/**
 * GZ BOT — AI Character Generator
 * Takes a character name + type, returns structured character JSON
 * Uses same multi-API fallback chain as the main chat endpoint.
 */

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const SYSTEM = `You are a gaming/anime/fiction character database expert. When asked to generate data for a character, you return ONLY a valid raw JSON object — no markdown, no code blocks, no explanation. Pure JSON only.`;

function buildPrompt(name, type) {
  return `Generate character database entry for: "${name}" (category: ${type})

Return ONLY this JSON object (no other text):
{
  "id": "unique-lowercase-id-letters-and-hyphens-only",
  "icon": "single-most-fitting-emoji",
  "type": "${type}",
  "source": "Exact Original Work Title in English",
  "p": 85,
  "isPeak": false,
  "ar": {
    "name": "اسم الشخصية بالعربية الفصحى أو المعروفة",
    "ability": "القدرة الرئيسية بالعربية (2-4 كلمات)",
    "lore": "نبذة جذابة عن الشخصية بالعربية تلتقط جوهرها (2-3 جمل متماسكة)"
  },
  "en": {
    "name": "CHARACTER NAME IN CAPS",
    "ability": "Main Ability (2-3 words)",
    "lore": "Engaging backstory capturing their essence (2-3 sentences)"
  }
}

Power level rules:
- 75-82: street-level / regular hero
- 83-89: enhanced / strong hero
- 90-95: very powerful / city-level threat
- 96-99: legendary / god-level
Set isPeak:true ONLY for explicitly named "final/ultimate/peak form" variants of already powerful characters.

Be accurate to the character's actual lore and power level.`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: HEADERS, body: '' };
  if (event.httpMethod !== 'POST')    return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { name, type = 'game' } = JSON.parse(event.body);

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return {
        statusCode: 400,
        headers: HEADERS,
        body: JSON.stringify({ error: 'اسم الشخصية مطلوب / Character name required' })
      };
    }

    const cleanName    = name.trim().slice(0, 100);
    const cleanType    = ['game','anime','movie','series','comic'].includes(type) ? type : 'game';
    const masterKey    = (event.body ? JSON.parse(event.body).master_key : '') || '';
    const masterProv   = (event.body ? JSON.parse(event.body).master_provider : '') || 'gemini';
    const prompt       = buildPrompt(cleanName, cleanType);

    const chain = [];
    if (masterKey) {
      if (masterProv === 'openrouter') {
        chain.push(() => callOpenRouter(masterKey, prompt));
      } else {
        chain.push(() => callGeminiWithKey(masterKey, 'gemini-2.0-flash', prompt));
        chain.push(() => callGeminiWithKey(masterKey, 'gemini-1.5-flash', prompt));
      }
    }
    // Free models first
    chain.push(
      () => callPollinations('openai',  prompt),
      () => callPollinations('mistral', prompt),
      () => callPollinations('llama',   prompt),
      () => callHackClub(prompt),
    );
    if (GEMINI_KEY) {
      chain.push(
        () => callGemini('gemini-2.0-flash', prompt),
        () => callGemini('gemini-1.5-flash', prompt),
        () => callGemini('gemini-1.5-pro',   prompt),
      );
    }

    for (const apiCall of chain) {
      try {
        const raw  = await apiCall();
        const char = parseCharJSON(raw);
        // Ensure type matches what was requested
        char.type = cleanType;
        return {
          statusCode: 200,
          headers: HEADERS,
          body: JSON.stringify({ character: char })
        };
      } catch (err) {
        console.warn(`[GZ-GEN] attempt failed: ${err.message}`);
      }
    }

    return {
      statusCode: 503,
      headers: HEADERS,
      body: JSON.stringify({ error: 'فشل توليد الشخصية. حاول مرة أخرى / Generation failed. Try again.' })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: err.message })
    };
  }
};

// ── Parse & validate character JSON from AI response ─────────────────────
function parseCharJSON(raw) {
  let text = raw.trim();
  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  // Extract first JSON object if there's extra text
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in response');
  const obj = JSON.parse(match[0]);
  // Validate required fields
  if (!obj.id || !obj.ar?.name || !obj.en?.name) throw new Error('Invalid character JSON structure');
  // Sanitize id
  obj.id = String(obj.id).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  // Clamp power level
  obj.p = Math.max(70, Math.min(110, parseInt(obj.p) || 80));
  return obj;
}

// ── Gemini ────────────────────────────────────────────────────────────────
async function callGemini(model, prompt) {
  return callGeminiWithKey(GEMINI_KEY, model, prompt);
}

async function callGeminiWithKey(key, model, prompt) {
  const reqBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    system_instruction: { parts: [{ text: SYSTEM }] },
    generationConfig: { maxOutputTokens: 700, temperature: 0.25, topP: 0.9 }
  };

  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqBody) },
    12000
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');
  return text;
}

// ── OpenRouter ────────────────────────────────────────────────────────────
async function callOpenRouter(key, prompt) {
  const res = await fetchWithTimeout(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer':  'https://game-zone-golden.netlify.app',
        'X-Title':       'GZ BOT'
      },
      body: JSON.stringify({
        model:       'meta-llama/llama-3.1-8b-instruct:free',
        messages:    [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt }],
        max_tokens:  700,
        temperature: 0.25
      })
    },
    18000
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty OpenRouter response');
  return text;
}

// ── Pollinations AI (free, no key, multiple models) ──────────────────────
async function callPollinations(model, prompt) {
  const res = await fetchWithTimeout(
    'https://text.pollinations.ai/',
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        model,
        messages:    [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt }],
        max_tokens:  700,
        temperature: 0.25,
        seed: Math.floor(Math.random()*9999)
      })
    },
    22000
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = await res.text();
  if (!raw || raw.trim().length < 2) throw new Error('Empty Pollinations response');
  try {
    const json = JSON.parse(raw);
    return json.choices?.[0]?.message?.content || json.text || raw.trim();
  } catch {
    return raw.trim();
  }
}

// ── HackClub AI ───────────────────────────────────────────────────────────
async function callHackClub(prompt) {
  const res = await fetchWithTimeout(
    'https://ai.hackclub.com/chat/completions',
    {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer hc-gzbot'
      },
      body: JSON.stringify({
        model:       'gpt-4o-mini',
        messages:    [
          { role: 'system', content: SYSTEM },
          { role: 'user',   content: prompt }
        ],
        max_tokens:  700,
        temperature: 0.25
      })
    },
    15000
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty HackClub response');
  return text;
}

// ── Utility ───────────────────────────────────────────────────────────────
function fetchWithTimeout(url, options, ms = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

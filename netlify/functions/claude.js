/**
 * GZ BOT — Multi-API AI Gateway
 * Fallback chain: [MasterKey] → Gemini 2.0 Flash → Gemini 1.5 Flash → Gemini 1.5 Pro → Pollinations → HackClub GPT
 * All providers are free-tier with no billing required.
 */

const GEMINI_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAZnp40tb1zaex64t-e6jWHppiiCWN6K3A';

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Master-Key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: HEADERS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body);
    const messages   = body.messages   || [];
    const system     = body.system     || '';
    const maxTokens  = body.max_tokens || 1100;
    const masterKey  = body.master_key || '';
    const masterProv = body.master_provider || 'gemini';

    // ── API Fallback Chain ──────────────────────────────────────────────
    const chain = [];

    // Prepend user's own key as first priority
    if (masterKey) {
      if (masterProv === 'openrouter') {
        chain.push({ label: 'OpenRouter (Master Key)', fn: () => callOpenRouter(masterKey, messages, system, maxTokens) });
      } else {
        chain.push({ label: 'Gemini (Master Key)', fn: () => callGeminiWithKey(masterKey, 'gemini-2.0-flash', messages, system, maxTokens) });
        chain.push({ label: 'Gemini 1.5 (Master Key)', fn: () => callGeminiWithKey(masterKey, 'gemini-1.5-flash', messages, system, maxTokens) });
      }
    }

    chain.push(
      { label: 'Gemini 2.0 Flash', fn: () => callGemini('gemini-2.0-flash', messages, system, maxTokens) },
      { label: 'Gemini 1.5 Flash', fn: () => callGemini('gemini-1.5-flash', messages, system, maxTokens) },
      { label: 'Gemini 1.5 Pro',   fn: () => callGemini('gemini-1.5-pro',   messages, system, maxTokens) },
      { label: 'Pollinations AI',  fn: () => callPollinations(               messages, system, maxTokens) },
      { label: 'HackClub AI',      fn: () => callHackClub(                   messages, system, maxTokens) },
    );

    for (const api of chain) {
      try {
        const result = await api.fn();
        console.log(`[GZ-BOT] Served by: ${result.model}`);
        return {
          statusCode: 200,
          headers: HEADERS,
          body: JSON.stringify({
            content:    [{ type: 'text', text: result.text }],
            model_used: result.model
          })
        };
      } catch (err) {
        console.warn(`[GZ-BOT] ${api.label} failed: ${err.message}`);
      }
    }

    return {
      statusCode: 503,
      headers: HEADERS,
      body: JSON.stringify({ error: 'جميع خوادم الـ AI مشغولة حالياً. حاول مرة أخرى / All AI providers busy. Try again.' })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: err.message })
    };
  }
};

// ── Gemini (Google AI) ────────────────────────────────────────────────────
async function callGemini(model, messages, system, maxTokens) {
  return callGeminiWithKey(GEMINI_KEY, model, messages, system, maxTokens);
}

async function callGeminiWithKey(key, model, messages, system, maxTokens) {
  const contents = messages.map(m => ({
    role:  m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const reqBody = {
    contents,
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.88, topP: 0.95 }
  };
  if (system) reqBody.system_instruction = { parts: [{ text: system }] };

  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqBody) },
    12000
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  return { text, model: key === GEMINI_KEY ? model : `${model}-master` };
}

// ── OpenRouter (user-provided key, free models available) ─────────────────
async function callOpenRouter(key, messages, system, maxTokens) {
  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : [...messages];

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
        model:      'meta-llama/llama-3.1-8b-instruct:free',
        messages:   msgs,
        max_tokens: maxTokens,
        temperature: 0.88
      })
    },
    18000
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from OpenRouter');

  return { text, model: 'openrouter-llama3.1-master' };
}

// ── Pollinations AI (completely free, no key required) ────────────────────
async function callPollinations(messages, system, maxTokens) {
  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : [...messages];

  const res = await fetchWithTimeout(
    'https://text.pollinations.ai/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openai', messages: msgs, max_tokens: maxTokens, temperature: 0.88 })
    },
    20000
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = await res.text();
  if (!raw || raw.trim().length < 2) throw new Error('Empty response from Pollinations');

  // Pollinations may return plain text or JSON
  try {
    const json = JSON.parse(raw);
    const text = json.choices?.[0]?.message?.content || json.text || json.response;
    if (!text) throw new Error('No text field');
    return { text, model: 'pollinations-openai' };
  } catch {
    return { text: raw.trim(), model: 'pollinations-openai' };
  }
}

// ── HackClub AI (OpenAI-compatible, completely free) ─────────────────────
async function callHackClub(messages, system, maxTokens) {
  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : [...messages];

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
        messages:    msgs,
        max_tokens:  maxTokens,
        temperature: 0.88
      })
    },
    15000
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from HackClub');

  return { text, model: 'hackclub-gpt-4o-mini' };
}

// ── Utility: fetch with timeout ───────────────────────────────────────────
function fetchWithTimeout(url, options, ms = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

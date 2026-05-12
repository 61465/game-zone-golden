/**
 * GZ BOT — Multi-API AI Gateway
 * Runs free APIs in parallel, returns fastest successful response.
 * Stays within Netlify's 10-second function timeout.
 */

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: HEADERS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body        = JSON.parse(event.body);
    const messages    = body.messages    || [];
    const system      = body.system      || '';
    const maxTokens   = body.max_tokens  || 1100;
    const masterKey   = body.master_key  || '';
    const masterProv  = body.master_provider || 'gemini';

    // ── Master key: try first, sequential ────────────────────────────────
    if (masterKey) {
      try {
        const result = masterProv === 'openrouter'
          ? await callOpenRouter(masterKey, messages, system, maxTokens)
          : await callGeminiWithKey(masterKey, 'gemini-2.0-flash', messages, system, maxTokens);
        return ok(result);
      } catch (_) { /* fall through to free APIs */ }
    }

    // ── Free APIs: run in parallel, take first winner ─────────────────────
    const freeCalls = [
      callPollinations('openai',  messages, system, maxTokens),
      callPollinations('mistral', messages, system, maxTokens),
      callPollinations('llama',   messages, system, maxTokens),
      callHackClub(messages, system, maxTokens),
    ];

    const result = await Promise.any(freeCalls).catch(() => null);
    if (result) return ok(result);

    // ── Gemini fallback (only if env key set) ─────────────────────────────
    if (GEMINI_KEY) {
      for (const model of ['gemini-2.0-flash', 'gemini-1.5-flash']) {
        try { return ok(await callGemini(model, messages, system, maxTokens)); } catch (_) {}
      }
    }

    return { statusCode: 503, headers: HEADERS,
      body: JSON.stringify({ error: 'جميع خوادم الـ AI مشغولة. حاول مرة أخرى / All AI busy. Try again.' }) };

  } catch (err) {
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};

function ok(result) {
  return {
    statusCode: 200, headers: HEADERS,
    body: JSON.stringify({ content: [{ type: 'text', text: result.text }], model_used: result.model })
  };
}

// ── Pollinations AI (free, no key) ────────────────────────────────────────
async function callPollinations(model, messages, system, maxTokens) {
  const msgs = system ? [{ role: 'system', content: system }, ...messages] : [...messages];
  const res = await fetchWT('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: msgs, max_tokens: maxTokens, temperature: 0.85,
      seed: Math.floor(Math.random() * 9999) })
  }, 8000);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = await res.text();
  if (!raw || raw.trim().length < 2) throw new Error('Empty');
  try {
    const j = JSON.parse(raw);
    const text = j.choices?.[0]?.message?.content || j.text || j.response;
    if (!text) throw new Error('No text');
    return { text, model: `pollinations-${model}` };
  } catch { return { text: raw.trim(), model: `pollinations-${model}` }; }
}

// ── HackClub AI (free) ────────────────────────────────────────────────────
async function callHackClub(messages, system, maxTokens) {
  const msgs = system ? [{ role: 'system', content: system }, ...messages] : [...messages];
  const res = await fetchWT('https://ai.hackclub.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: msgs, max_tokens: maxTokens, temperature: 0.85 })
  }, 8000);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty');
  return { text, model: 'hackclub-gpt-4o-mini' };
}

// ── Gemini ────────────────────────────────────────────────────────────────
async function callGemini(model, messages, system, maxTokens) {
  return callGeminiWithKey(GEMINI_KEY, model, messages, system, maxTokens);
}
async function callGeminiWithKey(key, model, messages, system, maxTokens) {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }]
  }));
  const reqBody = { contents, generationConfig: { maxOutputTokens: maxTokens, temperature: 0.88 } };
  if (system) reqBody.system_instruction = { parts: [{ text: system }] };

  const res = await fetchWT(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqBody) }, 7000);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty');
  return { text, model: key === GEMINI_KEY ? model : `${model}-master` };
}

// ── OpenRouter ────────────────────────────────────────────────────────────
async function callOpenRouter(key, messages, system, maxTokens) {
  const msgs = system ? [{ role: 'system', content: system }, ...messages] : [...messages];
  const res = await fetchWT('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://game-zone-golden.netlify.app', 'X-Title': 'GZ BOT' },
    body: JSON.stringify({ model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: msgs, max_tokens: maxTokens, temperature: 0.85 })
  }, 8000);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty');
  return { text, model: 'openrouter-llama3.1-master' };
}

// ── fetch with timeout ────────────────────────────────────────────────────
function fetchWT(url, opts, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

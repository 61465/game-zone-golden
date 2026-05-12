/**
 * GZ BOT — Multi-API AI Gateway
 * Fallback chain: Gemini 2.0 Flash → Gemini 1.5 Flash → Gemini 1.5 Pro → HackClub GPT
 * All providers are free-tier with no billing required.
 */

const GEMINI_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAZnp40tb1zaex64t-e6jWHppiiCWN6K3A';

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
    const body = JSON.parse(event.body);
    const messages  = body.messages  || [];
    const system    = body.system    || '';
    const maxTokens = body.max_tokens || 1100;

    // ── API Fallback Chain ──────────────────────────────────────────────
    const chain = [
      { label: 'Gemini 2.0 Flash', fn: () => callGemini('gemini-2.0-flash',      messages, system, maxTokens) },
      { label: 'Gemini 1.5 Flash', fn: () => callGemini('gemini-1.5-flash',      messages, system, maxTokens) },
      { label: 'Gemini 1.5 Pro',   fn: () => callGemini('gemini-1.5-pro',        messages, system, maxTokens) },
      { label: 'HackClub AI',      fn: () => callHackClub(                        messages, system, maxTokens) },
    ];

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
  const contents = messages.map(m => ({
    role:  m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const reqBody = {
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature:     0.88,
      topP:            0.95
    }
  };
  if (system) reqBody.system_instruction = { parts: [{ text: system }] };

  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(reqBody)
    },
    12000
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error)  throw new Error(data.error.message);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  return { text, model };
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

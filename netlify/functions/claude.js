exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' };
  }

  try {
    const body = JSON.parse(event.body);

    // Convert messages format from Claude to Gemini
    const messages = body.messages || [];
    const systemPrompt = body.system || '';

    // Build Gemini contents array
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const geminiBody = {
      system_instruction: systemPrompt ? {
        parts: [{ text: systemPrompt }]
      } : undefined,
      contents: contents,
      generationConfig: {
        maxOutputTokens: body.max_tokens || 1100,
        temperature: 0.9,
      }
    };

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const MODEL = 'gemini-1.5-flash';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody)
      }
    );

    const data = await response.json();

    // Check for Gemini errors
    if (data.error) {
      return {
        statusCode: 400,
        headers: HEADERS,
        body: JSON.stringify({ error: data.error.message })
      };
    }

    // Convert Gemini response to Claude format
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لا يوجد رد';

    const claudeFormat = {
      content: [{ type: 'text', text: text }]
    };

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(claudeFormat)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: err.message })
    };
  }
};

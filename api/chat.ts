import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── Updated CORS & body handling ──
const ALLOWED_ORIGINS = [
  'https://virtual-clinic-beta.vercel.app',
  'https://virtual-clinic-eta.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ---------- CORS ----------
  const origin = req.headers.origin ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin);
  const allowOrigin = allowed ? origin : '*';

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Uncomment if you need cookies or other credentials
  // res.setHeader('Access-Control-Allow-Credentials', 'true');

  // ---------- Pre‑flight ----------
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // ---------- Method check ----------
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ---------- Body parsing ----------
  const body = typeof req.body === 'object' && req.body !== null ? req.body : await (req as any).json?.();
  const { messages } = body as {
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
    language?: string;
  };

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body: messages array required.' });
  }

  // ---------- OpenRouter call ----------
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY is not configured. Please add it to your environment variables.',
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://virtual-clinic-beta.vercel.app',
        'X-Title': 'Virtual Clinic',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct',
        max_tokens: 1000,
        messages,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      return res.status(response.status).json({ error: `OpenRouter API error: ${errBody}` });
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}

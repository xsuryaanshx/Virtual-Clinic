import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'https://virtual-clinic-beta.vercel.app',
  'https://virtual-clinic-eta.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin ?? '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not configured. Please add it to your Vercel environment variables.',
    });
  }

  const { messages } = req.body as {
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
    language: string;
  };

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body: messages array required.' });
  }

  // Anthropic API separates system prompt from conversation messages
  const systemMessage = messages.find((m) => m.role === 'system');
  const conversationMessages = messages.filter((m) => m.role !== 'system');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemMessage?.content ?? '',
        messages: conversationMessages,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      return res.status(response.status).json({ error: `Anthropic API error: ${errBody}` });
    }

    const data = await response.json();
    const content: string = data.content?.[0]?.text ?? '';
    return res.status(200).json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}

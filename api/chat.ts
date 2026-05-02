import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST method' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Messages must be an array',
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing OPENROUTER_API_KEY',
      });
    }

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
        messages,
        max_tokens: 500,
      }),
    });

    const text = await response.text();

    if (!text) {
      return res.status(500).json({
        error: 'Empty response from AI',
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: 'Invalid AI response',
      });
    }

    const content =
      data?.choices?.[0]?.message?.content ||
      'Sorry, I could not generate a response.';

    return res.status(200).json({
      success: true,
      content,
    });

  } catch (error: any) {
    console.error('SERVER ERROR:', error);

    return res.status(500).json({
      error: error.message || 'Server error',
    });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * List of origins that are allowed to access this endpoint.
 * Add any additional domains here as your application evolves.
 */
const ALLOWED_ORIGINS = [
  'https://virtual-clinic-beta.vercel.app',
  'https://virtual-clinic-eta.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];

/**
 * Helper to safely retrieve the request origin.
 * Uses optional chaining – Vercel's request object may be missing headers in edge cases.
 */
function getOrigin(req: VercelRequest): string {
  return req.headers?.origin ?? '';
}

/**
 * Main handler for the `/api/chat` serverless function.
 * It validates CORS, HTTP method, request payload and forwards the request to OpenRouter.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ------------------- Defensive guard -------------------
  if (!req || typeof (req as any).method !== 'string') {
    // This protects against accidental client‑side imports of the module.
    return res?.status?.(500).json({ error: 'Serverless function invoked without a valid request object.' }) ?? null;
  }

  // ------------------- CORS handling -------------------
  const origin = getOrigin(req);
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  const allowOrigin = isAllowed ? origin : '*';

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Uncomment the line below if you ever need to send cookies or other credentials.
  // res.setHeader('Access-Control-Allow-Credentials', 'true');

  // ------------------- Pre‑flight (OPTIONS) -------------------
  if (req.method === 'OPTIONS') {
    // Vercel expects an empty body for a successful pre‑flight response.
    return res.status(204).end();
  }

  // ------------------- Method validation -------------------
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // ------------------- Body parsing -------------------
  let body: any;
  try {
    // Vercel automatically parses JSON bodies, but we fallback to manual parsing for safety.
    body = typeof req.body === 'object' && req.body !== null ? req.body : await (req as any).json?.();
  } catch (_) {
    // If parsing fails we fall back to an empty object.
    body = {};
  }

  const { messages } = body as {
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request: `messages` array is required.' });
  }

  // ------------------- OpenRouter API key -------------------
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY is not configured. Add it to your Vercel environment variables.',
    });
  }

  // ------------------- Forward request to OpenRouter -------------------
  try {
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        // These meta‑headers help OpenRouter attribute usage to your app.
        'HTTP-Referer': 'https://virtual-clinic-beta.vercel.app',
        'X-Title': 'Virtual Clinic',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct',
        max_tokens: 1000,
        messages,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      return res.status(openRouterResponse.status).json({
        error: `OpenRouter API error: ${errorText}`,
      });
    }

    const data = await openRouterResponse.json();
    const content: string = data.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error accessing OpenRouter';
    return res.status(500).json({ error: message });
  }
}

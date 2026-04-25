import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_ALLOWED_ORIGINS = [
  'https://virtual-clinic-beta.vercel.app',
  'https://virtual-clinic-eta.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
];

const MAX_MESSAGES = 40;
const MAX_CONTENT_LENGTH = 8000;

type ChatRole = 'system' | 'user' | 'assistant';

function parseAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS?.trim();
  if (!raw) return DEFAULT_ALLOWED_ORIGINS;
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function getOrigin(req: VercelRequest): string {
  return req.headers?.origin ?? '';
}

function parseJsonBody(req: VercelRequest): unknown {
  const raw = req.body;
  if (raw == null) return {};
  if (typeof raw === 'object' && !Buffer.isBuffer(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString('utf8')) as unknown;
    } catch {
      return null;
    }
  }
  return {};
}

function isChatRole(r: string): r is ChatRole {
  return r === 'system' || r === 'user' || r === 'assistant';
}

function validateMessages(input: unknown): { role: ChatRole; content: string }[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  if (input.length > MAX_MESSAGES) return null;

  const out: { role: ChatRole; content: string }[] = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (typeof role !== 'string' || !isChatRole(role)) return null;
    if (typeof content !== 'string' || content.trim().length === 0) return null;
    if (content.length > MAX_CONTENT_LENGTH) return null;
    out.push({ role, content: content.trim() });
  }
  return out;
}

function refererHeader(): string {
  const site = process.env.SITE_URL?.trim();
  if (site) return site.replace(/\/$/, '');
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`;
  return 'https://virtual-clinic-beta.vercel.app';
}

function safeUpstreamError(status: number, text: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `OpenRouter API error (${status}): ${text.slice(0, 2000)}`;
  }
  return 'The AI service returned an error. Please try again later.';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!req || typeof (req as { method?: unknown }).method !== 'string') {
    return res?.status?.(500).json({ error: 'Serverless function invoked without a valid request object.' }) ?? null;
  }

  const allowedOrigins = parseAllowedOrigins();
  const origin = getOrigin(req);
  const isAllowed = !origin || allowedOrigins.includes(origin);
  const allowOrigin =
    isAllowed && origin ? origin : isAllowed ? '*' : allowedOrigins[0] ?? '*';

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const parsed = parseJsonBody(req);
  if (parsed === null) {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  const body = parsed as { messages?: unknown };
  const messages = validateMessages(body.messages);
  if (!messages) {
    return res.status(400).json({
      error: `Invalid request: messages must be a non-empty array (max ${MAX_MESSAGES}) of { role, content } with role system|user|assistant and non-empty content (max ${MAX_CONTENT_LENGTH} chars each).`,
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY is not configured. Add it to your Vercel environment variables.',
    });
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || 'meta-llama/llama-3.3-70b-instruct';

  try {
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': refererHeader(),
        'X-Title': 'Virtual Clinic',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        messages,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      return res.status(openRouterResponse.status >= 500 ? 502 : openRouterResponse.status).json({
        error: safeUpstreamError(openRouterResponse.status, errorText),
      });
    }

    const rawText = await openRouterResponse.text();
    let data: { choices?: { message?: { content?: string } }[] };
    try {
      data = JSON.parse(rawText) as typeof data;
    } catch {
      return res.status(502).json({ error: 'Invalid response from AI service.' });
    }

    const content: string = data.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error accessing OpenRouter';
    return res.status(500).json({ error: message });
  }
}

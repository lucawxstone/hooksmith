// Simple in-memory rate limiter keyed by IP.
// Not suitable for production beyond a single instance.

const hits = new Map<string, { count: number; ts: number }>();

export function rateLimit(ip: string, perMinute = 20) {
  const now = Date.now();
  const rec = hits.get(ip) || { count: 0, ts: now };
  if (now - rec.ts > 60_000) {
    rec.count = 0;
    rec.ts = now;
  }
  rec.count += 1;
  hits.set(ip, rec);
  if (rec.count > perMinute) {
    const wait = 60 - Math.floor((now - rec.ts) / 1000);
    return { ok: false, retryAfter: wait };
  }
  return { ok: true };
}
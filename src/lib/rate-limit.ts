/**
 * Simple in-memory rate limiter for API routes.
 * For production, replace with Redis-based solution (Upstash, etc.)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  /** Max requests per window */
  limit: number;
  /** Window duration in seconds */
  windowSecs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSecs * 1000;
  const key = identifier;

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, newEntry);
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt: newEntry.resetAt,
    };
  }

  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

// Pre-configured rate limiters
export const rateLimiters = {
  /** AI endpoints: 10 requests per minute */
  ai: (identifier: string) =>
    rateLimit(`ai:${identifier}`, { limit: 10, windowSecs: 60 }),

  /** Auth endpoints: 5 requests per minute */
  auth: (identifier: string) =>
    rateLimit(`auth:${identifier}`, { limit: 5, windowSecs: 60 }),

  /** General API: 60 requests per minute */
  api: (identifier: string) =>
    rateLimit(`api:${identifier}`, { limit: 60, windowSecs: 60 }),

  /** Webhook endpoints: 100 per minute */
  webhook: (identifier: string) =>
    rateLimit(`webhook:${identifier}`, { limit: 100, windowSecs: 60 }),
};

export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.success
      ? {}
      : { "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)) }),
  };
}

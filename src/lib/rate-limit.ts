/**
 * Trend Street — In-Memory Sliding Window Rate Limiter
 * Provides brute-force and DDoS throttling for authentication and sensitive API routes.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale records every 10 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record: RateLimitRecord, key: string) => {
      record.timestamps = record.timestamps.filter((ts: number) => now - ts < 3600000); // retain 1 hr
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    });
  }, 600000);
}

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max allowed requests per window
}

export interface RateLimitResult {
  allowed: boolean;
  currentCount: number;
  remaining: number;
  resetMs: number;
}

/**
 * Checks if a given key (e.g. IP or user identifier) has exceeded the rate limit.
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within the current sliding window
  const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= options.maxRequests) {
    const oldestTimestamp = activeTimestamps[0];
    const resetMs = Math.max(0, oldestTimestamp + options.windowMs - now);

    return {
      allowed: false,
      currentCount: activeTimestamps.length,
      remaining: 0,
      resetMs,
    };
  }

  // Record this request
  activeTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: activeTimestamps });

  return {
    allowed: true,
    currentCount: activeTimestamps.length,
    remaining: Math.max(0, options.maxRequests - activeTimestamps.length),
    resetMs: options.windowMs,
  };
}

/**
 * Helper to extract client IP address from Next.js request headers.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headers.get("x-real-ip") || "127.0.0.1";
}

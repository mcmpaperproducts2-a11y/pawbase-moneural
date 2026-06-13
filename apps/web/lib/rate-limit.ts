type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function createRateLimiter(limit: number, windowMs: number) {
  return {
    async limit(key: string) {
      const now = Date.now();
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: limit - 1 };
      }

      if (bucket.count >= limit) {
        return { success: false, remaining: 0 };
      }

      bucket.count += 1;
      return { success: true, remaining: Math.max(0, limit - bucket.count) };
    }
  };
}

export const authLimiter = createRateLimiter(5, 15 * 60 * 1000);

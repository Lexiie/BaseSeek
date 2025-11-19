type Bucket = {
  windowMs: number;
  limit: number;
  hits: Record<string, { count: number; expiresAt: number }>;
};

const searchBucket: Bucket = {
  windowMs: 60_000,
  limit: 20,
  hits: {}
};

export function rateLimit(key: string, bucket: Bucket = searchBucket): boolean {
  const now = Date.now();
  const entry = bucket.hits[key];

  if (!entry || entry.expiresAt < now) {
    bucket.hits[key] = { count: 1, expiresAt: now + bucket.windowMs };
    return true;
  }

  if (entry.count >= bucket.limit) {
    return false;
  }

  entry.count += 1;
  return true;
}

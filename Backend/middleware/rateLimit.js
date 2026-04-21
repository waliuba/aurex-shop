const buckets = new Map();

const nowMs = () => Date.now();

const getKey = (req, prefix) => {
  const ip =
    String(req.headers['x-forwarded-for'] || '')
      .split(',')[0]
      .trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  return `${prefix}:${ip}`;
};

export const rateLimit = ({ windowMs = 60_000, max = 20, keyPrefix = 'rl' } = {}) => {
  return (req, res, next) => {
    const key = getKey(req, keyPrefix);
    const current = buckets.get(key) || { count: 0, resetAt: nowMs() + windowMs };

    const t = nowMs();
    if (t > current.resetAt) {
      current.count = 0;
      current.resetAt = t + windowMs;
    }

    current.count += 1;
    buckets.set(key, current);

    if (current.count > max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - t) / 1000));
      res.setHeader('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({ message: 'Too many requests, please try again later' });
    }

    return next();
  };
};


// Simple in-memory rate limiting for contact form
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS = 5; // Maximum 5 messages per hour per IP

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userRateLimit = rateLimit.get(identifier);

  if (!userRateLimit || userRateLimit.resetTime < now) {
    // First request or window expired
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }

  if (userRateLimit.count < MAX_REQUESTS) {
    // Under limit, increment counter
    userRateLimit.count++;
    return true;
  }

  // Rate limit exceeded
  return false;
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (value.resetTime < now) {
      rateLimit.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);

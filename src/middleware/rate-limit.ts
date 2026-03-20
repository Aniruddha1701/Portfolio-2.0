import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

function cleanExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanExpiredEntries, 5 * 60 * 1000);

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown';
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

export function rateLimit(
  maxRequests: number = MAX_REQUESTS,
  windowMs: number = RATE_LIMIT_WINDOW
) {
  return (request: NextRequest): NextResponse | null => {
    const identifier = getClientIdentifier(request);
    const now = Date.now();

    let entry = rateLimitStore.get(identifier);

    if (!entry || entry.resetTime < now) {
      entry = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitStore.set(identifier, entry);
      return null;
    }

    entry.count++;

    if (entry.count > maxRequests) {
      const response = NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
      response.headers.set('Retry-After', Math.ceil((entry.resetTime - now) / 1000).toString());
      response.headers.set('X-RateLimit-Limit', maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());
      return response;
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - entry.count).toString());
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());

    return null;
  };
}

export function authRateLimit() {
  return rateLimit(10, 15 * 60 * 1000);
}

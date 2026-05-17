import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ──────────────────────────────────────────────
//  Edge Middleware — runs BEFORE any page/API
//  Handles: Rate Limiting, Security Headers, Request IDs
//  This is the first line of defense — blocks abuse
//  before it reaches Node.js.
// ──────────────────────────────────────────────

// ── Rate Limiter (Edge-compatible, no Node crypto) ──

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (per-instance). For multi-instance deployments,
// replace with Vercel KV, Upstash Redis, or similar.
const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

// Tiered limits: stricter for auth, moderate for API, generous for pages
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  auth: { maxRequests: 50, windowMs: 15 * 60 * 1000 },    // 50 req/15min — brute-force protection
  api: { maxRequests: 100, windowMs: 60 * 1000 },          // 100 req/min — API abuse protection
  page: { maxRequests: 200, windowMs: 60 * 1000 },         // 200 req/min — generous for normal browsing
};

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown';
}

/**
 * Simple hash for IP (no Node crypto in Edge Runtime).
 * FNV-1a 32-bit — fast and collision-resistant enough for rate limiting.
 */
function hashIp(ip: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < ip.length; i++) {
    hash ^= ip.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

function cleanupExpiredEntries() {
  const now = Date.now();
  // Only clean every 30 seconds to avoid overhead
  if (now - lastCleanup < 30_000) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(
  identifier: string,
  tier: 'auth' | 'api' | 'page'
): { allowed: boolean; remaining: number; resetTime: number } {
  cleanupExpiredEntries();

  const { maxRequests, windowMs } = RATE_LIMITS[tier];
  const key = `${tier}:${identifier}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    entry = { count: 1, resetTime: now + windowMs };
    rateLimitStore.set(key, entry);
    return { allowed: true, remaining: maxRequests - 1, resetTime: entry.resetTime };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
}

// ── Security Headers ──

function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // XSS protection for older browsers
    'X-XSS-Protection': '1; mode=block',
    // Referrer policy — send origin only
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions policy — disable unnecessary browser features
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    // HSTS — force HTTPS (1 year)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    // CSP — restrictive but allows required resources
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://placehold.co https://images.unsplash.com https://*.googleusercontent.com",
      "connect-src 'self' https://*.mongodb.net https://fonts.googleapis.com https://fonts.gstatic.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  };
}

// ── Request ID Generator (Edge-compatible) ──

function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  // Use crypto.getRandomValues (available in Edge Runtime)
  const buffer = new Uint8Array(4);
  crypto.getRandomValues(buffer);
  const random = Array.from(buffer)
    .map((b) => b.toString(36))
    .join('');
  return `req-${timestamp}-${random}`;
}

// ── Route Classification ──

function getRouteTier(pathname: string): 'auth' | 'api' | 'page' {
  if (
    pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname.includes('/api/auth')
  ) {
    return 'auth';
  }
  if (pathname.startsWith('/api/')) {
    return 'api';
  }
  return 'page';
}

// ══════════════════════════════════════════════
//  MAIN MIDDLEWARE
// ══════════════════════════════════════════════

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Generate Request ID ──
  const requestId = generateRequestId();

  // ── 2. Rate Limiting ──
  const clientIp = getClientIp(request);
  const hashedIp = hashIp(clientIp);
  const tier = getRouteTier(pathname);

  const rateCheck = checkRateLimit(hashedIp, tier);

  if (!rateCheck.allowed) {
    const retryAfter = Math.ceil((rateCheck.resetTime - Date.now()) / 1000);
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests. Please try again later.',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': RATE_LIMITS[tier].maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateCheck.resetTime.toString(),
          'X-Request-ID': requestId,
        },
      }
    );
  }

  // ── 3. Admin Auth Check ──
  if (pathname.startsWith('/admin')) {
    if (pathname.includes('/login')) {
      // If already logged in, redirect to dashboard
      const adminToken = request.cookies.get('admin-token');
      const adminSession = request.cookies.get('admin-session');

      if (adminToken || adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    } else {
      // Protect all admin routes
      const adminToken = request.cookies.get('admin-token');
      const authToken = request.cookies.get('auth-token');
      const adminSession = request.cookies.get('admin-session');
      const accessToken = request.cookies.get('access-token');

      if (!adminToken && !authToken && !adminSession && !accessToken) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  // ── 4. Apply Security Headers + Rate Limit Headers + Request ID ──
  const response = NextResponse.next();

  // Security headers
  const securityHeaders = getSecurityHeaders();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Rate limit headers
  response.headers.set('X-RateLimit-Limit', RATE_LIMITS[tier].maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', rateCheck.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateCheck.resetTime.toString());

  // Request tracing
  response.headers.set('X-Request-ID', requestId);

  return response;
}

// ── Match everything except static files and Next.js internals ──
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files (sw.js, manifest, images, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|js|json|webmanifest)$).*)',
  ],
};

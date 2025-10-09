import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export function getAuthCookieConfig(): Partial<ResponseCookie> {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Get the domain from environment or request
  let domain: string | undefined;
  
  if (isProduction && process.env.NEXTAUTH_URL) {
    try {
      const url = new URL(process.env.NEXTAUTH_URL);
      // For Vercel deployments, don't set domain to allow subdomain flexibility
      // Only set if you have a custom domain
      if (!url.hostname.includes('vercel.app')) {
        domain = url.hostname;
      }
    } catch (e) {
      console.error('Invalid NEXTAUTH_URL:', e);
    }
  }

  return {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site in production
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    ...(domain && { domain }) // Only add domain if set
  };
}

export function getClearCookieConfig(): Partial<ResponseCookie> {
  const baseConfig = getAuthCookieConfig();
  return {
    ...baseConfig,
    expires: new Date(0),
    maxAge: 0
  };
}

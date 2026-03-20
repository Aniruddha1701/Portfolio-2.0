import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const isProduction = process.env.NODE_ENV === 'production';

function getDomain(): string | undefined {
  if (isProduction && process.env.NEXTAUTH_URL) {
    try {
      const url = new URL(process.env.NEXTAUTH_URL);
      if (!url.hostname.includes('vercel.app')) {
        return url.hostname;
      }
    } catch (e) {
      console.error('Invalid NEXTAUTH_URL:', e);
    }
  }
  return undefined;
}

const domain = getDomain();

export function getAccessTokenCookieConfig(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 60 * 15,
    ...(domain && { domain })
  };
}

export function getRefreshTokenCookieConfig(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    ...(domain && { domain })
  };
}

export function getAuthCookieConfig(): Partial<ResponseCookie> {
  return getAccessTokenCookieConfig();
}

export function getClearCookieConfig(): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
    ...(domain && { domain })
  };
}

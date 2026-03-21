import { NextRequest } from 'next/server';
import { getClearCookieConfig } from '@/lib/auth/cookie-config';
import { successResponse, serverError } from '@/lib/api-response';
import { logAudit } from '@/lib/audit';
import { verifyAuth } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

    if (user) {
      await logAudit({
        action: 'LOGOUT',
        userId: user.userId,
        email: user.email,
        status: 'success',
        ip
      });
    }

    const response = successResponse(null, 'Logout successful');
    
    // Use centralized cookie clear configuration
    const clearCookieOptions = getClearCookieConfig();
    
    // Clear all possible auth cookies
    response.cookies.set('access-token', '', clearCookieOptions);
    response.cookies.set('refresh-token', '', clearCookieOptions);
    response.cookies.set('auth-token', '', clearCookieOptions);
    response.cookies.set('admin-token', '', clearCookieOptions);
    response.cookies.set('admin-session', '', clearCookieOptions);
    
    return response;
  } catch (error: any) {
    return serverError(error);
  }
}

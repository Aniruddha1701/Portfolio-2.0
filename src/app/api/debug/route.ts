import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';
import dbConnect from '@/lib/db/mongoose';

// Debug endpoint to diagnose production issues
export async function GET(request: NextRequest) {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPrefix: process.env.MONGODB_URI?.substring(0, 20),
      hasJwtSecret: !!process.env.NEXTAUTH_SECRET || !!process.env.JWT_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasPublicUrl: !!process.env.NEXT_PUBLIC_URL,
      publicUrl: process.env.NEXT_PUBLIC_URL,
    },
    request: {
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
      hasCookie: !!request.headers.get('cookie'),
    },
    cookies: request.cookies.getAll().map(c => ({
      name: c.name,
      hasValue: !!c.value,
      length: c.value?.length || 0
    })),
    auth: {
      checking: true,
      authenticated: false,
      user: null,
      error: null
    },
    database: {
      checking: true,
      connected: false,
      error: null
    }
  };

  // Check authentication
  try {
    const user = await verifyAuth(request);
    debugInfo.auth.authenticated = !!user;
    debugInfo.auth.user = user ? { 
      email: user.email, 
      id: user.id,
      role: user.role 
    } : null;
  } catch (error: any) {
    debugInfo.auth.error = error.message || 'Auth check failed';
  }

  // Check database connection (only if authenticated or in development)
  if (debugInfo.auth.authenticated || process.env.NODE_ENV === 'development') {
    try {
      await dbConnect();
      debugInfo.database.connected = true;
      debugInfo.database.status = 'Connected successfully';
    } catch (error: any) {
      debugInfo.database.error = error.message || 'Connection failed';
      debugInfo.database.details = {
        name: error.name,
        code: error.code,
        codeName: error.codeName
      };
    }
  } else {
    debugInfo.database = {
      checking: false,
      message: 'Database check skipped (not authenticated)'
    };
  }

  // Add deployment platform detection
  debugInfo.platform = {
    vercel: !!process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
    isProduction: process.env.NODE_ENV === 'production',
  };

  return NextResponse.json(debugInfo, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

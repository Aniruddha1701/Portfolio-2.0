import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import OTP from '@/models/OTP';
import Admin from '@/models/Admin';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/auth/jwt-secret';
import { getAuthCookieConfig } from '@/lib/auth/cookie-config';
import { successResponse, errorResponse, serverError, unauthorizedResponse } from '@/lib/api-response';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

// Validation schema
const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const body = await request.json();
    
    // 1. Validate input
    const result = verifyOtpSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }
    
    const { email, otp } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    await dbConnect();

    // 2. Find the OTP record
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      // Increment attempts for any unverified OTP for this email
      await OTP.updateMany(
        { email: normalizedEmail, verified: false },
        { $inc: { attempts: 1 } }
      );

      await logAudit({
        action: 'LOGIN',
        email: normalizedEmail,
        status: 'failure',
        details: 'Invalid or expired OTP',
        ip,
        userAgent
      });

      return errorResponse('Invalid or expired OTP', 401);
    }

    // 3. Check if max attempts exceeded
    if (otpRecord.attempts >= 5) {
      await logAudit({
        action: 'LOGIN',
        email: normalizedEmail,
        status: 'failure',
        details: 'Maximum OTP attempts exceeded',
        ip,
        userAgent
      });
      return errorResponse('Maximum attempts exceeded. Please request a new OTP.', 429);
    }

    // 4. Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // 5. Find admin
    const admin = await Admin.findOne({ email: normalizedEmail });
    const userRole = admin?.role || 'admin';
    const userId = admin?._id?.toString() || normalizedEmail;

    // 6. Generate JWT token
    const token = jwt.sign(
      { 
        userId,
        email: normalizedEmail,
        role: userRole,
        type: 'access'
      },
      getJWTSecret(),
      { expiresIn: '15m' }
    );

    // 7. Success audit
    await logAudit({
      action: 'LOGIN',
      email: normalizedEmail,
      userId,
      status: 'success',
      details: 'OTP verified, login successful',
      ip,
      userAgent
    });

    // 8. Create response with cookies
    const response = successResponse({
      redirect: '/admin/dashboard'
    }, 'OTP verified successfully');
    
    const cookieOptions = getAuthCookieConfig();
    response.cookies.set('access-token', token, cookieOptions);

    // 9. Clean up
    await OTP.deleteMany({ email: normalizedEmail, verified: true });

    return response;

  } catch (error: any) {
    return serverError(error);
  }
}

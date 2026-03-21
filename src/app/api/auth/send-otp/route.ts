import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import OTP from '@/models/OTP';
import Admin from '@/models/Admin';
import { generateOTP, sendOTPEmail } from '@/lib/email';
import { successResponse, errorResponse, serverError, unauthorizedResponse } from '@/lib/api-response';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

// Validation schema
const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    const body = await request.json();
    
    // 1. Validate input
    const result = sendOtpSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }
    
    const { email, password } = result.data;

    await dbConnect();

    // 2. Find admin and verify password
    const admin = await Admin.findOne({ email: email.toLowerCase().trim(), isActive: true });
    
    if (!admin) {
      await logAudit({
        action: 'OTP_REQUEST',
        email,
        status: 'failure',
        details: 'Admin not found or inactive',
        ip,
        userAgent
      });
      return unauthorizedResponse('Invalid credentials');
    }

    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      await logAudit({
        action: 'OTP_REQUEST',
        email,
        userId: admin._id.toString(),
        status: 'failure',
        details: 'Invalid password',
        ip,
        userAgent
      });
      return unauthorizedResponse('Invalid credentials');
    }

    // 3. Rate limit OTP requests (1 minute)
    const recentOTP = await OTP.findOne({
      email: email.toLowerCase().trim(),
      createdAt: { $gte: new Date(Date.now() - 60000) }, // 1 minute
      verified: false
    });

    if (recentOTP) {
      return errorResponse('Please wait 1 minute before requesting a new OTP', 429);
    }

    // 4. Generate and save OTP
    await OTP.deleteMany({ email: email.toLowerCase().trim(), verified: false });
    const otpCode = generateOTP();

    await OTP.create({
      email: email.toLowerCase().trim(),
      otp: otpCode,
    });

    // 5. Log activity
    await logAudit({
      action: 'OTP_REQUEST',
      email,
      userId: admin._id.toString(),
      status: 'success',
      details: 'OTP generated and sent',
      ip,
      userAgent
    });

    // 6. Send email
    try {
      const emailSent = await sendOTPEmail(email, otpCode, admin.name || 'Admin');
      if (!emailSent) {
        console.error('[OTP Error]: Email sending failed');
      }
    } catch (emailError) {
      console.error('[OTP Email Error]:', emailError);
    }

    return successResponse({
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
    }, 'OTP sent successfully to your email');

  } catch (error: any) {
    return serverError(error);
  }
}

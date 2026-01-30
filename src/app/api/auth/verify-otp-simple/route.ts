import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OTP from '@/models/OTP';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/auth/jwt-secret';
import { getAuthCookieConfig } from '@/lib/auth/cookie-config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        await connectDB();

        // Find the OTP record
        const otpRecord = await OTP.findOne({
            email,
            otp,
            verified: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        // Mark OTP as verified
        otpRecord.verified = true;
        await otpRecord.save();

        // Create JWT token
        const secret = getJWTSecret();
        const token = jwt.sign(
            {
                email,
                isAdmin: true,
                loginTime: new Date().toISOString()
            },
            secret,
            { expiresIn: '7d' }
        );

        // Create response with success message
        const response = NextResponse.json({
            success: true,
            message: 'OTP verified successfully'
        });

        // Set the admin-token cookie
        const cookieConfig = getAuthCookieConfig();
        response.cookies.set('admin-token', token, {
            ...cookieConfig,
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        // Also set admin-session for compatibility
        response.cookies.set('admin-session', token, {
            ...cookieConfig,
            maxAge: 60 * 60 * 24 * 7
        });

        return response;

    } catch (error: any) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

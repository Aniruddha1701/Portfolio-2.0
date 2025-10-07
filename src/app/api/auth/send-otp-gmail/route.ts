import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import OTP from '@/models/OTP';
import Admin from '@/models/Admin';
import nodemailer from 'nodemailer';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    await connectDB();

    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin || !(await admin.comparePassword(password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const recentOTP = await OTP.findOne({
      email,
      createdAt: { $gte: new Date(Date.now() - 60000) },
      verified: false
    });

    if (recentOTP) {
      return NextResponse.json({ error: 'Please wait 1 minute before requesting a new OTP' }, { status: 429 });
    }

    await OTP.deleteMany({ email, verified: false });

    const otpCode = generateOTP();

    await OTP.create({ 
      email, 
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    console.log('\n' + '='.repeat(50));
    console.log('🔐 OTP:', otpCode);
    console.log('Email:', email);
    console.log('='.repeat(50) + '\n');

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'lab205ab1@gmail.com',
          pass: 'miqn dntu rwgu mtkr',
        },
      });

      await transporter.sendMail({
        from: '"Portfolio Admin" <lab205ab1@gmail.com>',
        to: email,
        subject: '🔐 Your Admin Login OTP Code',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:#f4f4f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">Portfolio Admin</h1>
              <p style="margin:10px 0 0;color:#ffffff;opacity:0.9;font-size:14px;">Secure Login Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px;color:#1a1a1a;font-size:24px;font-weight:600;">Your Login Code</h2>
              <p style="margin:0 0 30px;color:#666;font-size:16px;line-height:1.6;">You requested to log in to your Portfolio Admin Panel. Use the verification code below to complete your login:</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:#f7f9fc;border-radius:8px;padding:30px;">
                    <p style="margin:0 0 10px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Verification Code</p>
                    <div style="font-size:42px;font-weight:700;color:#667eea;letter-spacing:8px;font-family:'Courier New',monospace;">${otpCode}</div>
                    <p style="margin:15px 0 0;color:#999;font-size:13px;">⏱ Valid for 10 minutes</p>
                  </td>
                </tr>
              </table>
              <div style="margin:30px 0;padding:20px;background:#fff3cd;border-left:4px solid #ffc107;border-radius:4px;">
                <p style="margin:0;color:#856404;font-size:14px;line-height:1.6;"><strong>⚠️ Security Notice:</strong><br>Never share this code with anyone. If you didn't request this login, please ignore this email and secure your account.</p>
              </div>
              <p style="margin:0;color:#999;font-size:13px;line-height:1.6;">This is an automated message. Please do not reply to this email.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f7f9fc;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 10px;color:#999;font-size:12px;">© ${new Date().getFullYear()} Portfolio Admin. All rights reserved.</p>
              <p style="margin:0;color:#999;font-size:12px;">Secure authentication powered by OTP verification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });
      console.log('✅ Email sent');
    } catch (err) {
      console.error('Email error:', err);
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

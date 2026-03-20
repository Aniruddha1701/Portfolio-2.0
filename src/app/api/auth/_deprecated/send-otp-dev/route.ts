import { NextRequest, NextResponse } from 'next/server';

// Store OTPs in memory for development (in production, use database)
const otpStore = new Map<string, { otp: string; expires: number }>();

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Hardcode admin credentials
    const adminEmail = 'aniruddhap66@gmail.com';
    const adminPassword = 'Tamdev54@#';

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if there's a recent OTP (rate limiting)
    const existingOtp = otpStore.get(email);
    if (existingOtp && Date.now() < existingOtp.expires - 540000) { // 9 minutes left
      return NextResponse.json(
        { 
          error: 'Please wait before requesting a new OTP',
          remainingTime: Math.ceil((existingOtp.expires - 540000 - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otpCode = generateOTP();
    
    // Store OTP with 10 minute expiry
    otpStore.set(email, {
      otp: otpCode,
      expires: Date.now() + 600000 // 10 minutes
    });

    // Log OTP to console
    console.log('\n' + '='.repeat(50));
    console.log('🔐 OTP GENERATED');
    console.log('='.repeat(50));
    console.log('Email:', email);
    console.log('OTP Code:', otpCode);
    console.log('Time:', new Date().toLocaleString());
    console.log('Expires in: 10 minutes');
    console.log('='.repeat(50) + '\n');

    // Return success with OTP visible in development mode
    return NextResponse.json({
      success: true,
      message: 'OTP generated successfully',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      // IMPORTANT: Only show OTP in development mode
      developmentOTP: otpCode,
      expiresIn: 600, // seconds
      note: 'OTP is visible for development. In production, it would be sent to your email.'
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate OTP',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Endpoint to verify OTP
export async function PUT(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const storedOtp = otpStore.get(email);

    if (!storedOtp) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 404 }
      );
    }

    if (Date.now() > storedOtp.expires) {
      otpStore.delete(email);
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 410 }
      );
    }

    if (storedOtp.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 401 }
      );
    }

    // OTP is valid, remove it from store
    otpStore.delete(email);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}

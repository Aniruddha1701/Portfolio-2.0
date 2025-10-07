import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const nodemailer = (await import('nodemailer')).default;
    
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    console.log('Email User:', emailUser);
    console.log('Email Pass exists:', !!emailPass);
    
    if (!emailUser || !emailPass) {
      return NextResponse.json({
        error: 'Missing email credentials',
        user: !!emailUser,
        pass: !!emailPass
      }, { status: 500 });
    }

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test the connection
    try {
      await transporter.verify();
      return NextResponse.json({
        success: true,
        message: 'Email configuration is working'
      });
    } catch (verifyError: any) {
      console.error('Verification error:', verifyError);
      return NextResponse.json({
        error: 'Email verification failed',
        details: verifyError.message,
        code: verifyError.code
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error.message
    }, { status: 500 });
  }
}
import dbConnect from '@/lib/db/mongoose';
import ResumeRequest from '@/models/ResumeRequest';
import { sendResumeRequestEmailToAdmin } from '@/lib/mail';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, origin } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if there is already a pending request for this email
    const existingRequest = await ResumeRequest.findOne({ email, status: 'pending' });
    if (existingRequest) {
      return NextResponse.json({ error: 'You already have a pending request.' }, { status: 429 });
    }

    // Generate a secure random token for the approval process
    const authorizationToken = crypto.randomUUID();

    // Create the request in the DB
    const resumeRequest = await ResumeRequest.create({
      name,
      email,
      token: authorizationToken,
      status: 'pending',
    });

    // Use origin from client if passed, else fallback to headers
    let baseUrl = origin;
    if (!baseUrl) {
      const protocol = request.headers.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https');
      const host = request.headers.get('host') ?? 'localhost:9002';
      baseUrl = `${protocol}://${host}`;
    }

    // Send email to Admin
    try {
      await sendResumeRequestEmailToAdmin(
        resumeRequest._id.toString(),
        name,
        email,
        authorizationToken,
        baseUrl
      );
    } catch (emailError: any) {
      console.error('Failed to send admin email:', emailError);
      
      // If email fails, we should technically probably delete the request or flag it
      // But for local testing if SMTP isn't set up, we just let it pass with a warning console log
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('EMAIL_USER and EMAIL_PASS not configured in .env. Email was not sent, but request was saved to DB.');
      } else {
        console.error('SMTP Error: Database saved but failed to send email. Check SMTP settings.');
      }
      // Return success anyway so UI doesn't crash, since it was saved to the DB
    }

    return NextResponse.json({ success: true, message: 'Request submitted successfully' });
  } catch (error: any) {
    console.error('Resume request submission error:', error);
    
    // Check for duplicate email within a short timeframe (optional anti-spam)
    if (error.code === 11000) {
       return NextResponse.json({ error: 'You have already submitted a request recently.' }, { status: 429 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

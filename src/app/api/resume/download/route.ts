import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';
import ResumeRequest from '@/models/ResumeRequest';
import ResumeFile from '@/models/ResumeFile';
import { verifyAuth } from '@/middleware/auth';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Check if it's an admin requesting
    const user = await verifyAuth(request);

    // 1. Token Validation
    if (!user) {
      if (!token) {
          // Strictly enforce the token if not an admin.
          return NextResponse.json({ error: 'Access Denied. Missing authorization token.' }, { status: 403 });
      }

      const resumeRequest = await ResumeRequest.findOne({ token });

      if (!resumeRequest) {
          return NextResponse.json({ error: 'Access Denied. Invalid token.' }, { status: 403 });
      }

      if (resumeRequest.status !== 'approved') {
           return NextResponse.json({ error: 'Access Denied. This request has not been approved.' }, { status: 403 });
      }

      // Check expiration
      if (new Date() > new Date(resumeRequest.expiresAt)) {
           return NextResponse.json({ error: 'Access Denied. This token has expired.' }, { status: 410 });
      }
    }

    // 2. Fetch Resume from Database
    const resumeFile = await ResumeFile.findOne({ filename: 'Resume_Aniruddha.pdf' }).sort({ uploadedAt: -1 });
    
    if (!resumeFile) {
      return NextResponse.json(
        { error: 'Resume file not found in database' },
        { status: 404 }
      );
    }
    
    // Serve the DB buffer directly
    const downloadName = 'Resume_Aniruddha.pdf';
    return new NextResponse(resumeFile.data, {
      headers: {
        'Content-Type': resumeFile.contentType || 'application/pdf',
        'Content-Disposition': `attachment; filename="${downloadName}"`,
        'Content-Length': resumeFile.data.length.toString(),
      },
    });

  } catch (error) {
    console.error('Resume download error:', error);
    return NextResponse.json(
      { error: 'Failed to download resume' },
      { status: 500 }
    );
  }
}

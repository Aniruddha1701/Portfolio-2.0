import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Portfolio from '@/models/Portfolio';
import ResumeRequest from '@/models/ResumeRequest'; // Added
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // 1. Token Validation
    if (!token) {
        // If an admin requests it natively from dashboard, we might want to let them bypass, 
        // but for now strictly enforce the token.
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

    // 2. Fetch Portfolio data
    const portfolio = await Portfolio.findOne();
    
    if (!portfolio || !portfolio.personalInfo?.resume) {
      return NextResponse.json(
        { error: 'No resume available' },
        { status: 404 }
      );
    }

    const resumePath = portfolio.personalInfo.resume;
    
    // If it's a URL (external resume), redirect to it
    if (resumePath.startsWith('http://') || resumePath.startsWith('https://')) {
      return NextResponse.redirect(resumePath);
    }
    
    // For local files, serve them
    if (resumePath.startsWith('/uploads/')) {
      const filename = resumePath.replace('/uploads/', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      
      try {
        const fileBuffer = await readFile(filePath);
        
        // Determine content type based on file extension
        let contentType = 'application/pdf';
        if (filename.endsWith('.doc')) {
          contentType = 'application/msword';
        } else if (filename.endsWith('.docx')) {
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }
        
        // Get the person's name for the filename
        const downloadName = portfolio.personalInfo.name 
          ? `${portfolio.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
          : 'Resume.pdf';
        
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${downloadName}"`,
            'Content-Length': fileBuffer.length.toString(),
          },
        });
      } catch (error) {
        console.error('File read error:', error);
        return NextResponse.json(
          { error: 'Resume file not found' },
          { status: 404 }
        );
      }
    }
    
    // Fallback for old '/resume.pdf' format
    if (resumePath === '/resume.pdf') {
      const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
      
      try {
        const fileBuffer = await readFile(filePath);
        
        const downloadName = portfolio.personalInfo.name 
          ? `${portfolio.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
          : 'Resume.pdf';
        
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${downloadName}"`,
            'Content-Length': fileBuffer.length.toString(),
          },
        });
      } catch (error) {
        return NextResponse.json(
          { error: 'Resume file not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid resume path' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Resume download error:', error);
    return NextResponse.json(
      { error: 'Failed to download resume' },
      { status: 500 }
    );
  }
}

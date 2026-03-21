import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import ResumeRequest from '@/models/ResumeRequest';
import ResumeFile from '@/models/ResumeFile';
import Portfolio from '@/models/Portfolio';
import { successResponse, errorResponse, serverError, notFoundResponse, forbiddenResponse } from '@/lib/api-response';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  if (!token) {
    return errorResponse('Token is required', 400);
  }

  try {
    await dbConnect();

    // 1. Find and validate the request
    const resumeRequest = await ResumeRequest.findOne({ token });

    if (!resumeRequest) {
      return notFoundResponse('Invalid or expired view link');
    }

    if (resumeRequest.status !== 'approved') {
      return forbiddenResponse('This request has not been approved yet');
    }

    // 2. Check Expiration (7 days default)
    if (new Date() > new Date(resumeRequest.expiresAt)) {
      return forbiddenResponse('This view link has expired');
    }

    // 3. One-Time Access Check
    if (resumeRequest.viewCount > 0) {
      return forbiddenResponse('This link has already been used. Access is restricted to one-time view only.');
    }

    // 4. Record the view (Self-destruct mechanism)
    resumeRequest.viewCount += 1;
    resumeRequest.viewedAt = new Date();
    resumeRequest.lastViewedIp = ip;
    await resumeRequest.save();

    // 5. Fetch the actual resume file
    // First, check the Portfolio model to see which file is active
    const portfolio = await Portfolio.findOne().lean();
    const resumePath = portfolio?.personalInfo?.resume;

    let fileBuffer: Buffer | null = null;
    let contentType = 'application/pdf';

    if (resumePath && resumePath.startsWith('/uploads/')) {
      // Fetch from local filesystem
      const filename = resumePath.replace('/uploads/', '');
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      
      if (existsSync(filePath)) {
        fileBuffer = await readFile(filePath);
      }
    }

    // Fallback to ResumeFile collection if not found on disk
    if (!fileBuffer) {
      const resumeFile = await ResumeFile.findOne({ filename: 'Resume_Aniruddha.pdf' }).sort({ uploadedAt: -1 });
      if (resumeFile) {
        fileBuffer = resumeFile.data;
        contentType = resumeFile.contentType || 'application/pdf';
      }
    }

    if (!fileBuffer) {
      return notFoundResponse('Resume file not found');
    }

    // 6. Return as base64 to prevent automatic browser download/viewing
    return successResponse({
      fileData: fileBuffer.toString('base64'),
      contentType,
      fileName: 'Portfolio_Resume.pdf',
      viewerEmail: resumeRequest.email
    }, 'Resume data retrieved successfully');

  } catch (error: any) {
    console.error('[Secure View API Error]:', error);
    return serverError(error);
  }
}

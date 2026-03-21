import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';
import { requireAdmin } from '@/middleware/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { successResponse, errorResponse, serverError, forbiddenResponse } from '@/lib/api-response';
import { logAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const authUser = await requireAdmin(request);
    if (!authUser) {
      return forbiddenResponse('Admin access required');
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return errorResponse('No file provided', 400);
    }

    const validTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!validTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Please upload PDF or DOC/DOCX', 400);
    }

    if (file.size > 5 * 1024 * 1024) {
      return errorResponse('File too large. Maximum size is 5MB', 400);
    }

    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `resume_${timestamp}_${originalName}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    const filePath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    await dbConnect();
    const portfolio = await Portfolio.findOne();
    
    if (portfolio) {
      // Remove old file if exists
      if (portfolio.personalInfo.resume && portfolio.personalInfo.resume.startsWith('/uploads/')) {
        const oldFilename = portfolio.personalInfo.resume.replace('/uploads/', '');
        const oldFilePath = path.join(process.cwd(), 'public', 'uploads', oldFilename);
        if (existsSync(oldFilePath)) {
          try { await unlink(oldFilePath); } catch (e) {}
        }
      }
      
      portfolio.personalInfo.resume = `/uploads/${filename}`;
      await portfolio.save();
    } else {
      await Portfolio.create({
        personalInfo: {
          resume: `/uploads/${filename}`
        }
      });
    }

    await logAudit({
      action: 'RESUME_UPLOAD',
      userId: authUser.userId,
      email: authUser.email,
      status: 'success',
      details: `Uploaded: ${filename}`,
      ip,
      userAgent
    });

    return successResponse({ 
      resumeUrl: `/uploads/${filename}` 
    }, 'Resume uploaded successfully');

  } catch (error: any) {
    return serverError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const authUser = await requireAdmin(request);
    if (!authUser) {
      return forbiddenResponse('Admin access required');
    }

    await dbConnect();
    const portfolio = await Portfolio.findOne();
    
    if (portfolio && portfolio.personalInfo && portfolio.personalInfo.resume) {
      if (portfolio.personalInfo.resume.startsWith('/uploads/')) {
        const filename = portfolio.personalInfo.resume.replace('/uploads/', '');
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
        if (existsSync(filePath)) {
          try { await unlink(filePath); } catch (e) {}
        }
      }
      
      portfolio.personalInfo.resume = '';
      await portfolio.save();
      
      await logAudit({
        action: 'RESUME_DELETE',
        userId: authUser.userId,
        email: authUser.email,
        status: 'success',
        ip,
        userAgent
      });

      return successResponse(null, 'Resume removed successfully');
    }

    return successResponse(null, 'No resume to remove');

  } catch (error: any) {
    return serverError(error);
  }
}

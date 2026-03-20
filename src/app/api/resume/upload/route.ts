import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';
import { requireAdmin } from '@/middleware/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAdmin(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload PDF or DOC/DOCX' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 });
    }

    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `resume_${timestamp}_${originalName}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const filePath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    await dbConnect();
    const portfolio = await Portfolio.findOne();
    
    if (portfolio) {
      if (portfolio.personalInfo.resume && portfolio.personalInfo.resume.startsWith('/uploads/')) {
        const oldFilename = portfolio.personalInfo.resume.replace('/uploads/', '');
        const oldFilePath = path.join(process.cwd(), 'public', 'uploads', oldFilename);
        
        if (existsSync(oldFilePath)) {
          try {
            await unlink(oldFilePath);
          } catch (error) {
            console.error('Error deleting old resume file:', error);
          }
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

    return NextResponse.json({ 
      message: 'Resume uploaded successfully',
      resumeUrl: `/uploads/${filename}`
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = await requireAdmin(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const portfolio = await Portfolio.findOne();
    
    if (portfolio && portfolio.personalInfo && portfolio.personalInfo.resume) {
      if (portfolio.personalInfo.resume.startsWith('/uploads/')) {
        const filename = portfolio.personalInfo.resume.replace('/uploads/', '');
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
        
        if (existsSync(filePath)) {
          try {
            await unlink(filePath);
          } catch (error) {
            console.error('Error deleting resume file:', error);
          }
        }
      }
      
      portfolio.personalInfo.resume = '';
      await portfolio.save();
      
      return NextResponse.json({ 
        message: 'Resume removed successfully'
      });
    } else {
      return NextResponse.json({ 
        message: 'No resume to remove'
      });
    }

  } catch (error: any) {
    console.error('Resume removal error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove resume' },
      { status: 500 }
    );
  }
}

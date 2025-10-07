import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Portfolio from '@/models/Portfolio';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-here-change-this-in-production';

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('NEXTAUTH_SECRET is not defined in environment variables, using default (NOT SECURE FOR PRODUCTION)');
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token.value, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload PDF or DOC/DOCX' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 });
    }

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `resume_${timestamp}_${originalName}`;
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Save file to public/uploads
    const filePath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update portfolio with resume path
    await connectDB();
    const portfolio = await Portfolio.findOne();
    
    if (portfolio) {
      // Delete old resume file if it exists
      if (portfolio.personalInfo.resume && portfolio.personalInfo.resume.startsWith('/uploads/')) {
        const oldFilename = portfolio.personalInfo.resume.replace('/uploads/', '');
        const oldFilePath = path.join(process.cwd(), 'public', 'uploads', oldFilename);
        
        // Check if old file exists and delete it
        if (existsSync(oldFilePath)) {
          try {
            await unlink(oldFilePath);
            console.log('Old resume file deleted:', oldFilename);
          } catch (error) {
            console.error('Error deleting old resume file:', error);
          }
        }
      }
      
      // Store relative path for public access
      portfolio.personalInfo.resume = `/uploads/${filename}`;
      await portfolio.save();
    } else {
      // Create new portfolio with resume
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
    // Verify admin authentication
    const token = request.cookies.get('auth-token');
    console.log('Delete resume - Token present:', !!token);
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token found' }, { status: 401 });
    }

    try {
      jwt.verify(token.value, JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    const portfolio = await Portfolio.findOne();
    console.log('Portfolio found:', !!portfolio);
    console.log('Resume path:', portfolio?.personalInfo?.resume);
    
    if (portfolio && portfolio.personalInfo && portfolio.personalInfo.resume) {
      // Delete the file from filesystem
      if (portfolio.personalInfo.resume.startsWith('/uploads/')) {
        const filename = portfolio.personalInfo.resume.replace('/uploads/', '');
        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
        
        // Check if file exists and delete it
        if (existsSync(filePath)) {
          try {
            await unlink(filePath);
            console.log('Resume file deleted:', filename);
          } catch (error) {
            console.error('Error deleting resume file:', error);
            // Continue even if file deletion fails
          }
        }
      }
      
      // Remove resume path from database
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
    const errorMessage = error.message || 'Failed to remove resume';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/mongoose';
import Admin from '@/models/Admin';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find admin
    const admin = await Admin.findOne({ email, isActive: true });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check password
    const isValidPassword = await admin.comparePassword(password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id,
        email: admin.email,
        role: admin.role 
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key-here-change-this-in-production',
      { expiresIn: '7d' }
    );
    
    // Return success response with token
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      },
      { status: 200 }
    );
    
    // Set HTTP-only cookies
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    // Also set simple session cookie for easier verification
    response.cookies.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    console.log('Login successful for:', admin.email);
    
    return response;
    
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

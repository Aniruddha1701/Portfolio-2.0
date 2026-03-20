import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '@/lib/auth/jwt-secret';
import { getAuthCookieConfig } from '@/lib/auth/cookie-config';
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
      getJWTSecret(),
      { expiresIn: '15m' }
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
    
    // Set HTTP-only cookies (multiple names for compatibility)
    const cookieOptions = getAuthCookieConfig();
    
    response.cookies.set('auth-token', token, cookieOptions);
    response.cookies.set('admin-token', token, cookieOptions);
    response.cookies.set('admin-session', token, cookieOptions);
    
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

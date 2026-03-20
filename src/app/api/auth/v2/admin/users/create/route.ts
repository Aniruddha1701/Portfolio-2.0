import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { requireAdmin } from '@/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAdmin(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    let userRole: 'user' | 'admin' | 'super-admin' = 'user';
    
    if (authUser.role === 'super-admin') {
      if (role && ['user', 'admin', 'super-admin'].includes(role)) {
        userRole = role;
      }
    } else if (authUser.role === 'admin') {
      if (role === 'super-admin') {
        return NextResponse.json(
          { error: 'Cannot create super-admin users' },
          { status: 403 }
        );
      }
      if (role === 'admin') {
        userRole = 'admin';
      }
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role: userRole,
      isEmailVerified: true,
      isActive: true
    });

    await AuditLog.create({
      user: authUser.userId,
      action: 'register',
      status: 'success',
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || '',
      metadata: { action: 'create_user', createdUserId: user._id, role: userRole }
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

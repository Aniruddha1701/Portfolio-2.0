import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { requireAdmin } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const authUser = await requireAdmin(request);

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');

    const query: any = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    await AuditLog.create({
      user: authUser.userId,
      action: 'login',
      status: 'success',
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || '',
      metadata: { action: 'admin_users_list', page, limit }
    });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

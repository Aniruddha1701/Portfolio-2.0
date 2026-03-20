import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { requireAdmin, requireSuperAdmin } from '@/middleware/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authUser = await requireSuperAdmin(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const { role, isActive } = await request.json();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user._id.toString() === authUser.userId) {
      return NextResponse.json(
        { error: 'Cannot modify your own account' },
        { status: 400 }
      );
    }

    const updates: any = {};

    if (role && ['user', 'admin', 'super-admin'].includes(role)) {
      if (role === 'super-admin' && authUser.role !== 'super-admin') {
        return NextResponse.json(
          { error: 'Cannot assign super-admin role' },
          { status: 403 }
        );
      }
      updates.role = role;
    }

    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).select('-password');

    await AuditLog.create({
      user: authUser.userId,
      action: 'password_change',
      status: 'success',
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || '',
      metadata: { action: 'update_user', updatedUserId: id, updates }
    });

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: updatedUser
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authUser = await requireSuperAdmin(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user._id.toString() === authUser.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);

    await AuditLog.create({
      user: authUser.userId,
      action: 'logout',
      status: 'success',
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || '',
      metadata: { action: 'delete_user', deletedUserId: id }
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

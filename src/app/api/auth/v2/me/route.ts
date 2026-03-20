import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import { authenticateWithRefresh } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const user = await authenticateWithRefresh(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const fullUser = await User.findById(user.userId);

    if (!fullUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: fullUser._id,
        email: fullUser.email,
        name: fullUser.name,
        role: fullUser.role,
        isEmailVerified: fullUser.isEmailVerified,
        isActive: fullUser.isActive,
        lastLogin: fullUser.lastLogin
      }
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

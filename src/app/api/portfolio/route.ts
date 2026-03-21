import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';
import { requireAdmin } from '@/middleware/auth';
import { successResponse, errorResponse, serverError, forbiddenResponse, notFoundResponse } from '@/lib/api-response';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

// GET - Fetch portfolio data (Public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const portfolio = await Portfolio.findOne({}).lean();
    
    if (!portfolio) {
      return notFoundResponse('Portfolio not found');
    }
    
    return successResponse(portfolio);
    
  } catch (error: any) {
    return serverError(error);
  }
}

// POST - Create portfolio (Admin only)
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  try {
    const authUser = await requireAdmin(request);
    if (!authUser) {
      return forbiddenResponse('Admin access required');
    }
    
    await dbConnect();
    
    const data = await request.json();
    const existingPortfolio = await Portfolio.findOne({});
    
    if (existingPortfolio) {
      return errorResponse('Portfolio already exists. Use PUT to update.', 400);
    }
    
    const portfolio = await Portfolio.create(data);
    
    await logAudit({
      action: 'PORTFOLIO_UPDATE',
      userId: authUser.userId,
      email: authUser.email,
      status: 'success',
      details: 'Created new portfolio',
      ip
    });

    return successResponse(portfolio, 'Portfolio created successfully', 201);
    
  } catch (error: any) {
    return serverError(error);
  }
}

// PUT - Update portfolio (Admin only)
export async function PUT(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  try {
    const authUser = await requireAdmin(request);
    if (!authUser) {
      return forbiddenResponse('Admin access required');
    }
    
    await dbConnect();
    
    const data = await request.json();
    const { _id, ...updateData } = data;
    
    // Normalize data (ensure structure is correct)
    if (updateData.education) {
      updateData.education = updateData.education.map((edu: any) => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        location: edu.location || '',
        duration: edu.duration || '',
        startDate: edu.startDate || null,
        endDate: edu.endDate || null,
        current: edu.current || false,
        gpa: edu.gpa || '',
        achievements: edu.achievements || [],
        iconType: edu.iconType || 'university'
      }));
    }
    
    if (updateData.experience) {
      updateData.experience = updateData.experience.map((exp: any) => ({
        company: exp.company || exp.institution || '',
        position: exp.position || exp.degree || '',
        institution: exp.institution || exp.company || '',
        degree: exp.degree || exp.position || '',
        location: exp.location || '',
        duration: exp.duration || '',
        startDate: exp.startDate || null,
        endDate: exp.endDate || null,
        current: exp.current || false,
        description: exp.description || exp.highlights || [],
        highlights: exp.highlights || exp.description || [],
        iconType: exp.iconType || 'briefcase'
      }));
    }
    
    let portfolio;
    const existingPortfolio = await Portfolio.findOne({});
    
    if (existingPortfolio) {
      portfolio = await Portfolio.findByIdAndUpdate(
        existingPortfolio._id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      portfolio = await Portfolio.create(updateData);
    }
    
    if (!portfolio) {
      return notFoundResponse('Failed to update/create portfolio');
    }

    await logAudit({
      action: 'PORTFOLIO_UPDATE',
      userId: authUser.userId,
      email: authUser.email,
      status: 'success',
      details: 'Updated portfolio data',
      ip
    });
    
    return successResponse(portfolio, 'Portfolio updated successfully');
    
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return errorResponse(`Validation error: ${error.message}`, 400);
    }
    return serverError(error);
  }
}

// DELETE - Delete portfolio (Admin only)
export async function DELETE(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  try {
    const authUser = await requireAdmin(request);
    if (!authUser) {
      return forbiddenResponse('Admin access required');
    }
    
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return errorResponse('Portfolio ID required', 400);

    const portfolio = await Portfolio.findByIdAndDelete(id);
    
    if (!portfolio) {
      return notFoundResponse('Portfolio not found');
    }
    
    await logAudit({
      action: 'PORTFOLIO_UPDATE',
      userId: authUser.userId,
      email: authUser.email,
      status: 'success',
      details: `Deleted portfolio: ${id}`,
      ip
    });

    return successResponse(null, 'Portfolio deleted successfully');
    
  } catch (error: any) {
    return serverError(error);
  }
}

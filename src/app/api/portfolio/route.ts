import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';
import { authenticateWithRefresh, requireAdmin } from '@/middleware/auth';

// GET - Fetch portfolio data (Public - anyone can view)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const portfolio = await Portfolio.findOne({}).lean();
    
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(portfolio, { status: 200 });
    
  } catch (error: any) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create portfolio (Admin only)
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
    
    const data = await request.json();
    
    const existingPortfolio = await Portfolio.findOne({});
    
    if (existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio already exists. Use PUT to update.' },
        { status: 400 }
      );
    }
    
    const portfolio = await Portfolio.create(data);
    
    return NextResponse.json(portfolio, { status: 201 });
    
  } catch (error: any) {
    console.error('Portfolio create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update portfolio (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const authUser = await requireAdmin(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    const data = await request.json();
    const { _id, ...updateData } = data;
    
    if (updateData.education) {
      updateData.education = updateData.education.map((edu: any) => {
        return {
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
        };
      });
    }
    
    if (updateData.experience) {
      updateData.experience = updateData.experience.map((exp: any) => {
        return {
          company: exp.company || '',
          position: exp.position || '',
          institution: exp.institution || exp.company || '',
          degree: exp.degree || exp.position || '',
          location: exp.location || '',
          duration: exp.duration || '',
          startDate: exp.startDate || null,
          endDate: exp.endDate || null,
          current: exp.current || false,
          description: exp.description || [],
          highlights: exp.highlights || exp.description || [],
          iconType: exp.iconType || 'briefcase'
        };
      });
    }
    
    let portfolioId = _id;
    if (!portfolioId) {
      const existingPortfolio = await Portfolio.findOne({});
      portfolioId = existingPortfolio?._id;
    }
    
    if (portfolioId) {
      const portfolio = await Portfolio.findByIdAndUpdate(
        portfolioId,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!portfolio) {
        return NextResponse.json(
          { error: 'Portfolio not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(portfolio, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    } else {
      const portfolio = await Portfolio.create(updateData);
      return NextResponse.json(portfolio, { 
        status: 201,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }
    
  } catch (error: any) {
    console.error('Portfolio update error:', error.message || error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: `Validation error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete portfolio (Admin only)
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
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const portfolio = await Portfolio.findByIdAndDelete(id);
    
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Portfolio deleted successfully' },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Portfolio delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

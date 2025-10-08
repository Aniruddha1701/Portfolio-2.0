import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';
import { verifyAuth } from '@/middleware/auth';

// GET - Fetch portfolio data
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // For public access, get the first portfolio (you can modify this logic)
    const portfolio = await Portfolio.findOne({});
    
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
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const data = await request.json();
    
    // Check if portfolio already exists
    const existingPortfolio = await Portfolio.findOne({
      'personalInfo.email': data.personalInfo.email
    });
    
    if (existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio already exists for this email' },
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
    // Verify authentication
    const user = await verifyAuth(request);
    
    if (!user) {
      console.log('Auth failed - no valid session found');
      console.log('Available cookies:', request.cookies.getAll());
      return NextResponse.json(
        { error: 'Unauthorized - Please log in again' },
        { status: 401 }
      );
    }
    
    console.log('Authenticated user:', user.email || user);
    
    await dbConnect();
    
    const data = await request.json();
    const { _id, ...updateData } = data;
    
    // Clean up data and provide defaults for education
    if (updateData.education) {
      updateData.education = updateData.education.map((edu: any) => {
        return {
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',  // Provide empty string as default
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
    
    // If _id is provided, use it. Otherwise, find the first portfolio
    let portfolioId = _id;
    if (!portfolioId) {
      const existingPortfolio = await Portfolio.findOne({});
      portfolioId = existingPortfolio?._id;
    }
    
    console.log('Portfolio ID:', portfolioId);
    
    if (portfolioId) {
      // Update existing portfolio
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
      
      console.log('Portfolio updated successfully');
      return NextResponse.json(portfolio, { status: 200 });
    } else {
      // No portfolio exists, create a new one
      console.log('Creating new portfolio');
      const portfolio = await Portfolio.create(updateData);
      return NextResponse.json(portfolio, { status: 201 });
    }
    
  } catch (error: any) {
    console.error('Portfolio update error:', error.message || error);
    console.error('Full error:', error);
    
    // Check for validation errors
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
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

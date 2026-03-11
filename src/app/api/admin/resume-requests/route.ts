import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import ResumeRequest from '@/models/ResumeRequest';
import ResumeFile from '@/models/ResumeFile';
import { verifyAuth } from '@/middleware/auth';
import { sendApprovalEmailToVisitor, sendRejectionEmailToVisitor } from '@/lib/mail';

// GET - Fetch all resume requests (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch all requests, sort by newest first
    const requests = await ResumeRequest.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error('Failed to fetch resume requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT - Update resume request status (approve/reject) (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const data = await request.json();
    const { id, status, origin } = data; // status should be 'approved' or 'rejected'

    if (!id || !status || (status !== 'approved' && status !== 'rejected')) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const resumeRequest = await ResumeRequest.findById(id);

    if (!resumeRequest) {
      return NextResponse.json({ error: 'Resume request not found' }, { status: 404 });
    }

    if (resumeRequest.status !== 'pending') {
         return NextResponse.json({ error: `Request has already been ${resumeRequest.status}` }, { status: 400 });
    }

    // Process the action
    resumeRequest.status = status;
    await resumeRequest.save();

    let baseUrl = origin;
    if (!baseUrl) {
      const protocol = request.headers.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https');
      const host = request.headers.get('host') ?? 'localhost:9002';
      baseUrl = `${protocol}://${host}`;
    }

    // Send corresponding email to the visitor
    try {
        if (status === 'approved') {
            const resumeFile = await ResumeFile.findOne({ filename: 'Resume_Aniruddha.pdf' }).sort({ uploadedAt: -1 });
            await sendApprovalEmailToVisitor(
                resumeRequest.name, 
                resumeRequest.email, 
                resumeRequest.token, 
                baseUrl,
                resumeFile ? resumeFile.data : undefined,
                resumeFile ? resumeFile.filename : undefined
            );
        } else {
            await sendRejectionEmailToVisitor(resumeRequest.name, resumeRequest.email);
        }
    } catch (emailError: any) {
        console.error('Failed to send visitor update email:', emailError);
        // Continue anyway since DB was updated
    }

    return NextResponse.json({ success: true, request: resumeRequest }, { status: 200 });

  } catch (error: any) {
    console.error('Update resume request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import ResumeRequest from '@/models/ResumeRequest';
import ResumeFile from '@/models/ResumeFile';
import { requireAdmin } from '@/middleware/auth';
import { sendApprovalEmailToVisitor, sendRejectionEmailToVisitor } from '@/lib/mail';
import { successResponse, unauthorizedResponse, errorResponse, serverError, notFoundResponse } from '@/lib/api-response';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

/**
 * GET - Fetch all resume requests (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) return unauthorizedResponse('Admin access required');

    await dbConnect();
    
    // Fetch all requests, sort by newest first
    const requests = await ResumeRequest.find({}).sort({ createdAt: -1 }).lean();
    
    return successResponse(requests);
  } catch (error: any) {
    return serverError(error);
  }
}

/**
 * PUT - Update resume request status (approve/reject) (Admin only)
 */
export async function PUT(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    const user = await requireAdmin(request);
    if (!user) return unauthorizedResponse('Admin access required');

    await dbConnect();

    const data = await request.json();
    const { id, status, origin } = data; // status should be 'approved' or 'rejected'

    if (!id || !status || (status !== 'approved' && status !== 'rejected')) {
      return errorResponse('Invalid request data: id and valid status (approved/rejected) are required', 400);
    }

    const resumeRequest = await ResumeRequest.findById(id);

    if (!resumeRequest) {
      return notFoundResponse('Resume request not found');
    }

    if (resumeRequest.status !== 'pending') {
      return errorResponse(`Request has already been ${resumeRequest.status}`, 400);
    }

    // Process the action
    const oldStatus = resumeRequest.status;
    resumeRequest.status = status;
    await resumeRequest.save();

    // Log the audit event
    await logAudit({
      action: status === 'approved' ? 'RESUME_REQUEST_APPROVE' : 'RESUME_REQUEST_REJECT',
      userId: user.userId,
      email: user.email,
      resourceId: id,
      details: `${status.charAt(0).toUpperCase() + status.slice(1)} resume request for ${resumeRequest.email}`,
      ip,
      userAgent,
      status: 'success'
    });

    let baseUrl = origin;
    if (!baseUrl) {
      const protocol = request.headers.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https');
      const host = request.headers.get('host') ?? 'localhost:9002';
      baseUrl = `${protocol}://${host}`;
    }

    // Send corresponding email to the visitor
    try {
      if (status === 'approved') {
        await sendApprovalEmailToVisitor(
          resumeRequest.name, 
          resumeRequest.email, 
          resumeRequest.token, 
          baseUrl
        );
      } else {
        await sendRejectionEmailToVisitor(resumeRequest.name, resumeRequest.email);
      }
    } catch (emailError: any) {
      console.error('[Resume Request Email Error]:', emailError);
      // We don't return an error here because the database update was successful
    }

    return successResponse(resumeRequest, `Request ${status} successfully`);

  } catch (error: any) {
    return serverError(error);
  }
}

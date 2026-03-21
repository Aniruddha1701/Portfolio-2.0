import dbConnect from '@/lib/db/mongoose';
import ResumeRequest from '@/models/ResumeRequest';
import { sendResumeRequestEmailToAdmin } from '@/lib/mail';
import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { successResponse, errorResponse, serverError } from '@/lib/api-response';

// Validation schema
const resumeRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  origin: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // 1. Validate input
    const result = resumeRequestSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }
    
    const { name, email, origin } = result.data;

    // 2. Check if there is already a pending request for this email
    const existingRequest = await ResumeRequest.findOne({ email, status: 'pending' });
    if (existingRequest) {
      return errorResponse('You already have a pending request.', 429);
    }

    // 3. Generate a secure random token
    const authorizationToken = crypto.randomUUID();

    // 4. Create the request
    const resumeRequest = await ResumeRequest.create({
      name,
      email,
      token: authorizationToken,
      status: 'pending',
    });

    // 5. Determine base URL
    let baseUrl = origin;
    if (!baseUrl) {
      const protocol = request.headers.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https');
      const host = request.headers.get('host') ?? 'localhost:9002';
      baseUrl = `${protocol}://${host}`;
    }

    // 6. Send email to Admin
    try {
      await sendResumeRequestEmailToAdmin(
        resumeRequest._id.toString(),
        name,
        email,
        authorizationToken,
        baseUrl
      );
    } catch (emailError: any) {
      console.error('[Resume Request Email Error]:', emailError);
    }

    return successResponse(null, 'Request submitted successfully');
  } catch (error: any) {
    if (error.code === 11000) {
      return errorResponse('You have already submitted a request recently.', 429);
    }
    return serverError(error);
  }
}

import dbConnect from '@/lib/db/mongodb';
import ResumeRequest from '@/models/ResumeRequest';
import ResumeFile from '@/models/ResumeFile';
import { sendApprovalEmailToVisitor, sendRejectionEmailToVisitor } from '@/lib/mail';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const action = searchParams.get('action'); // 'approve' or 'reject'

    if (!token || !action) {
      return NextResponse.json({ error: 'Invalid link. Missing token or action.' }, { status: 400 });
    }

    if (action !== 'approve' && action !== 'reject') {
        return NextResponse.json({ error: 'Invalid action provided.' }, { status: 400 });
    }

    // Find the request by secure token
    const resumeRequest = await ResumeRequest.findOne({ token });

    if (!resumeRequest) {
      return NextResponse.json({ error: 'Request not found or token invalid.' }, { status: 404 });
    }

    // Check if it's expired
    if (new Date() > new Date(resumeRequest.expiresAt)) {
        return NextResponse.json({ error: 'This request has expired.' }, { status: 410 });
    }

    // Check if it's already been processed
    if (resumeRequest.status !== 'pending') {
         return NextResponse.json({ message: `This request has already been ${resumeRequest.status}.` }, { status: 200 });
    }

    // Process the Action
    resumeRequest.status = action === 'approve' ? 'approved' : 'rejected';
    await resumeRequest.save();

    const protocol = request.headers.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https');
    const host = request.headers.get('host') ?? 'localhost:9002';
    const baseUrl = `${protocol}://${host}`;

    // Send corresponding email to the visitor
    try {
        if (action === 'approve') {
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
        // Continue anyway, DB was updated successfully
    }

    // Render a nice success page to the Admin
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
            <title>Request ${action === 'approve' ? 'Approved' : 'Rejected'}</title>
            <style>
                body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #0a0a12; color: white; margin: 0; }
                .card { background-color: #110e1b; padding: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: center; max-width: 400px; }
                .success { color: #10B981; font-size: 48px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="${action === 'approve' ? 'success' : 'success'}">${action === 'approve' ? '✅' : '🚫'}</div>
                <h2>Successfully ${action === 'approve' ? 'Approved' : 'Rejected'}!</h2>
                <p>An email has been dispatched to <strong>${resumeRequest.email}</strong> to notify them.</p>
                <p style="color: gray; font-size: 14px; margin-top: 20px;">You can now close this tab.</p>
            </div>
        </body>
      </html>
    `;

    return new NextResponse(htmlResponse, {
        headers: { 'Content-Type': 'text/html' }
    });

  } catch (error: any) {
    console.error('Approval processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

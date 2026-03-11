import nodemailer from 'nodemailer';

// Create a singleton transporter instance
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

export const sendResumeRequestEmailToAdmin = async (
  requestId: string,
  visitorName: string,
  visitorEmail: string,
  approvalToken: string,
  baseUrl?: string
) => {
  const adminEmail = process.env.EMAIL_USER;
  let appUrl = baseUrl || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:9002';
  // Strip trailing slash if present
  appUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
  
  const approveLink = `${appUrl}/api/resume/approve?token=${approvalToken}&action=approve`;
  const rejectLink = `${appUrl}/api/resume/approve?token=${approvalToken}&action=reject`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0F0F13; color: #ffffff; border-radius: 12px; border: 1px solid #2A2A35;">
      <h2 style="color: #A855F7; margin-bottom: 20px; font-size: 24px; margin-top: 0;">New Resume Request</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #D1D5DB;">
        <strong>${visitorName}</strong> (<a href="mailto:${visitorEmail}" style="color: #60A5FA; text-decoration: none;">${visitorEmail}</a>) has requested access to view or download your resume.
      </p>
      
      <div style="margin: 30px 0; padding: 20px; background-color: #1A1A24; border-radius: 8px; border: 1px solid #333342;">
        <p style="margin-top: 0; font-size: 16px; color: #E5E7EB; margin-bottom: 20px;">Do you approve this request?</p>
        <div>
          <a href="${approveLink}" style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; text-align: center;">Approve Access</a>
          <a href="${rejectLink}" style="display: inline-block; padding: 12px 24px; background-color: #EF4444; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; text-align: center; margin-left: 10px;">Reject</a>
        </div>
      </div>
      
      <p style="font-size: 13px; color: #6B7280; border-top: 1px solid #2A2A35; padding-top: 20px; margin-bottom: 0;">
        This request will expire in 7 days. You can also manage requests from your Admin Dashboard.
      </p>
    </div>
  `;

  return transporter.sendMail({
    from: `"Portfolio Alerts" <${adminEmail}>`,
    to: adminEmail,
    subject: `Resume Request from ${visitorName}`,
    html: htmlContent,
  });
};

export const sendApprovalEmailToVisitor = async (
  visitorName: string,
  visitorEmail: string,
  downloadToken: string,
  baseUrl?: string
) => {
  const adminEmail = process.env.EMAIL_USER;
  let appUrl = baseUrl || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:9002';
  // Strip trailing slash if present
  appUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
  
  const downloadLink = `${appUrl}/api/resume/download?token=${downloadToken}`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; color: #1f2937; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; background-color: #10B981; color: white; border-radius: 50%; width: 48px; height: 48px; line-height: 48px; font-size: 24px; margin-bottom: 15px;">✓</div>
        <h2 style="color: #111827; margin: 0; font-size: 24px;">Request Approved!</h2>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Hi ${visitorName},</p>
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Thank you for your interest! Aniruddha has approved your request to view his resume.</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${downloadLink}" style="display: inline-block; padding: 14px 28px; background-color: #8B5CF6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.25);">Download Resume</a>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
        <p style="margin: 0 0 5px 0;">Best regards,</p>
        <p style="margin: 0; font-weight: 600; color: #374151;">Aniruddha Patil</p>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: `"Aniruddha Patil" <${adminEmail}>`,
    to: visitorEmail,
    subject: `Resume Request Approved`,
    html: htmlContent,
  });
};

export const sendRejectionEmailToVisitor = async (
  visitorName: string,
  visitorEmail: string
) => {
  const adminEmail = process.env.EMAIL_USER;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; color: #1f2937; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <h2 style="color: #111827; margin-top: 0; margin-bottom: 20px; font-size: 24px;">Resume Request Update</h2>
      
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Hi ${visitorName},</p>
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Thank you for your interest in my profile. Unfortunately, I am not sharing my resume publicly at this moment.</p>
      
      <div style="margin: 25px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #8B5CF6;">
        <p style="margin: 0; font-size: 15px; color: #4b5563; line-height: 1.5;">
          However, you can still view my full professional journey, skills, and detailed projects directly on my portfolio website!
        </p>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
        <p style="margin: 0 0 5px 0;">Best regards,</p>
        <p style="margin: 0; font-weight: 600; color: #374151;">Aniruddha Patil</p>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: `"Aniruddha Patil" <${adminEmail}>`,
    to: visitorEmail,
    subject: `Resume Request Update`,
    html: htmlContent,
  });
};

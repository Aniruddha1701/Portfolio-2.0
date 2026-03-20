import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getBaseUrl = (baseUrl?: string) => {
  let appUrl = baseUrl || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:9002';
  return appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
};

export const sendResumeRequestEmailToAdmin = async (
  requestId: string,
  visitorName: string,
  visitorEmail: string,
  approvalToken: string,
  baseUrl?: string
) => {
  const adminEmail = process.env.EMAIL_USER;
  const appUrl = getBaseUrl(baseUrl);
  
  const approveLink = `${appUrl}/api/resume/approve?token=${approvalToken}&action=approve`;
  const rejectLink = `${appUrl}/api/resume/approve?token=${approvalToken}&action=reject`;
  const dashboardLink = `${appUrl}/admin/dashboard`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #12121a; border-radius: 16px; border: 1px solid #2a2a3a; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%); padding: 32px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">New Resume Request</h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Someone wants to access your resume</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 24px; background-color: #1a1a24; border-radius: 12px; border: 1px solid #2a2a3a;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Requester Name</p>
                          <p style="margin: 4px 0 0; color: #ffffff; font-size: 18px; font-weight: 600;">${visitorName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 16px; border-top: 1px solid #2a2a3a;">
                          <p style="margin: 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Email Address</p>
                          <p style="margin: 4px 0 0;">
                            <a href="mailto:${visitorEmail}" style="color: #a855f7; font-size: 16px; text-decoration: none;">${visitorEmail}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Action Buttons -->
                <tr>
                  <td style="padding-top: 28px;">
                    <p style="margin: 0 0 16px; color: #d1d5db; font-size: 14px; text-align: center;">Take action on this request:</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="border-radius: 10px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                                <a href="${approveLink}" style="display: inline-block; padding: 14px 28px; color: white; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 10px;">✓ Approve Request</a>
                              </td>
                              <td style="width: 12px;"></td>
                              <td style="border-radius: 10px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                                <a href="${rejectLink}" style="display: inline-block; padding: 14px 28px; color: white; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 10px;">✕ Reject</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Dashboard Link -->
                <tr>
                  <td style="padding-top: 24px; text-align: center;">
                    <a href="${dashboardLink}" style="color: #6b7280; font-size: 13px; text-decoration: underline;">View all requests in Dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; border-top: 1px solid #2a2a3a; background-color: #0d0d12;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                Request ID: ${requestId} • Expires in 7 days
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Bottom Text -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; padding-top: 24px;">
          <tr>
            <td style="text-align: center; color: #4b5563; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from your Portfolio Website</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return transporter.sendMail({
    from: `"Portfolio Alerts" <${adminEmail}>`,
    to: adminEmail,
    subject: `🔔 New Resume Request from ${visitorName}`,
    html: htmlContent,
  });
};

export const sendApprovalEmailToVisitor = async (
  visitorName: string,
  visitorEmail: string,
  downloadToken: string,
  baseUrl?: string,
  resumeBuffer?: Buffer,
  resumeFilename?: string
) => {
  const adminEmail = process.env.EMAIL_USER;
  const appUrl = getBaseUrl(baseUrl);
  
  const downloadLink = `${appUrl}/api/resume/download?token=${downloadToken}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Success Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 32px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 72px; height: 72px; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Request Approved!</h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px;">Your resume access has been granted</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 16px; color: #1e293b; font-size: 16px; line-height: 1.6;">Hi <strong>${visitorName}</strong>,</p>
              
              <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
                Great news! Your request to view the resume has been <strong style="color: #10b981;">approved</strong>. 
                You can now access it using the secure download link below.
              </p>
              
              ${resumeBuffer ? `
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 600;">
                  📎 The resume is also attached to this email
                </p>
              </div>
              ` : ''}
              
              <!-- Download Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${downloadLink}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(124, 58, 237, 0.39);">
                      📥 Download Resume
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px; text-align: center;">
                This link will expire in 7 days
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 4px; color: #64748b; font-size: 13px;">Best regards,</p>
                    <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 600;">Aniruddha Patil</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Portfolio Link -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; padding-top: 24px;">
          <tr>
            <td style="text-align: center;">
              <a href="${appUrl}" style="color: #7c3aed; font-size: 14px; text-decoration: none;">Visit Portfolio Website</a>
              <span style="color: #cbd5e1; margin: 0 8px;">•</span>
              <span style="color: #94a3b8; font-size: 12px;">Powered by Portfolio 2.0</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const mailOptions: any = {
    from: `"Aniruddha Patil" <${adminEmail}>`,
    to: visitorEmail,
    subject: `🎉 Your Resume Request Has Been Approved!`,
    html: htmlContent,
  };

  if (resumeBuffer && resumeFilename) {
    mailOptions.attachments = [
      {
        filename: resumeFilename,
        content: resumeBuffer
      }
    ];
  }

  return transporter.sendMail(mailOptions);
};

export const sendRejectionEmailToVisitor = async (
  visitorName: string,
  visitorEmail: string
) => {
  const adminEmail = process.env.EMAIL_USER;
  const appUrl = getBaseUrl();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 40px 32px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 72px; height: 72px; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">Request Update</h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px;">Regarding your resume access request</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 16px; color: #1e293b; font-size: 16px; line-height: 1.6;">Hi <strong>${visitorName}</strong>,</p>
              
              <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.6;">
                Thank you for your interest in my professional profile. Unfortunately, I'm not sharing my resume publicly at this time.
              </p>
              
              <!-- Alternative Access Card -->
              <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1px solid #c4b5fd; border-radius: 16px; padding: 24px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <p style="margin: 0; color: #7c3aed; font-size: 14px; font-weight: 600;">💼 Here's what you can explore instead:</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
                        <li>Full project portfolio with live demos</li>
                        <li>Detailed skills and certifications</li>
                        <li>Professional work experience</li>
                        <li>Contact information for opportunities</li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Visit Portfolio Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${appUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px;">
                      View Full Portfolio
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 4px; color: #64748b; font-size: 13px;">Best regards,</p>
                    <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 600;">Aniruddha Patil</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Portfolio Link -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; padding-top: 24px;">
          <tr>
            <td style="text-align: center;">
              <a href="${appUrl}" style="color: #7c3aed; font-size: 14px; text-decoration: none;">Visit Portfolio Website</a>
              <span style="color: #cbd5e1; margin: 0 8px;">•</span>
              <span style="color: #94a3b8; font-size: 12px;">Powered by Portfolio 2.0</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return transporter.sendMail({
    from: `"Aniruddha Patil" <${adminEmail}>`,
    to: visitorEmail,
    subject: `Update on Your Resume Request`,
    html: htmlContent,
  });
};

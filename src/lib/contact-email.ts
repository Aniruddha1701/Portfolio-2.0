import nodemailer from 'nodemailer';

// Create transporter
export const createContactTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'lab205ab1@gmail.com',
      pass: process.env.EMAIL_PASS || 'miqn dntu rwgu mtkr',
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send contact email
export const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) => {
  const transporter = createContactTransporter();
  
  // Verify connection (optional)
  try {
    await transporter.verify();
    console.log('Email server is ready');
  } catch (error) {
    console.warn('Email verification warning:', error);
  }
  
  // Admin email template
  const adminEmailHtml = getAdminEmailTemplate(data);
  
  // Send to admin
  const adminEmail = process.env.ADMIN_EMAIL || 'aniruddhap66@gmail.com';
  const adminMailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER || 'lab205ab1@gmail.com'}>`,
    to: adminEmail,
    subject: `🔔 New Contact: ${data.subject || 'No subject'}`,
    html: adminEmailHtml,
    replyTo: data.email
  };
  
  const adminInfo = await transporter.sendMail(adminMailOptions);
  console.log('Admin email sent:', adminInfo.messageId);
  
  // Send confirmation to sender (optional, don't fail if it doesn't work)
  try {
    const senderEmailHtml = getSenderEmailTemplate(data.name);
    const senderMailOptions = {
      from: `"Portfolio Admin" <${process.env.EMAIL_USER || 'lab205ab1@gmail.com'}>`,
      to: data.email,
      subject: '✅ Message Received - Thank You!',
      html: senderEmailHtml,
    };
    
    await transporter.sendMail(senderMailOptions);
    console.log('Confirmation email sent to sender');
  } catch (error) {
    console.error('Failed to send confirmation:', error);
  }
  
  return { success: true, messageId: adminInfo.messageId };
};

// Admin email template
const getAdminEmailTemplate = (data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 0 0 10px 10px;
          }
          .field {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
          }
          .label {
            font-weight: bold;
            color: #667eea;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .value {
            color: #333;
            font-size: 15px;
          }
          .message-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
          }
          .reply-btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>📬 New Contact Form Message</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">From</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          ${data.subject ? `
          <div class="field">
            <div class="label">Subject</div>
            <div class="value">${data.subject}</div>
          </div>
          ` : ''}
          <div class="label">Message</div>
          <div class="message-box">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          <center>
            <a href="mailto:${data.email}?subject=Re: ${data.subject || 'Your message'}" class="reply-btn">
              Reply to ${data.name}
            </a>
          </center>
        </div>
      </body>
    </html>
  `;
};

// Sender confirmation template
const getSenderEmailTemplate = (name: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #48bb78;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 0 0 10px 10px;
          }
          .message {
            background: #f0fff4;
            border-left: 4px solid #48bb78;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>✅ Message Received!</h2>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <div class="message">
            <strong>Thank you for reaching out!</strong><br>
            Your message has been successfully delivered. I'll review it and get back to you as soon as possible.
          </div>
          <p>Typical response time is within 24-48 hours.</p>
          <p>Best regards,<br>Portfolio Admin</p>
        </div>
      </body>
    </html>
  `;
};

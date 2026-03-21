import nodemailer from 'nodemailer';

// Create email transporter with proper Gmail configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // false for TLS - as specified
  auth: {
    user: process.env.EMAIL_USER || 'lab205ab1@gmail.com',
    pass: process.env.EMAIL_PASS || 'miqn dntu rwgu mtkr',
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
});

// Email template for OTP
const getOTPEmailTemplate = (otp: string, name: string = 'Admin') => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            padding: 2px;
          }
          .content {
            background: white;
            border-radius: 8px;
            padding: 40px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .otp-container {
            background: #f7f9fc;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            margin: 10px 0;
          }
          .message {
            color: #666;
            margin: 20px 0;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
            color: #856404;
          }
          .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <div class="header">
              <div class="logo">Portfolio Admin</div>
            </div>
            
            <h2>Hello ${name},</h2>
            
            <p class="message">
              You've requested to log in to your Portfolio Admin Panel. 
              Please use the following One-Time Password (OTP) to complete your login:
            </p>
            
            <div class="otp-container">
              <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">Valid for 10 minutes</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              Never share this OTP with anyone. Our team will never ask for your OTP.
              If you didn't request this code, please ignore this email.
            </div>
            
            <p class="message">
              For security reasons, this OTP will expire in 10 minutes. 
              If you need a new code, please request it from the login page.
            </p>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>© ${new Date().getFullYear()} Portfolio Admin. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Generate random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string, name?: string): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"Portfolio Admin" <${process.env.EMAIL_FROM || 'lab205ab1@gmail.com'}>`,
      to: email,
      subject: '🔐 Your Admin Login OTP',
      html: getOTPEmailTemplate(otp, name),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

/**
 * Generic function to send an email using the shared transporter
 */
export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: any[];
}): Promise<boolean> => {
  try {
    const mailOptions = {
      from: options.from || `"Portfolio" <${process.env.EMAIL_FROM || 'lab205ab1@gmail.com'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

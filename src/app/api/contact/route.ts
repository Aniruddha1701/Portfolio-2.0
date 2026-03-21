import { NextRequest } from "next/server";
import { z } from "zod";
import { successResponse, errorResponse, serverError } from "@/lib/api-response";
import { sendEmail } from "@/lib/email";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(result.error.errors[0].message, 400);
    }
    
    const { name, email, subject, message } = result.data;

    // 2. Prepare email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="padding: 20px; border-left: 4px solid #7c3aed;">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 12px;">
          This message was sent from your portfolio website contact form.
        </p>
      </div>
    `;

    // 3. Send email using centralized utility
    const recipient = process.env.EMAIL_TO || process.env.EMAIL_USER || 'lab205ab1@gmail.com';
    const emailSent = await sendEmail({
      to: recipient,
      subject: `[Portfolio Contact] ${subject}`,
      html: htmlContent,
      from: `"Portfolio Contact" <${process.env.EMAIL_FROM || 'lab205ab1@gmail.com'}>`
    });

    if (!emailSent) {
      return errorResponse("Failed to send email. Please try again later.", 500);
    }

    return successResponse(null, "Your message has been sent successfully!");
  } catch (error: any) {
    return serverError(error);
  }
}

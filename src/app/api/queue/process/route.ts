import { NextRequest } from "next/server";
import { successResponse, serverError } from "@/lib/api-response";
import dbConnect from "@/lib/db/mongoose";
import EmailJob from "@/models/EmailJob";
import { sendEmail } from "@/lib/email";

// This route can be called periodically by a Cron job, or triggered manually.
// It processes up to 10 pending emails at a time.
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Find up to 10 pending jobs or failed jobs that haven't reached max attempts
    const jobs = await EmailJob.find({
      $or: [
        { status: 'pending' },
        { 
          status: 'failed', 
          $expr: { $lt: ["$attempts", "$maxAttempts"] } 
        }
      ]
    }).limit(10).sort({ createdAt: 1 });

    if (jobs.length === 0) {
      return successResponse({ processed: 0 }, "No pending emails to process");
    }

    // Mark as processing
    const jobIds = jobs.map(job => job._id);
    await EmailJob.updateMany(
      { _id: { $in: jobIds } },
      { $set: { status: 'processing' } }
    );

    let successCount = 0;
    let failCount = 0;

    for (const job of jobs) {
      try {
        job.attempts += 1;
        job.lastAttemptAt = new Date();
        
        const success = await sendEmail({
          to: job.to,
          subject: job.subject,
          html: job.html,
          from: job.from,
        });

        if (success) {
          job.status = 'completed';
          successCount++;
        } else {
          job.status = 'failed';
          job.error = "sendEmail returned false";
          failCount++;
        }
      } catch (err: any) {
        job.status = 'failed';
        job.error = err.message || "Unknown error";
        failCount++;
      }
      await job.save();
    }

    return successResponse({ processed: jobs.length, successCount, failCount }, "Email queue processed");
  } catch (error: any) {
    return serverError(error);
  }
}

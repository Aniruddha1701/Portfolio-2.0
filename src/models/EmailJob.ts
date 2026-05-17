import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailJob extends Document {
  to: string;
  subject: string;
  html: string;
  from?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailJobSchema = new Schema<IEmailJob>(
  {
    to: { type: String, required: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    from: { type: String },
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'completed', 'failed'], 
      default: 'pending',
      index: true 
    },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    lastAttemptAt: { type: Date },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.EmailJob || mongoose.model<IEmailJob>('EmailJob', EmailJobSchema);

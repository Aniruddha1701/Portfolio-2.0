import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

const OTPSchema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    index: { expireAfterSeconds: 0 } // Auto-delete expired documents
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5, // Maximum 5 attempts
  },
  verified: {
    type: Boolean,
    default: false,
  }
});

// Index for faster lookups
OTPSchema.index({ email: 1, otp: 1 });

// Auto-delete old OTPs after 1 hour
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

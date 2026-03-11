import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeFile extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  uploadedAt: Date;
}

const ResumeFileSchema = new Schema<IResumeFile>({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.ResumeFile || mongoose.model<IResumeFile>('ResumeFile', ResumeFileSchema);

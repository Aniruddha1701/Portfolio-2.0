import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastAccessed: Date;
  expiresAt: Date;
}

const SessionSchema = new Schema<ISession>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  deviceInfo: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

SessionSchema.index({ user: 1, isActive: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

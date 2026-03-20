import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  expiresAt: Date;
  isRevoked: boolean;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  family?: string;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  deviceInfo: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  family: {
    type: String
  }
}, {
  timestamps: true
});

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
RefreshTokenSchema.index({ user: 1, isRevoked: 1 });

export default mongoose.models.RefreshToken || mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

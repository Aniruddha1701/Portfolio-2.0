import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user?: mongoose.Types.ObjectId;
  action: 'login' | 'logout' | 'register' | 'password_change' | 'refresh_token' | 'failed_login' | 'account_locked';
  status: 'success' | 'failure';
  ipAddress: string;
  userAgent: string;
  deviceInfo?: string;
  email?: string;
  metadata?: Record<string, any>;
}

const AuditLogSchema = new Schema<IAuditLog>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  action: {
    type: String,
    enum: [
      'login', 'logout', 'register', 'password_change', 'refresh_token', 'failed_login', 'account_locked',
      'otp_request', 'portfolio_update', 'project_create', 'project_update', 'project_delete', 
      'resume_upload', 'resume_request_approve', 'resume_request_reject', 'settings_update'
    ],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['success', 'failure'],
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  deviceInfo: {
    type: String
  },
  email: {
    type: String
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

AuditLogSchema.index({ user: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

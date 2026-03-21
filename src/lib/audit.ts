import dbConnect from '@/lib/db/mongoose';
import AuditLog from '@/models/AuditLog';

export type AuditAction = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'OTP_REQUEST' 
  | 'PORTFOLIO_UPDATE' 
  | 'PROJECT_CREATE' 
  | 'PROJECT_UPDATE' 
  | 'PROJECT_DELETE' 
  | 'RESUME_UPLOAD' 
  | 'RESUME_REQUEST_APPROVE' 
  | 'RESUME_REQUEST_REJECT' 
  | 'SETTINGS_UPDATE';

export interface AuditData {
  action: AuditAction;
  userId?: string;
  email?: string;
  details?: string;
  ip?: string;
  userAgent?: string;
  resourceId?: string;
  status: 'success' | 'failure';
}

/**
 * Log an administrative action to the database
 */
export async function logAudit(data: AuditData) {
  try {
    await dbConnect();
    
    const log = await AuditLog.create({
      action: data.action.toLowerCase(),
      user: data.userId || null,
      email: data.email || 'system',
      details: data.details || '',
      ipAddress: data.ip || 'unknown',
      userAgent: data.userAgent || 'unknown',
      resourceId: data.resourceId || null,
      status: data.status,
      timestamp: new Date()
    });
    
    return log;
  } catch (error) {
    // We don't want to crash the request if auditing fails, 
    // but we should definitely log the error to console.
    console.error('[Audit Log Error]:', error);
    return null;
  }
}

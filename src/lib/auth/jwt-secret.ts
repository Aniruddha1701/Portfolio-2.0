// Centralized JWT secret configuration to ensure consistency
export function getJWTSecret(): string {
  // Use NEXTAUTH_SECRET as the primary secret
  // Fall back to JWT_SECRET if NEXTAUTH_SECRET is not set
  // This ensures backward compatibility
  const secret = process.env.NEXTAUTH_SECRET || 
                  process.env.JWT_SECRET || 
                  'your-secret-key-here-change-this-in-production';
  
  if (secret === 'your-secret-key-here-change-this-in-production' && process.env.NODE_ENV === 'production') {
    console.warn('WARNING: Using default JWT secret in production! Please set NEXTAUTH_SECRET environment variable.');
  }
  
  return secret;
}

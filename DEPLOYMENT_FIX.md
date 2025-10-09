# Production Deployment Fix for Portfolio Application

## Issue: Cannot add/edit projects in production (but works on localhost)

## Root Causes Identified:

1. **Authentication Issues**
   - JWT token verification failing in production
   - Cookie settings not configured for production domain
   - CORS issues with credentials

2. **Environment Variables Not Set**
   - Missing `MONGODB_URI` for production database
   - Missing `NEXTAUTH_SECRET` or `JWT_SECRET`
   - Missing `NEXTAUTH_URL` or `NEXT_PUBLIC_URL`

3. **Hardcoded localhost URLs**
   - Several files contain hardcoded `http://localhost:9002`

## Required Environment Variables for Production:

```env
# Required - MongoDB Atlas or production MongoDB
MONGODB_URI=[Your MongoDB connection string from MongoDB Atlas]

# Required - JWT secret for authentication (generate a secure random string)
NEXTAUTH_SECRET=[Generate using: openssl rand -base64 32]
# or
JWT_SECRET=[Generate using: openssl rand -base64 32]

# Required - Your production URL
NEXTAUTH_URL=[Your production URL, e.g., https://your-domain.com]
NEXT_PUBLIC_URL=[Your production URL, e.g., https://your-domain.com]

# Optional but recommended
NODE_ENV=production
```

## Files That Need Updates:

### 1. **src/lib/portfolio.ts**
```typescript
// Replace:
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:9002';

// With:
const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:9002');
```

### 2. **src/app/manifest.ts**
```typescript
// Replace:
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:9002';

// With:
const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:9002');
```

### 3. **src/app/layout.tsx**
```typescript
// Replace:
url: process.env.NEXT_PUBLIC_URL || 'http://localhost:9002',

// With:
url: process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:9002'),
```

### 4. **src/lib/db/contact-db.ts**
```typescript
// Replace:
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

// With:
const MONGODB_URI = process.env.MONGODB_URI;
// Remove the fallback to force proper configuration
```

## Cookie Configuration Fix

### Update **src/app/api/auth/verify-otp/route.ts** and similar auth routes:

```typescript
// Add secure cookie options for production
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  // Add domain if needed for subdomain access
  // domain: '.your-domain.com'
};

response.cookies.set('admin-token', token, cookieOptions);
```

## CORS Configuration (if API and frontend are on different domains)

### Add to API routes if needed:

```typescript
// Add CORS headers for production
const headers = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL || '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
};
```

## Deployment Checklist:

### On Vercel/Netlify/Your Hosting Platform:

1. ✅ Set `MONGODB_URI` environment variable
   - Get from MongoDB Atlas or your database provider
   
2. ✅ Set `NEXTAUTH_SECRET` or `JWT_SECRET`
   - Generate using: `openssl rand -base64 32`
   
3. ✅ Set `NEXTAUTH_URL` and `NEXT_PUBLIC_URL`
   - Set to your production URL (e.g., https://your-portfolio.vercel.app)
   
4. ✅ Set `NODE_ENV=production`

5. ✅ Verify MongoDB IP Whitelist
   - Add your hosting provider's IP or use 0.0.0.0/0 for all IPs (less secure)

### Database Setup:

1. ✅ Ensure MongoDB database exists
2. ✅ Run seed script if needed: `/api/seed-aniruddha`
3. ✅ Verify admin user exists in database

### Testing After Deployment:

1. Open browser DevTools
2. Try to login to admin dashboard
3. Check Network tab for API calls
4. Look for:
   - 401 errors (authentication issues)
   - 500 errors (database connection issues)
   - CORS errors (cross-origin issues)

### Debug Commands:

```javascript
// In browser console after login attempt:
document.cookie

// Check if admin-token exists

// In API route (temporarily add for debugging):
console.log('Environment variables:', {
  hasMongoUri: !!process.env.MONGODB_URI,
  hasJwtSecret: !!process.env.NEXTAUTH_SECRET || !!process.env.JWT_SECRET,
  hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
  nodeEnv: process.env.NODE_ENV
});
```

## Common Issues and Solutions:

### Issue: "Unauthorized - Please log in again"
**Solution:** JWT secret not matching or cookies not being set properly

### Issue: "Failed to save portfolio"  
**Solution:** Database connection issue or validation errors

### Issue: Works after login but not after refresh
**Solution:** Cookie persistence issue - check cookie settings

### Issue: CORS errors
**Solution:** Add proper CORS headers or ensure frontend and backend are on same domain

## Quick Fix Script:

Run this to update all hardcoded URLs:
```bash
# This will be implemented in the next step
```

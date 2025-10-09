# Production Troubleshooting Guide

## Quick Diagnosis Steps

### 1. Check Browser Console (F12)
Look for these common errors:

#### Error: "Failed to save portfolio" or "Unauthorized"
```javascript
// Run in browser console after login:
document.cookie
// Should show: admin-token=...; auth-token=...; admin-session=...

// If cookies are missing, authentication failed
```

#### Error: "500 Internal Server Error"
- Database connection issue
- Check MongoDB Atlas IP whitelist
- Verify MONGODB_URI is set correctly

### 2. Check Network Tab
- Look for failed API calls to `/api/portfolio`
- Check request headers for cookies
- Check response for specific error messages

## Common Issues and Solutions

### Issue 1: Can login but can't save changes
**Symptoms:**
- Login works
- Dashboard loads
- Saving fails with "Unauthorized"

**Solution:**
```javascript
// Check if cookies are being set with correct domain
// In your deployment platform, ensure:
NEXTAUTH_URL=https://your-actual-domain.com  // No trailing slash!
NEXT_PUBLIC_URL=https://your-actual-domain.com
```

### Issue 2: "Cannot connect to database"
**Symptoms:**
- 500 errors
- "Internal server error" messages

**Solution:**
1. Go to MongoDB Atlas > Network Access
2. Add IP: `0.0.0.0/0` (allows all IPs)
3. Or add your hosting platform's specific IPs

### Issue 3: Changes save but don't persist after refresh
**Symptoms:**
- Save shows success
- Data reverts on page refresh

**Solution:**
- Database write permissions issue
- Check MongoDB user has `readWrite` role
- Verify database name in connection string

### Issue 4: CORS errors
**Symptoms:**
- "CORS policy" errors in console
- "No Access-Control-Allow-Origin header"

**Solution:**
```javascript
// This is usually when frontend and backend are on different domains
// Ensure both are on the same domain, or add CORS headers
```

### Issue 5: Works locally but not in production
**Most Common Cause:** Environment variables not set

**Quick Check:**
1. Login to your hosting dashboard
2. Go to environment variables section
3. Ensure ALL these are set:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET` or `JWT_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_URL`
   - `NODE_ENV=production`

## Debug Mode

### Temporary API Route Debug
Add this temporarily to `/api/portfolio/route.ts`:

```typescript
export async function GET(request: NextRequest) {
  // Debug info (remove in production)
  console.log('Debug Info:', {
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    cookies: request.cookies.getAll().map(c => c.name)
  });
  
  // ... rest of your code
}
```

### Check Deployment Logs
Most platforms provide logs:
- **Vercel**: Functions tab > View logs
- **Netlify**: Functions > View logs  
- **Railway**: Deployments > View logs
- **Render**: Logs tab

Look for:
- "MongoDB connection failed"
- "JWT secret not found"
- "Authentication failed"

## Emergency Fixes

### Can't access admin at all:
1. Create a temporary direct login route
2. Or use the simple login at `/admin/simple-login`
3. Or reset via database directly

### Lost all data:
1. Check if data exists in MongoDB Atlas
2. Run seed endpoint: `/api/seed-aniruddha`
3. Restore from MongoDB Atlas backup

### Site completely broken:
1. Revert to previous deployment
2. Check recent environment variable changes
3. Verify MongoDB Atlas is running

## Contact Support Checklist

If you need help, provide:
1. **Error messages** from browser console
2. **Network tab** screenshot of failed request
3. **Deployment platform** (Vercel, Netlify, etc.)
4. **MongoDB Atlas status** (connected/error)
5. **Recent changes** made before issue started

## Testing Checklist After Fix

1. ✅ Can login to admin dashboard
2. ✅ Can add new project
3. ✅ Can edit existing project
4. ✅ Changes persist after refresh
5. ✅ Can logout and login again
6. ✅ Public portfolio page loads
7. ✅ Resume upload works
8. ✅ All sections save properly

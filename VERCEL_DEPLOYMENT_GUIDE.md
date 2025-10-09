# Vercel Deployment Guide - Fix "Cannot Add Projects" Issue

## 🚨 Quick Fix Steps for https://portfolio-pied-eta-57.vercel.app

### Step 1: Deploy the Latest Code
1. Push the latest changes to your repository:
   ```bash
   git push origin main
   ```
2. Vercel will automatically redeploy

### Step 2: Set Environment Variables in Vercel Dashboard

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```env
# REQUIRED - MongoDB Atlas connection string
MONGODB_URI=[Your MongoDB Atlas connection string - get from MongoDB Atlas dashboard]

# REQUIRED - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=[Generate a secure random string using the command above]

# REQUIRED - Your Vercel deployment URL (NO trailing slash!)
NEXTAUTH_URL=https://portfolio-pied-eta-57.vercel.app
NEXT_PUBLIC_URL=https://portfolio-pied-eta-57.vercel.app

# REQUIRED
NODE_ENV=production
```

### Step 3: MongoDB Atlas Configuration

1. **Go to MongoDB Atlas** → Network Access
2. **Add IP Address**: `0.0.0.0/0` (Allow access from anywhere)
   - Or add Vercel's IP ranges if you want more security
3. **Verify Database User** has `readWrite` permissions

### Step 4: Clear Browser Data

1. Open Chrome DevTools (F12)
2. Go to **Application** tab → **Storage**
3. Click **Clear site data**
4. Or open in Incognito mode

### Step 5: Test the Debug Endpoint

After deployment, visit: `https://portfolio-pied-eta-57.vercel.app/api/debug`

This will show you:
- Environment variables status
- Database connection status
- Authentication status
- Cookie configuration

## 📋 Verification Checklist

After completing the above steps, test:

1. **Visit**: https://portfolio-pied-eta-57.vercel.app/admin/login
2. **Login** with your admin credentials
3. **Try to add a project** in the dashboard
4. **Check browser console** for any errors

## 🔍 Debugging Guide

### If you see "Unauthorized" error:
- JWT secret not set correctly in Vercel
- Cookies not being saved (check Application → Cookies in DevTools)
- Try the debug endpoint to see auth status

### If you see "Database connection failed":
- MongoDB URI is incorrect or not set
- MongoDB Atlas IP whitelist issue
- Database doesn't exist

### If login works but adding projects fails:
- Check the Network tab in DevTools
- Look for the PUT request to `/api/portfolio`
- Check the response for specific error messages

## 🛠️ Advanced Troubleshooting

### 1. Check Vercel Function Logs
- Go to Vercel Dashboard → Functions tab
- Look for errors in `/api/portfolio` function
- Common issues:
  - MongoDB connection timeout
  - Missing environment variables
  - JWT verification failures

### 2. Use the Debug Endpoint
Visit: `https://portfolio-pied-eta-57.vercel.app/api/debug`

Expected response:
```json
{
  "environment": {
    "NODE_ENV": "production",
    "hasMongoUri": true,
    "hasJwtSecret": true,
    "hasNextAuthUrl": true
  },
  "auth": {
    "authenticated": true,
    "user": { "email": "your-email@example.com" }
  },
  "database": {
    "connected": true,
    "status": "Connected successfully"
  }
}
```

### 3. Test with Simple Login
If regular login fails, try: `/admin/simple-login`
- Email: Your admin email
- Password: Your admin password

### 4. Manual Database Test
Create a temporary test endpoint to verify database write:
```javascript
// /api/test-db/route.ts
export async function GET() {
  try {
    await dbConnect();
    // Try to read portfolio
    const portfolio = await Portfolio.findOne({});
    return NextResponse.json({ 
      success: true, 
      hasPortfolio: !!portfolio,
      id: portfolio?._id 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}
```

## 🎯 What Was Fixed

### Backend Improvements:
1. **Enhanced Logging** - Added detailed logs in portfolio API
2. **Better Error Handling** - More descriptive error messages
3. **Database Connection** - Added retry logic and health checks
4. **Cookie Configuration** - Fixed for cross-site HTTPS (Vercel)
5. **Debug Endpoint** - Created `/api/debug` for diagnostics
6. **Dynamic URLs** - Removed hardcoded localhost references

### Cookie Settings for Production:
- `secure: true` - HTTPS only
- `sameSite: 'none'` - Allows cross-site cookies
- `httpOnly: true` - Prevents JavaScript access
- Proper domain configuration for Vercel

## 📞 Still Having Issues?

1. **Check Latest Logs**:
   ```bash
   vercel logs --follow
   ```

2. **Verify Environment Variables**:
   ```bash
   vercel env pull
   ```

3. **Force Redeploy**:
   - Go to Vercel Dashboard
   - Click on your latest deployment
   - Click "Redeploy"

4. **Test Locally with Production Env**:
   ```bash
   # Create .env.production.local
   # Add production environment variables
   npm run build
   npm run start
   ```

## ✅ Success Indicators

When everything is working:
1. ✅ Can login to admin dashboard
2. ✅ Can add new projects
3. ✅ Changes persist after refresh
4. ✅ No errors in browser console
5. ✅ Debug endpoint shows all green
6. ✅ Projects appear on public portfolio

## 🔄 After Fix Deployment Workflow

1. Make changes locally
2. Test locally: `npm run dev`
3. Commit and push: `git push`
4. Vercel auto-deploys
5. Test on production URL
6. Clear browser cache if needed

---

**Remember**: After setting environment variables in Vercel, you need to **redeploy** for changes to take effect!

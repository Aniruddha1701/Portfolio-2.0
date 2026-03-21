# Set all Vercel environment variables for Production
# Run this from the project root after vercel login

$project = "portfolio-2-0"

$envVars = @{
    "NEXTAUTH_SECRET"     = "a3f8e2c1d7b94f6a0e5c82d1b3f7a9e4c2d6b8f0a1e5c9d3b7f2a4e6c8d0b2f4"
    "JWT_SECRET"          = "b4e9f3d2c8a5b1e7d4c0f6a2b8e3c9d5a1f7b3e9c5d1a7f3b9e5c1d7a3f9b5e1"
    "JWT_REFRESH_SECRET"  = "c5f0a4e3d9b6c2f8e5d1a7c3f9b5e1d7c4a0f6b2e8d4c0a6f2b8e4d0c6a2f8b4"
    "NEXTAUTH_URL"        = "https://portfolio-dfca5oegf-aniruddha1701s-projects.vercel.app"
    "NEXT_PUBLIC_URL"     = "https://portfolio-dfca5oegf-aniruddha1701s-projects.vercel.app"
    "NEXT_PUBLIC_API_URL" = "https://portfolio-dfca5oegf-aniruddha1701s-projects.vercel.app"
    "MONGODB_URI"         = "mongodb+srv://ani:ani123@cluster0.lueplfp.mongodb.net/portfolio?retryWrites=true&w=majority"
    "EMAIL_HOST"          = "smtp.gmail.com"
    "EMAIL_PORT"          = "587"
    "EMAIL_USER"          = "lab205ab1@gmail.com"
    "EMAIL_PASS"          = "miqn dntu rwgu mtkr"
    "EMAIL_FROM"          = "lab205ab1@gmail.com"
    "EMAIL_SECURE"        = "false"
    "GOOGLE_API_KEY"      = "your_google_api_key_here"
}

foreach ($key in $envVars.Keys) {
    $val = $envVars[$key]
    Write-Host "Setting $key ..."
    $val | vercel env add $key production --force 2>&1
}

Write-Host "`n✅ Done! All environment variables have been set."
Write-Host "Now run: vercel --prod"

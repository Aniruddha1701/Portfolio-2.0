const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/api/admin/resume-requests/route.ts',
  'src/app/api/resume/upload/route.ts',
  'src/app/api/resume/request/route.ts',
  'src/app/api/resume/download/route.ts',
  'src/app/api/resume/approve/route.ts',
  'src/app/api/auth/send-otp-gmail/route.ts',
  'src/app/api/auth/verify-otp/route.ts',
  'src/app/api/auth/verify-otp-simple/route.ts',
  'src/app/api/auth/send-otp/route.ts',
  'src/app/api/auth/send-otp-fixed/route.ts'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/import\s+connectDB\s+from\s+['"]@\/lib\/db\/mongodb['"];?/g, "import dbConnect from '@/lib/db/mongoose';");
    content = content.replace(/await\s+connectDB\(\);?/g, "await dbConnect();");
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

// Also remove mongodb.ts
const mongoDbPath = path.join(__dirname, '../src/lib/db/mongodb.ts');
if (fs.existsSync(mongoDbPath)) {
  fs.unlinkSync(mongoDbPath);
  console.log('Deleted src/lib/db/mongodb.ts');
}

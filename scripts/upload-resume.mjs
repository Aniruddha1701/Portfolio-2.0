import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Setup basic __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env explicitly
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const ResumeFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const ResumeFile = mongoose.models.ResumeFile || mongoose.model('ResumeFile', ResumeFileSchema);

async function uploadResume() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const pdfPath = path.join(__dirname, '..', 'Resume_Aniruddha.pdf');
    console.log(`Reading PDF from: ${pdfPath}`);
    
    const fileBuffer = await fs.readFile(pdfPath);
    console.log(`Successfully read PDF. Size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);

    console.log('Upserting into database...');
    // Upsert the resume so we only ever have one "Resume_Aniruddha.pdf" document
    const result = await ResumeFile.findOneAndUpdate(
      { filename: 'Resume_Aniruddha.pdf' },
      { 
        filename: 'Resume_Aniruddha.pdf',
        contentType: 'application/pdf',
        data: fileBuffer,
        uploadedAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log(`Success! Resume stored in DB with Document ID: ${result._id}`);
  } catch (error) {
    console.error('Error during upload:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

uploadResume();

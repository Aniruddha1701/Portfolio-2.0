import mongoose from 'mongoose';

const resumeRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the visitor name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide the visitor email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  token: {
    type: String,
    required: true,
    unique: true,
    // Using a UUID or a long secure random string for the auth link
  },
  expiresAt: {
    type: Date,
    // By default, let's say the token is valid for 7 days after generation
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
}, {
  timestamps: true,
});

// Avoid standard error: Cannot overwrite `ResumeRequest` model once compiled.
const ResumeRequest = mongoose.models.ResumeRequest || mongoose.model('ResumeRequest', resumeRequestSchema);

export default ResumeRequest;

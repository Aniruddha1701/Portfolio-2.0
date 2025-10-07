// Script to ensure admin account exists and is set up properly
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Define the Admin schema inline
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

async function ensureAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create Admin model
    const Admin = mongoose.model('Admin', adminSchema);
    
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin account already exists');
      
      // Reset password to ensure we know it
      const hashedPassword = await bcrypt.hash('admin123', 10);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('Admin password has been reset');
    } else {
      // Create admin account
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new Admin({
        email: 'admin@example.com',
        password: hashedPassword
      });
      
      await newAdmin.save();
      console.log('Admin account created successfully');
    }
    
    console.log('\nAdmin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nLogin at: http://localhost:9002/admin/login');
    
  } catch (error) {
    console.error('Error ensuring admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

ensureAdmin();

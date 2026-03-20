// Script to create admin user directly in MongoDB
// Usage: node scripts/create-admin.js <email> <password> [name] [role]
// Example: node scripts/create-admin.js admin@example.com mypassword123 "Admin User" super-admin

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ani:ani123@cluster0.lueplfp.mongodb.net/portfolio?retryWrites=true&w=majority';

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node scripts/create-admin.js <email> <password> [name] [role]');
    console.log('');
    console.log('Arguments:');
    console.log('  email    - Admin email (required)');
    console.log('  password - Admin password (required, min 6 chars)');
    console.log('  name     - Admin name (optional, default: "Admin User")');
    console.log('  role     - Admin role (optional, default: "admin", options: "admin", "super-admin")');
    console.log('');
    console.log('Example: node scripts/create-admin.js admin@example.com mypassword123 "Admin User" super-admin');
    process.exit(1);
  }

  const [email, password, name = 'Admin User', role = 'admin'] = args;

  if (password.length < 6) {
    console.error('Error: Password must be at least 6 characters long');
    process.exit(1);
  }

  if (!['admin', 'super-admin'].includes(role)) {
    console.error('Error: Role must be either "admin" or "super-admin"');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin if exists
    await Admin.deleteOne({ email });
    console.log('Deleted existing admin if any');

    // Create admin (pre-save hook will hash the password)
    const admin = new Admin({
      email: email.toLowerCase().trim(),
      password, // Plain password - will be hashed by pre-save hook
      name: name.trim(),
      role
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('isActive:', admin.isActive);
    console.log('Password: [hidden]');
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Admin.deleteMany({});
    console.log('✅ Deleted all old admins');

    const hashedPassword = await bcrypt.hash('Tamdev54@#', 10);
    
    await Admin.create({
      email: 'aniruddhap66@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'super-admin',
      isActive: true
    });

    console.log('✅ New admin created:');
    console.log('Email: aniruddhap66@gmail.com');
    console.log('Password: Tamdev54@#');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetAdmin();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

// Minimal Admin Schema for seeding
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Check if model already exists before creating
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'lab205ab1@gmail.com';
    const password = 'password123'; // Default password

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin ${email} already exists. Updating password...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('Admin password updated to: password123');
    } else {
      console.log(`Creating admin ${email}...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      await Admin.create({
        email,
        password: hashedPassword,
        name: 'Portfolio Admin',
        isActive: true
      });
      console.log('Admin created successfully with password: password123');
    }

    // Now seed some basic Portfolio data so the warning goes away
    const PortfolioSchema = new mongoose.Schema({}, { strict: false });
    const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
    
    const existingPortfolio = await Portfolio.findOne();
    if (!existingPortfolio) {
      console.log('Creating initial blank Portfolio data...');
      await Portfolio.create({
        personalInfo: {
          name: "Aniruddha",
          title: "Full Stack Developer",
          bio: "Welcome to my portfolio!",
          location: "India",
          email: "lab205ab1@gmail.com"
        },
        skills: [],
        projects: [],
        education: [],
        experience: [],
        socialLinks: {
          github: "https://github.com/Aniruddha1701"
        },
        settings: {
          openToWork: true
        }
      });
      console.log('Blank Portfolio data created!');
    } else {
      console.log('Portfolio data already exists.');
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();

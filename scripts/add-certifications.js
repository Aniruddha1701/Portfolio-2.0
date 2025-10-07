// Script to add certification data to MongoDB
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ani:ani123@cluster0.lueplfp.mongodb.net/portfolio?retryWrites=true&w=majority';

// Portfolio Schema (simplified for this script)
const portfolioSchema = new mongoose.Schema({
  personalInfo: Object,
  socialLinks: Object,
  skills: Array,
  experience: Array,
  education: Array,
  projects: Array,
  testimonials: Array,
  services: Array,
  achievements: Array,
  settings: Object,
}, { timestamps: true });

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

// Sample certification data based on common certifications
const certificationsData = [
  {
    title: "Oracle Cloud Infrastructure 2024 Certified AI Foundations Associate",
    description: "Fundamental understanding of AI and ML concepts on Oracle Cloud",
    date: new Date("2024-08-01"),
    issuer: "Oracle",
    credentialId: "102312965OCI24AICFA",
    icon: "cloud"
  },
  {
    title: "Google Cloud Computing Foundations",
    description: "Comprehensive understanding of Google Cloud Platform services",
    date: new Date("2023-12-15"),
    issuer: "Google",
    icon: "cloud"
  },
  {
    title: "GenAI Powered Data Analytics",
    description: "Advanced data analytics using Generative AI technologies",
    date: new Date("2024-06-20"),
    issuer: "Tata Group",
    icon: "brain"
  },
  {
    title: "Certificate for Completion of Python Programming",
    description: "Advanced Python programming concepts and applications",
    date: new Date("2022-02-10"),
    issuer: "Indian Institute of Technology, Bombay",
    icon: "code"
  },
  {
    title: "Certificate for Completion of C++ Training",
    description: "Advanced C++ programming with STL and modern features",
    date: new Date("2022-02-15"),
    issuer: "Indian Institute of Technology, Bombay",
    icon: "code"
  },
  {
    title: "AWS Certified Cloud Practitioner",
    description: "Foundational understanding of AWS Cloud services and architecture",
    date: new Date("2024-01-10"),
    issuer: "Amazon Web Services",
    icon: "cloud"
  }
];

async function addCertifications() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the existing portfolio
    let portfolio = await Portfolio.findOne();
    
    if (!portfolio) {
      console.log('No portfolio found. Please run the seed endpoint first at http://localhost:9002/api/seed');
      process.exit(1);
    }

    console.log('Found existing portfolio. Adding certifications as achievements...');

    // Update achievements (certifications)
    portfolio.achievements = certificationsData;

    // Save the updated portfolio
    await portfolio.save();
    console.log('Successfully added certification data!');

    // Display the added certifications
    console.log('\nCertifications Added:');
    portfolio.achievements.forEach((cert, index) => {
      console.log(`${index + 1}. ${cert.title}`);
      console.log(`   Issuer: ${cert.issuer}`);
      console.log(`   Date: ${cert.date.toLocaleDateString()}`);
      if (cert.credentialId) {
        console.log(`   Credential ID: ${cert.credentialId}`);
      }
      console.log('');
    });

    console.log('The certifications have been added to your portfolio!');

  } catch (error) {
    console.error('Error updating portfolio:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the update
addCertifications();

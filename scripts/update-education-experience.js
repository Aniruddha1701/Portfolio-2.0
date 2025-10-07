// Script to update education and experience data in MongoDB
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

// Your education data
const educationData = [
  {
    institution: "Maharashtra State Board",
    degree: "Secondary",
    field: "",
    location: "Nashik",
    duration: "Completed 2019",
    startDate: "2017-06-01",
    endDate: "2019-03-31",
    current: false,
    gpa: "",
    achievements: [],
    iconType: "school"
  },
  {
    institution: "Maharashtra State Board",
    degree: "Senior Secondary",
    field: "",
    location: "Nashik",
    duration: "Completed 2021",
    startDate: "2019-06-01",
    endDate: "2021-03-31",
    current: false,
    gpa: "",
    achievements: [],
    iconType: "secondary"
  },
  {
    institution: "Vellore Institute of Technology",
    degree: "Bachelor of Technology in Computer Science",
    field: "Computer Science",
    location: "Chennai, Tamil Nadu",
    duration: "Aug 2021 – Jul 2025",
    startDate: "2021-08-01",
    endDate: "2025-07-31",
    current: false,
    gpa: "",
    achievements: [],
    iconType: "university"
  }
];

// Your experience data
const experienceData = [
  {
    institution: "Ethnus",
    degree: "Full Stack Developer Internship Program",
    company: "Ethnus",
    position: "Full Stack Developer Intern",
    location: "Remote",
    duration: "Aug 2023 – Dec 2023",
    startDate: "2023-08-01",
    endDate: "2023-12-31",
    current: false,
    highlights: [
      "Developed and deployed 8 key features and functionalities for a hotel booking application, encompassing user authentication, booking management, and real-time availability tracking",
      "Engineered MongoDB database solutions for 1,000+ hotel listings, reducing query response time by 40% and enabling seamless scalability for a 50% increase in daily user traffic",
      "Collaborated closely with a 4-person team to design and implement a highly intuitive user interface",
      "Maintained code quality through regular code reviews and rigorous testing, achieving a 15% improvement in application performance"
    ],
    description: [
      "Developed and deployed 8 key features and functionalities for a hotel booking application, encompassing user authentication, booking management, and real-time availability tracking",
      "Engineered MongoDB database solutions for 1,000+ hotel listings, reducing query response time by 40% and enabling seamless scalability for a 50% increase in daily user traffic",
      "Collaborated closely with a 4-person team to design and implement a highly intuitive user interface",
      "Maintained code quality through regular code reviews and rigorous testing, achieving a 15% improvement in application performance"
    ],
    iconType: "code"
  }
];

async function updatePortfolio() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the existing portfolio or create a new one
    let portfolio = await Portfolio.findOne();
    
    if (!portfolio) {
      console.log('No portfolio found. Please run the seed endpoint first at http://localhost:9002/api/seed');
      process.exit(1);
    }

    console.log('Found existing portfolio. Updating education and experience...');

    // Update education and experience
    portfolio.education = educationData;
    portfolio.experience = experienceData;

    // Save the updated portfolio
    await portfolio.save();
    console.log('Successfully updated education and experience data!');

    // Display the updated data
    console.log('\nEducation Data:');
    portfolio.education.forEach(edu => {
      console.log(`- ${edu.institution}: ${edu.degree} (${edu.duration})`);
    });

    console.log('\nExperience Data:');
    portfolio.experience.forEach(exp => {
      console.log(`- ${exp.institution || exp.company}: ${exp.degree || exp.position} (${exp.duration})`);
    });

  } catch (error) {
    console.error('Error updating portfolio:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the update
updatePortfolio();

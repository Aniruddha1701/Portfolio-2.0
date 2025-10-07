// Script to add education data to the database
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define the Portfolio schema inline for this script
const portfolioSchema = new mongoose.Schema({
  personalInfo: {
    name: String,
    title: String,
    bio: String,
    email: String,
    phone: String,
    location: String,
    resume: String
  },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    youtube: String,
    facebook: String
  },
  skills: [{
    category: String,
    items: [String]
  }],
  education: [{
    institution: String,
    degree: String,
    duration: String,
    location: String,
    field: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    gpa: String,
    achievements: [String],
    iconType: String
  }],
  experience: [{
    institution: String,
    degree: String,
    duration: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    highlights: [String],
    iconType: String
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    github: String,
    live: String,
    image: String,
    featured: Boolean
  }],
  achievements: [{
    title: String,
    issuer: String,
    date: String,
    description: String,
    link: String,
    image: String
  }]
}, {
  timestamps: true
});

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

// Education data to add
const educationData = [
  {
    institution: "Vellore Institute of Technology",
    degree: "Bachelor of Technology in Computer Science",
    duration: "Aug 2021 – Jul 2025",
    location: "Chennai, Tamil Nadu",
    field: "Computer Science",
    startDate: new Date("2021-08-01"),
    endDate: "2025-07-31",
    current: false,
    gpa: "",
    achievements: [],
    iconType: "university"
  },
  {
    institution: "Maharashtra State Board",
    degree: "Senior Secondary",
    duration: "Completed 2021",
    location: "Nashik, Maharashtra",
    field: "Science",  // Added field value
    startDate: new Date("2019-06-01"),
    endDate: "2021-03-31",
    current: false,
    gpa: "",
    achievements: [],
    iconType: "secondary"
  },
  {
    institution: "Maharashtra State Board",
    degree: "Secondary",
    duration: "Completed 2019",
    location: "Nashik, Maharashtra",
    field: "General",  // Added field value
    startDate: new Date("2017-06-01"),
    endDate: "2019-03-31",
    current: false,
    gpa: "",
    achievements: [],
    iconType: "school"
  }
];

async function updateEducationData() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find existing portfolio or create new one
    let portfolio = await Portfolio.findOne({});
    
    if (!portfolio) {
      console.log('No portfolio found. Creating new portfolio with education data...');
      portfolio = new Portfolio({
        personalInfo: {
          name: "Your Name",
          title: "Your Title",
          bio: "Your bio",
          email: "your.email@example.com",
          location: "Your Location"
        },
        education: educationData,
        skills: [],
        experience: [],
        projects: [],
        achievements: [],
        socialLinks: {}
      });
    } else {
      console.log('Updating existing portfolio with education data...');
      portfolio.education = educationData;
    }

    // Save the portfolio
    await portfolio.save();
    console.log('Education data successfully added to database!');
    
    // Display the added education data
    console.log('\nAdded Education Data:');
    educationData.forEach((edu, index) => {
      console.log(`\n${index + 1}. ${edu.institution}`);
      console.log(`   Degree: ${edu.degree}`);
      console.log(`   Duration: ${edu.duration}`);
      console.log(`   Location: ${edu.location}`);
    });

  } catch (error) {
    console.error('Error updating education data:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the script
updateEducationData();

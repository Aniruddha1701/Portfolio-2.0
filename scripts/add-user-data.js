// Script to add user's specific education and experience data
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function addUserData() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    // Get the portfolios collection directly
    const db = mongoose.connection.db;
    const collection = db.collection('portfolios');
    
    // Find the portfolio
    const portfolio = await collection.findOne({});
    
    if (!portfolio) {
      console.log('❌ No portfolio found in database');
      return;
    }
    
    console.log('✅ Found portfolio:', portfolio._id);
    
    // User's education data
    const educationData = [
      {
        institution: 'Vellore Institute of Technology',
        degree: 'Bachelor of Technology in Computer Science',
        field: 'Computer Science',
        location: 'Chennai, Tamil Nadu',
        duration: 'Aug 2021 – Jul 2025',
        startDate: new Date('2021-08-01'),
        endDate: new Date('2025-07-31'),
        current: false,
        gpa: '',
        achievements: [],
        iconType: 'university'
      },
      {
        institution: 'Maharashtra State Board',
        degree: 'Senior Secondary',
        field: 'Science',
        location: 'Nashik, Maharashtra',
        duration: '2021',
        startDate: new Date('2019-06-01'),
        endDate: new Date('2021-05-31'),
        current: false,
        gpa: '',
        achievements: [],
        iconType: 'secondary'
      },
      {
        institution: 'Maharashtra State Board',
        degree: 'Secondary',
        field: '',
        location: 'Nashik, Maharashtra',
        duration: '2019',
        startDate: new Date('2017-06-01'),
        endDate: new Date('2019-05-31'),
        current: false,
        gpa: '',
        achievements: [],
        iconType: 'school'
      }
    ];
    
    // User's experience data
    const experienceData = [
      {
        institution: 'Ethnus',
        degree: 'Full Stack Developer Internship Program',
        company: 'Ethnus',
        position: 'Full Stack Developer Internship Program',
        location: 'Remote',
        duration: 'Aug 2023 – Dec 2023',
        startDate: new Date('2023-08-01'),
        endDate: new Date('2023-12-31'),
        current: false,
        description: [
          'Developed and deployed 8 key features and functionalities for a hotel booking application, encompassing user authentication, booking management, and real-time availability tracking.',
          'Engineered MongoDB database solutions for 1,000+ hotel listings, reducing query response time by 40% and enabling seamless scalability for a 50% increase in daily user traffic.',
          'Collaborated closely with a 4-person team to design and implement a highly intuitive user interface.',
          'Maintained code quality through regular code reviews and rigorous testing, achieving a 15% improvement in application performance.'
        ],
        highlights: [
          'Developed and deployed 8 key features and functionalities for a hotel booking application, encompassing user authentication, booking management, and real-time availability tracking.',
          'Engineered MongoDB database solutions for 1,000+ hotel listings, reducing query response time by 40% and enabling seamless scalability for a 50% increase in daily user traffic.',
          'Collaborated closely with a 4-person team to design and implement a highly intuitive user interface.',
          'Maintained code quality through regular code reviews and rigorous testing, achieving a 15% improvement in application performance.'
        ],
        iconType: 'code'
      }
    ];
    
    // Update personal info with proper details
    const updatedPersonalInfo = {
      name: 'Aniruddha Patil',
      title: 'Full Stack Developer',
      email: 'aniruddhapatil@example.com',
      phone: '+91 1234567890',
      location: 'Chennai, India',
      bio: 'Passionate Full Stack Developer pursuing B.Tech in Computer Science at VIT Chennai. Experienced in developing scalable web applications with modern technologies including React, Node.js, and MongoDB. Proven track record of improving application performance and delivering user-centric solutions.'
    };
    
    // Update the portfolio
    const updateResult = await collection.updateOne(
      { _id: portfolio._id },
      {
        $set: {
          personalInfo: updatedPersonalInfo,
          education: educationData,
          experience: experienceData
        }
      }
    );
    
    console.log('✅ Update result:', updateResult.modifiedCount > 0 ? 'Success' : 'No changes made');
    
    // Verify the update
    const updatedPortfolio = await collection.findOne({ _id: portfolio._id });
    
    console.log('\n=== UPDATED EDUCATION ===');
    updatedPortfolio.education.forEach((edu, index) => {
      console.log(`${index + 1}. ${edu.institution}`);
      console.log(`   Degree: ${edu.degree}`);
      console.log(`   Duration: ${edu.duration}`);
      console.log(`   Location: ${edu.location}`);
    });
    
    console.log('\n=== UPDATED EXPERIENCE ===');
    updatedPortfolio.experience.forEach((exp, index) => {
      console.log(`${index + 1}. ${exp.institution || exp.company}`);
      console.log(`   Position: ${exp.degree || exp.position}`);
      console.log(`   Duration: ${exp.duration}`);
      console.log(`   Location: ${exp.location}`);
      if (exp.highlights && exp.highlights.length > 0) {
        console.log(`   Highlights: ${exp.highlights.length} items`);
      }
    });
    
    console.log('\n✅ Your education and experience data has been successfully added!');
    
  } catch (error) {
    console.error('Error adding user data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

addUserData();

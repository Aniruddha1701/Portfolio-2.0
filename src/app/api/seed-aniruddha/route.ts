import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Delete existing portfolio to start fresh
    await Portfolio.deleteMany({});
    
    // Create Aniruddha's portfolio
    const aniruddhaPortfolio = await Portfolio.create({
      personalInfo: {
        name: 'Aniruddha Patil',
        title: 'Software Engineer',
        email: 'aniruddhapatil@example.com', // Update with actual email
        phone: '+91 XXXXXXXXXX', // Update with actual phone
        bio: 'A passionate Software Engineer with expertise in building robust and scalable web applications. Recently Graduated B.Tech in Computer Science at VIT Chennai, with a strong foundation in full-stack development, machine learning, and cloud technologies.',
        avatar: 'https://github.com/Aniruddha1701.png', // GitHub avatar
        resume: '/resume.pdf'
      },
      socialLinks: {
        github: 'https://github.com/Aniruddha1701',
        linkedin: 'https://linkedin.com/in/aniruddha-patil',
        twitter: '',
        instagram: '',
        youtube: '',
        facebook: ''
      },
      skills: [
        {
          category: 'Frontend',
          items: ['JavaScript', 'React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS']
        },
        {
          category: 'Backend',
          items: ['Node.js', 'Express', 'Python', 'Django', 'RESTful APIs']
        },
        {
          category: 'Database',
          items: ['MongoDB', 'SQL', 'Database Design', 'Aggregation Pipelines']
        },
        {
          category: 'Machine Learning',
          items: ['LightGBM', 'KNN', 'Scikit-learn', 'Pandas', 'NumPy']
        },
        {
          category: 'Programming Languages',
          items: ['JavaScript (ES6+)', 'Python', 'C++', 'TypeScript']
        },
        {
          category: 'Tools & Technologies',
          items: ['Git', 'Docker', 'Kubernetes', 'Google Cloud', 'Oracle Cloud']
        }
      ],
      experience: [
        {
          company: 'Ethnus',
          position: 'Full Stack Developer Internship Program',
          location: 'Remote',
          startDate: new Date('2023-08-01'),
          endDate: new Date('2023-12-01'),
          current: false,
          description: [
            'Developed and deployed 8 key features and functionalities for a hotel booking application, encompassing user authentication, booking management, and real-time availability tracking.',
            'Engineered MongoDB database solutions for 1,000+ hotel listings, reducing query response time by 40% and enabling seamless scalability for a 50% increase in daily user traffic.',
            'Collaborated closely with a 4-person team to design and implement a highly intuitive user interface.',
            'Maintained code quality through regular code reviews and rigorous testing, achieving a 15% improvement in application stability.'
          ]
        },
        {
          company: 'Open to Opportunities',
          position: 'Seeking Full Stack Developer Role',
          location: 'Worldwide',
          startDate: new Date(),
          current: true,
          description: [
            'Embarking on New Adventures',
            'Open to new opportunities and collaborations',
            'Looking for challenging projects in web development and AI'
          ]
        }
      ],
      education: [
        {
          institution: 'Vellore Institute of Technology (VIT Chennai)',
          degree: 'Bachelor of Technology',
          field: 'Computer Science',
          startDate: new Date('2021-08-01'),
          endDate: new Date('2025-06-01'),
          current: true,
          gpa: '',
          achievements: []
        },
        {
          institution: 'Maharashtra State Board, Nashik',
          degree: 'Senior Secondary',
          field: 'HSC',
          startDate: new Date('2019-06-01'),
          endDate: new Date('2021-03-01'),
          current: false,
          gpa: '',
          achievements: []
        },
        {
          institution: 'Maharashtra State Board, Nashik',
          degree: 'Secondary',
          field: 'SSC',
          startDate: new Date('2009-06-01'),
          endDate: new Date('2019-03-01'),
          current: false,
          gpa: '',
          achievements: []
        }
      ],
      projects: [
        {
          title: 'CarePlus - Healthcare Management System',
          description: 'A comprehensive healthcare platform for patient management, appointment scheduling, and secure data handling, built with HIPAA compliance in mind.',
          technologies: ['Web App', 'Healthcare', 'React.js', 'Appwrite'],
          image: '/projects/careplus.jpg',
          liveUrl: '#',
          githubUrl: 'https://github.com/Aniruddha1701/careplus',
          featured: true,
          order: 1
        },
        {
          title: 'GourmetGenie - AI-Powered Food Recommendation System',
          description: 'An AI-driven food suggestion engine using LightGBM and KNN to provide personalized recommendations based on user preferences and eating habits.',
          technologies: ['AI', 'Python', 'Streamlit', 'Django'],
          image: '/projects/gourmetgenie.jpg',
          liveUrl: '#',
          githubUrl: 'https://github.com/Aniruddha1701/gourmetgenie',
          featured: true,
          order: 2
        },
        {
          title: 'ImaginAI - Text-to-Image Generator',
          description: 'An open-source text-to-image generator using Stability AI, featuring a responsive interface and secure API management for real-time image creation.',
          technologies: ['AI', 'Tooling', 'React.js', 'Stability AI'],
          image: '/projects/imaginai.jpg',
          liveUrl: '#',
          githubUrl: 'https://github.com/Aniruddha1701/imaginai',
          featured: true,
          order: 3
        },
        {
          title: 'Wildlife Conservation Platform',
          description: 'An educational platform designed to raise awareness and provide information about wildlife conservation efforts and species protection.',
          technologies: ['Web App', 'Education'],
          image: '/projects/wildlife.jpg',
          liveUrl: '#',
          githubUrl: 'https://github.com/Aniruddha1701/wildlife',
          featured: false,
          order: 4
        }
      ],
      testimonials: [],
      services: [
        {
          title: 'Full Stack Development',
          description: 'End-to-end web application development using MERN stack',
          icon: 'code',
          features: ['React/Next.js Frontend', 'Node.js Backend', 'MongoDB Database', 'RESTful APIs']
        },
        {
          title: 'AI/ML Solutions',
          description: 'Machine learning models and AI-powered applications',
          icon: 'brain',
          features: ['Predictive Analytics', 'Recommendation Systems', 'Data Analysis', 'Model Training']
        },
        {
          title: 'Cloud Architecture',
          description: 'Scalable cloud solutions and deployment',
          icon: 'cloud',
          features: ['Google Cloud Platform', 'Kubernetes', 'Docker', 'CI/CD Pipelines']
        }
      ],
      achievements: [
        {
          title: 'Google Cloud Certified - Professional Cloud Developer',
          description: 'Issued by Google Cloud',
          date: new Date('2023-08-01'),
          icon: 'cloud'
        },
        {
          title: 'Certified Kubernetes Application Developer (CKAD)',
          description: 'Issued by The Linux Foundation',
          date: new Date('2023-12-01'),
          icon: 'kubernetes'
        },
        {
          title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
          description: 'Issued by Oracle',
          date: new Date('2025-08-01'),
          icon: 'ai'
        },
        {
          title: 'GenAI Powered Data Analytics',
          description: 'Issued by Tata Group',
          date: new Date('2025-06-01'),
          icon: 'analytics'
        },
        {
          title: 'Google Cloud Computing Foundations',
          description: 'Issued by Google',
          date: new Date('2023-12-01'),
          icon: 'cloud'
        },
        {
          title: 'Certificate for Completion of C Training',
          description: 'Issued by Indian Institute of Technology, Bombay',
          date: new Date('2022-02-01'),
          icon: 'code'
        },
        {
          title: 'Certificate for Completion of Advanced C++ Training',
          description: 'Issued by Indian Institute of Technology, Bombay',
          date: new Date('2022-02-01'),
          icon: 'code'
        },
        {
          title: 'Certificate for Completion of Python 3.4.3',
          description: 'Issued by Indian Institute of Technology, Bombay',
          date: new Date('2022-02-01'),
          icon: 'python'
        },
        {
          title: 'Certificate of Participation (Finalist)',
          description: 'Issued by NMIMS Navi Mumbai',
          date: new Date('2023-01-01'),
          icon: 'trophy'
        }
      ],
      settings: {
        theme: 'auto',
        emailNotifications: true,
        publicProfile: true,
        analytics: true
      }
    });
    
    console.log('Aniruddha\'s portfolio created successfully');
    
    return NextResponse.json(
      { 
        message: 'Aniruddha\'s portfolio seeded successfully',
        portfolio: aniruddhaPortfolio
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed portfolio', details: error.message },
      { status: 500 }
    );
  }
}

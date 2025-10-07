import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Admin from '@/models/Admin';
import Portfolio from '@/models/Portfolio';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Create or update default admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    let admin = await Admin.findOne({ email: adminEmail });
    
    if (!admin) {
      admin = await Admin.create({
        email: adminEmail,
        password: adminPassword,
        name: 'Admin User',
        role: 'super-admin'
      });
      
      console.log('Admin created:', admin.email);
    } else {
      // Update existing admin's password to match .env.local
      admin.password = adminPassword;
      admin.isModified('password'); // Ensure password gets hashed
      await admin.save();
      console.log('Admin password updated for:', admin.email);
    }
    
    // Create sample portfolio if not exists
    const existingPortfolio = await Portfolio.findOne({});
    
    if (!existingPortfolio) {
      const samplePortfolio = await Portfolio.create({
        personalInfo: {
          name: 'John Doe',
          title: 'Full Stack Developer',
          email: 'john@example.com',
          phone: '+1234567890',
          location: 'San Francisco, CA',
          bio: 'Passionate developer with expertise in modern web technologies.',
          avatar: 'https://github.com/shadcn.png',
          resume: '/resume.pdf'
        },
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com'
        },
        skills: [
          {
            category: 'Frontend',
            items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
          },
          {
            category: 'Backend',
            items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL']
          },
          {
            category: 'Tools',
            items: ['Git', 'Docker', 'AWS', 'Figma']
          }
        ],
        experience: [
          {
            company: 'Tech Corp',
            position: 'Senior Developer',
            location: 'Remote',
            startDate: new Date('2022-01-01'),
            current: true,
            description: [
              'Led development of key features',
              'Mentored junior developers',
              'Improved performance by 40%'
            ]
          }
        ],
        education: [
          {
            institution: 'University of Technology',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: new Date('2018-09-01'),
            endDate: new Date('2022-05-01'),
            current: false,
            gpa: '3.8',
            achievements: ['Dean\'s List', 'Best Project Award']
          }
        ],
        projects: [
          {
            title: 'E-Commerce Platform',
            description: 'Full-stack e-commerce solution with modern UI',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            image: 'https://via.placeholder.com/600x400',
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com/example/project',
            featured: true,
            order: 1
          },
          {
            title: 'Task Management App',
            description: 'Collaborative task management application',
            technologies: ['Next.js', 'Prisma', 'PostgreSQL'],
            image: 'https://via.placeholder.com/600x400',
            featured: false,
            order: 2
          }
        ],
        testimonials: [
          {
            name: 'Jane Smith',
            position: 'CEO',
            company: 'Tech Startup',
            content: 'Outstanding developer with great problem-solving skills.',
            rating: 5
          }
        ],
        services: [
          {
            title: 'Web Development',
            description: 'Building modern web applications',
            icon: 'code',
            features: ['Responsive Design', 'SEO Optimization', 'Performance']
          },
          {
            title: 'Mobile Development',
            description: 'Cross-platform mobile applications',
            icon: 'smartphone',
            features: ['React Native', 'Flutter', 'Native Apps']
          }
        ],
        achievements: [
          {
            title: 'Best Developer Award',
            description: 'Recognized for exceptional performance',
            date: new Date('2023-12-01'),
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
      
      console.log('Sample portfolio created');
    }
    
    return NextResponse.json(
      { 
        message: 'Database seeded successfully',
        admin: process.env.ADMIN_EMAIL,
        note: 'Use the credentials in .env.local to login'
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

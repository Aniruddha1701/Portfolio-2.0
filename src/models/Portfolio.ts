import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript
export interface IPortfolio extends Document {
  // Personal Info
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    avatar: string;
    resume: string;
  };
  
  // Social Links
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  
  // Skills
  skills: {
    category: string;
    items: string[];
  }[];
  
  // Experience
  experience: {
    company?: string;  // Legacy field
    position?: string;  // Legacy field
    institution?: string;  // New field
    degree?: string;  // New field (position/role)
    location?: string;
    duration?: string;
    startDate?: Date;
    endDate?: Date | string;
    current?: boolean;
    description?: string[];  // Legacy field
    highlights?: string[];  // New field
    iconType?: string;
  }[];
  
  // Education
  education: {
    institution: string;
    degree: string;
    field?: string;  // Made optional
    location?: string;
    duration?: string;
    startDate?: Date;
    endDate?: Date | string;
    current?: boolean;
    gpa?: string;
    achievements?: string[];
    iconType?: string;
  }[];
  
  // Projects
  projects: {
    title: string;
    description: string;
    technologies: string[];
    image: string;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    order: number;
  }[];
  
  // Testimonials
  testimonials: {
    name: string;
    position: string;
    company: string;
    image?: string;
    content: string;
    rating: number;
  }[];
  
  // Services
  services: {
    title: string;
    description: string;
    icon: string;
    features: string[];
  }[];
  
  // Achievements
  achievements: {
    title: string;
    description: string;
    date: Date;
    icon?: string;
  }[];
  
  // Settings
  settings: {
    theme: 'light' | 'dark' | 'auto';
    emailNotifications: boolean;
    publicProfile: boolean;
    analytics: boolean;
  };
  
  updatedAt: Date;
  createdAt: Date;
}

// Schema
const PortfolioSchema = new Schema<IPortfolio>({
  personalInfo: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    avatar: { type: String },
    resume: { type: String }
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
    category: { type: String, required: true },
    items: [{ type: String }]
  }],
  
  experience: [{
    company: { type: String, default: '' },  // Legacy field
    position: { type: String, default: '' },  // Legacy field
    institution: { type: String, default: '' },  // New field matching Journey
    degree: { type: String, default: '' },  // New field matching Journey (position/role)
    location: { type: String, default: '' },
    duration: { type: String, default: '' },
    startDate: { type: Schema.Types.Mixed },
    endDate: { type: Schema.Types.Mixed },  // Can be Date or String ('Present')
    current: { type: Boolean, default: false },
    description: { type: [String], default: [] },  // Legacy field
    highlights: { type: [String], default: [] },  // New field matching Journey
    iconType: { type: String, default: 'briefcase' }
  }],
  
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, default: '' },  // Made optional with default value
    location: { type: String, default: '' },
    duration: { type: String, default: '' },
    startDate: { type: Schema.Types.Mixed },
    endDate: { type: Schema.Types.Mixed },  // Can be Date or String ('Present')
    current: { type: Boolean, default: false },
    gpa: { type: String, default: '' },
    achievements: { type: [String], default: [] },
    iconType: { type: String, default: 'university' }
  }],
  
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [String],
    image: String,
    liveUrl: String,
    githubUrl: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  
  testimonials: [{
    name: { type: String, required: true },
    position: String,
    company: String,
    image: String,
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 }
  }],
  
  services: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: String,
    features: [String]
  }],
  
  achievements: [{
    title: { type: String, required: true },
    description: String,
    date: Date,
    icon: String
  }],
  
  settings: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
    emailNotifications: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true },
    analytics: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Only create one portfolio document per user in real app
// For now, we'll use a single portfolio
PortfolioSchema.index({ 'personalInfo.email': 1 }, { unique: true });

export default mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

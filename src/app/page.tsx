"use client"

import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Portfolio } from '@/components/portfolio';
import { Skills } from '@/components/skills';
import { Footer } from '@/components/footer';
import { Journey } from '@/components/journey';
import { Github, Linkedin, Mail } from 'lucide-react';
import { LoadingScreen } from '@/components/loading-screen';

import { Skeleton } from '@/components/ui/skeleton';
import { Certifications } from '@/components/certifications';
import HeroEnhanced from '@/components/hero-enhanced';
import Navbar from '@/components/navbar';
import { AdminButton } from '@/components/admin-button';

const SmartLab = lazy(() => import('@/components/smart-lab').then(module => ({ default: module.SmartLab })));

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        // Fetch portfolio data from database
        const response = await fetch('/api/portfolio');
        
        if (response.ok) {
          const data = await response.json();
          setPortfolioData(data);
        } else if (response.status === 404) {
          // No portfolio exists in database
          console.log('No portfolio found in database');
          setPortfolioData(null);
        } else {
          throw new Error('Failed to load portfolio');
        }
      } catch (error) {
        console.error('Error loading portfolio data:', error);
        setPortfolioData(null);
      } finally {
        // Set minimum loading time for smooth UX
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    loadPortfolioData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // If no portfolio data from database, show setup message
  if (!portfolioData) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-transparent items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-4xl font-bold text-primary">Portfolio Not Set Up</h1>
          <p className="text-lg text-muted-foreground">
            Please contact the administrator to set up the portfolio data.
          </p>
          <p className="text-sm text-muted-foreground">
            Admin can log in at <a href="/admin/login" className="text-primary hover:underline">/admin/login</a> to configure the portfolio.
          </p>
        </div>
      </div>
    );
  }

  // Extract data from portfolioData
  const personalInfo = portfolioData.personalInfo || {};
  const socialLinks = portfolioData.socialLinks || {};
  const skills = portfolioData.skills || [];
  const projects = portfolioData.projects || [];
  const education = portfolioData.education || [];
  const experience = portfolioData.experience || [];
  const achievements = portfolioData.achievements || [];

  const SocialLinks = () => (
    <motion.div 
      className="fixed top-1/2 right-4 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {socialLinks.github && (
        <motion.a 
          href={socialLinks.github} 
          aria-label="Github" 
          target="_blank" 
          className="p-2 rounded-full glass-effect transition-all text-[#e4e4e4] hover:text-white hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <Github className="h-6 w-6 icon-glow" />
        </motion.a>
      )}
      {socialLinks.linkedin && (
        <motion.a 
          href={socialLinks.linkedin} 
          aria-label="LinkedIn" 
          target="_blank" 
          className="p-2 rounded-full glass-effect transition-all text-[#0A66C2] hover:text-[#0077B5] hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <Linkedin className="h-6 w-6 icon-glow" />
        </motion.a>
      )}
      {personalInfo.email && (
        <motion.a 
          href={`mailto:${personalInfo.email}`} 
          aria-label="Email" 
          target="_blank" 
          className="p-2 rounded-full glass-effect transition-all text-[#EA4335] hover:text-[#c71610] hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <Mail className="h-6 w-6 icon-glow" />
        </motion.a>
      )}
    </motion.div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <Navbar />
      <AdminButton />
      <SocialLinks />
      <main className="flex-1">
        <section id="home" className="relative w-full">
          <HeroEnhanced 
            name={personalInfo.name || ''}
            city={personalInfo.location || ''}
            title={personalInfo.title || ''}
            bio={personalInfo.bio || ''}
            hasResume={!!personalInfo.resume}
          />
        </section>
        
        {/* About/Journey Section - Pass education and experience data */}
        <section id="about" className="w-full py-16 md:py-24 lg:py-32">
          <Journey education={education} experience={experience} />
        </section>
        
        {/* Skills Section - Pass skills data */}
        <section id="skills" className="w-full py-16 md:py-24 lg:py-32">
          <Skills skills={skills} />
        </section>
        
        {/* Portfolio Section - Pass projects data */}
        <section id="portfolio" className="w-full py-16 md:py-24 lg:py-32">
          <Portfolio projects={projects} />
        </section>
        
        {/* Certifications Section - Pass achievements data */}
        <section id="certifications" className="w-full py-16 md:py-24 lg:py-32">
          <Certifications certifications={achievements} />
        </section>
        
        <section id="smart-lab" className="w-full py-16 md:py-24 lg:py-32">
          <Suspense fallback={
            <div className="container px-4 md:px-6">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          }>
            <SmartLab />
          </Suspense>
        </section>
      </main>
      <Footer personalInfo={personalInfo} />
    </div>
  );
}

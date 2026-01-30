"use client"

import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portfolio } from '@/components/portfolio';
import { Skills } from '@/components/skills';
import { Footer } from '@/components/footer';
import { Journey } from '@/components/journey';
import { Github, Linkedin, Mail, Brain } from 'lucide-react';
import { LoadingScreen } from '@/components/loading-screen';

import { Skeleton } from '@/components/ui/skeleton';
import { Certifications } from '@/components/certifications';
import HeroEnhanced from '@/components/hero-enhanced';
import FloatingNavbar from '@/components/floating-navbar';
import { WordleGame } from '@/components/wordle-demo/wordle-game';
import { Terminal } from '@/components/terminal/terminal';
import { MatrixRain } from '@/components/effects/matrix-rain';
import { TextReveal } from '@/components/ui/text-reveal';
import { ItNews } from '@/components/it-news';



export default function Home() {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

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
        setDataLoaded(true);
      }
    };

    loadPortfolioData();
  }, []);

  useEffect(() => {
    if (dataLoaded && animationFinished) {
      setLoading(false);
    }
  }, [dataLoaded, animationFinished]);

  if (loading) {
    return <LoadingScreen onComplete={() => setAnimationFinished(true)} />;
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
      <FloatingNavbar />
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

        {/* Logic Demo CTA Section */}
        <section id="logic-demo" className="w-full py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-background to-background" />

          <div className="container px-4 md:px-6 relative z-10 text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Engineering Challenge
              </h2>
              <TextReveal
                text="Beyond simply writing code, I build systems that enforce constraints and handle complex state. Think you can crack the logic?"
                className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
              />
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* Wordle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDemo(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Brain className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Test My Brain 🧠
                </span>
              </motion.button>

              {/* Terminal Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTerminal(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-black/40 hover:bg-black/60 border border-emerald-500/20 rounded-full backdrop-blur-md transition-all duration-300"
              >
                <span className="text-emerald-500 font-mono text-xl mr-1">&gt;_</span>
                <span className="text-lg font-mono text-gray-300 group-hover:text-emerald-400 transition-colors">
                  Dev Terminal
                </span>
              </motion.button>
            </div>
          </div>
        </section>
        {/* Tech Radar Section */}
        <section id="tech-radar" className="w-full py-16 md:py-24 relative bg-black/40">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Global Tech Radar 📡
            </h2>
            <ItNews />
          </div>
        </section>

      </main>
      <Footer personalInfo={personalInfo} socialLinks={socialLinks} />

      {/* Matrix Rain Overlay */}
      <AnimatePresence>
        {showMatrix && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] cursor-pointer"
            onClick={() => setShowMatrix(false)}
          >
            <MatrixRain />
            <div className="absolute top-4 right-4 z-[70] bg-black/50 text-emerald-500 px-4 py-2 rounded border border-emerald-500/30 backdrop-blur text-xs font-mono animate-pulse">
              MATRIX MODE ACTIVE - CLICK TO EXIT
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Overlay for Wordle Game */}
      <AnimatePresence>
        {/* Wordle Modal */}
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
            onClick={() => setShowDemo(false)} // Close on backdrop click
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent close on content click
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <WordleGame onClose={() => setShowDemo(false)} />
            </motion.div>
          </motion.div>
        )}

        {/* Terminal Modal */}
        {showTerminal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setShowTerminal(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl"
            >
              <Terminal
                onClose={() => setShowTerminal(false)}
                onAction={(action) => {
                  if (action === 'matrix') {
                    setShowMatrix(true);
                    setShowTerminal(false); // Close terminal to show full effect
                  }
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

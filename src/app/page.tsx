"use client"

import { Header } from '@/components/header';
import { Portfolio } from '@/components/portfolio';
import { Skills } from '@/components/skills';
import { SmartLab } from '@/components/smart-lab';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowDown, FileText } from 'lucide-react';
import { Journey } from '@/components/journey';
import { Github, Linkedin, Mail } from 'lucide-react';
import { TypingEffect } from '@/components/typing-effect';

const SocialLinks = () => (
  <div className="fixed top-1/2 right-4 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
    <a href="https://github.com/Aniruddha1701" aria-label="Github" target="_blank" className="p-2 rounded-full bg-background/80 backdrop-blur-md transition-colors text-[#e4e4e4] hover:text-white">
      <Github className="h-6 w-6 icon-glow" />
    </a>
    <a href="https://linkedin.com/in/Aniruddha1701" aria-label="LinkedIn" target="_blank" className="p-2 rounded-full bg-background/80 backdrop-blur-md transition-colors text-[#0A66C2] hover:text-[#0077B5]">
      <Linkedin className="h-6 w-6 icon-glow" />
    </a>
    <a href="mailto:aniruddhap66@gmail.com" aria-label="Email" target="_blank" className="p-2 rounded-full bg-background/80 backdrop-blur-md transition-colors text-[#EA4335] hover:text-[#c71610]">
       <Mail className="h-6 w-6 icon-glow" />
    </a>
  </div>
);


export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <Header />
      <SocialLinks />
      <main className="flex-1">
        <section id="hero" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden text-center">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-background/80 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(125,249,255,0.1),rgba(255,255,255,0))]"></div>
             <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(125,249,255,0.1),rgba(255,255,255,0))]"></div>
          </div>
          <div className="container z-10 px-4 md:px-6">
            <div className="animate-fade-in-up space-y-6">
              <div className="relative inline-block">
                <div className="absolute -left-12 -top-8 w-16 h-16 text-primary/30 animate-hero-text [animation-delay:0.2s] animate-float">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 20,50 C 20,20 80,20 80,50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                        <circle cx="20" cy="50" r="4" fill="currentColor"/>
                        <path d="M 50,80 C 20,80 20,20 50,20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                </div>
                 <div className="absolute -left-24 top-1/2 w-12 h-12 text-accent/30 animate-hero-text [animation-delay:0.3s] animate-float [animation-duration:5s]">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 50,20 C 80,20 80,80 50,80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                        <circle cx="50" cy="20" r="4" fill="currentColor"/>
                    </svg>
                </div>
                <div className="absolute left-1/2 -top-20 w-10 h-10 text-destructive/30 animate-hero-text [animation-delay:0.4s] animate-float [animation-duration:6s]">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="4" />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="4" />
                    </svg>
                </div>
                <div className="absolute right-1/4 -top-12 w-10 h-10 text-primary/30 animate-hero-text [animation-delay:0.6s] animate-float [animation-duration:8s]">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="4"/>
                    </svg>
                </div>
                <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl animate-hero-text">
                  Aniruddha Patil
                </h1>
                <div className="absolute -right-12 -bottom-8 w-16 h-16 text-primary/30 animate-hero-text [animation-delay:0.2s] transform -scale-x-100 -scale-y-100 animate-float">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 20,50 C 20,20 80,20 80,50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                        <circle cx="20" cy="50" r="4" fill="currentColor"/>
                        <path d="M 50,80 C 20,80 20,20 50,20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                </div>
                 <div className="absolute -right-24 top-1/2 w-12 h-12 text-accent/30 animate-hero-text [animation-delay:0.3s] transform -scale-x-100 -scale-y-100 animate-float [animation-duration:5s]">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 50,20 C 80,20 80,80 50,80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                        <circle cx="50" cy="20" r="4" fill="currentColor"/>
                    </svg>
                </div>
                 <div className="absolute -right-8 -top-12 w-12 h-12 text-accent/30 animate-hero-text [animation-delay:0.7s] animate-float [animation-duration:9s]">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 50 L50 10 L90 50 L50 90 Z" fill="none" stroke="currentColor" strokeWidth="4"/>
                    </svg>
                </div>
              </div>
              <TypingEffect />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="group transition-all duration-300 ease-in-out hover:scale-105">
                  <a href="#portfolio">
                    <span>View My Work</span>
                    <ArrowDown className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="group transition-all duration-300 ease-in-out hover:scale-105">
                  <a href="https://drive.google.com/file/d/1gG17jQFF8jYT4m4KSIGrZ6O9MVElxggF/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                    <span>View Resume</span>
                    <FileText className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 animate-bounce">
            <a href="#portfolio" aria-label="Scroll to portfolio">
              <ArrowDown className="h-8 w-8 text-muted-foreground" />
            </a>
          </div>
        </section>
        
        <section id="journey" className="w-full py-12 md:py-24 lg:py-32">
          <Journey />
        </section>

        <section id="portfolio" className="relative w-full py-12 md:py-24 lg:py-32 bg-muted/20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(125,249,255,0.1),rgba(255,255,255,0))]"></div>
          <Portfolio />
        </section>

        <section id="skills" className="w-full py-12 md:py-24 lg:py-32">
          <Skills />
        </section>

        <section id="smart-lab" className="relative w-full py-12 md:py-24 lg:py-32 bg-muted/20 overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(125,249,255,0.1),rgba(255,255,255,0))]"></div>
          <SmartLab />
        </section>
      </main>
      <Footer />
    </div>
  );
}

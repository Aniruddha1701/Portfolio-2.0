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
              <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl animate-hero-text">
                Aniruddha Patil
              </h1>
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

        <section id="portfolio" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <Portfolio />
        </section>

        <section id="skills" className="w-full py-12 md:py-24 lg:py-32">
          <Skills />
        </section>

        <section id="smart-lab" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <SmartLab />
        </section>
      </main>
      <Footer />
    </div>
  );
}

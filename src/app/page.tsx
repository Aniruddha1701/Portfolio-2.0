import { Header } from '@/components/header';
import { Portfolio } from '@/components/portfolio';
import { Skills } from '@/components/skills';
import { CodePlayground } from '@/components/code-playground';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowDown, FileText } from 'lucide-react';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Education } from '@/components/education';

const SocialLinks = () => (
  <div className="fixed top-1/2 right-4 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
    <a href="https://github.com/Aniruddha1701" aria-label="Github" target="_blank" className="p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-primary/10 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" className="text-foreground">
        <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,0.8-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3c1.4-1.3,2.8-1.3,2.8-1.3c0.2,0.6,0.2,1.2,0.2,1.6c0,0.7-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c4.1-1.6,6.8-5.8,6.3-10.5 C20.1,6.4,16.4,2.6,10.9,2.1z"></path>
      </svg>
    </a>
    <a href="https://linkedin.com/in/Aniruddha1701" aria-label="LinkedIn" target="_blank" className="p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-primary/10 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" className="text-foreground">
        <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M8,19H5V8h3V19z M6.5,6.732c-0.966,0-1.75-0.785-1.75-1.75S5.534,3.232,6.5,3.232S8.25,4.017,8.25,5.014S7.466,6.732,6.5,6.732z M20,19h-3 v-5.604c0-3.368-4-3.113-4,0V19h-3V8h3v1.765c1.396-2.586,7-2.777,7,2.476V19z"></path>
      </svg>
    </a>
    <a href="mailto:aniruddhap66@gmail.com" aria-label="Email" target="_blank" className="p-2 rounded-full bg-background/80 backdrop-blur-md hover:bg-primary/10 transition-colors">
       <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" className="text-foreground">
        <path d="M 3 5 A 1 1 0 0 0 2 6 L 2 18 A 1 1 0 0 0 3 19 L 21 19 A 1 1 0 0 0 22 18 L 22 6 A 1 1 0 0 0 21 5 L 3 5 z M 4.3125 7 L 19.6875 7 L 12 11.65625 L 4.3125 7 z M 4 8.523438 L 11.476562 13.4375 A 1 1 0 0 0 12 13.5 A 1 1 0 0 0 12.523438 13.4375 L 20 8.523438 L 20 17 L 4 17 L 4 8.523438 z"></path>
       </svg>
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
            <div className="absolute inset-0 bg-background/80">
               <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(125,249,255,0.1),rgba(255,255,255,0))]"></div>
               <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(125,249,255,0.1),rgba(255,255,255,0))]"></div>
            </div>
          </div>
          <div className="container z-10 px-4 md:px-6">
            <div className="animate-fade-in-up space-y-6">
              <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
                Aniruddha Patil
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Full Stack Developer with expertise in MERN stack and Machine Learning. I build beautiful, responsive, and scalable web applications.
              </p>
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
        
        <section id="education" className="w-full py-12 md:py-24 lg:py-32">
          <Education />
        </section>

        <section id="portfolio" className="w-full py-12 md:py-24 lg:py-32">
          <Portfolio />
        </section>

        <section id="skills" className="w-full bg-muted/40 py-12 md:py-24 lg:py-32">
          <Skills />
        </section>

        <section id="playground" className="w-full py-12 md:py-24 lg:py-32">
          <CodePlayground />
        </section>
      </main>
      <Footer />
    </div>
  );
}

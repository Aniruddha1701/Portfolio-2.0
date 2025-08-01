import { Header } from '@/components/header';
import { Portfolio } from '@/components/portfolio';
import { Skills } from '@/components/skills';
import { CodePlayground } from '@/components/code-playground';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section id="hero" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden text-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-background">
               <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(125,249,255,0.15),rgba(255,255,255,0))]"></div>
               <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(125,249,255,0.15),rgba(255,255,255,0))]"></div>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
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
                 <div className="flex justify-center space-x-4 md:justify-start">
                    <Link href="https://github.com/Aniruddha1701" aria-label="Github" target="_blank" className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                      <Github className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
                    </Link>
                    <Link href="https://linkedin.com/in/aniruddhapatil0593" aria-label="LinkedIn" target="_blank" className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                      <Linkedin className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
                    </Link>
                     <Link href="mailto:aniruddhap66@gmail.com" aria-label="Email" target="_blank" className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                      <Mail className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
                    </Link>
                  </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 animate-bounce">
            <a href="#portfolio" aria-label="Scroll to portfolio">
              <ArrowDown className="h-8 w-8 text-muted-foreground" />
            </a>
          </div>
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

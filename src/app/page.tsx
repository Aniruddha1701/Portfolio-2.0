import { Header } from '@/components/header';
import { Portfolio } from '@/components/portfolio';
import { Skills } from '@/components/skills';
import { CodePlayground } from '@/components/code-playground';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section id="hero" className="relative flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden bg-background text-center">
          <div className="absolute inset-0 z-0 h-full w-full bg-grid-white/[0.02]"></div>
          <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_500px_at_50%_200px,#3e9c9c44,transparent)]"></div>
          <div className="container z-10 px-4 md:px-6">
            <div className="animate-fade-in-up space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Aniruddha Patil
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Full Stack Developer with expertise in MERN stack and Machine Learning. Currently pursuing B.Tech in Computer Science from VIT Chennai with hands-on experience in healthcare systems, AI-powered applications, and scalable web development. Proven track record of optimizing system performance and leading development teams.
              </p>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <a href="#portfolio">View My Work</a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href="#contact">Get in Touch</a>
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

        <section id="portfolio" className="w-full py-12 md:py-24 lg:py-32">
          <Portfolio />
        </section>

        <section id="skills" className="w-full bg-muted py-12 md:py-24 lg:py-32">
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

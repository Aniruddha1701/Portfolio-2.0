"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react"

export function Footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer id="contact" className="relative w-full border-t border-primary/10 bg-muted/20 py-12 overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(125,249,255,0.1),rgba(255,255,255,0))]"></div>
      <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 text-center md:grid-cols-3 md:px-6 md:text-left">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Aniruddha Patil</h3>
          <p className="text-sm text-muted-foreground">
            Full Stack Developer & ML Enthusiast crafting digital experiences.
          </p>
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Get In Touch</h3>
           <p className="text-sm text-muted-foreground">
             <a href="mailto:aniruddhap66@gmail.com" className="hover:text-primary underline-offset-4 hover:underline">aniruddhap66@gmail.com</a>
          </p>
           <p className="text-sm text-muted-foreground">
             +91 8469341792
          </p>
           <p className="text-sm text-muted-foreground">
            Available for full-time opportunities from July 2025.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#portfolio" className="hover:text-primary">Portfolio</Link></li>
            <li><Link href="#skills" className="hover:text-primary">Skills</Link></li>
            <li><Link href="#playground" className="hover:text-primary">Playground</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 flex justify-between items-center px-4 text-center text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Aniruddha Patil. All Rights Reserved.</span>
        <button onClick={scrollToTop} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Scroll to top</span>
        </button>
      </div>
    </footer>
  )
}

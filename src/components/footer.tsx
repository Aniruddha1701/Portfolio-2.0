"use client"

import Link from "next/link"
import { ArrowUp } from "lucide-react"

export function Footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer id="contact" className="relative w-full border-t border-primary/10 bg-muted/20 py-8 overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(125,249,255,0.1),rgba(255,255,255,0))]"></div>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 text-center text-xs text-muted-foreground">
        <div className="mb-4 md:mb-0">
          <span>Designed & Built by Aniruddha Patil ✨</span>
        </div>
        <div className="flex items-center gap-4">
           <span>© {new Date().getFullYear()} Aniruddha Patil. All Rights Reserved.</span>
          <button onClick={scrollToTop} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <ArrowUp className="h-5 w-5" />
            <span className="sr-only">Scroll to top</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

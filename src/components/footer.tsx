import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer id="contact" className="w-full border-t bg-muted/40 py-12">
      <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 text-center md:grid-cols-3 md:px-6 md:text-left">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Aniruddha Patil</h3>
          <p className="text-sm text-muted-foreground">
            Full Stack Developer & ML Enthusiast
          </p>
          <div className="flex justify-center space-x-4 md:justify-start">
            <Link href="https://github.com/Aniruddha1701" aria-label="Github" target="_blank">
              <Github className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="https://linkedin.com/in/aniruddhapatil0593" aria-label="LinkedIn" target="_blank">
              <Linkedin className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
             <Link href="mailto:aniruddhap66@gmail.com" aria-label="Email" target="_blank">
              <Mail className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Get In Touch</h3>
          <p className="text-sm text-muted-foreground">
            Available for full-time opportunities from July 2025.
          </p>
           <p className="text-sm text-muted-foreground">
             Email: <a href="mailto:aniruddhap66@gmail.com" className="underline hover:text-foreground">aniruddhap66@gmail.com</a>
          </p>
           <p className="text-sm text-muted-foreground">
             Phone: +91 8469341792
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><Link href="#portfolio" className="hover:text-foreground">Portfolio</Link></li>
            <li><Link href="#skills" className="hover:text-foreground">Skills</Link></li>
            <li><Link href="#playground" className="hover:text-foreground">Playground</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-8 px-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aniruddha Patil. All Rights Reserved.
      </div>
    </footer>
  )
}

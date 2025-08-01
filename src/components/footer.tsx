import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer id="contact" className="w-full border-t bg-muted/40 py-12">
      <div className="container mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 text-center md:grid-cols-3 md:px-6 md:text-left">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Vizfolio</h3>
          <p className="text-sm text-muted-foreground">
            Interactive Portfolio by a Passionate Developer.
          </p>
          <div className="flex justify-center space-x-4 md:justify-start">
            <Link href="#" aria-label="Github">
              <Github className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Get In Touch</h3>
          <p className="text-sm text-muted-foreground">
            Have a project in mind or just want to say hi?
          </p>
          <form className="flex w-full max-w-sm mx-auto md:mx-0 space-x-2">
            <Input type="email" placeholder="your@email.com" />
            <Button type="submit">Send</Button>
          </form>
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
        © {new Date().getFullYear()} Vizfolio. All Rights Reserved.
      </div>
    </footer>
  )
}

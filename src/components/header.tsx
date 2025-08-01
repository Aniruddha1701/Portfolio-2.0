"use client"

import Link from "next/link"
import { CodeXml } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <CodeXml className="h-6 w-6 text-primary" />
          <span className="font-bold">Aniruddha Patil</span>
        </Link>
        <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
          <Link href="#portfolio" className="text-foreground/60 transition-colors hover:text-foreground/80">
            Portfolio
          </Link>
          <Link href="#skills" className="text-foreground/60 transition-colors hover:text-foreground/80">
            Skills
          </Link>
          <Link href="#playground" className="text-foreground/60 transition-colors hover:text-foreground/80">
            Playground
          </Link>
          <Link href="#contact" className="text-foreground/60 transition-colors hover:text-foreground/80">
            Contact
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

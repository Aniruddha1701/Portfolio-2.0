"use client"

import Link from "next/link"
import { CodeXml, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { Button } from "./ui/button"

const navLinks = [
  { href: "#journey", label: "The Journey" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#skills", label: "Skills" },
  { href: "#certifications", label: "Certifications" },
  { href: "#smart-lab", label: "Smart Lab" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-4 inset-x-0 max-w-5xl mx-auto z-50">
        <div className="relative flex h-16 items-center justify-between rounded-full border border-primary/10 bg-background/80 px-8 shadow-lg shadow-primary/5 backdrop-blur-md">
          <Link href="/" className="flex items-center space-x-2">
            <CodeXml className="h-6 w-6 text-primary" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center space-x-6 text-sm font-medium md:flex">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="group relative text-foreground/70 transition-colors hover:text-foreground">
                {link.label}
                <span className="absolute bottom-[-2px] left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-24 z-40 bg-background/95 backdrop-blur-lg">
          <nav className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-semibold text-foreground/80 transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

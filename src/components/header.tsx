
"use client"

import Link from "next/link"
import { CodeXml, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"

const navLinks = [
  { href: "#journey", label: "The Journey" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#skills", label: "Skills" },
  { href: "#certifications", label: "Certifications" },
  { href: "#smart-lab", label: "Smart Lab" },
  { href: "#contact", label: "Contact" },
]

const Clock = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatDateTime = (date: Date | null) => {
    if (!date) return { date: '', time: '' };
    const dateString = date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
     const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return { date: dateString, time: timeString };
  };

  const { date: formattedDate, time: formattedTime } = formatDateTime(time);

  return (
    <div className="hidden md:flex items-center justify-center text-xs font-mono text-muted-foreground gap-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full transition-all hover:shadow-md hover:shadow-primary/10">
      <span className="tabular-nums">{formattedDate}</span>
      <span className="text-primary/50">|</span>
      <span className="tabular-nums">{formattedTime}</span>
    </div>
  )
}


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

          <div className="flex items-center justify-end gap-4">
            <Clock />
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

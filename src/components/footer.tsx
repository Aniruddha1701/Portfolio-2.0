"use client"

import Link from "next/link"
import { ArrowUp, Mail, Github, Linkedin, MapPin } from "lucide-react"
import { ContactForm } from "./contact-form"
import { motion } from "framer-motion"

interface FooterProps {
  personalInfo?: any;
  socialLinks?: any;
}

export function Footer({ personalInfo, socialLinks }: FooterProps) {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer id="contact" className="relative w-full border-t border-primary/10 bg-muted/10 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.15),rgba(255,255,255,0))]"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-headline">
                Let's <span className="text-primary text-glow">Connect</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
                Have a project in mind or just want to chat? Feel free to reach out. I'm always open to discussing new opportunities.
              </p>
            </div>

            <div className="space-y-4">
              {personalInfo?.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span>{personalInfo.email}</span>
                </a>
              )}
              {personalInfo?.location && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks?.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass-effect border border-white/5 hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass-effect border border-white/5 hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span className="opacity-70">© {new Date().getFullYear()} {personalInfo?.name || 'Portfolio Owner'}. All Rights Reserved.</span>
          <button onClick={scrollToTop} className="p-2.5 rounded-full bg-gray-800/50 hover:bg-primary/20 border border-white/5 hover:border-primary/30 transition-all duration-300 group">
            <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
            <span className="sr-only">Scroll to top</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

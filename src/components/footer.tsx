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
    <footer id="contact" className="relative w-full overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-violet-950/10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-pink-500/6 blur-[100px]"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left Column - Info */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                </span>
                <span className="text-xs font-semibold text-violet-400 tracking-wide uppercase">Open to Connect</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 font-headline">
                Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Connect</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-md leading-relaxed">
                Have a project in mind or just want to chat? Feel free to reach out. I&apos;m always open to discussing new opportunities.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {personalInfo?.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/25 hover:bg-white/[0.04] transition-all duration-300 group"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/15 to-pink-500/10 border border-white/[0.06] group-hover:border-violet-500/20 transition-colors">
                    <Mail className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Email</div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{personalInfo.email}</span>
                  </div>
                </a>
              )}
              {personalInfo?.location && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-white/[0.06]">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Location</div>
                    <span className="text-sm text-gray-300">{personalInfo.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks?.github && (
                <motion.a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/25 hover:bg-white/[0.06] transition-all duration-300 group"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </motion.a>
              )}
              {socialLinks?.linkedin && (
                <motion.a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/25 hover:bg-white/[0.06] transition-all duration-300 group"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/[0.05]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <span className="text-gray-500">© {new Date().getFullYear()} {personalInfo?.name || 'Portfolio Owner'}. All Rights Reserved.</span>
              <span className="hidden md:block text-gray-700">·</span>
              <span className="text-gray-600 text-xs">Built with Next.js & ❤️</span>
            </div>
            <motion.button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.05] transition-all duration-300 group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="h-4 w-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
              <span className="sr-only">Scroll to top</span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}

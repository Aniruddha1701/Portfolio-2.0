"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  /* Dynamic Variables using standard shadcn/tailwind v4 tokens */
  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);
  
  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, var(--destructive) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--destructive) 80%, transparent)); }
  30% { transform: scale(1); }
}

@keyframes footer-gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes footer-pulse-ring {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes footer-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 30s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.animate-footer-gradient {
  background-size: 200% 200%;
  animation: footer-gradient-shift 4s ease infinite;
}

.animate-footer-float {
  animation: footer-float 6s ease-in-out infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    color-mix(in oklch, var(--primary) 25%, transparent) 0%, 
    color-mix(in oklch, var(--accent, var(--primary)) 15%, transparent) 30%, 
    color-mix(in oklch, var(--secondary) 10%, transparent) 50%, 
    transparent 70%
  );
}

/* Animated gradient line separator */
.footer-gradient-line {
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    hsl(var(--primary)) 20%, 
    hsl(var(--accent, var(--primary))) 50%, 
    hsl(var(--primary)) 80%, 
    transparent
  );
  background-size: 200% 100%;
  animation: footer-gradient-shift 3s ease infinite;
}

/* Action card with glow */
.footer-action-card {
  position: relative;
  background: linear-gradient(145deg, 
    color-mix(in oklch, var(--foreground) 5%, transparent) 0%, 
    color-mix(in oklch, var(--foreground) 2%, transparent) 100%);
  border: 1px solid color-mix(in oklch, var(--foreground) 10%, transparent);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.footer-action-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, 
    color-mix(in oklch, var(--foreground) 15%, transparent), 
    transparent 40%, 
    transparent 60%, 
    color-mix(in oklch, var(--primary) 30%, transparent));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s;
}

.footer-action-card:hover::before {
  opacity: 1;
}

.footer-action-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in oklch, var(--primary) 30%, transparent);
  box-shadow: 
    0 20px 60px -15px color-mix(in oklch, var(--primary) 20%, transparent),
    0 0 40px -10px color-mix(in oklch, var(--primary) 10%, transparent);
}

.footer-action-card .action-icon-ring {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-action-card:hover .action-icon-ring {
  box-shadow: 0 0 20px color-mix(in oklch, var(--primary) 40%, transparent);
  border-color: hsl(var(--primary));
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 22vw;
  line-height: 0.8;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1.5px color-mix(in oklch, var(--foreground) 6%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 12%, transparent) 0%, transparent 70%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Gradient Heading */
.footer-text-glow {
  background: linear-gradient(135deg, 
    hsl(var(--primary)) 0%, 
    var(--foreground) 40%, 
    hsl(var(--accent, var(--primary))) 70%, 
    hsl(var(--primary)) 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: footer-gradient-shift 5s ease infinite;
  filter: drop-shadow(0px 0px 30px color-mix(in oklch, var(--primary) 25%, transparent));
}

/* Floating orb */
.footer-orb {
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  position: absolute;
}

.footer-orb-1 {
  width: 300px; height: 300px;
  background: hsl(var(--primary) / 0.15);
  top: 20%; left: 10%;
  animation: footer-float 8s ease-in-out infinite;
}

.footer-orb-2 {
  width: 200px; height: 200px;
  background: hsl(var(--accent, var(--primary)) / 0.12);
  bottom: 30%; right: 15%;
  animation: footer-float 10s ease-in-out infinite reverse;
}

.footer-orb-3 {
  width: 150px; height: 150px;
  background: hsl(var(--primary) / 0.1);
  top: 50%; left: 50%;
  animation: footer-float 12s ease-in-out infinite 2s;
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Zero Dependency)
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    },[]);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. TYPES
// -------------------------------------------------------------------------
export interface CinematicFooterProps {
  personalInfo?: {
    name?: string;
    email?: string;
    location?: string;
    title?: string;
    bio?: string;
  };
  socialLinks?: {
    github?: string;
    linkedin?: string;
  };
}

// -------------------------------------------------------------------------
// 4. MAIN COMPONENT — customized for portfolio
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Full-Stack Developer</span> <span className="text-primary/60">✦</span>
    <span>Next.js & React</span> <span className="text-secondary/60">✦</span>
    <span>TypeScript Expert</span> <span className="text-primary/60">✦</span>
    <span>UI/UX Engineering</span> <span className="text-secondary/60">✦</span>
    <span>Open to Opportunities</span> <span className="text-primary/60">✦</span>
    <span>Cloud & DevOps</span> <span className="text-secondary/60">✦</span>
    <span>MongoDB & Databases</span> <span className="text-primary/60">✦</span>
  </div>
);

export function CinematicFooter({ personalInfo, socialLinks }: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const ownerName = personalInfo?.name || "Aniruddha";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  },[]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box. 
      */}
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground cinematic-footer-wrapper">
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[80vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[100px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />
          
          {/* Floating Orbs */}
          <div className="footer-orb footer-orb-1" />
          <div className="footer-orb footer-orb-2" />
          <div className="footer-orb footer-orb-3" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            {ownerName.toUpperCase()}
          </div>

          {/* Top gradient separator */}
          <div className="footer-gradient-line w-full mt-4" />

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 w-full max-w-6xl mx-auto">
            
            {/* Subtitle */}
            <div className="text-muted-foreground text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-4 opacity-70">Ready to build something amazing?</div>
            
            <h2
              ref={headingRef}
              className="text-6xl md:text-9xl font-black footer-text-glow tracking-tighter mb-10 text-center leading-none"
            >
              Let&apos;s Connect
            </h2>

            {/* Interactive Action Cards */}
            <div ref={linksRef} className="flex flex-col items-center gap-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
                {socialLinks?.github && (
                  <MagneticButton as="a" href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="footer-action-card px-8 py-7 flex flex-col items-center gap-4 group text-center">
                    <div className="action-icon-ring w-14 h-14 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center bg-background/50">
                      <svg className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-foreground font-bold text-sm md:text-base">GitHub</div>
                      <div className="text-muted-foreground text-xs mt-1">View my code</div>
                    </div>
                    <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </MagneticButton>
                )}
                
                {socialLinks?.linkedin && (
                  <MagneticButton as="a" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="footer-action-card px-8 py-7 flex flex-col items-center gap-4 group text-center">
                    <div className="action-icon-ring w-14 h-14 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center bg-background/50">
                      <svg className="w-6 h-6 text-muted-foreground group-hover:text-[#0A66C2] transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-foreground font-bold text-sm md:text-base">LinkedIn</div>
                      <div className="text-muted-foreground text-xs mt-1">Let&apos;s connect</div>
                    </div>
                    <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </MagneticButton>
                )}

                {personalInfo?.email && (
                  <MagneticButton as="a" href={`mailto:${personalInfo.email}`} className="footer-action-card px-8 py-7 flex flex-col items-center gap-4 group text-center">
                    <div className="action-icon-ring w-14 h-14 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center bg-background/50">
                      <svg className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-foreground font-bold text-sm md:text-base">Email</div>
                      <div className="text-muted-foreground text-xs mt-1">Get in touch</div>
                    </div>
                    <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </MagneticButton>
                )}
              </div>

              {/* Navigation Pills */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full mt-2">
                {["Home", "About", "Skills", "Portfolio", "Certifications"].map((item) => (
                  <MagneticButton key={item} as="a" href={`#${item.toLowerCase()}`} className="footer-glass-pill px-6 py-3 rounded-full text-muted-foreground font-medium text-xs md:text-sm hover:text-foreground">
                    {item}
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* Marquee Ticker — bottom position */}
          <div className="relative w-full overflow-hidden border-y border-primary/20 bg-primary/5 backdrop-blur-md py-5 z-10 -rotate-1 scale-105 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
            <div className="flex w-max animate-footer-scroll-marquee text-sm md:text-base font-black tracking-[0.25em] text-primary/70 uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div className="text-muted-foreground text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1">
              © {new Date().getFullYear()} {ownerName}. All rights reserved.
            </div>

            {/* "Made with Love" Badge */}
            <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-border/50">
              <span className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest">Built with</span>
              <span className="animate-footer-heartbeat text-sm md:text-base text-destructive">❤</span>
              <span className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest">&</span>
              <span className="text-foreground font-black text-xs md:text-sm tracking-normal ml-1">Next.js</span>
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground group order-3"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}

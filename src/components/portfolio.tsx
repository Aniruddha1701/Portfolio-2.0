"use client"

import React, { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Github, Globe, Sparkles, ArrowUpRight, Code2, Layers, Zap, Rocket, ExternalLink } from "lucide-react"
import { useRef } from "react"

interface Project {
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  image?: string;
}

interface PortfolioProps {
  projects?: Project[];
}

// Project color schemes based on type
const getProjectColors = (title: string, technologies: string[]) => {
  const titleLower = title.toLowerCase();
  const techString = technologies.join(' ').toLowerCase();

  if (titleLower.includes('health') || titleLower.includes('care'))
    return { primary: '#3B82F6', secondary: '#10B981', accent: '#06B6D4' };
  if (titleLower.includes('food') || titleLower.includes('gourmet') || titleLower.includes('recipe'))
    return { primary: '#F59E0B', secondary: '#EF4444', accent: '#F97316' };
  if (titleLower.includes('ai') || titleLower.includes('imagin') || techString.includes('ai'))
    return { primary: '#8B5CF6', secondary: '#EC4899', accent: '#A855F7' };
  if (titleLower.includes('wildlife') || titleLower.includes('conservation') || titleLower.includes('nature'))
    return { primary: '#10B981', secondary: '#06B6D4', accent: '#14B8A6' };
  if (techString.includes('react') || techString.includes('next'))
    return { primary: '#61DAFB', secondary: '#3B82F6', accent: '#818CF8' };
  if (techString.includes('python'))
    return { primary: '#3776AB', secondary: '#FFD43B', accent: '#306998' };

  return { primary: '#8B5CF6', secondary: '#EC4899', accent: '#06B6D4' };
};

const ProjectLogo = ({ title, colors, index }: { title: string, colors: { primary: string, secondary: string }, index: number }) => {
  // Generate logo based on project title
  if (title.includes("CarePlus")) {
    return (
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1, rotateY: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute -inset-1 rounded-xl blur-lg opacity-60"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
        />
        <div className="relative w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br border border-white/20"
          style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`careplus-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill={`url(#careplus-gradient-${index})`} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        </div>
      </motion.div>
    );
  } else if (title.includes("GourmetGenie")) {
    return (
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1, rotateY: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute -inset-1 rounded-xl blur-lg opacity-60"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
        />
        <div className="relative w-14 h-14 rounded-xl flex items-center justify-center border border-white/20"
          style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`gourmet-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill={`url(#gourmet-gradient-${index})`} d="M12,1C8.2,1,5.2,2.8,3.6,5.6C2,8.4,2.2,11.8,4.2,14.4l-1.5,4.7l4.7-1.5c2.6,2,6,2.2,8.8,0.6c2.8-1.6,4.6-4.6,4.6-8.4c0-4.9-3.9-8.9-8.8-8.9L12,1z M13,11h-2V6h2V11z M13,14h-2v-2h2V14z" />
          </svg>
        </div>
      </motion.div>
    );
  } else if (title.includes("ImaginAI")) {
    return (
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1, rotateY: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute -inset-1 rounded-xl blur-lg opacity-60"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
        />
        <div className="relative w-14 h-14 rounded-xl flex items-center justify-center border border-white/20"
          style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)` }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <linearGradient id={`imaginai-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill={`url(#imaginai-gradient-${index})`} d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </motion.svg>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1, rotateY: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute -inset-1 rounded-xl blur-lg opacity-60"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
        />
        <div className="relative w-14 h-14 rounded-xl flex items-center justify-center border border-white/20"
          style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)` }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <defs>
              <linearGradient id={`default-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill={`url(#default-gradient-${index})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </motion.svg>
        </div>
      </motion.div>
    );
  }
};

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  }
};

// Project Card Component
const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const colors = getProjectColors(project.title, project.technologies || []);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  const spotlightX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), { stiffness: 200, damping: 30 });
  const spotlightY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), { stiffness: 200, damping: 30 });

  return (
    <motion.div
      variants={cardVariants}
      className="h-full group"
    >
      <motion.div
        ref={cardRef}
        className="relative h-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <Card className="relative h-full min-h-[360px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a12] hover:border-white/[0.12] transition-all duration-500">
          {/* Left accent stripe */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-500 group-hover:w-1.5"
            style={{ background: `linear-gradient(180deg, ${colors.primary}, ${colors.secondary})` }}
          />

          {/* Mouse-following spotlight gradient */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: useTransform(
                [spotlightX, spotlightY],
                ([x, y]) => `radial-gradient(600px circle at ${x}% ${y}%, ${colors.primary}12, transparent 50%)`
              ),
            }}
          />

          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay'
          }} />

          <div className="relative p-6 md:p-8 flex flex-col h-full z-10 pl-8">
            {/* Header — project number + logo + title */}
            <div className="flex items-start gap-4 mb-5">
              {/* Numbered badge */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}08)`,
                  borderColor: isHovered ? `${colors.primary}40` : 'rgba(255,255,255,0.06)',
                  color: colors.primary,
                  boxShadow: isHovered ? `0 0 25px ${colors.primary}20` : 'none',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="flex-1 min-w-0">
                <motion.h3
                  className="text-xl md:text-2xl font-bold leading-tight text-white mb-1"
                  style={{
                    backgroundImage: isHovered ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'none',
                    WebkitBackgroundClip: isHovered ? 'text' : 'unset',
                    WebkitTextFillColor: isHovered ? 'transparent' : 'white',
                    transition: 'all 0.5s ease',
                  }}
                >
                  {project.title}
                </motion.h3>

                {/* Colored underline that expands on hover */}
                <motion.div
                  className="h-0.5 rounded-full origin-left"
                  style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
                  initial={{ scaleX: 0.3, opacity: 0.5 }}
                  animate={{ scaleX: isHovered ? 1 : 0.3, opacity: isHovered ? 1 : 0.5 }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm md:text-[15px] text-gray-400 leading-relaxed line-clamp-3 mb-6">
              {project.description}
            </p>

            {/* Tech tags — frosted glass pills with glow border */}
            <div className="flex flex-wrap gap-2 mb-auto">
              {project.technologies?.slice(0, 4).map((tag, tagIndex) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tagIndex * 0.06, duration: 0.3 }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 cursor-default"
                  style={{
                    background: isHovered ? `${colors.primary}10` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isHovered ? colors.primary + '30' : 'rgba(255,255,255,0.06)'}`,
                    color: isHovered ? colors.primary : '#9ca3af',
                  }}
                >
                  {tag}
                </motion.span>
              ))}
              {project.technologies && project.technologies.length > 4 && (
                <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-500">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            {/* Footer — action buttons */}
            <div className="flex gap-3 pt-5 mt-5 border-t border-white/[0.05]">
              {project.liveUrl && project.liveUrl !== '#' && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-400 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    boxShadow: `0 4px 20px ${colors.primary}30`,
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: `0 8px 30px ${colors.primary}50`,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Globe className="w-4 h-4" />
                  Live Demo
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </motion.a>
              )}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 text-gray-300 hover:text-white"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isHovered ? colors.primary + '25' : 'rgba(255,255,255,0.08)'}`,
                  }}
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Github className="w-4 h-4" />
                  Source
                </motion.a>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const PortfolioComponent = ({ projects = [] }: PortfolioProps) => {
  const [filter, setFilter] = useState("all")

  const displayProjects = projects || [];

  const allTags = Array.from(new Set(
    displayProjects.flatMap(project => project.technologies || [])
  ));

  const filteredProjects = filter === "all"
    ? displayProjects
    : displayProjects.filter(project =>
      project.technologies?.some(tag =>
        tag.toLowerCase() === filter.toLowerCase()
      )
    );

  return (
    <div id="portfolio" className="container px-4 md:px-6 relative">
      {/* Background aurora */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-violet-500/[0.04] rounded-full blur-[150px]"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[120px]"
          animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* Section Header */}
      <motion.div
        className="flex flex-col items-center justify-center text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full blur-xl opacity-40" />
          <div className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/15 to-cyan-500/15 border border-violet-500/25 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <Layers className="w-4 h-4 text-violet-400" />
            </motion.div>
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="text-white">My </span>
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
              Work
            </span>
            {/* Curvy underline SVG */}
            <motion.svg
              className="absolute -bottom-6 left-0 w-full overflow-visible z-0"
              viewBox="0 0 200 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.2 }}
            >
              <motion.path
                d="M 0 10 Q 50 -5 100 10 T 200 10"
                stroke="url(#gradient-portfolio-line)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient-portfolio-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </motion.svg>
          </span>
        </motion.h2>

        <motion.p
          className="max-w-[650px] text-gray-400 md:text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          A curated collection of projects showcasing{" "}
          <span className="text-violet-400 font-medium">innovation</span>,{" "}
          <span className="text-purple-400 font-medium">creativity</span>, and{" "}
          <span className="text-cyan-400 font-medium">technical excellence</span>
        </motion.p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-12"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.button
          onClick={() => setFilter("all")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${filter === "all"
              ? "bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/25"
              : "bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:bg-white/[0.08] hover:text-white"
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All
        </motion.button>
        {allTags.slice(0, 8).map((tag) => (
          <motion.button
            key={tag}
            onClick={() => setFilter(tag.toLowerCase())}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${filter === tag.toLowerCase()
                ? "bg-gradient-to-r from-violet-500/80 to-cyan-500/80 text-white shadow-md"
                : "bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-gray-300"
              }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {tag}
          </motion.button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <motion.div
          className="grid gap-6 md:gap-8 md:grid-cols-2 max-w-[1200px] mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center p-16 border border-dashed border-white/[0.08] rounded-3xl bg-white/[0.02]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.08]">
            <Layers className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/40 text-lg">No projects found for this filter</p>
        </motion.div>
      )}
    </div>
  )
}

export const Portfolio = React.memo(PortfolioComponent)


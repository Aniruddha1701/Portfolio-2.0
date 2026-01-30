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

const ProjectLogo = ({ title, colors }: { title: string, colors: { primary: string, secondary: string } }) => {
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
              <linearGradient id="careplus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill="url(#careplus-gradient)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
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
              <linearGradient id="gourmet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill="url(#gourmet-gradient)" d="M12,1C8.2,1,5.2,2.8,3.6,5.6C2,8.4,2.2,11.8,4.2,14.4l-1.5,4.7l4.7-1.5c2.6,2,6,2.2,8.8,0.6c2.8-1.6,4.6-4.6,4.6-8.4c0-4.9-3.9-8.9-8.8-8.9L12,1z M13,11h-2V6h2V11z M13,14h-2v-2h2V14z" />
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
              <linearGradient id="imaginai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill="url(#imaginai-gradient)" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
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
              <linearGradient id={`default-gradient-${title}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill={`url(#default-gradient-${title})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      variants={cardVariants}
      className="h-full group"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        className="relative h-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute -inset-2 rounded-[28px] blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at center, ${colors.primary}40, ${colors.secondary}20, transparent 70%)`,
          }}
        />

        {/* Animated border gradient */}
        <div className="absolute -inset-[2px] rounded-[26px] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, ${colors.primary}60, ${colors.secondary}60, ${colors.accent}60, ${colors.primary}60)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-[2px] rounded-3xl bg-[#0c0c12]" />
        </div>

        {/* Card inner */}
        <Card className="relative h-full min-h-[320px] overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-[#111118] via-[#0e0e14] to-[#0a0a10]">
          {/* Aurora background */}
          <div className="absolute inset-0 opacity-40 overflow-hidden">
            <motion.div
              className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-[60px]"
              style={{ background: colors.primary }}
              animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-[50px]"
              style={{ background: colors.secondary }}
              animate={{ x: [0, -15, 0], y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>

          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)`,
              backgroundSize: '200% 100%',
            }}
            animate={isHovered ? { backgroundPosition: ['100% 0%', '-100% 0%'] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Top highlight */}
          <div
            className="absolute top-0 left-6 right-6 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}50, ${colors.secondary}50, transparent)` }}
          />

          <div className="relative p-6 flex flex-col h-full z-10">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <ProjectLogo title={project.title} colors={colors} />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold leading-tight text-white group-hover:text-transparent group-hover:bg-clip-text transition-all duration-500 line-clamp-2"
                  style={{
                    backgroundImage: isHovered ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'none'
                  }}
                >
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-5">
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mb-auto">
              {project.technologies?.slice(0, 4).map((tag, tagIndex) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: tagIndex * 0.05, duration: 0.3 }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-300 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 cursor-default"
                  style={{
                    boxShadow: isHovered ? `0 0 12px ${colors.primary}15` : 'none'
                  }}
                >
                  {tag}
                </motion.span>
              ))}
              {project.technologies && project.technologies.length > 4 && (
                <span className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-500">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-4 border-t border-white/[0.06] mt-4">
              {project.liveUrl && project.liveUrl !== '#' && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)`,
                    border: `1px solid ${colors.primary}25`,
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 0 25px ${colors.primary}20`
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Globe className="w-4 h-4" style={{ color: colors.primary }} />
                  <span className="bg-gradient-to-r bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
                  >
                    Live Demo
                  </span>
                </motion.a>
              )}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-white/[0.03] border border-white/[0.08] text-gray-300 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className="w-4 h-4" />
                  <span>Source</span>
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
              Work
            </span>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            />
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
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${filter === "all"
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === tag.toLowerCase()
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


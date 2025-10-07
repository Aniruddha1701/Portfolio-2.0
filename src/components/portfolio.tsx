"use client"

import React, { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Github, Globe } from "lucide-react"

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

// No default projects - all data must come from MongoDB

const ProjectLogo = ({ title }: { title: string }) => {
  // Generate logo based on project title
  if (title.includes("CarePlus")) {
    return (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="careplus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#10B981', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          <path fill="url(#careplus-gradient)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
      </motion.div>
    );
  } else if (title.includes("GourmetGenie")) {
    return (
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="gourmet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#F59E0B', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#EF4444', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          <path fill="url(#gourmet-gradient)" d="M12,1C8.2,1,5.2,2.8,3.6,5.6C2,8.4,2.2,11.8,4.2,14.4l-1.5,4.7l4.7-1.5c2.6,2,6,2.2,8.8,0.6c2.8-1.6,4.6-4.6,4.6-8.4c0-4.9-3.9-8.9-8.8-8.9L12,1z M13,11h-2V6h2V11z M13,14h-2v-2h2V14z"/>
        </svg>
      </motion.div>
    );
  } else if (title.includes("ImaginAI")) {
    return (
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="imaginai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#8B5CF6', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#EC4899', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          <path fill="url(#imaginai-gradient)" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="default-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#06B6D4', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#10B981', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          <path fill="url(#default-gradient)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </motion.div>
    );
  }
};

const PortfolioComponent = ({ projects = [] }: PortfolioProps) => {
  const [filter, setFilter] = useState("all")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  // Use only data from MongoDB - no fallbacks
  const displayProjects = projects || [];

  // Extract unique tags from all projects
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
    <div className="container px-4 md:px-6">
      <motion.div 
        className="flex flex-col items-center justify-center space-y-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gradient">My Work</h2>
        <p className="text-muted-foreground md:text-xl max-w-2xl">
          Here's a selection of projects I've worked on. Use the filters to explore different categories.
        </p>
      </motion.div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        {allTags.slice(0, 8).map((tag) => (
          <Button
            key={tag}
            variant={filter === tag.toLowerCase() ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tag.toLowerCase())}
          >
            {tag}
          </Button>
        ))}
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: [0.25, 1, 0.5, 1]
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Card className="group h-full overflow-hidden glass-effect hover-lift card-hover-effect relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="flex-shrink-0"
                      animate={{ 
                        rotate: hoveredIndex === index ? 360 : 0,
                        scale: hoveredIndex === index ? 1.1 : 1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <ProjectLogo title={project.title} />
                    </motion.div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-4 relative z-10">
                <motion.p 
                  className="text-sm text-muted-foreground line-clamp-3"
                  animate={{ 
                    x: hoveredIndex === index ? [0, -2, 2, -2, 0] : 0 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {project.description}
                </motion.p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies?.slice(0, 5).map((tag, tagIndex) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + tagIndex * 0.05,
                        duration: 0.3
                      }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-default hover:scale-110"
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                  {project.technologies && project.technologies.length > 5 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{project.technologies.length - 5}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-2 relative z-10">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="sm" variant="outline" asChild className="w-full group/btn">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-3 w-3 group-hover/btn:animate-pulse" />
                        Live Demo
                      </a>
                    </Button>
                  </motion.div>
                )}
                {project.githubUrl && (
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="sm" variant="outline" asChild className="w-full group/btn">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-3 w-3 group-hover/btn:rotate-12 transition-transform" />
                        Source
                      </a>
                    </Button>
                  </motion.div>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export const Portfolio = React.memo(PortfolioComponent)

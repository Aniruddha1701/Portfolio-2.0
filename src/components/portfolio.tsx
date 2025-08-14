
"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Image from "next/image"
import { Leaf } from "lucide-react"

const projects = [
  {
    title: "CarePlus - Healthcare Management System",
    description: "A comprehensive healthcare platform for patient management, appointment scheduling, and secure data handling, built with HIPAA compliance in mind.",
    logo: (
        <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id="careplus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#10B981', stopOpacity: 1}} />
                    </linearGradient>
                </defs>
                <path fill="url(#careplus-gradient)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
        </motion.div>
    ),
    tags: ["Web App", "Healthcare", "React.js", "Appwrite"],
    liveUrl: "https://careplus-demo.vercel.app",
    sourceUrl: "https://github.com/Aniruddha1701/careplus",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba9996a?q=80&w=600&h=400&auto=format&fit=crop",
    imageHint: "healthcare doctor",
  },
  {
    title: "GourmetGenie - AI-Powered Food Recommendation System",
    description: "An AI-driven food suggestion engine using LightGBM and KNN to provide personalized recommendations based on user preferences and eating habits.",
    logo: (
        <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id="gourmet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#F59E0B', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#EF4444', stopOpacity: 1}} />
                    </linearGradient>
                </defs>
                <path fill="url(#gourmet-gradient)" d="M12,1C8.2,1,5.2,2.8,3.6,5.6C2,8.4,2.2,11.8,4.2,14.4l-1.5,4.7l4.7-1.5c2.6,2,6,2.2,8.8,0.6c2.8-1.6,4.6-4.6,4.6-8.4c0-4.9-3.9-8.9-8.8-8.9L12,1z M13,11h-2V6h2V11z M13,14h-2v-2h2V14z"/>
            </svg>
        </motion.div>
    ),
    tags: ["AI", "Python", "Streamlit", "Django"],
    liveUrl: "https://gourmetgenie-demo.streamlit.app",
    sourceUrl: "https://github.com/Aniruddha1701/gourmetgenie",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=600&h=400&auto=format&fit=crop",
    imageHint: "delicious food",
  },
  {
    title: "ImaginAI - Text-to-Image Generator",
    description: "An open-source text-to-image generator using Stability AI, featuring a responsive interface and secure API management for real-time image creation.",
    logo: (
        <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id="imaginai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#8B5CF6', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#EC4899', stopOpacity: 1}} />
                    </linearGradient>
                </defs>
                <path fill="url(#imaginai-gradient)" d="M21.5,2h-19C1.1,2,0,3.1,0,4.5v15C0,20.9,1.1,22,2.5,22h19c1.4,0,2.5-1.1,2.5-2.5v-15C24,3.1,22.9,2,21.5,2z M6,16l-3-3l3-3L9,13L6,16z M10,18l-3-3l6-6l3,3L10,18z M18,8l-3,3l-3-3L15,5L18,8z"/>
            </svg>
        </motion.div>
    ),
    tags: ["AI", "Tooling", "React.js", "Stability AI"],
    liveUrl: "https://image-generator-aniruddha1701.vercel.app/settings",
    sourceUrl: "https://github.com/Aniruddha1701/imaginai",
    image: "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?q=80&w=600&h=400&auto=format&fit=crop",
    imageHint: "abstract art",
  },
  {
    title: "Wildlife Conservation Platform",
    description: "An educational platform designed to raise awareness and provide information about wildlife conservation efforts and species protection.",
    logo: (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id="wildlife-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#22C55E', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#FBBF24', stopOpacity: 1}} />
                    </linearGradient>
                </defs>
                <path fill="url(#wildlife-gradient)" d="M20.5,10.6c-1.2-1.2-2.8-1.9-4.5-1.9c-1.7,0-3.3,0.7-4.5,1.9c-1.2,1.2-1.9,2.8-1.9,4.5c0,1.7,0.7,3.3,1.9,4.5c1.2,1.2,2.8,1.9,4.5,1.9s3.3-0.7,4.5-1.9c1.2-1.2,1.9-2.8,1.9-4.5C22.4,13.4,21.7,11.8,20.5,10.6z M12.5,4.2V2.5C12.5,2.2,12.3,2,12,2s-0.5,0.2-0.5,0.5V4.2c-3.5,0.6-6.4,3.5-7,7H2.5C2.2,11.2,2,11.4,2,11.7s0.2,0.5,0.5,0.5H5c0.6,3.5,3.5,6.4,7,7v2.5c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V21c3.5-0.6,6.4-3.5,7-7h2.5c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5H19C18.4,7.7,15.5,4.8,12.5,4.2z"/>
            </svg>
        </motion.div>
    ),
    tags: ["Web App", "Education"],
    liveUrl: "#",
    sourceUrl: "#",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=600&h=400&auto=format&fit=crop",
    imageHint: "wildlife elephant",
  },
];

const categories = ["All", "Web App", "AI", "Healthcare", "Python", "Streamlit", "Tooling", "React.js", "Education", "Appwrite", "Django", "Stability AI"];

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <motion.h2 
      className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
)

const SectionDescription = ({ children }: { children: React.ReactNode }) => (
    <motion.p 
      className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {children}
    </motion.p>
)

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.tags.includes(activeFilter));

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <SectionTitle>My Work</SectionTitle>
          <SectionDescription>
            Here's a selection of projects I've worked on. Use the filters to explore different categories.
          </SectionDescription>
        </div>
      </div>
      <div className="my-8 flex justify-center">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "secondary"}
              onClick={() => setActiveFilter(category)}
              className="transition-all hover:scale-105"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <motion.div 
        layout
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        style={{ perspective: 1000 }}
      >
        {filteredProjects.map((project, i) => (
          <motion.div
            key={project.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -10, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="flex flex-col overflow-hidden h-full bg-card/50 border-primary/10 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg group">
                  <Image
                    src={project.image}
                    alt={project.title}
                    data-ai-hint={project.imageHint}
                    width={600}
                    height={400}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                     <div className="text-6xl transition-transform duration-500 group-hover:scale-125">{project.logo}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle>{project.title}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </CardContent>
              <CardFooter className="flex justify-start gap-2 p-6 pt-0">
                <Button asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>
                </Button>
                <Button asChild variant="outline">
                  <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">Source Code</a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

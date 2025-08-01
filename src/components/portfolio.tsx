"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const projects = [
  {
    title: "CarePlus - Healthcare Management System",
    description: "A comprehensive healthcare platform for patient management, appointment scheduling, and secure data handling, built with HIPAA compliance in mind.",
    image: "https://placehold.co/600x400.png",
    tags: ["Web App", "Healthcare", "React.js"],
    liveUrl: "https://care-plus-lyart.vercel.app/",
    sourceUrl: "https://github.com/Aniruddha1701/careplus",
    aiHint: "healthcare dashboard",
  },
  {
    title: "GourmetGenie - AI-Powered Food Recommendation System",
    description: "An AI-driven food suggestion engine using LightGBM and KNN to provide personalized recommendations based on user preferences and eating habits.",
    image: "https://placehold.co/600x400.png",
    tags: ["AI", "Python", "Streamlit"],
    liveUrl: "https://gourmetgenie-demo.streamlit.app",
    sourceUrl: "https://github.com/Aniruddha1701/gourmetgenie",
    aiHint: "food recommendation",
  },
  {
    title: "ImaginAI - Text-to-Image Generator",
    description: "An open-source text-to-image generator using Stability AI, featuring a responsive interface and secure API management for real-time image creation.",
    image: "https://placehold.co/600x400.png",
    tags: ["AI", "Tooling", "React.js"],
    liveUrl: "https://image-generator-aniruddha1701.vercel.app/settings",
    sourceUrl: "https://github.com/Aniruddha1701/imaginai",
    aiHint: "ai art",
  },
  {
    title: "Wildlife Conservation Platform",
    description: "An educational platform designed to raise awareness and provide information about wildlife conservation efforts and species protection.",
    image: "https://placehold.co/600x400.png",
    tags: ["Web App", "Education"],
    liveUrl: "#",
    sourceUrl: "#",
    aiHint: "wildlife nature",
  },
];

const categories = ["All", "Web App", "AI", "Healthcare", "Python", "Streamlit", "Tooling", "React.js", "Education"];

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


export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.tags.includes(activeFilter));

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">My Work</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Here's a selection of projects I've worked on. Use the filters to explore different categories.
          </p>
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
            whileHover={{ y: -10, scale: 1.05, rotateZ: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="flex flex-col overflow-hidden h-full bg-card/50 border-primary/10 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image src={project.image} alt={project.title} fill objectFit="cover" className="transition-transform duration-500 group-hover:scale-105" data-ai-hint={project.aiHint} />
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

"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    title: "AI-Powered E-commerce Platform",
    description: "A modern e-commerce site with personalized recommendations and a smart search engine.",
    image: "https://placehold.co/600x400.png",
    tags: ["Web App", "AI"],
    liveUrl: "#",
    sourceUrl: "#",
    aiHint: "online shopping",
  },
  {
    title: "Interactive Data Visualization Dashboard",
    description: "A web-based dashboard for visualizing complex datasets with interactive charts and maps.",
    image: "https://placehold.co/600x400.png",
    tags: ["Web App"],
    liveUrl: "#",
    sourceUrl: "#",
    aiHint: "dashboard analytics",
  },
  {
    title: "Cross-Platform Mobile Fitness App",
    description: "A fitness tracking application for iOS and Android with social features and workout plans.",
    image: "https://placehold.co/600x400.png",
    tags: ["Mobile"],
    liveUrl: "#",
    sourceUrl: "#",
    aiHint: "fitness app",
  },
  {
    title: "AI Code Assistant",
    description: "An intelligent assistant integrated into the IDE to help developers write better code faster.",
    image: "https://placehold.co/600x400.png",
    tags: ["AI", "Tooling"],
    liveUrl: "#",
    sourceUrl: "#",
    aiHint: "code editor",
  },
    {
    title: "Real-time Collaborative Whiteboard",
    description: "A web application that allows teams to collaborate in real-time on a shared digital whiteboard.",
    image: "https://placehold.co/600x400.png",
    tags: ["Web App"],
    liveUrl: "#",
    sourceUrl: "#",
    aiHint: "team collaboration",
  },
  {
    title: "Mobile AR Experience",
    description: "An augmented reality mobile app that brings digital content into the real world.",
    image: "https://placehold.co/600x400.png",
    tags: ["Mobile", "AR"],
    liveUrl: "#",
    sourceUrl: "#",
    aiHint: "augmented reality",
  },
];

const categories = ["All", "Web App", "Mobile", "AI", "Tooling", "AR"];

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.tags.includes(activeFilter));

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">My Work</h2>
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
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.title} className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2">
            <CardHeader>
              <div className="relative h-48 w-full">
                <Image src={project.image} alt={project.title} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint={project.aiHint} />
              </div>
              <CardTitle className="pt-4">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-start gap-2">
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>
              </Button>
              <Button asChild variant="outline">
                <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">Source Code</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

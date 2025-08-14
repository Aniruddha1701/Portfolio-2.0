"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Building, Calendar } from "lucide-react";

const certifications = [
  {
    title: "Google Cloud Certified - Professional Cloud Developer",
    issuer: "Google Cloud",
    date: "Issued Aug 2023",
    logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256">
            <defs>
                <linearGradient id="google-cloud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#4285F4'}} />
                    <stop offset="50%" style={{stopColor: '#34A853'}} />
                    <stop offset="100%" style={{stopColor: '#FBBC05'}} />
                </linearGradient>
            </defs>
            <g fill="url(#google-cloud-gradient)">
                <path d="M209.1,120.3c0-7.3-0.6-14.5-1.9-21.3H132.4v40.2h43.1c-1.8,13-7.5,24.2-16.8,31.7c-9.3,7.5-21.7,11.9-36.4,11.9 c-27.5,0-50-22.5-50-50s22.5-50,50-50c15.2,0,28.8,6.2,38.6,15.4l30.2-30.2C182.2,37,158.6,24.3,132.4,24.3 C81.3,24.3,40.7,64.9,40.7,116s40.5,91.7,91.7,91.7c26.2,0,48.8-8.7,65.2-25.2c16.8-16.8,25.2-39.2,25.2-66.2V120.3z"/>
            </g>
        </svg>
    ),
  },
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    date: "Issued Jun 2023",
    logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
             <defs>
                <linearGradient id="aws-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#FF9900'}} />
                    <stop offset="100%" style={{stopColor: '#232F3E'}} />
                </linearGradient>
            </defs>
            <path fill="url(#aws-gradient)" d="M12.3,9.3c0,0-0.5-0.1-1.1-0.1c-1.3,0-2.3,0.4-2.9,1.2c-0.6,0.8-0.9,1.9-0.9,3.3c0,2.1,0.8,3.7,2.3,4.6 c1.5,0.9,3.4,1.4,5.7,1.4c2,0,3.6-0.3,4.8-0.8l0.1-0.5c0,0-0.4,0.2-1.2,0.4c-1.2,0.3-2.4,0.4-3.5,0.4c-2.4,0-4.3-0.5-5.5-1.4 c-1.2-0.9-1.8-2.3-1.8-4.1c0-1.2,0.3-2.3,0.8-3.1s1.3-1.3,2.4-1.3c0.9,0,1.7,0.1,2.5,0.4c0.8,0.3,1.3,0.5,1.3,0.5L12.3,9.3z M19.4,7.2C18.2,6.1,16.6,5.5,14.6,5.5c-2.4,0-4.3,0.5-5.6,1.4C7.8,7.8,7.1,9.2,7.1,11c0,1.8,0.7,3.3,2.1,4.4 c1.4,1.1,3.3,1.7,5.7,1.7c2.4,0,4.3-0.5,5.6-1.4c1.3-0.9,2-2.3,2-4.1c0-1.8-0.7-3.3-2.1-4.4L19.4,7.2z"/>
        </svg>
    ),
  },
   {
    title: "Certified Kubernetes Application Developer (CKAD)",
    issuer: "The Linux Foundation",
    date: "Issued Dec 2023",
    logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
             <defs>
                <linearGradient id="k8s-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#326CE5'}} />
                    <stop offset="100%" style={{stopColor: '#00BFFF'}} />
                </linearGradient>
            </defs>
            <path fill="url(#k8s-gradient)" d="M12,2L2,7l10,5l10-5L12,2z M2,17l10,5l10-5l-10-5L2,17z M12,14.47L4.9,11L12,7.53L19.1,11L12,14.47z"/>
        </svg>
    ),
  },
];

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

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
};

export function Certifications() {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <SectionTitle>My Certifications</SectionTitle>
          <SectionDescription>
            A collection of my professional certifications and credentials.
          </SectionDescription>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full flex flex-col p-6 bg-card/50 border-primary/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/15">
              <CardHeader className="p-0 flex flex-row items-center gap-4">
                <div className="flex-shrink-0">
                  {cert.logo}
                </div>
                <CardTitle className="text-lg leading-tight">{cert.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-4 flex-grow flex flex-col justify-end">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Building className="h-4 w-4" />
                  <span>{cert.issuer}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{cert.date}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

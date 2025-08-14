"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar } from "lucide-react";

const certifications = [
  {
    title: "Google Cloud Certified - Professional Cloud Developer",
    issuer: "Google Cloud",
    date: "Issued Aug 2023",
    logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256">
            <g fill="#4285F4">
                <path d="M209.1,120.3c0-7.3-0.6-14.5-1.9-21.3H132.4v40.2h43.1c-1.8,13-7.5,24.2-16.8,31.7c-9.3,7.5-21.7,11.9-36.4,11.9 c-27.5,0-50-22.5-50-50s22.5-50,50-50c15.2,0,28.8,6.2,38.6,15.4l30.2-30.2C182.2,37,158.6,24.3,132.4,24.3 C81.3,24.3,40.7,64.9,40.7,116s40.5,91.7,91.7,91.7c26.2,0,48.8-8.7,65.2-25.2c16.8-16.8,25.2-39.2,25.2-66.2V120.3z"/>
            </g>
             <g fill="#34A853">
                <path d="M132.4,207.7c26.2,0,48.8-8.7,65.2-25.2l-30.2-30.2c-9.3,7.5-21.7,11.9-36.4,11.9v43.5z"/>
            </g>
            <g fill="#FBBC05">
                <path d="M72.4,116c0-14.5,6.2-27.5,15.4-36.4l-30.2-30.2C37,68.2,24.3,90.6,24.3,116s12.7,47.8,32.9,66.6l30.2-30.2 C78.6,143.5,72.4,130.5,72.4,116z"/>
            </g>
            <g fill="#EA4335">
                 <path d="M207.2,99c-1.3-6.8-3.9-13.3-7.8-19.2l-31.7,31.7h43.1C208.5,108.3,207.8,103.7,207.2,99z"/>
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
            <path fill="#FF9900" d="M12.3,9.3c0,0-0.5-0.1-1.1-0.1c-1.3,0-2.3,0.4-2.9,1.2c-0.6,0.8-0.9,1.9-0.9,3.3c0,2.1,0.8,3.7,2.3,4.6 c1.5,0.9,3.4,1.4,5.7,1.4c2,0,3.6-0.3,4.8-0.8l0.1-0.5c0,0-0.4,0.2-1.2,0.4c-1.2,0.3-2.4,0.4-3.5,0.4c-2.4,0-4.3-0.5-5.5-1.4 c-1.2-0.9-1.8-2.3-1.8-4.1c0-1.2,0.3-2.3,0.8-3.1s1.3-1.3,2.4-1.3c0.9,0,1.7,0.1,2.5,0.4c0.8,0.3,1.3,0.5,1.3,0.5L12.3,9.3z M19.4,7.2C18.2,6.1,16.6,5.5,14.6,5.5c-2.4,0-4.3,0.5-5.6,1.4C7.8,7.8,7.1,9.2,7.1,11c0,1.8,0.7,3.3,2.1,4.4 c1.4,1.1,3.3,1.7,5.7,1.7c2.4,0,4.3-0.5,5.6-1.4c1.3-0.9,2-2.3,2-4.1c0-1.8-0.7-3.3-2.1-4.4L19.4,7.2z"/>
             <path fill="#232F3E" d="M0,0h24v4.8H0V0z M0,19.2h24V24H0V19.2z" />
        </svg>
    ),
  },
  {
    title: "Certified Kubernetes Application Developer (CKAD)",
    issuer: "The Linux Foundation",
    date: "Issued Dec 2023",
    logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <path fill="#326CE5" d="M12,2L2,7l10,5l10-5L12,2z M2,17l10,5l10-5l-10-5L2,17z M12,14.47L4.9,11L12,7.53L19.1,11L12,14.47z"/>
        </svg>
    ),
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    date: "Issued Aug 2025",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <path fill="#F80000" d="M13.535 15.155c-1.397 0-2.443-.447-3.235-1.343a4.363 4.363 0 0 1-1.127-3.088c0-1.22.376-2.26.98-2.954c.604-.694 1.493-1.128 2.58-1.128c.967 0 1.8.313 2.459.887c.66.574 1.055 1.455.98 2.427c-.075.972-.51 1.785-1.22 2.378c-.708.594-1.637.82-2.437.82zm.125-8.987c-2.02 0-3.652.668-4.838 2.003c-1.186 1.336-1.78 3.14-1.78 5.414c0 2.274.594 4.05 1.78 5.267c1.186 1.218 2.817 1.848 4.838 1.848c2.145 0 3.864-.694 5.07-2.083c1.206-1.389 1.83-3.268 1.83-5.592c0-2.203-.594-3.96-1.78-5.267C17.47 6.84 15.78 6.168 13.66 6.168z"/>
      </svg>
    ),
  },
  {
    title: "GenAI Powered Data Analytics",
    issuer: "Tata Group",
    date: "Issued Jun 2025",
    logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="#4A90E2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1.25 14.25h-1.5v-7.5h1.5v7.5zm3.75 0h-1.5v-7.5h1.5v7.5zm-5-9.25h6.25v1.5H9.5v-1.5z"/>
        </svg>
    ),
  },
  {
    title: "Google cloud computing foundations",
    issuer: "Google",
    date: "Issued Dec 2023",
    logo: (
       <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M21.35,11.1H12.18V13.83H18.67C18.2,17.09 15.82,19.46 12.18,19.46C8.76,19.46 6,16.7 6,13.28C6,9.87 8.76,7.1 12.18,7.1C13.8,7.1 15.2,7.67 16.24,8.66L18.3,6.62C16.5,4.96 14.47,4 12.18,4C7.59,4 4,7.59 4,12.18C4,16.77 7.59,20.36 12.18,20.36C17.09,20.36 21.5,17.15 21.5,12.42C21.5,11.93 21.45,11.51 21.35,11.1Z"/>
        </svg>
    ),
  },
  {
    title: "Certificate for Completion of C Training",
    issuer: "Indian Institute of Technology, Bombay",
    date: "Issued Feb 2022",
    logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#F37021"/>
          <path fill="#FFFFFF" d="M8.5,8.5h7v2h-5v1h4v2h-4v1h5v2h-7v-8z"/>
        </svg>
    ),
  },
  {
    title: "Certificate for Completion of Advanced Cpp Training",
    issuer: "Indian Institute of Technology, Bombay",
    date: "Issued Feb 2022",
    logo: (
       <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#005C9E"/>
          <path fill="#FFFFFF" d="M8.5,8.5h7v2h-5v1h4v2h-4v1h5v2h-7v-8z M16,10h2v2h-2v-2zm0,4h2v2h-2v-2z"/>
        </svg>
    ),
  },
  {
    title: "Certificate for Completion of Python 3.4.3",
    issuer: "Indian Institute of Technology, Bombay",
    date: "Issued Feb 2022",
    logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#3776AB"/>
          <path fill="#FFD43B" d="M10.25,8.5v1.5h3.5c1.1,0,2-0.9,2-2s-0.9-2-2-2h-5v7h2v-2.5h3v-2h-3zm3.5,5v-1.5h-3.5c-1.1,0-2,0.9-2,2s0.9,2,2,2h5v-7h-2v2.5h-3v2h3z"/>
        </svg>
    ),
  },
   {
    title: "Certificate of Participation (Finalist)",
    issuer: "NMIMS Navi Mumbai",
    date: "Issued 2023",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="#A51C30" d="M3,3v18h18V3H3z M12,14.25L9,16l1.12-3.5L8,10.25h3.6L12,7l1.4,3.25H17l-2.12,2.25L16,16L12,14.25z"/>
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
            key={cert.title + i}
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

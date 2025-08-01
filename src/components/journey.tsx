
"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { School, Infinity } from "lucide-react"
import { useRef } from "react"

const journeyData = [
  {
    institution: "Vellore Institute of Technology (VIT Chennai)",
    degree: "Bachelor of Technology in Computer Science",
    duration: "2021 – 2025",
    location: "Chennai, Tamil Nadu",
    icon: <School className="text-primary-foreground" />,
  },
  {
    institution: "To be continued...",
    degree: "The journey continues, shaping the future with every step.",
    duration: "Present - Future",
    location: "",
    icon: (
      <motion.div
        animate={{
          scale: [1, 1.2, 1, 1.2, 1],
          rotate: [0, 0, 180, 180, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <Infinity className="text-primary-foreground" />
      </motion.div>
    ),
  },
  {
    institution: "Maharashtra State Board, Nashik",
    degree: "Senior Secondary (HSC)",
    duration: "2019 – 2021",
    location: "Nashik, Maharashtra",
    icon: <School className="text-primary-foreground" />,
  },
  {
    institution: "Maharashtra State Board, Nashik",
    degree: "Secondary (SSC)",
    duration: "Completed 2019",
    location: "Nashik, Maharashtra",
    icon: <School className="text-primary-foreground" />,
  },
]

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

const TimelineItem = ({ edu, i }: { edu: typeof journeyData[0], i: number }) => {
  const isEven = i % 2 === 0;

  const timelineVariants = {
    hidden: { opacity: 0, x: isEven ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={timelineVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="relative mb-12"
    >
      <div className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-1 ${isEven ? 'text-right pr-8' : 'text-left pl-8'}`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-4 rounded-lg bg-card/50 border border-primary/10 shadow-lg"
          >
            <h3 className="font-bold text-lg">{edu.institution}</h3>
            <p className="text-primary">{edu.degree}</p>
            <p className="text-sm text-muted-foreground">{edu.duration}</p>
            <p className="text-xs text-muted-foreground">{edu.location}</p>
          </motion.div>
        </div>
        
        <div className="absolute left-1/2 -ml-5 z-10">
          <motion.div 
            className="bg-primary rounded-full h-10 w-10 flex items-center justify-center ring-8 ring-background"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 15 }}
          >
            {edu.icon}
          </motion.div>
        </div>

        <div className="flex-1">
          {/* Empty div for spacing */}
        </div>
      </div>
    </motion.div>
  );
};


export function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <SectionTitle>The Journey</SectionTitle>
          <SectionDescription>My academic and professional journey.</SectionDescription>
        </div>
      </div>
      <div ref={ref} className="relative mt-12 w-full max-w-3xl mx-auto">
        <svg width="2" height="100%" className="absolute left-1/2 -ml-[1px] top-0 bottom-0">
          <motion.path
            d="M 1 0 V 1000"
            fill="transparent"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="4 8"
            initial={{ pathLength: 0 }}
            style={{ pathLength }}
          />
        </svg>
        <div className="relative">
          {journeyData.map((edu, i) => (
            <TimelineItem key={i} edu={edu} i={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

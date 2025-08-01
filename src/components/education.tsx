
"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { School } from "lucide-react"
import { useRef } from "react"

const educationData = [
  {
    institution: "Vellore Institute of Technology (VIT Chennai)",
    degree: "Bachelor of Technology in Computer Science",
    duration: "2021 – 2025",
    location: "Chennai, Tamil Nadu",
  },
  {
    institution: "Maharashtra State Board, Nashik",
    degree: "Senior Secondary (HSC)",
    duration: "2019 – 2021",
    location: "Nashik, Maharashtra",
  },
  {
    institution: "Maharashtra State Board, Nashik",
    degree: "Secondary (SSC)",
    duration: "Completed 2019",
    location: "Nashik, Maharashtra",
  },
]

const timelineVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

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

const TimelineItem = ({ edu, i }: { edu: typeof educationData[0], i: number }) => {
  const isEven = i % 2 === 0;
  return (
    <motion.div
      custom={i}
      variants={timelineVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="relative mb-12"
    >
      <div className={`flex items-center ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-1 ${isEven ? 'text-left pl-8' : 'text-right pr-8'}`}>
            <div className="p-4 rounded-lg bg-card/50 border border-primary/10 shadow-lg">
              <h3 className="font-bold text-lg">{edu.institution}</h3>
              <p className="text-primary">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">{edu.duration}</p>
              <p className="text-xs text-muted-foreground">{edu.location}</p>
            </div>
        </div>
        
        <div className="absolute left-1/2 -ml-5 z-10">
          <div className="bg-primary rounded-full h-10 w-10 flex items-center justify-center ring-8 ring-background">
            <School className="text-primary-foreground" />
          </div>
        </div>

        <div className="flex-1">
          {/* Empty div for spacing */}
        </div>
      </div>
    </motion.div>
  );
};


export function Education() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <SectionTitle>Education</SectionTitle>
          <SectionDescription>My academic journey and qualifications.</SectionDescription>
        </div>
      </div>
      <div ref={ref} className="relative mt-12 w-full max-w-3xl mx-auto">
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="absolute left-1/2 -ml-[2px] h-full w-1 bg-primary/20"
        />
        <div className="relative">
          {educationData.map((edu, i) => (
            <TimelineItem key={i} edu={edu} i={i} />
          ))}
        </div>
      </div>
    </div>
  )
}


"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { School, Infinity, BookOpen, GraduationCap, Briefcase } from "lucide-react"
import { useRef } from "react"

const journeyData = [
  {
    institution: "Embarking on New Adventures",
    degree: "Open to new opportunities and collaborations.",
    duration: "Present - Future",
    location: "Worldwide",
    icon: (
       <motion.div
        className="text-primary-foreground"
        animate={{
          scale: [1, 1.1, 1, 1.1, 1],
          rotate: [0, 15, -15, 15, 0],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1,
        }}
       >
        <Briefcase size={24}/>
       </motion.div>
    ),
  },
  {
    institution: "Vellore Institute of Technology (VIT Chennai)",
    degree: "Bachelor of Technology in Computer Science",
    duration: "2021 – 2025",
    location: "Chennai, Tamil Nadu",
    icon: (
        <motion.div 
         className="text-primary-foreground"
         animate={{ rotateY: [0, 360] }}
         transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        >
            <GraduationCap size={24}/>
        </motion.div>
    ),
  },
  {
    institution: "Maharashtra State Board, Nashik",
    degree: "Senior Secondary (HSC)",
    duration: "2019 – 2021",
    location: "Nandurbar, Maharashtra",
    icon: (
        <motion.div 
            className="text-primary-foreground"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        >
            <BookOpen size={24}/>
        </motion.div>
    ),
  },
  {
    institution: "Maharashtra State Board, Nashik",
    degree: "Secondary (SSC)",
    duration: "Completed 2019",
    location: "Nandurbar, Maharashtra",
    icon: (
       <motion.div 
            className="text-primary-foreground"
            animate={{ rotate: [0, 5, -5, 5, 0] }}
            transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
        >
            <School size={24}/>
       </motion.div>
    ),
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
    hidden: { opacity: 0, x: isEven ? 50 : -50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1],
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
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative p-6 rounded-lg bg-card/50 border border-primary/10 shadow-lg overflow-hidden group"
          >
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-all duration-700 group-hover:left-0"></div>
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

  const firstFutureIndex = journeyData.findIndex(item => item.duration.startsWith("Present"));
  const completedJourneyEnd = (journeyData.length - firstFutureIndex) / journeyData.length;
  const pathHeight = useTransform(scrollYProgress, [0, 0.8], [0, completedJourneyEnd]);
  

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <SectionTitle>The Journey</SectionTitle>
          <SectionDescription>My academic and professional journey.</SectionDescription>
        </div>
      </div>
      <div ref={ref} className="relative mt-12 w-full max-w-3xl mx-auto">
        <div 
            className="absolute left-1/2 -ml-[1px] top-0 h-full w-[2px] bg-primary/20"
        />
        <motion.div 
          className="absolute left-1/2 -ml-[1px] top-0 w-[2px] bg-primary"
          style={{
            height: useTransform(pathHeight, (h) => `${h * 100}%`),
            boxShadow: '0 0 10px hsl(var(--primary))'
          }}
        />

        <div className="relative">
          {journeyData.map((edu, i) => (
            <TimelineItem key={i} edu={edu} i={i} />
          ))}
        </div>
      </div>
    </div>
  )
}


"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const skills = [
  { 
    name: 'JavaScript', 
    description: "Advanced proficiency in modern ES6+ features.",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#F7DF1E]">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 3h18v18H3z" fill="#F7DF1E"/>
        <path d="M9.522 13.013c.318.644.759 1.156 1.458 1.458l-.51.986c-.9-.37-1.54-1.096-1.933-1.933l.985-.511zm4.956-2.026c-.318-.644-.759 1.156-1.458-1.458l.51-.986c.9.37 1.54 1.096 1.933 1.933l-.985.511zM10 6h2v2h-2zm4 10h2v2h-2z"/>
        <path d="M12 12c-2.388-.388-3.002-1.28-3-2 0-.72.63-1.002 1.5-1.002.825 0 1.5.315 1.5.315V6.5s-.63-.315-1.5-.315c-1.5 0-2.5.765-2.5 2.5 0 2.25 1.92 2.94 3 3.24.81.22 1 .5 1 1s-.502 1-1.5 1c-.825 0-1.5-.315-1.5-.315V17.5s.63.315 1.5.315c1.5 0 2.5-.765 2.5-2.5 0-1.53-1.002-2.19-2.5-2.7z" fill="#000"/>
      </svg>
    ),
  },
  { 
    name: 'React & Next.js', 
    description: "Full-stack development with modern React frameworks.",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#61DAFB]">
        <circle cx="12" cy="12" r="2"/>
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(120 12 12)"/>
      </svg>
    ),
  },
  { 
    name: 'Node.js & Express', 
    description: "Server-side JavaScript, RESTful APIs, and middleware.",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#339933]">
        <path d="M11.833 3.001l-8.333 4.811v9.622l8.333 4.811 8.334-4.811v-9.622l-8.334-4.811z" strokeWidth="1.5" />
        <path d="M12 11.5v-3m0 7v-3m0 0l-3-1.75m3 0l3-1.75m-3 5.25l3-1.75m-3 0l-3-1.75m0-3.5l3-1.75m-3 3.5l-3 1.75" />
      </svg>
    ),
  },
  { 
    name: 'Python', 
    description: "Machine learning, data analysis, and backend development.",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-[#3776AB]">
        <path d="M15 7.5c0 2.07-1.68 3.75-3.75 3.75S7.5 9.57 7.5 7.5 9.18 3.75 11.25 3.75v3.75zm-3.75 9c0-2.07 1.68-3.75 3.75-3.75s3.75 1.68 3.75 3.75-1.68 3.75-3.75 3.75H11.25v-3.75z" fill="#FFD43B"/>
        <path d="M11.25 3.75C9.18 3.75 7.5 5.43 7.5 7.5v1.5h7.5V7.5C15 5.43 13.32 3.75 11.25 3.75zM12.75 20.25c2.07 0 3.75-1.68 3.75-3.75v-1.5H9v1.5c0 2.07 1.68 3.75 3.75 3.75z" fill="currentColor"/>
      </svg>
    ),
  },
  { 
    name: 'MongoDB', 
    description: "Database design, aggregation pipelines, and optimization.",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#47A248]">
        <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.125 15.625c-3.125 0-4.375-1.625-4.375-3.25 0-1.125.875-2.25 2.375-2.625l4-1.25c.375-.125.5-.375.5-.625s-.25-.625-.75-.625c-1.5 0-2.375.75-2.375 1.625H8.5c0-2.25 1.75-3.75 4-3.75 2.125 0 3.625 1.25 3.625 3s-1 2-2.125 2.375l-4.125 1.375c-.375.125-.5.375-.5.625s.25.625.75.625c1.75 0 2.625-.75 2.625-1.75h1.75c0 2.375-1.875 4-4.25 4z"/>
      </svg>
    ),
  },
  { 
    name: 'C++', 
    description: "Strong foundation in OOP and algorithm implementation.",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#00599C]">
        <path d="M14 10h-4v4h4v-4zM10 10h-4v4h4v-4zM16 12a2 2 0 11-4 0 2 2 0 014 0zM12 12a2 2 0 11-4 0 2 2 0 014 0z" />
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3.293 6.293a1 1 0 011.414 0L12 10.586l1.879-1.88a1 1 0 111.414 1.414L13.414 12l1.88 1.879a1 1 0 01-1.414 1.414L12 13.414l-1.879 1.88a1 1 0 01-1.414-1.414L10.586 12l-1.88-1.879a1 1 0 010-1.414z" />
      </svg>
    ),
  },
  { 
    name: 'SQL', 
    description: "Database design, complex queries, and optimization.",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4479A1]">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
  { 
    name: 'Machine Learning', 
    description: "LightGBM, KNN, Scikit-learn, Pandas, and NumPy.",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M6.34 17.66L17.66 6.34"/>
        <path d="M6.34 6.34l11.32 11.32"/>
        <circle cx="12" cy="12" r="2"/>
        <circle cx="6.5" cy="6.5" r="2.5"/>
        <circle cx="17.5" cy="17.5" r="2.5"/>
      </svg>
    ),
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
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


export function Skills() {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <SectionTitle>My Expertise</SectionTitle>
          <SectionDescription>
            I have a diverse skill set that allows me to build robust and beautiful web applications from front to back.
          </SectionDescription>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ y: -5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="flex h-full flex-col items-center justify-start text-center p-6 bg-card/50 border-primary/10 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader className="p-0 flex-grow flex flex-col items-center justify-center">
                <motion.div
                  className="mb-4"
                  animate={{ y: [-3, 3, -3] }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                >
                  {skill.logo}
                </motion.div>
                <CardTitle className="text-lg font-semibold">{skill.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

    
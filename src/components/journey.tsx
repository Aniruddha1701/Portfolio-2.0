
"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { School, BookOpen, GraduationCap, Briefcase, Code, Trophy, Target, Rocket } from "lucide-react"
import { useRef, useState } from "react"
import Image from "next/image"

// Icon component to render icons based on type
const IconComponent = ({ type, iconType }: { type: string; iconType?: string }) => {
  const getIcon = () => {
    switch (iconType || type) {
      case 'education':
      case 'university':
        return <GraduationCap className="h-6 w-6"/>;
      case 'secondary':
        return <BookOpen className="h-6 w-6"/>;
      case 'primary':
      case 'school':
        return <School className="h-6 w-6"/>;
      case 'opportunity':
      case 'target':
        return <Target className="h-6 w-6"/>;
      case 'freelance':
      case 'code':
        return <Code className="h-6 w-6"/>;
      case 'opensource':
      case 'rocket':
        return <Rocket className="h-6 w-6"/>;
      case 'achievement':
      case 'trophy':
        return <Trophy className="h-6 w-6"/>;
      case 'work':
      case 'briefcase':
      default:
        return <Briefcase className="h-6 w-6"/>;
    }
  };

  const getAnimation = () => {
    switch (iconType || type) {
      case 'education':
      case 'university':
        return { animate: { rotateY: [0, 360] }, transition: { duration: 4, ease: "linear", repeat: Infinity } };
      case 'secondary':
        return { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, ease: "easeInOut", repeat: Infinity } };
      case 'primary':
      case 'school':
        return { animate: { rotate: [0, 5, -5, 5, 0] }, transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity } };
      case 'opportunity':
      case 'target':
        return { 
          animate: { scale: [1, 1.1, 1, 1.1, 1], rotate: [0, 15, -15, 15, 0] }, 
          transition: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 } 
        };
      case 'freelance':
      case 'code':
        return { animate: { y: [0, -5, 0] }, transition: { duration: 2, ease: "easeInOut", repeat: Infinity } };
      case 'opensource':
      case 'rocket':
        return { animate: { rotate: [0, 360] }, transition: { duration: 3, ease: "linear", repeat: Infinity } };
      case 'achievement':
      case 'trophy':
        return { animate: { scale: [1, 1.2, 1] }, transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity } };
      default:
        return { animate: { scale: [1, 1.05, 1] }, transition: { duration: 2, ease: "easeInOut", repeat: Infinity } };
    }
  };

  const animation = getAnimation();
  
  return (
    <motion.div
      className="text-primary-foreground"
      animate={animation.animate}
      transition={animation.transition}
    >
      {getIcon()}
    </motion.div>
  );
};

// No default data - all data must come from MongoDB

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

const TimelineItem = ({ item, i, type }: { item: any, i: number, type: 'education' | 'experience' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEven = i % 2 === 0;

  const timelineVariants = {
    hidden: { opacity: 0, x: isEven ? 50 : -50, scale: 0.95 },
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

  const contentVariants = {
      hidden: { opacity: 0, y: 20},
      visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.2,
            duration: 0.5
          }
      }
  }

  // Calculate progress percentage for timeline tracker
  const getProgress = () => {
    if (item.current || item.endDate === 'Present') return 100;
    if (!item.startDate || !item.endDate) return 0;
    
    const start = new Date(item.startDate).getTime();
    const end = new Date(item.endDate).getTime();
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const progress = getProgress();

  return (
    <motion.div
      variants={timelineVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="relative mb-12"
    >
      <div className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-1 ${isEven ? 'pr-8 md:pr-12' : 'pl-8 md:pl-12'}`}>
          <motion.div
            whileHover={{ 
                y: -4, 
                boxShadow: "0 20px 40px -10px hsl(var(--primary) / 0.2)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative p-6 md:p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/10 shadow-lg hover:shadow-2xl group overflow-hidden cursor-pointer transition-all duration-300"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* Enhanced Progress bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/5 to-primary/10 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.div 
                className="absolute top-0 right-0 h-full w-8 bg-gradient-to-r from-transparent to-white/20"
                animate={{ x: [-8, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ display: progress === 100 ? 'none' : 'block' }}
              />
            </div>
            
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-all duration-1000 group-hover:left-0 pointer-events-none"></div>
            <motion.div variants={contentVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className={isEven ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-4 py-1.5 mb-4 rounded-full ${item.duration?.toLowerCase().includes('present') ? 'bg-gradient-to-r from-primary/25 to-primary/15 border border-primary/30 shadow-sm' : 'bg-primary/10 border border-primary/15'} text-primary text-xs font-semibold tracking-wide uppercase ${isEven ? 'float-right' : 'float-left'}`}>
                  <span className="flex items-center gap-2">
                    {item.duration?.toLowerCase().includes('present') && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                    )}
                    {item.duration}
                  </span>
                </div>
                <div className="clear-both"></div>
                
                {/* Enhanced Header */}
                <div className="mb-4 space-y-2">
                  <div className={`flex items-center gap-3 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Institution Logo */}
                    {(item.logo || item.institution) && (
                      <div className="flex-shrink-0">
                        {item.logo ? (
                          <Image 
                            src={item.logo} 
                            alt={`${item.institution} Logo`} 
                            width={58} 
                            height={58} 
                            className="rounded-lg shadow-sm"
                          />
                        ) : (
                          <>
                            {(item.institution.toLowerCase().includes('vit') || item.institution.toLowerCase().includes('vellore')) && (
                              <Image 
                                src="/images/VIT_logo.png" 
                                alt="VIT Logo" 
                                width={58} 
                                height={58} 
                                className="rounded-lg shadow-sm"
                              />
                            )}
                            {item.institution.toLowerCase().includes('maharashtra') && (
                              <Image 
                                src="/images/Maharashtra_Board.png" 
                                alt="Maharashtra Board Logo" 
                                width={58} 
                                height={58} 
                                className="rounded-lg shadow-sm"
                              />
                            )}
                            {item.institution.toLowerCase().includes('ethnus') && (
                              <Image 
                                src="/images/Ethnus.png" 
                                alt="Ethnus Logo" 
                                width={58} 
                                height={58} 
                                className="rounded-lg shadow-sm"
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg md:text-xl leading-tight tracking-tight">
                        {item.institution}
                      </h3>
                      <p className="text-primary font-medium text-base md:text-lg">
                        {item.degree}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 mt-3 ${isEven ? 'justify-end' : 'justify-start'}`}>
                    {item.location && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </span>
                    )}
                    {item.field && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {item.field}
                      </span>
                    )}
                  </div>
                </div>

                {/* Enhanced Expand/Collapse indicator */}
                <motion.button
                  type="button"
                  className={`mt-4 flex items-center gap-2 text-sm font-medium text-primary/70 hover:text-primary transition-colors ${isEven ? 'ml-auto' : 'mr-auto'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{isExpanded ? 'View Less' : 'View Details'}</span>
                  <motion.svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </motion.svg>
                </motion.button>

                {/* Expandable content */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-primary/5 mt-4 space-y-4">
                    {/* Enhanced Date Range */}
                    {(item.startDate || item.endDate) && (
                      <div className={`${isEven ? 'text-right' : 'text-left'}`}>
                        <p className="text-xs font-semibold text-primary/50 uppercase tracking-wider mb-2">Duration</p>
                        <div className={`flex items-center gap-2 ${isEven ? 'justify-end' : 'justify-start'}`}>
                          <svg className="w-4 h-4 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm font-medium text-foreground/80">
                            {item.startDate && new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            <span className="mx-2 text-primary/40">→</span>
                            {item.current || item.endDate === 'Present' ? (
                              <span className="text-primary font-semibold">Present</span>
                            ) : (
                              item.endDate && new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced GPA for education */}
                    {item.gpa && (
                      <div className={`${isEven ? 'text-right' : 'text-left'}`}>
                        <p className="text-xs font-semibold text-primary/50 uppercase tracking-wider mb-2">Academic Performance</p>
                        <div className={`flex items-center gap-2 ${isEven ? 'justify-end' : 'justify-start'}`}>
                          <svg className="w-4 h-4 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-medium text-foreground/80">GPA: <span className="text-primary font-semibold">{item.gpa}</span></p>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Highlights/Achievements */}
                    {((item.highlights && item.highlights.length > 0) || (item.achievements && item.achievements.length > 0)) && (
                      <div className={`${isEven ? 'text-right' : 'text-left'}`}>
                        <p className="text-xs font-semibold text-primary/50 uppercase tracking-wider mb-3">
                          {type === 'education' ? 'Key Achievements' : 'Responsibilities & Impact'}
                        </p>
                        <ul className="space-y-2.5">
                          {(item.highlights || item.achievements || []).map((item: string, idx: number) => (
                            <li key={idx} className={`flex items-start gap-3 ${isEven ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                              <span className="flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-primary/60" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-sm text-foreground/75 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Enhanced Progress Tracker */}
                    <div className={`pt-4 border-t border-primary/5 ${isEven ? 'text-right' : 'text-left'}`}>
                      <p className="text-xs font-semibold text-primary/50 uppercase tracking-wider mb-3">Completion Status</p>
                      <div className={`flex items-center gap-3 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="flex-1">
                          <div className="h-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full shadow-sm"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-primary">{progress}</span>
                          <span className="text-xs text-primary/60">%</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        {progress === 100 ? 'Completed' : progress === 0 ? 'Not started' : 'In progress'}
                      </p>
                    </div>
                  </div>
                </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute left-1/2 -ml-6 z-10">
          <motion.div 
            className={`rounded-full h-12 w-12 flex items-center justify-center ring-4 ring-background shadow-lg ${
              item.duration?.toLowerCase().includes('present') 
                ? 'bg-gradient-to-br from-primary via-primary/80 to-primary/60' 
                : 'bg-gradient-to-br from-primary/90 to-primary'
            }`}
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            whileHover={{ 
              scale: 1.15, 
              rotate: 5,
              boxShadow: '0 0 25px hsl(var(--primary) / 0.4)' 
            }}
            viewport={{ once: true, amount: 1 }}
            transition={{ 
              delay: 0.3, 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          >
            {item.duration?.toLowerCase().includes('present') && (
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
            )}
            <IconComponent type={type} iconType={item.iconType} />
          </motion.div>
        </div>

        <div className="flex-1">
          {/* Empty div for spacing */}
        </div>
      </div>
    </motion.div>
  );
};


interface JourneyProps {
  education?: any[];
  experience?: any[];
}

export function Journey({ education = [], experience = [] }: JourneyProps) {
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState<'education' | 'experience' | 'all'>('all');
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Function to parse date from duration string or date fields
  const getDateValue = (item: any): number => {
    const duration = item.duration || '';
    
    // Check if item has endDate field (from database)
    if (item.endDate) {
      if (typeof item.endDate === 'string' && item.endDate.toLowerCase() === 'present') {
        return new Date().getFullYear() + 1; // Future date for current/ongoing
      }
      if (typeof item.endDate === 'string' && /\d{4}/.test(item.endDate)) {
        return parseInt(item.endDate.match(/\d{4}/)[0]);
      }
    }
    
    // Handle "Present" or current ongoing
    if (duration.toLowerCase().includes('present')) {
      return new Date().getFullYear() + 1; // Future date for current/ongoing
    }
    
    // Extract years from duration string
    const yearMatches = duration.match(/\d{4}/g);
    if (yearMatches && yearMatches.length > 0) {
      // Return the start year (first year found) or latest year for sorting
      return parseInt(yearMatches[yearMatches.length - 1]); // Use last year for sorting (latest first)
    }
    
    // If "Completed" is found, extract the year
    if (duration.toLowerCase().includes('completed')) {
      const year = duration.match(/\d{4}/);
      if (year) return parseInt(year[0]);
    }
    
    return 0; // Default for items without clear dates
  };

  // Sort function for chronological ordering (latest first)
  const sortByDate = (items: any[]) => {
    return [...items].sort((a, b) => {
      const dateA = getDateValue(a);
      const dateB = getDateValue(b);
      return dateB - dateA; // Descending order (latest first)
    });
  };

  // Use only data from MongoDB props - no fallbacks
  const educationItems = education || [];
  const experienceItems = experience || [];

  // Combine and sort data chronologically when showing all
  const getAllData = () => {
    const allData = [
      ...educationItems.map(item => ({ ...item, type: 'education' as const })),
      ...experienceItems.map(item => ({ ...item, type: 'experience' as const }))
    ];
    return sortByDate(allData);
  };

  // Sort the data by date to show latest first
  const displayData = activeTab === 'education' ? sortByDate(educationItems)
    : activeTab === 'experience' ? sortByDate(experienceItems)
    : getAllData();

  const pathHeight = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <SectionTitle>The Journey</SectionTitle>
          <SectionDescription>My academic and professional journey.</SectionDescription>
        </div>
        
        {/* Tab buttons */}
        <div className="flex gap-2 mt-6">
          <motion.button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card/50 hover:bg-card/80 text-muted-foreground'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'education' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card/50 hover:bg-card/80 text-muted-foreground'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Education
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'experience' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card/50 hover:bg-card/80 text-muted-foreground'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Experience
          </motion.button>
        </div>
      </div>
      
      <div ref={ref} className="relative mt-16 w-full max-w-3xl mx-auto">
        {/* Enhanced Current Year Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-20">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="px-6 py-2.5 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground rounded-full shadow-xl">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold tracking-wide uppercase">
                  Timeline • {new Date().getFullYear()}
                </span>
              </div>
            </div>
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
          </motion.div>
        </div>
        
        {/* Enhanced Timeline Line */}
        <div className="absolute left-1/2 -ml-[1.5px] top-0 h-full w-[3px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-full" />
        <motion.div 
          className="absolute left-1/2 -ml-[1.5px] top-0 w-[3px] bg-gradient-to-b from-primary via-primary/70 to-primary/40 rounded-full"
          style={{
            height: useTransform(pathHeight, (h) => `${h * 100}%`),
            boxShadow: '0 0 15px hsl(var(--primary) / 0.3)',
            filter: `drop-shadow(0 0 8px hsl(var(--primary) / 0.2))`
          }}
        />

        <motion.div 
          className="relative"
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'all' 
            ? getAllData().map((item, i) => (
                <TimelineItem key={i} item={item} i={i} type={item.type} />
              ))
            : displayData.map((item, i) => (
                <TimelineItem key={i} item={item} i={i} type={activeTab as 'education' | 'experience'} />
              ))
          }
        </motion.div>
      </div>
    </div>
  )
}

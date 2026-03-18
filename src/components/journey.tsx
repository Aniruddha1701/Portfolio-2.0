"use client"

import { motion } from "framer-motion"
import { School, Briefcase, Calendar, MapPin, Building2, GraduationCap, Award, ChevronRight, GripHorizontal } from "lucide-react"
import Image from "next/image"
import { useMemo, useRef, useState, useEffect } from "react"
import { format, differenceInMonths } from "date-fns"

// Helper to calculate duration between two dates
const getDuration = (start: string | Date, end: string | Date | null | undefined) => {
  const startDate = new Date(start)
  const endDate = end === 'Present' || !end ? new Date() : new Date(end)

  const totalMonths = differenceInMonths(endDate, startDate)
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years > 0) {
    return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months !== 1 ? 's' : ''}`
  }
  return `${months} mo${months !== 1 ? 's' : ''}`
}

interface JounreyItem {
  id?: string
  institution: string
  degree?: string
  location?: string
  startDate?: string
  endDate?: string
  current?: boolean
  description?: string[]
  logo?: string
  field?: string
  gpa?: string
  achievements?: string[]
  type: 'education' | 'experience'
}

interface GroupedExperience {
  company: string
  logo?: string
  totalDuration: string
  roles: JounreyItem[]
}

const ExpandableList = ({ items, theme = "violet" }: { items: string[], theme?: "violet" | "cyan" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_ITEMS = 3;

  if (!items || items.length === 0) return null;

  const showToggle = items.length > MAX_ITEMS;
  const visibleItems = isExpanded ? items : items.slice(0, MAX_ITEMS);

  const themeClasses = {
    violet: {
      icon: "text-violet-500/40 group-hover/item:text-violet-400",
      btn: "text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20"
    },
    cyan: {
      icon: "text-cyan-500/40 group-hover/item:text-cyan-400",
      btn: "text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20"
    }
  }[theme];

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.04]">
      <ul className="space-y-2.5">
        {visibleItems.map((desc, index) => (
          <li key={index} className="text-sm text-gray-400/90 leading-relaxed flex items-start gap-2.5 group/item cursor-default hover:text-gray-300 transition-colors">
            <ChevronRight className={`w-4 h-4 mt-[3px] shrink-0 transition-colors ${themeClasses.icon}`} />
            <span className="tracking-wide leading-relaxed">{desc}</span>
          </li>
        ))}
      </ul>
      {showToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mt-4 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 border transition-all duration-300 ${themeClasses.btn}`}
        >
          {isExpanded ? "See Less" : `See ${items.length - MAX_ITEMS} More`}
        </button>
      )}
    </div>
  );
};

const Journey = ({ education = [], experience = [], openToWork = false }: { education?: any[], experience?: any[], openToWork?: boolean }) => {

  const groupedExperiences: GroupedExperience[] = useMemo(() => {
    const groups: { [key: string]: GroupedExperience } = {}

    // Filter out "Open to Opportunities" if openToWork is false
    const filteredExperience = openToWork 
      ? experience 
      : experience.filter(item => {
          const companyName = (item.company || item.institution || '').toLowerCase();
          return !companyName.includes('open to opportunities');
        });

    const sortedExp = [...filteredExperience].sort((a, b) => {
      return new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime()
    })

    sortedExp.forEach((item) => {
      const companyName = item.company || item.institution || "Unknown Company"

      if (!groups[companyName]) {
        groups[companyName] = {
          company: companyName,
          logo: item.logo,
          totalDuration: "",
          roles: []
        }
      }
      groups[companyName].roles.push({ ...item, type: 'experience' })
    })

    return Object.values(groups).map(group => {
      group.roles.sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime())

      if (group.roles.length > 0) {
        const earliest = group.roles[group.roles.length - 1].startDate
        const latest = group.roles[0].current || group.roles[0].endDate === 'Present'
          ? new Date()
          : group.roles[0].endDate

        if (earliest) {
          group.totalDuration = getDuration(earliest, latest as string | Date)
        }
      }
      return group
    }).sort((a, b) => {
      const dateA = new Date(a.roles[0]?.startDate || 0).getTime();
      const dateB = new Date(b.roles[0]?.startDate || 0).getTime();
      return dateB - dateA;
    })
  }, [experience, openToWork])

  const [expWidth, setExpWidth] = useState(0)
  const [eduWidth, setEduWidth] = useState(0)
  const expCarousel = useRef<HTMLDivElement>(null)
  const eduCarousel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add a slight delay to ensure elements are painted or use ResizeObserver for perfect accuracy.
    // For simplicity, we trigger it once on mount and on window resize.
    const updateWidths = () => {
      if (expCarousel.current) {
        setExpWidth(Math.max(0, expCarousel.current.scrollWidth - expCarousel.current.offsetWidth))
      }
      if (eduCarousel.current) {
        setEduWidth(Math.max(0, eduCarousel.current.scrollWidth - eduCarousel.current.offsetWidth))
      }
    }

    updateWidths()
    setTimeout(updateWidths, 500) // Double check after animations
    window.addEventListener("resize", updateWidths)
    return () => window.removeEventListener("resize", updateWidths)
  }, [groupedExperiences, education])

  return (
    <section className="container max-w-7xl mx-auto px-4 py-20 relative overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full blur-xl opacity-30" />
          <div className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/15 to-blue-500/15 border border-violet-500/25 backdrop-blur-sm">
            <Briefcase className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Career Path
            </span>
          </div>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="text-white">Professional </span>
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400">
              Journey
            </span>
          </span>
        </motion.h2>

        <motion.p
          className="max-w-[600px] text-gray-400 md:text-lg leading-relaxed mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          A timeline of my growth, technical evolution, and educational milestones. Drag left and right to explore my timeline.
        </motion.p>
        
        <motion.div 
          className="flex items-center gap-2 text-violet-400/80 text-sm font-medium animate-pulse"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <GripHorizontal className="w-4 h-4" />
          <span>Swipe to explore</span>
        </motion.div>
      </div>

      {/* Experience Section */}
      <div className="relative w-full max-w-[100vw] -mx-4 md:mx-0 px-4 md:px-0">
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#0a0a12] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#0a0a12] to-transparent z-10 pointer-events-none" />
        
        <motion.div ref={expCarousel} className="overflow-hidden cursor-grab active:cursor-grabbing w-full relative">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -expWidth }}
            className="flex gap-6 w-max px-4 md:px-8 pt-[80px] pb-12 relative"
            whileTap={{ cursor: "grabbing" }}
          >
            {/* Structural IT Track Background */}
            <div className="absolute top-[40px] left-0 right-0 h-[2px] bg-white/5 z-0">
               <motion.div 
                 className="h-full w-full bg-gradient-to-r from-violet-600 via-blue-500 to-purple-600 origin-left shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                 initial={{ scaleX: 0 }}
                 whileInView={{ scaleX: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
               />
            </div>

            {groupedExperiences.map((group, index) => (
              <motion.div
                key={`exp-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px -50px" }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
                className="w-[320px] md:w-[420px] shrink-0 h-full flex flex-col relative"
              >
                {/* Structural IT Node & Stem */}
                <div className="absolute top-[-40px] left-8 flex flex-col items-center z-10 group-hover:-translate-y-1 transition-transform duration-300">
                   <motion.div 
                     initial={{ scale: 0 }} 
                     whileInView={{ scale: 1 }} 
                     transition={{ delay: 0.5 + index * 0.1 }}
                     className="w-3 h-3 bg-violet-400 rotate-45 shadow-[0_0_12px_rgba(139,92,246,0.8)] border border-white/20 relative z-20"
                   >
                     <div className="absolute inset-0 bg-violet-300 animate-ping opacity-50" />
                   </motion.div>
                   <motion.div 
                     initial={{ height: 0 }}
                     whileInView={{ height: 40 }}
                     transition={{ delay: 0.7 + index * 0.1 }}
                     className="w-[2px] bg-gradient-to-b from-violet-400 to-transparent -mt-1.5 z-10" 
                   />
                </div>

                {/* Story Card */}
                <div className="relative w-full rounded-xl border border-white/[0.08] bg-[#0a0a12]/90 hover:border-violet-500/40 hover:bg-[#0c0c16] hover:shadow-[0_8px_32px_-12px_rgba(139,92,246,0.3)] transition-all duration-500 overflow-hidden flex flex-col group backdrop-blur-xl mt-0">
                  {/* Subtle top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-blue-500 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="p-6 flex-1 flex flex-col gap-6">
                    {/* Header: Company & Duration */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/15 to-blue-500/10 border border-white/[0.08] group-hover:border-violet-500/30 flex items-center justify-center shrink-0 transition-colors shadow-inner">
                          {group.logo ? (
                            <Image src={group.logo} alt={group.company} width={28} height={28} className="rounded-lg object-contain" />
                          ) : (
                            <Building2 className="w-6 h-6 text-violet-400 drop-shadow-md" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 group-hover:to-white transition-colors">
                            {group.company}
                          </h3>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-violet-300 bg-violet-500/10 rounded border border-violet-500/20 whitespace-nowrap">
                        {group.totalDuration}
                      </span>
                    </div>

                    {/* Roles List */}
                    <div className="space-y-6 flex-1">
                      {group.roles.map((role, rIndex) => (
                        <div key={rIndex} className="relative">
                          {rIndex > 0 && <div className="absolute -top-4 left-2 w-px h-4 bg-violet-500/20" />}
                          
                          <div className="flex items-start gap-4">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-semibold text-gray-100 leading-snug">
                                {role.degree}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-violet-300/80 font-mono">
                                <span>{role.startDate ? format(new Date(role.startDate), 'MMM yyyy') : ''} – {(!role.endDate || role.endDate === 'Present') ? 'Present' : format(new Date(role.endDate), 'MMM yyyy')}</span>
                                {role.location && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {role.location}</span>
                                  </>
                                )}
                              </div>
                              
                              {role.description && (
                                <ExpandableList items={Array.isArray(role.description) ? role.description : [role.description]} theme="violet" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Education & Achievements Divider */}
      <div className="flex items-center justify-center my-20">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent w-full max-w-sm" />
        <motion.div
          className="mx-6 p-4 rounded-2xl bg-[#0a0a12] border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          whileInView={{ rotate: [0, -10, 10, 0] }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <GraduationCap className="w-7 h-7 text-blue-400 drop-shadow-lg" />
        </motion.div>
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent w-full max-w-sm" />
      </div>

      {/* Education Section */}
      <div className="relative w-full max-w-[100vw] -mx-4 md:mx-0 px-4 md:px-0">
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#0a0a12] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#0a0a12] to-transparent z-10 pointer-events-none" />
        
        <motion.div ref={eduCarousel} className="overflow-hidden cursor-grab active:cursor-grabbing w-full pb-8 relative">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -eduWidth }}
            className="flex gap-6 w-max px-4 md:px-8 pt-[80px] pb-12 relative"
            whileTap={{ cursor: "grabbing" }}
          >
            {/* Structural IT Track Background for Education */}
            <div className="absolute top-[40px] left-0 right-0 h-[2px] bg-white/5 z-0">
               <motion.div 
                 className="h-full w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 origin-left shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                 initial={{ scaleX: 0 }}
                 whileInView={{ scaleX: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
               />
            </div>

            {education.map((edu, eIndex) => (
              <motion.div
                key={`edu-${eIndex}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px -50px" }}
                transition={{ duration: 0.5, delay: Math.min(eIndex * 0.1, 0.5) }}
                className="w-[300px] md:w-[380px] shrink-0 h-full flex flex-col relative"
              >
                {/* Structural IT Node & Stem */}
                <div className="absolute top-[-40px] left-8 flex flex-col items-center z-10 group-hover:-translate-y-1 transition-transform duration-300">
                   <motion.div 
                     initial={{ scale: 0 }} 
                     whileInView={{ scale: 1 }} 
                     transition={{ delay: 0.5 + eIndex * 0.1 }}
                     className="w-3 h-3 bg-cyan-400 rotate-45 shadow-[0_0_12px_rgba(6,182,212,0.8)] border border-white/20 relative z-20"
                   >
                     <div className="absolute inset-0 bg-cyan-300 animate-ping opacity-50" />
                   </motion.div>
                   <motion.div 
                     initial={{ height: 0 }}
                     whileInView={{ height: 40 }}
                     transition={{ delay: 0.7 + eIndex * 0.1 }}
                     className="w-[2px] bg-gradient-to-b from-cyan-400 to-transparent -mt-1.5 z-10" 
                   />
                </div>

                {/* Education Card */}
                <div className="relative w-full p-6 bg-[#0a0a12]/90 border border-blue-500/10 rounded-xl hover:border-cyan-500/40 hover:bg-[#0c0c16] hover:shadow-[0_8px_32px_-12px_rgba(6,182,212,0.3)] transition-all duration-500 overflow-hidden flex flex-col group backdrop-blur-xl mt-0">
                  {/* Subtle top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/10 border border-blue-500/20 group-hover:border-blue-500/40 flex items-center justify-center shrink-0 transition-colors shadow-inner">
                      <School className="w-6 h-6 text-blue-400 drop-shadow-md" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 group-hover:to-white transition-colors">{edu.institution}</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-white/[0.04] pb-3">
                       <span className="text-[11px] font-mono font-semibold tracking-wider text-blue-300 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">
                        {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} – {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                       </span>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-gray-200">{edu.degree}</h4>
                      {edu.field && !edu.degree?.toLowerCase().includes(edu.field?.toLowerCase()) && (
                        <p className="text-sm text-blue-400/80 mt-1 font-medium italic">in {edu.field}</p>
                      )}
                    </div>

                    {edu.gpa && (
                      <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm font-medium text-yellow-500/90 shadow-[inset_0_1px_4px_rgba(234,179,8,0.1)]">
                        <Award className="w-4 h-4" />
                        <span>GPA: {edu.gpa}</span>
                      </div>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <ExpandableList items={edu.achievements} theme="cyan" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export { Journey };

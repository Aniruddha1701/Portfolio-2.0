"use client"

import { motion } from "framer-motion"
import { School, Briefcase, Calendar, MapPin, Building2, GraduationCap, Award, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useMemo } from "react"
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

const Journey = ({ education = [], experience = [] }: { education?: any[], experience?: any[] }) => {

  const groupedExperiences: GroupedExperience[] = useMemo(() => {
    const groups: { [key: string]: GroupedExperience } = {}

    const sortedExp = [...experience].sort((a, b) => {
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
  }, [experience])

  return (
    <section className="container max-w-4xl mx-auto px-4 py-20 relative">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400">
              Journey
            </span>
            {/* Curvy underline SVG */}
            <motion.svg
              className="absolute -bottom-4 left-0 w-full overflow-visible"
              viewBox="0 0 200 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.2 }}
            >
              <motion.path
                d="M 0 10 Q 50 -5 100 10 T 200 10"
                stroke="url(#gradient-line)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </motion.svg>
          </span>
        </motion.h2>

        <motion.p
          className="max-w-[600px] text-gray-400 md:text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          A timeline of my growth, technical evolution, and educational milestones
        </motion.p>
      </div>

      {/* Experience Section */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/40 via-violet-500/15 to-transparent" />

        <div className="space-y-8">
          {groupedExperiences.map((group, index) => (
            <motion.div
              key={`exp-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-16 md:pl-20 group"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-6 top-8 w-4 h-4 rounded-full border-2 border-violet-500 bg-[#0a0a12] z-10">
                <div className="absolute inset-0 rounded-full bg-violet-500/30 animate-ping" style={{ animationDuration: '3s' }} />
              </div>

              {/* Experience Card */}
              <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                {/* Subtle gradient top bar */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

                <div className="p-6 md:p-8">
                  {/* Company Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/15 to-blue-500/10 border border-white/[0.08] group-hover:border-violet-500/25 flex items-center justify-center shrink-0 transition-all duration-500">
                        {group.logo ? (
                          <Image src={group.logo} alt={group.company} width={28} height={28} className="rounded-lg object-contain" />
                        ) : (
                          <Building2 className="w-5 h-5 text-violet-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300">{group.company}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{group.totalDuration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="space-y-5">
                    {group.roles.map((role, rIndex) => (
                      <div key={rIndex} className="relative">
                        {/* Role connector */}
                        {rIndex > 0 && (
                          <div className="absolute -top-2.5 left-3 w-px h-2.5 bg-violet-500/20" />
                        )}

                        <div className="flex items-start gap-3">
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 shadow-[0_0_6px_rgba(139,92,246,0.5)]" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-semibold text-white">{role.degree}</h4>
                              {(!role.endDate || role.endDate === 'Present') && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold tracking-wider">CURRENT</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 font-mono">
                              <span>{role.startDate ? format(new Date(role.startDate), 'MMM yyyy') : ''} – {(!role.endDate || role.endDate === 'Present') ? 'Present' : format(new Date(role.endDate), 'MMM yyyy')}</span>
                              {role.location && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-700" />
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {role.location}</span>
                                </>
                              )}
                            </div>

                            {role.description && (
                              <ul className="mt-3 space-y-2">
                                {(Array.isArray(role.description) ? role.description : [role.description]).map((desc, dIndex) => (
                                  <li key={dIndex} className="text-sm text-gray-400 leading-relaxed flex items-start gap-2.5">
                                    <ChevronRight className="w-3.5 h-3.5 text-violet-500/50 mt-0.5 shrink-0" />
                                    <span>{desc}</span>
                                  </li>
                                ))}
                              </ul>
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
        </div>
      </div>

      {/* Education Divider */}
      <div className="flex items-center justify-center my-16">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent w-full max-w-sm" />
        <motion.div
          className="mx-6 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20"
          whileInView={{ rotate: [0, 10, -10, 0] }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <GraduationCap className="w-6 h-6 text-blue-400" />
        </motion.div>
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent w-full max-w-sm" />
      </div>

      {/* Education Section */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-blue-500/15 to-transparent" />

        <div className="space-y-6">
          {education.map((edu, eIndex) => (
            <motion.div
              key={`edu-${eIndex}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: eIndex * 0.1 }}
              className="relative pl-16 md:pl-20 group"
            >
              {/* Timeline dot */}
              <div className="absolute left-[18px] md:left-[26px] top-6 w-3 h-3 rounded-full border-2 border-blue-500 bg-[#0a0a12] z-10" />

              {/* Education Card */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-blue-500/20 hover:bg-white/[0.04] transition-all duration-500 p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/10 border border-white/[0.08] group-hover:border-blue-500/25 flex items-center justify-center shrink-0 transition-all duration-500">
                    <School className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300">{edu.institution}</h3>
                      <span className="text-xs font-mono text-blue-400/80 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/15 shrink-0">
                        {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} – {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      <span className="text-gray-300 font-medium">{edu.degree}</span>
                      {edu.field && !edu.degree?.toLowerCase().includes(edu.field?.toLowerCase()) && <span className="text-gray-500"> in {edu.field}</span>}
                    </p>

                    {edu.gpa && (
                      <div className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500">
                        <Award className="w-3 h-3" />
                        <span>GPA: {edu.gpa}</span>
                      </div>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/[0.06]">
                        {edu.achievements.map((item: string, i: number) => (
                          <div key={i} className="text-sm text-gray-400 flex items-start gap-2 mb-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-blue-500/50 mt-0.5 shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Journey };

"use client"

import { motion } from "framer-motion"
import { School, Briefcase, Calendar, MapPin, Building2, GraduationCap, Award } from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"
import { format, differenceInMonths, differenceInYears } from "date-fns"

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
  institution: string // Company or School Name
  degree?: string // Job Title or Degree
  location?: string
  startDate?: string
  endDate?: string
  current?: boolean
  description?: string[]
  logo?: string
  type: 'education' | 'experience'
}

interface GroupedExperience {
  company: string
  logo?: string
  totalDuration: string
  roles: JounreyItem[]
}

const Journey = ({ education = [], experience = [] }: { education?: any[], experience?: any[] }) => {

  // Group experiences by company
  const groupedExperiences: GroupedExperience[] = useMemo(() => {
    const groups: { [key: string]: GroupedExperience } = {}

    // Sort by date descending first
    const sortedExp = [...experience].sort((a, b) => {
      return new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime()
    })

    sortedExp.forEach((item) => {
      // Normalize company name to grouping key
      const companyName = item.institution || "Unknown Company"

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

    // Calculate total duration per group and sort roles descending
    return Object.values(groups).map(group => {
      // Sort roles by start date descending
      group.roles.sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime())

      // Calculate total duration (simplistic: earliest start to latest end)
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
      // Sort groups by the start date of their most recent role
      const dateA = new Date(a.roles[0]?.startDate || 0).getTime();
      const dateB = new Date(b.roles[0]?.startDate || 0).getTime();
      return dateB - dateA;
    })
  }, [experience])

  return (
    <section className="container max-w-5xl mx-auto px-4 py-20 relative">
      <div className="flex flex-col items-center mb-20 space-y-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block p-2 px-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-2"
        >
          Career Path
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-400">
          Professional <span className="text-purple-400">Journey</span>
        </h2>
        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
          A timeline of my growth, technical evolution, and educational milestones.
        </p>
      </div>

      <div className="relative">
        {/* Center Timeline Line (Hidden on Mobile) */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/0 via-purple-500/20 to-purple-500/0 hidden md:block" />

        <div className="space-y-16">
          {/* Experience Section */}
          {groupedExperiences.map((group, index) => (
            <div key={`exp-${index}`} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-8 md:gap-0`}>

              {/* Timeline Dot (Desktop) */}
              <div className="absolute left-1/2 w-4 h-4 -ml-2 rounded-full border-2 border-purple-500 bg-black z-10 hidden md:block shadow-[0_0_10px_purple] group-hover:scale-125 transition-transform" />

              {/* Date/Duration Side */}
              <div className={`w-full md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-start md:pl-16' : 'md:justify-end md:pr-16'}`}>
                <div className={`hidden md:flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}>
                  <span className="text-2xl font-bold text-white/50">{group.totalDuration}</span>
                  <span className="text-sm text-purple-400 uppercase tracking-widest font-mono mt-1">Duration</span>
                </div>
              </div>

              {/* Card Content Side */}
              <div className={`w-full md:w-1/2 md:px-12`}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.4 }}
                  className="relative group bg-gray-900/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl overflow-hidden"
                >
                  {/* Gradient Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-purple-500/20 transition-all">
                        {group.logo ? (
                          <Image src={group.logo} alt={group.company} width={32} height={32} className="rounded-lg object-contain" />
                        ) : (
                          <Building2 className="w-6 h-6 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{group.company}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 md:hidden">
                          <Calendar className="w-3 h-3" />
                          {group.totalDuration}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {group.roles.map((role, rIndex) => (
                        <div key={rIndex} className="relative pl-6 border-l border-white/10 last:border-0 pb-1">
                          <div className="absolute left-[-2px] top-2 w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_8px_purple]" />
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            {role.degree}
                            {(!role.endDate || role.endDate === 'Present') && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">CURRENT</span>
                            )}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 mb-3 font-mono">
                            <span>{role.startDate ? format(new Date(role.startDate), 'MMM yyyy') : ''} - {(!role.endDate || role.endDate === 'Present') ? 'Present' : format(new Date(role.endDate), 'MMM yyyy')}</span>
                            {role.location && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {role.location}</span>
                              </>
                            )}
                          </div>

                          {role.description && (
                            <ul className="space-y-2 mt-2">
                              {(Array.isArray(role.description) ? role.description : [role.description]).map((desc, dIndex) => (
                                <li key={dIndex} className="text-sm text-gray-400 leading-relaxed flex items-start gap-2">
                                  <span className="block mt-1.5 w-1 h-1 rounded-full bg-gray-600 shrink-0" />
                                  {desc}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Education Section Title */}
        <div className="flex items-center justify-center my-20">
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full max-w-md" />
          <div className="mx-4 p-3 bg-gray-900 border border-white/10 rounded-xl">
            <GraduationCap className="w-6 h-6 text-blue-400" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full max-w-md" />
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {education.map((edu, eIndex) => (
            <motion.div
              key={`edu-${eIndex}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative bg-gray-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0 group-hover:scale-110 transition-transform">
                  <School className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{edu.institution}</h3>
                    <span className="text-xs font-mono text-blue-400/80 bg-blue-500/10 px-2 py-1 rounded">
                      {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-gray-300 mt-1">{edu.degree} {edu.field && <span className="text-gray-500">in {edu.field}</span>}</h4>

                  {edu.gpa && (
                    <div className="inline-flex items-center gap-1.5 mt-3 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-500">
                      <Award className="w-3 h-3" />
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  )}

                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      {edu.achievements.map((item: string, i: number) => (
                        <div key={i} className="text-sm text-gray-400 flex items-start gap-2 mb-1">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500/50 block shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
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

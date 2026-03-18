"use client"

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Award, ExternalLink, Shield, Code, Cloud, Brain, Database, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

interface CertificationsProps {
  certifications?: any[];
}

// Holographic color palette based on issuer
const getHolographicColors = (issuer: string, title: string) => {
  const issuerLower = issuer?.toLowerCase() || '';
  const titleLower = title?.toLowerCase() || '';

  if (issuerLower.includes('oracle')) return { primary: '#F80000', secondary: '#FF6B35', accent: '#FFD93D' };
  if (issuerLower.includes('google')) return { primary: '#00D1FF', secondary: '#4285F4', accent: '#FBBC05' };
  if (issuerLower.includes('microsoft') || issuerLower.includes('azure')) return { primary: '#00A4EF', secondary: '#7FBA00', accent: '#FFB900' };
  if (issuerLower.includes('aws') || issuerLower.includes('amazon')) return { primary: '#FF9900', secondary: '#232F3E', accent: '#FF6600' };
  if (titleLower.includes('ai') || titleLower.includes('machine learning')) return { primary: '#A855F7', secondary: '#EC4899', accent: '#8B5CF6' };
  if (titleLower.includes('cloud') || titleLower.includes('devops')) return { primary: '#06B6D4', secondary: '#3B82F6', accent: '#8B5CF6' };
  if (titleLower.includes('data')) return { primary: '#10B981', secondary: '#14B8A6', accent: '#06B6D4' };

  return { primary: '#8B5CF6', secondary: '#EC4899', accent: '#06B6D4' };
};

// Premium logo system with 3D floating effect
const getCertificateLogo = (cert: any) => {
  const issuer = cert.issuer?.toLowerCase() || '';
  const title = cert.title?.toLowerCase() || '';

  const logoWrapper = (children: React.ReactNode, gradientFrom: string, gradientTo: string) => (
    <div className="relative group/logo">
      {/* Floating glow ring */}
      <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r opacity-40 group-hover/card:opacity-80 blur-2xl transition-all duration-700 animate-pulse"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      />
      {/* Main logo container */}
      <div
        className="relative w-16 h-16 rounded-[18px] flex items-center justify-center backdrop-blur-xl border-t border-l border-white/20 shadow-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}30, ${gradientTo}10)` }}
      >
        {/* Holographic shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-transparent opacity-50 group-hover/card:opacity-100 transition-opacity duration-500" />
        
        {/* Inner subtle shadow */}
        <div className="absolute inset-0 rounded-[18px] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] mix-blend-overlay" />

        <div className="relative z-10 drop-shadow-md">{children}</div>
      </div>
    </div>
  );

  // Oracle
  if (issuer.includes('oracle')) {
    return logoWrapper(
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 32 32">
        <path fill="#F80000" d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16s16-7.2 16-16S24.8 0 16 0zm8.4 22.5c-2.1 2.1-5 3.3-8.1 3.3s-6.1-1.2-8.2-3.3s-3.3-5.1-3.3-8.3s1.2-6.2 3.3-8.3S13.2 2.6 16.3 2.6s6 1.2 8.1 3.3s3.3 5.1 3.3 8.3s-1.2 6.2-3.3 8.3zm-8.2-17c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5s8.5-3.8 8.5-8.5s-3.8-8.5-8.5-8.5zm0 14.3c-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8s-2.6 5.8-5.8 5.8z" />
      </svg>, "#F80000", "#FF6B35"
    );
  }

  // Google
  if (issuer.includes('google')) {
    return logoWrapper(
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l5.9-5.9C34.5 3.5 29.8 1.5 24 1.5C14.7 1.5 6.8 7.3 3.5 15.4l6.9 5.4C11.8 14.8 17.3 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.7-.4-3.9H24v7.7h12.7c-.6 3-2.1 5.2-4.3 6.7l6.8 5.3C43 36.8 46.1 31.3 46.1 24.5z" />
        <path fill="#FBBC05" d="M10.4 28.6c-.5-1.4-.7-2.9-.7-4.6s.3-3.2.7-4.6L3.5 14C2 17 1.1 20.4 1.1 24s.9 7 2.4 10L10.4 28.6z" />
        <path fill="#34A853" d="M24 46.5c5.8 0 10.7-1.9 14.2-5.2l-6.8-5.3c-1.9 1.3-4.4 2.1-7.4 2.1c-5.7 0-10.5-3.8-12.2-9l-6.9 5.4C8.2 42.2 15.4 46.5 24 46.5z" />
      </svg>, "#00D1FF", "#4285F4"
    );
  }

  // Microsoft / Azure
  if (issuer.includes('microsoft') || issuer.includes('azure')) {
    return logoWrapper(
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
        <rect x="4" y="4" width="18" height="18" fill="#F25022" />
        <rect x="26" y="4" width="18" height="18" fill="#7FBA00" />
        <rect x="4" y="26" width="18" height="18" fill="#00A4EF" />
        <rect x="26" y="26" width="18" height="18" fill="#FFB900" />
      </svg>, "#00A4EF", "#7FBA00"
    );
  }

  // AWS
  if (issuer.includes('aws') || issuer.includes('amazon')) {
    return logoWrapper(
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 48 48">
        <path fill="#FF9900" d="M35.8 33.5c-3.9 2.9-9.6 4.4-14.5 4.4-6.9 0-13-2.5-17.7-6.8-.4-.3 0-.8.4-.5 5 2.9 11.2 4.7 17.6 4.7 4.3 0 9.1-.9 13.5-2.8.6-.3 1.2.4.7 1zm1.6-1.9c-.5-.6-3.3-.3-4.6-.1-.4.1-.4-.3-.1-.5 2.2-1.6 5.9-1.1 6.3-.6.4.5-.1 4.1-2.2 5.8-.3.3-.6.1-.5-.2.5-1 1.6-3.2 1.1-3.8z" />
        <path fill="#E6E6E6" d="M24.2 4.2c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20z" opacity=".1" />
      </svg>, "#FF9900", "#FFD93D"
    );
  }

  // Icons based on type
  if (title.includes('ai') || title.includes('machine learning')) return logoWrapper(<Brain className="w-8 h-8 text-white" />, "#A855F7", "#EC4899");
  if (title.includes('cloud') || title.includes('devops')) return logoWrapper(<Cloud className="w-8 h-8 text-white" />, "#06B6D4", "#3B82F6");
  if (title.includes('data')) return logoWrapper(<Database className="w-8 h-8 text-white" />, "#10B981", "#14B8A6");

  // Default
  return logoWrapper(<Award className="w-8 h-8 text-white" />, "#8B5CF6", "#EC4899");
};

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const CertificateCard = ({ cert }: { cert: any }) => {
  const logo = getCertificateLogo(cert);
  const colors = getHolographicColors(cert.issuer, cert.title);
  const issueDateFormatted = cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    requestAnimationFrame(() => {
      mouseX.set(x);
      mouseY.set(y);
    });
  };

  return (
    <CardContainer className="h-full w-full py-0">
      <CardBody 
        className="group/card relative w-full h-full min-h-[380px] flex flex-col rounded-[2.5rem] bg-[#0c0c11]/90 backdrop-blur-2xl border border-white/[0.03] p-6 sm:p-8 hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-500 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-0 rounded-[2.5rem]"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                ${colors.primary}15,
                transparent 70%
              )
            `,
          }}
        />

        {/* Ambient colored blur in top left behind the logo */}
        <div 
          className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-[70px] opacity-30 mix-blend-screen transition-opacity duration-500 group-hover/card:opacity-60"
          style={{ background: colors.primary }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header area */}
          <CardItem translateZ="40" className="flex items-start justify-between w-full mb-8">
            <div className="flex items-center gap-4">
              {logo}
              <div className="hidden sm:block opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                <ShieldCheck className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <Shield className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
          </CardItem>

          {/* Title Area */}
          <CardItem translateZ="60" className="flex-1 w-full">
            <h3 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-white/90 group-hover/card:text-white transition-colors duration-300 drop-shadow-sm">
              {cert.title}
            </h3>
            
            {(cert.issuer || issueDateFormatted) && (
              <div className="mt-4 flex flex-col gap-1">
                {cert.issuer && (
                  <span className="text-sm font-medium text-white/60">
                    Issuer: <span className="text-white/80">{cert.issuer}</span>
                  </span>
                )}
                {issueDateFormatted && (
                  <span className="text-xs text-white/40 font-medium">
                    Issued {issueDateFormatted}
                  </span>
                )}
              </div>
            )}
            
            {cert.credentialId && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <Code className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs text-white/50 font-mono truncate max-w-[200px]">
                  ID: {cert.credentialId}
                </span>
              </div>
            )}
          </CardItem>

          {/* Footer content */}
          <CardItem translateZ="30" className="w-full mt-6 pt-5 border-t border-white/[0.04]">
            <div className="flex items-center justify-between">
              {/* Verified Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase mt-[1px]">Verified</span>
              </div>

              {/* Active Badge */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                <span className="mt-[1px]">Active</span>
              </div>
            </div>

            {/* View Credential Button - Appears seamlessly on hover directly in layout */}
            {cert.verifyUrl && (
              <div className="w-full mt-4 h-0 opacity-0 overflow-hidden group-hover/card:h-[42px] group-hover/card:opacity-100 group-hover/card:mt-5 transition-all duration-300 ease-in-out">
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-full rounded-xl text-sm font-semibold transition-all duration-300 backdrop-blur-md hover:brightness-125"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}30, transparent)`,
                    border: `1px solid ${colors.primary}40`,
                    boxShadow: `0 4px 20px ${colors.primary}20`
                  }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: colors.secondary }} />
                  <span className="text-white">View Credential</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </a>
              </div>
            )}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  )
};

export function Certifications({ certifications = [] }: CertificationsProps) {
  const displayCertifications = certifications || [];

  return (
    <div className="container mx-auto px-4 md:px-6 relative">
      {/* Background aurora effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px]"
          animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Section Header */}
      <motion.div
        className="flex flex-col items-center justify-center space-y-6 text-center mb-20"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Floating badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />
          <div className="relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <Award className="w-5 h-5 text-violet-400" />
            <span className="text-sm font-semibold tracking-wide bg-gradient-to-r from-violet-300 via-white to-cyan-300 bg-clip-text text-transparent">
              Professional Credentials
            </span>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="text-white/90">Certified </span>
          <span className="relative inline-block mt-4 md:mt-0 xl:ml-3">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 animate-gradient-x">
              Excellence
            </span>
            {/* Curvy underline SVG */}
            <motion.svg
              className="absolute -bottom-6 left-0 w-[110%] -ml-[5%] overflow-visible pointer-events-none z-0"
              viewBox="0 0 200 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.2 }}
            >
              <motion.path
                d="M 0 10 Q 50 -5 100 10 T 200 10"
                stroke="url(#gradient-cert-line)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient-cert-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </motion.svg>
          </span>
        </motion.h2>

        <motion.p
          className="max-w-[700px] text-gray-400 md:text-lg lg:text-xl leading-relaxed mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Industry-recognized certifications that demonstrate{" "}
          <span className="text-violet-400 font-medium">expertise</span>,{" "}
          <span className="text-pink-400 font-medium">dedication</span>, and{" "}
          <span className="text-cyan-400 font-medium">technical mastery</span>
        </motion.p>
      </motion.div>

      {displayCertifications.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-[1400px] mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayCertifications.map((cert, i) => (
            <motion.div 
              key={cert.title + i} 
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <CertificateCard cert={cert} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center p-20 border border-dashed border-white/10 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5" />
          <motion.div
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center border border-violet-500/20"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Award className="w-12 h-12 text-violet-400/50" />
          </motion.div>
          <p className="text-gray-500 text-xl font-medium">No certifications available yet</p>
        </motion.div>
      )}
    </div>
  )
}


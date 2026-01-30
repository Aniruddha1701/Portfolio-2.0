"use client"

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Award, ExternalLink, Shield, Code, Cloud, Brain, Database, Globe, CheckCircle2, Sparkles, Star, Zap } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface CertificationsProps {
  certifications?: any[];
}

// Holographic color palette based on issuer
const getHolographicColors = (issuer: string, title: string) => {
  const issuerLower = issuer?.toLowerCase() || '';
  const titleLower = title?.toLowerCase() || '';

  if (issuerLower.includes('oracle')) return { primary: '#F80000', secondary: '#FF6B35', accent: '#FFD93D' };
  if (issuerLower.includes('google')) return { primary: '#4285F4', secondary: '#34A853', accent: '#FBBC05' };
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
    <motion.div
      className="relative"
      whileHover={{ scale: 1.15, rotateY: 15 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Floating glow ring */}
      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-70 blur-xl transition-all duration-700 animate-pulse"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      />
      {/* Main logo container */}
      <div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}10)` }}
      >
        {/* Holographic shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-2xl p-[1px]">
          <div className="absolute inset-0 rounded-2xl animate-spin-slow"
            style={{
              background: `conic-gradient(from 0deg, ${gradientFrom}, ${gradientTo}, transparent, ${gradientFrom})`,
              opacity: 0.5
            }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
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
      </svg>, "#4285F4", "#34A853"
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
  if (title.includes('ai') || title.includes('machine learning')) return logoWrapper(<Brain className="w-8 h-8 text-purple-400" />, "#A855F7", "#EC4899");
  if (title.includes('cloud') || title.includes('devops')) return logoWrapper(<Cloud className="w-8 h-8 text-cyan-400" />, "#06B6D4", "#3B82F6");
  if (title.includes('data')) return logoWrapper(<Database className="w-8 h-8 text-emerald-400" />, "#10B981", "#14B8A6");

  // Default
  return logoWrapper(<Award className="w-8 h-8 text-violet-400" />, "#8B5CF6", "#EC4899");
};

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    }
  }
};

// Card animation variants - cleaner slide up
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
    }
  }
};

const CertificateCard = ({ cert, i }: { cert: any, i: number }) => {
  const logo = getCertificateLogo(cert);
  const colors = getHolographicColors(cert.issuer, cert.title);
  const issueDateFormatted = cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

  const [isHovered, setIsHovered] = useState(false);

  // Spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.div
      variants={cardVariants}
      className="h-full group relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Spotlight Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          background: useMotionTemplate`
              radial-gradient(
                500px circle at ${mouseX}px ${mouseY}px,
                ${colors.primary}40,
                transparent 80%
              )
            `,
        }}
      />

      {/* Outer Glow (static/pulsing) */}
      <div
        className="absolute -inset-1 rounded-[28px] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
        style={{ background: colors.primary }}
      />

      {/* Animated border gradient */}
      <div className="absolute -inset-[1px] rounded-[26px] overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
        <div className="absolute inset-[1px] rounded-3xl bg-[#0d0d12]" />
      </div>

      <Card className="relative h-full min-h-[340px] overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-[#12121a] via-[#0f0f16] to-[#0a0a10]">

        {/* Subtle aurora background */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: colors.primary }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative p-6 flex flex-col h-full z-10">
          {/* Header with logo and issuer */}
          <div className="flex items-center gap-4 mb-5">
            {logo}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.primary }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                  {cert.issuer}
                </span>
              </div>
              {issueDateFormatted && (
                <span className="text-[11px] text-gray-500 font-medium">
                  Issued {issueDateFormatted}
                </span>
              )}
            </div>
          </div>

          {/* Title - prominent */}
          <h3 className="text-xl md:text-[22px] font-bold leading-snug text-white mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-500"
            style={{
              backgroundImage: isHovered ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'none'
            }}
          >
            {cert.title}
          </h3>

          {/* Credential ID if available */}
          {cert.credentialId && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <Code className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-400 font-mono truncate">
                ID: {cert.credentialId}
              </span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer */}
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            {/* Verified badge */}
            <div className="flex items-center justify-between">
              <motion.div
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl overflow-hidden bg-emerald-500/10 border border-emerald-500/20"
                whileHover={{ scale: 1.02 }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Verified</span>
              </motion.div>

              {/* Quick action hint */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Zap className="w-3 h-3" style={{ color: colors.accent }} />
                <span>Active</span>
              </div>
            </div>

            {/* View Credential Button - Only visible on hover/always visible but styled */}
            {cert.verifyUrl && (
              <motion.a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl text-sm font-bold overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)`,
                  border: `1px solid ${colors.primary}30`,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 0 20px ${colors.primary}20`
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-4 h-4 relative z-10" style={{ color: colors.primary }} />
                <span className="relative z-10 bg-gradient-to-r bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
                >
                  View Credential
                </span>
                <ExternalLink className="w-4 h-4 relative z-10" style={{ color: colors.secondary }} />
              </motion.a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
};

export function Certifications({ certifications = [] }: CertificationsProps) {
  const displayCertifications = certifications || [];

  return (
    <div className="container mx-auto px-4 md:px-6 relative">
      {/* Background aurora effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px]"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1]
          }}
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
        {/* Floating badge with glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Award className="w-5 h-5 text-violet-400" />
            </motion.div>
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Professional Credentials
            </span>
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Main title with gradient animation */}
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="text-white">Certified </span>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-[length:200%_auto] animate-gradient">
              Excellence
            </span>
            {/* Underline glow */}
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </span>
        </motion.h2>

        <motion.p
          className="max-w-[700px] text-gray-400 md:text-lg lg:text-xl leading-relaxed"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-[1200px] mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayCertifications.map((cert, i) => (
            <CertificateCard key={cert.title + i} cert={cert} i={i} />
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


"use client"

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Award, ExternalLink, Shield, Code, Cloud, Brain, Database, Globe } from "lucide-react";

interface CertificationsProps {
  certifications?: any[];
}

// Comprehensive logo system for certificate issuers
const getCertificateLogo = (cert: any) => {
  const issuer = cert.issuer?.toLowerCase() || '';
  const title = cert.title?.toLowerCase() || '';
  
  // Oracle
  if (issuer.includes('oracle')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 32 32">
        <path fill="#F80000" d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16s16-7.2 16-16S24.8 0 16 0zm8.4 22.5c-2.1 2.1-5 3.3-8.1 3.3s-6.1-1.2-8.2-3.3s-3.3-5.1-3.3-8.3s1.2-6.2 3.3-8.3S13.2 2.6 16.3 2.6s6 1.2 8.1 3.3s3.3 5.1 3.3 8.3s-1.2 6.2-3.3 8.3zm-8.2-17c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5s8.5-3.8 8.5-8.5s-3.8-8.5-8.5-8.5zm0 14.3c-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8s-2.6 5.8-5.8 5.8z"/>
      </svg>
    );
  }
  
  // Google
  if (issuer.includes('google')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l5.9-5.9C34.5 3.5 29.8 1.5 24 1.5C14.7 1.5 6.8 7.3 3.5 15.4l6.9 5.4C11.8 14.8 17.3 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.7-.4-3.9H24v7.7h12.7c-.6 3-2.1 5.2-4.3 6.7l6.8 5.3C43 36.8 46.1 31.3 46.1 24.5z"/>
        <path fill="#FBBC05" d="M10.4 28.6c-.5-1.4-.7-2.9-.7-4.6s.3-3.2.7-4.6L3.5 14C2 17 1.1 20.4 1.1 24s.9 7 2.4 10L10.4 28.6z"/>
        <path fill="#34A853" d="M24 46.5c5.8 0 10.7-1.9 14.2-5.2l-6.8-5.3c-1.9 1.3-4.4 2.1-7.4 2.1c-5.7 0-10.5-3.8-12.2-9l-6.9 5.4C8.2 42.2 15.4 46.5 24 46.5z"/>
      </svg>
    );
  }
  
  // Microsoft / Azure
  if (issuer.includes('microsoft') || issuer.includes('azure')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <rect x="4" y="4" width="18" height="18" fill="#F25022"/>
        <rect x="26" y="4" width="18" height="18" fill="#7FBA00"/>
        <rect x="4" y="26" width="18" height="18" fill="#00A4EF"/>
        <rect x="26" y="26" width="18" height="18" fill="#FFB900"/>
      </svg>
    );
  }
  
  // AWS
  if (issuer.includes('aws') || issuer.includes('amazon')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path fill="#252F3E" d="M13.5 21.7c0 .8.1 1.4.2 1.9.2.5.4 1 .7 1.5.1.2.1.3.1.4 0 .2-.1.3-.3.5l-1 .7c-.1.1-.3.1-.4.1s-.3-.1-.5-.2c-.2-.2-.4-.4-.6-.7-.1-.3-.3-.5-.4-.9-1.2 1.5-2.8 2.2-4.7 2.2-1.3 0-2.4-.4-3.2-1.1-.8-.8-1.2-1.8-1.2-3.1 0-1.4.5-2.5 1.5-3.3s2.3-1.2 3.9-1.2c.5 0 1.1 0 1.7.1.6.1 1.2.2 1.8.4v-1.2c0-1.2-.3-2.1-.8-2.6-.5-.5-1.4-.7-2.6-.7-.6 0-1.1.1-1.7.2-.6.1-1.2.3-1.7.5-.3.1-.5.2-.6.2-.1 0-.2 0-.3 0-.2 0-.3-.2-.3-.5v-.8c0-.3 0-.4.1-.6.1-.1.2-.2.4-.3.6-.3 1.2-.5 2-.7.8-.2 1.7-.3 2.6-.3 2 0 3.4.4 4.2 1.3.9.9 1.3 2.3 1.3 4.1v5.4zm-6.5 2.3c.5 0 1.1-.1 1.6-.3.6-.2 1.1-.5 1.5-1.1.3-.3.4-.6.5-1 .1-.4.2-.8.2-1.4v-.7c-.5-.1-1-.2-1.5-.3-.5-.1-1-.1-1.5-.1-1.1 0-1.9.2-2.4.6-.5.4-.8 1-.8 1.8 0 .8.2 1.3.6 1.7.4.4.9.5 1.7.5zm13 1.6c-.3 0-.5 0-.7-.2-.2-.1-.3-.3-.3-.6l-3.7-12.2c-.1-.3-.1-.5-.1-.6 0-.3.1-.4.4-.4h1.5c.3 0 .5 0 .7.1.2.1.3.3.3.6l2.6 10.3 2.5-10.3c.1-.3.1-.5.3-.6.2-.1.4-.1.7-.1h1.2c.3 0 .5 0 .7.1.2.1.3.3.3.6l2.5 10.4L32 12.1c.1-.3.2-.5.3-.6.2-.1.4-.1.7-.1h1.4c.3 0 .4.1.4.4 0 .1 0 .2 0 .3 0 .1 0 .2-.1.3l-3.8 12.2c-.1.3-.2.5-.3.6-.2.1-.4.2-.7.2h-1.3c-.3 0-.5 0-.7-.1-.2-.1-.3-.3-.3-.6l-2.4-10-2.4 10c-.1.3-.1.5-.3.6-.2.1-.4.1-.7.1h-1.3zm20.3.5c-.8 0-1.6-.1-2.4-.3-.8-.2-1.4-.4-1.8-.6-.3-.2-.4-.3-.5-.5-.1-.2-.1-.3-.1-.5v-.8c0-.3.1-.5.4-.5.1 0 .2 0 .3 0 .1 0 .3.1.4.1.6.3 1.2.5 1.8.6.7.1 1.3.2 2 .2 1.1 0 1.9-.2 2.5-.5.6-.3.9-.8.9-1.5 0-.4-.1-.8-.4-1.1-.3-.3-.8-.6-1.6-.9l-2.3-.7c-1.2-.4-2-.9-2.6-1.6-.5-.7-.8-1.5-.8-2.4 0-.7.1-1.3.4-1.8.3-.5.7-1 1.2-1.3.5-.4 1-.6 1.7-.8.6-.2 1.3-.3 2-.3.4 0 .7 0 1.1.1.4 0 .7.1 1.1.2.3.1.6.2.9.2.3.1.5.2.7.3.2.1.3.2.4.3.1.1.2.2.2.3.1.1.1.3.1.5v.7c0 .3-.1.5-.4.5-.1 0-.3 0-.5-.1-.9-.4-1.9-.6-3-.6-.9 0-1.7.2-2.2.5-.5.3-.8.8-.8 1.5 0 .4.1.8.4 1.1.3.3.9.6 1.8 1l2.2.7c1.1.4 2 .9 2.5 1.5.5.6.8 1.4.8 2.3 0 .7-.1 1.4-.4 2-.3.6-.7 1.1-1.2 1.5-.5.4-1.1.7-1.9 1-.7.2-1.6.3-2.5.3z"/>
        <path fill="#FF9900" d="M35.8 33.5c-3.9 2.9-9.6 4.4-14.5 4.4-6.9 0-13-2.5-17.7-6.8-.4-.3 0-.8.4-.5 5 2.9 11.2 4.7 17.6 4.7 4.3 0 9.1-.9 13.5-2.8.6-.3 1.2.4.7 1zm1.6-1.9c-.5-.6-3.3-.3-4.6-.1-.4.1-.4-.3-.1-.5 2.2-1.6 5.9-1.1 6.3-.6.4.5-.1 4.1-2.2 5.8-.3.3-.6.1-.5-.2.5-1 1.6-3.2 1.1-3.8z"/>
      </svg>
    );
  }
  
  // IIT (Indian Institute of Technology)
  if (issuer.includes('iit') || issuer.includes('indian institute')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#003366"/>
        <text x="50" y="40" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" textAnchor="middle" fill="white">IIT</text>
        <text x="50" y="65" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" fill="white">BOMBAY</text>
      </svg>
    );
  }
  
  // Tata
  if (issuer.includes('tata')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="#54B4D3"/>
        <text x="50" y="65" fontFamily="Arial, sans-serif" fontSize="45" fontWeight="bold" textAnchor="middle" fill="white">T</text>
      </svg>
    );
  }
  
  // Coursera
  if (issuer.includes('coursera')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path fill="#0056D2" d="M47.8 23.3c-.1-2.4-.6-4.8-1.5-7-.9-2.2-2.2-4.2-3.8-5.9-1.6-1.7-3.6-3-5.7-4-4.4-2-9.4-2.2-14-.5-2.2.8-4.2 2-5.9 3.6-1.7 1.5-3.1 3.4-4.1 5.5-2 4.4-2.1 9.4-.4 13.9.8 2.2 2.1 4.2 3.6 5.9 1.6 1.7 3.5 3.1 5.6 4.1 2.2 1 4.5 1.5 6.9 1.5 1.8 0 3.6-.3 5.3-.9 2.2-.8 4.2-2 5.9-3.5 1.7-1.6 3.1-3.5 4.1-5.6 1-2.2 1.6-4.6 1.6-7.1zm-7.5 0c0 1.5-.3 3-.9 4.4-.6 1.4-1.4 2.6-2.5 3.6-1.1 1-2.3 1.8-3.7 2.3-1.4.5-2.9.8-4.4.8-1.5 0-3-.3-4.4-.8-1.4-.5-2.6-1.3-3.7-2.3-1-1-1.9-2.2-2.5-3.6-.6-1.4-.9-2.8-.9-4.4 0-1.5.3-3 .9-4.4.6-1.3 1.4-2.5 2.5-3.5 1-1 2.3-1.8 3.7-2.3 1.4-.5 2.9-.8 4.4-.8 1.5 0 3 .3 4.4.8 1.4.5 2.6 1.3 3.7 2.3 1 1 1.9 2.2 2.5 3.5.6 1.4.9 2.9.9 4.4z"/>
      </svg>
    );
  }
  
  // Udemy
  if (issuer.includes('udemy')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path fill="#A435F0" d="M23.5 0L0 13.5v13.8c0 10.2 10.5 18.5 23.5 20.7 13-2.2 23.5-10.5 23.5-20.7V13.5L23.5 0zm0 7.3l16.2 9.3v10.2c0 6.8-7.2 12.4-16.2 13.9-9-1.5-16.2-7.1-16.2-13.9V16.6L23.5 7.3z"/>
      </svg>
    );
  }
  
  // LinkedIn Learning
  if (issuer.includes('linkedin')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path fill="#0A66C2" d="M44.5 0H3.5C1.6 0 0 1.5 0 3.4v41.2C0 46.5 1.6 48 3.5 48h41c1.9 0 3.5-1.5 3.5-3.4V3.4C48 1.5 46.4 0 44.5 0zM14.2 40.9H7.1V18h7.1v22.9zM10.7 14.9c-2.3 0-4.1-1.8-4.1-4.1s1.8-4.1 4.1-4.1 4.1 1.8 4.1 4.1-1.9 4.1-4.1 4.1zM40.9 40.9h-7.1V29.8c0-2.7 0-6.1-3.7-6.1s-4.3 2.9-4.3 5.9v11.3h-7.1V18h6.8v3.1h.1c.9-1.8 3.2-3.7 6.6-3.7 7.1 0 8.4 4.7 8.4 10.7v12.8z"/>
      </svg>
    );
  }
  
  // NMIMS
  if (issuer.includes('nmims')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#800020"/>
        <text x="50" y="55" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white">NMIMS</text>
      </svg>
    );
  }
  
  // IBM
  if (issuer.includes('ibm')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path fill="#1F70C1" d="M0 32h8v2H0zM0 36h8v2H0zM10 32h8v2h-8zM10 36h8v2h-8zM10 28h8v2h-8zM10 24h8v2h-8zM0 28h8v2H0zM0 24h8v2H0zM20 32h8v2h-8zM20 36h8v2h-8zM20 28h8v2h-8zM20 24h8v2h-8zM20 20h8v2h-8zM20 16h8v2h-8zM20 12h8v2h-8zM30 32h8v2h-8zM30 36h8v2h-8zM30 28h8v2h-8zM30 24h8v2h-8zM30 20h8v2h-8zM30 16h8v2h-8zM30 12h8v2h-8zM40 32h8v2h-8zM40 36h8v2h-8zM40 28h8v2h-8zM40 24h8v2h-8z"/>
      </svg>
    );
  }
  
  // Meta/Facebook
  if (issuer.includes('meta') || issuer.includes('facebook')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path fill="#0081FB" d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0zm6 24l-1.5 9h-6v15h-6V33h-4.5v-9h4.5v-6c0-4.97 2.03-9 9-9h6v9h-4.5c-.825 0-1.5.675-1.5 1.5V24h6z"/>
      </svg>
    );
  }
  
  // Check for AI/ML related certifications
  if (title.includes('ai') || title.includes('machine learning') || title.includes('deep learning') || title.includes('genai')) {
    return <Brain className="w-12 h-12 text-purple-500" />;
  }
  
  // Check for Cloud certifications
  if (title.includes('cloud') || title.includes('devops')) {
    return <Cloud className="w-12 h-12 text-blue-500" />;
  }
  
  // Check for coding/programming certifications
  if (title.includes('python') || title.includes('javascript') || title.includes('java') || title.includes('cpp') || title.includes('programming')) {
    return <Code className="w-12 h-12 text-green-500" />;
  }
  
  // Check for data related certifications
  if (title.includes('data') || title.includes('analytics') || title.includes('database')) {
    return <Database className="w-12 h-12 text-orange-500" />;
  }
  
  // Check for web development
  if (title.includes('web') || title.includes('frontend') || title.includes('backend') || title.includes('fullstack')) {
    return <Globe className="w-12 h-12 text-cyan-500" />;
  }
  
  // Default certificate logo
  return (
    <div className="relative">
      <Shield className="w-12 h-12 text-primary" />
      <Award className="w-6 h-6 text-primary absolute -bottom-1 -right-1" />
    </div>
  );
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

const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
};

const CertificateCard = ({ cert, i }: { cert: any, i: number }) => {
    const logo = getCertificateLogo(cert);
    const issueDateFormatted = cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
    const expiryDateFormatted = cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
    
    return (
      <motion.div
        custom={i}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{ y: -8 }}
        style={{ perspective: "1000px" }}
      >
        <motion.div
            className="h-full"
            whileHover={{ 
              scale: 1.02, 
              rotateX: 2, 
              rotateY: -2,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
        >
          <Card className="relative h-full flex flex-col bg-gradient-to-br from-amber-50/90 via-white/95 to-amber-50/90 dark:from-zinc-900/95 dark:via-zinc-800/95 dark:to-zinc-900/95 backdrop-blur-sm overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500">
            {/* Certificate border pattern */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="calc(100% - 16)" height="calc(100% - 16)" fill="none" stroke="url(#goldGradient)" strokeWidth="2" strokeDasharray="5 3" opacity="0.3"/>
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#F4E4C1" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Certificate seal/stamp */}
            <div className="absolute top-4 right-4 z-20">
              <motion.div 
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-600 dark:to-amber-800 shadow-lg flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300 dark:border-amber-700 animate-spin-slow" />
              </motion.div>
            </div>
            
            <div className="relative z-10 flex flex-col h-full p-6">
                {/* Certificate Header */}
                <div className="text-center mb-6">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-[0.3em] mb-3">
                      Certificate of Achievement
                    </p>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-wide">
                      {cert.title}
                    </h3>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-3" />
                </div>
                
                {/* Issuer Logo Section */}
                <div className="flex justify-center mb-6">
                    <motion.div 
                      className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-inner border-2 border-amber-200 dark:border-amber-800"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {logo}
                    </motion.div>
                </div>

                {/* Certificate Body */}
                <div className="text-center space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Issued by</p>
                      <p className="font-semibold text-lg text-foreground">{cert.issuer || 'Certification Authority'}</p>
                    </div>
                    
                    {/* Credential ID */}
                    {cert.credentialId && (
                      <div className="inline-block px-4 py-2 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border border-amber-300 dark:border-amber-700">
                        <p className="text-xs text-muted-foreground">Credential ID</p>
                        <p className="font-mono text-sm font-semibold text-foreground">{cert.credentialId}</p>
                      </div>
                    )}
                </div>

                {/* Certificate Footer */}
                <div className="mt-auto">
                    {/* Date Information */}
                    <div className="flex justify-between items-center mb-4 text-xs text-muted-foreground">
                      {issueDateFormatted && (
                        <div>
                          <p className="font-semibold mb-1">Issued</p>
                          <p>{issueDateFormatted}</p>
                        </div>
                      )}
                      {expiryDateFormatted && (
                        <div className="text-right">
                          <p className="font-semibold mb-1">Expires</p>
                          <p>{expiryDateFormatted}</p>
                        </div>
                      )}
                      {!expiryDateFormatted && cert.issueDate && (
                        <div className="text-right">
                          <p className="font-semibold mb-1">No Expiry</p>
                          <p className="text-green-600 dark:text-green-400">Lifetime Valid</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Verification Link */}
                    {cert.verifyUrl && (
                      <motion.a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Verify Certificate</span>
                        <ExternalLink className="h-3 w-3" />
                      </motion.a>
                    )}
                </div>

                {/* Background watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Award className="w-48 h-48 text-foreground" />
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
          </Card>
        </motion.div>
      </motion.div>
    )
}

export function Certifications({ certifications = [] }: CertificationsProps) {
  // Use only data from MongoDB - no fallbacks
  const displayCertifications = certifications || [];
  
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2">
          <SectionTitle>Professional Certifications</SectionTitle>
          <SectionDescription>
            Recognized achievements and verified credentials from leading institutions and platforms
          </SectionDescription>
        </div>
      </div>
      
      {displayCertifications.length > 0 ? (
        <motion.div 
          className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {displayCertifications.map((cert, i) => (
            <CertificateCard key={cert.title + i} cert={cert} i={i} />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-xl bg-card/50 border-2 border-dashed border-primary/20">
            <Award className="w-16 h-16 text-primary/40" />
            <p className="text-muted-foreground">No certifications data available</p>
            <p className="text-sm text-muted-foreground/60">Certifications will appear here once added to the database</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

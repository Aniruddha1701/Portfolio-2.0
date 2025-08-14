import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import ParticlesBackground from '@/components/particles-background';
import CursorFollower from '@/components/cursor-follower';
import { Spotlight } from '@/components/spotlight';
import { AnimatePresence } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Aniruddha Patil | Full Stack Developer',
  description: 'Full Stack Developer with expertise in MERN stack and Machine Learning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><filter id='glow'><feGaussianBlur stdDeviation='3.5' result='coloredBlur'/><feMerge><feMergeNode in='coloredBlur'/><feMergeNode in='SourceGraphic'/></feMerge></filter></defs><path d='M50 15 L20 85 L80 85 Z' fill='none' stroke='%2300f0ff' stroke-width='8' stroke-linejoin='round' /><circle cx='50' cy='15' r='5' fill='%2300f0ff' filter='url(%23glow)' /><circle cx='20' cy='85' r='5' fill='%2300f0ff' filter='url(%23glow)' /><circle cx='80' cy='85' r='5' fill='%2300f0ff' filter='url(%23glow)' /><path d='M35 65 L65 65' stroke='%2300f0ff' stroke-width='8' stroke-linecap='round' /></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Inter:wght@400;500;700&family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CursorFollower />
          <Spotlight />
          <ParticlesBackground />
          <AnimatePresence mode="wait">
            <div className="relative z-10">
              {children}
            </div>
          </AnimatePresence>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

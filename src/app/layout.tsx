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

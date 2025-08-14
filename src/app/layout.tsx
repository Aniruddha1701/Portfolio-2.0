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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><style>@keyframes morph { 0%, 100% { d: path('M50 15 L85 50 L50 85 L15 50 Z'); } 33% { d: path('M50 25 L75 75 L25 75 Z'); } 66% { d: path('M20 20 L80 20 L80 80 L20 80 Z'); } } path { animation: morph 6s infinite ease-in-out; fill: hsl(var(--primary) / 0.8); stroke: hsl(var(--primary)); stroke-width: 5; }</style><path d='M50 15 L85 50 L50 85 L15 50 Z' /></svg>" />
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

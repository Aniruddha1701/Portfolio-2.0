import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { getPortfolioMetadata } from '@/lib/get-portfolio';
import { CustomCursor } from '@/components/effects/custom-cursor';
import { ScrollProgress } from '@/components/effects/scroll-progress';
import { AuthProvider } from '@/lib/auth/auth-context';

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const portfolioMeta = await getPortfolioMetadata();

  return {
    title: portfolioMeta.title,
    description: portfolioMeta.description,
    manifest: '/manifest.webmanifest',
    openGraph: {
      title: portfolioMeta.title,
      description: portfolioMeta.description,
      type: 'website',
      url: process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL ||
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:9002'),
    },
    twitter: {
      card: 'summary_large_image',
      title: portfolioMeta.title,
      description: portfolioMeta.description,
    },
    icons: {
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><style>@keyframes morph { 0%, 100% { d: path('M50 15 L85 50 L50 85 L15 50 Z'); } 33% { d: path('M50 25 L75 75 L25 75 Z'); } 66% { d: path('M20 20 L80 20 L80 80 L20 80 Z'); } } path { animation: morph 6s infinite ease-in-out; fill: rgba(124, 58, 237, 0.8); stroke: rgb(124, 58, 237); stroke-width: 5; }</style><path d='M50 15 L85 50 L50 85 L15 50 Z' /></svg>",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><style>@keyframes morph { 0%, 100% { d: path('M50 15 L85 50 L50 85 L15 50 Z'); } 33% { d: path('M50 25 L75 75 L25 75 Z'); } 66% { d: path('M20 20 L80 20 L80 80 L20 80 Z'); } } path { animation: morph 6s infinite ease-in-out; fill: rgba(124, 58, 237, 0.8); stroke: rgb(124, 58, 237); stroke-width: 5; }</style><path d='M50 15 L85 50 L50 85 L15 50 Z' /></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Lightweight CSS-only ambient background — no JS, no rAF, no re-renders */}
          <div className="fixed inset-0 -z-10 bg-[#0a0a12]">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
          </div>
          <CustomCursor />
          <ScrollProgress />
          <AuthProvider>
            <div className="relative z-10">
              {children}
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

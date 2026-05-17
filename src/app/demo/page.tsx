"use client";

import { ThemeToggle } from "@/components/ui/curtain-theme-toggle";
import Demo from "@/components/ui/demo";

export default function ThemeToggleDemoPage() {
  return (
    <main className="min-h-screen transition-colors duration-300">
      {/* 
        This is a demo page showcasing all three variants of the ThemeToggle component:
        1. Default variant (button hanging from a minimal top bar)
        2. AppBar variant (fully-featured top header with search, app name, logo, avatar and toggle)
        3. Icon variant (standalone button for grids, bento, and custom layouts)
      */}
      <ThemeToggle 
        variant="appbar" 
        duration={550}
        appBarProps={{
          appName: "Starlight Console",
          logo: (
            <div className="size-8 rounded-lg bg-gradient-to-tr from-violet-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              S
            </div>
          ),
          userName: "Anirudh Patil",
          onSearch: (q) => console.log("Searching for:", q),
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center gap-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-500 via-pink-500 to-amber-500 bg-clip-text text-transparent animate-gradient-x py-1">
              Curtain Theme Toggle
            </h1>
            <p className="text-lg opacity-70 leading-relaxed font-sans">
              An immersive, premium-grade full-screen theme transition. Click the toggle button in the header or in the card below to trigger the sweeping curtain effect.
            </p>
          </div>

          {/* Interactive Card Section */}
          <div className="grid md:grid-cols-2 gap-8 w-full">
            {/* Icon Variant Showcase Card */}
            <div className="rounded-2xl p-8 bg-neutral-100/40 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-md flex flex-col items-center justify-between min-h-[300px] text-center shadow-lg transition-transform duration-300 hover:scale-[1.01]">
              <div className="space-y-2">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-violet-500/10 text-violet-500 rounded-full">
                  Icon Variant
                </span>
                <h3 className="text-xl font-bold mt-2">Standalone Toggle</h3>
                <p className="text-sm opacity-60 max-w-xs mx-auto">
                  Perfect for dashboards, custom navigation menus, bento grids, and app sidebars.
                </p>
              </div>
              
              <div className="my-6">
                <Demo />
              </div>

              <span className="text-xs opacity-40">
                Customizable speed and duration parameters
              </span>
            </div>

            {/* Default Variant Showcase Card */}
            <div className="rounded-2xl p-8 bg-neutral-100/40 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-md flex flex-col items-center justify-between min-h-[300px] text-center shadow-lg transition-transform duration-300 hover:scale-[1.01]">
              <div className="space-y-2">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-500 rounded-full">
                  AppBar Integration
                </span>
                <h3 className="text-xl font-bold mt-2">Smooth & Dynamic</h3>
                <p className="text-sm opacity-60 max-w-xs mx-auto">
                  Integrated seamless controls that blend perfectly with user headers, avatars, and search bars.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 my-6 p-4 rounded-xl bg-white/50 dark:bg-black/50 border border-neutral-200/30 dark:border-neutral-800/30 shadow-inner">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Full accessibility (ARIA supported)
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Preserves system theme preferences
                </div>
              </div>

              <span className="text-xs opacity-40">
                Synchronized dark mode across Tailwind CSS classes
              </span>
            </div>
          </div>

          {/* Integration Specs */}
          <div className="w-full max-w-2xl rounded-2xl p-6 bg-neutral-100/30 dark:bg-neutral-900/30 border border-neutral-200/20 dark:border-neutral-800/20 backdrop-blur-sm space-y-4">
            <h4 className="font-bold text-lg">💡 Quick Integration Guideline</h4>
            <ul className="space-y-2.5 text-sm opacity-80 list-disc list-inside">
              <li>
                <strong>Global Dark Mode Support:</strong> The toggle dynamically appends/removes the <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-xs">dark</code> class to the root <code className="font-mono text-xs">&lt;html&gt;</code> element.
              </li>
              <li>
                <strong>Custom Easing:</strong> Uses <code className="font-mono text-xs">cubic-bezier(0.76, 0, 0.24, 1)</code> for a physical-curtain feel.
              </li>
              <li>
                <strong>State Synchronization:</strong> Syncs on initial mount to respect SSR constraints and prevent flashes of unstyled content.
              </li>
            </ul>
          </div>
        </div>
      </ThemeToggle>
    </main>
  );
}

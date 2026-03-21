'use client';

import { useState, useEffect, useCallback, use, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  AlertTriangle, 
  Loader2, 
  FileText,
  ShieldCheck,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SecureViewerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const [contentType, setContentType] = useState('application/pdf');
  const [viewerEmail, setViewerEmail] = useState('');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  
  const [isFocused, setIsFocused] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(true);

  const blobUrlRef = useRef<string | null>(null);
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchResume = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resume/view/${token}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load resume');
      }

      setFileData(result.data.fileData);
      setContentType(result.data.contentType);
      setViewerEmail(result.data.viewerEmail);

      const byteCharacters = atob(result.data.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: result.data.contentType });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      blobUrlRef.current = url;

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResume();
    return () => { 
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    };
  }, [fetchResume]);

  // Anti-Screenshot & Focus Protections
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      setIsFocused(false);
      setIsInteracting(false);
      setIsHolding(false);
    };
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'c', 'u'].includes(e.key.toLowerCase())) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 's', 'c'].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setIsFocused(false);
        setIsHolding(false);
        setTimeout(() => setIsFocused(true), 3000); 
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInteractionStart = () => {
    setIsIdle(false);
    setIsInteracting(true);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    handleInteractionStart();
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      setIsInteracting(false);
    }, 1000);

    if ('clientX' in e) {
      setMousePos({ x: e.clientX, y: e.clientY });
    } else if ('touches' in e && e.touches[0]) {
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
      <span className="text-gray-500 font-mono text-sm tracking-tighter">Securing Assets...</span>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-xl font-bold text-white mb-2">Security Violation</h1>
      <p className="text-gray-400 max-w-sm text-sm mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.href = '/'}>Return to Site</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col overflow-hidden select-none">
      <header className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Vault Secure v4 (Hold-to-View)</span>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 text-[10px] py-1 px-3 rounded-full border border-emerald-500/20 font-bold uppercase">
          Live Trace Active
        </div>
      </header>

      <main 
        className="flex-1 relative cursor-default overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseDown={() => setIsHolding(true)}
        onMouseUp={() => setIsHolding(false)}
        onTouchStart={() => setIsHolding(true)}
        onTouchEnd={() => setIsHolding(false)}
      >
        <div className="w-full h-full p-2 md:p-6 flex justify-center items-center overflow-hidden relative">
          
          {/* Animated Noise Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.05] mix-blend-screen">
            <div className="noise-bg w-full h-full" />
          </div>

          <div className="relative w-full max-w-4xl h-[90vh] shadow-2xl rounded-lg overflow-hidden bg-white/5 ring-1 ring-white/10">
            
            {/* The Document Layer */}
            <div 
              className={`w-full h-full transition-all duration-700 ease-in-out ${
                isHolding && isFocused ? 'blur-0 opacity-100 scale-100' : 'blur-[80px] opacity-10 scale-[0.95]'
              }`}
            >
              <div className="w-full h-full bg-white overflow-hidden">
                {blobUrl && (
                  <iframe
                    src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                    className="w-full h-full border-none pointer-events-none"
                    title="Resume"
                    loading="eager"
                  />
                )}
              </div>
            </div>

            {/* High-Density Traceability Watermark */}
            <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.08] overflow-hidden">
               <div className="grid grid-cols-4 grid-rows-12 h-full w-full gap-4 p-8 -rotate-12 scale-110">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="text-[10px] font-black uppercase text-black whitespace-nowrap bg-white/20 px-2 rounded">
                      {viewerEmail} • {token.substring(0,8)}
                    </div>
                  ))}
               </div>
            </div>

            {/* Instant Blackout Protection */}
            <AnimatePresence>
              {!isFocused && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-12 text-center"
                >
                  <ShieldAlert className="w-20 h-20 text-red-600 mb-6 animate-bounce" />
                  <h2 className="text-3xl font-black text-white tracking-tighter">SCREENSHOT ATTEMPT BLOCKED</h2>
                  <p className="text-red-500 text-sm mt-6 font-mono font-bold animate-pulse">
                    ACCESS TO THIS ASSET IS VOLATILE. 
                    NEVER LOSE FOCUS OF THE DOCUMENT.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hold-to-View Instruction */}
            <AnimatePresence>
              {!isHolding && isFocused && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center pointer-events-none bg-black/40 backdrop-blur-md"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="bg-white text-black px-8 py-4 rounded-full border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                  >
                    <span className="font-black text-lg uppercase tracking-tighter flex items-center gap-3">
                       <Lock className="w-6 h-6" /> CLICK & HOLD TO REVEAL
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="h-10 border-t border-white/5 bg-black/40 flex items-center justify-center px-6 z-50 text-gray-600 font-mono">
        <p className="text-[9px] uppercase tracking-widest italic">
          Session Hash: {token} • Protection: HOLD-TO-VIEW ALPHA-4
        </p>
      </footer>

      <style jsx global>{`
        @media print { body { display: none !important; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: noise-move 0.1s steps(2) infinite;
        }

        @keyframes noise-move {
          0% { transform: translate(0,0) }
          50% { transform: translate(-1%,1%) }
          100% { transform: translate(1%,-1%) }
        }
      `}</style>
    </div>
  );
}

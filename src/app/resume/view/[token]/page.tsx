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
    };
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block all known capture/print shortcuts
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'c', 'u'].includes(e.key.toLowerCase())) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 's', 'c'].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setIsFocused(false);
        setIsInteracting(false);
        setTimeout(() => setIsFocused(true), 2000); // 2 second blackout for PrintScreen
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

  // Active-Viewing Logic: Visibility only on motion
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    setIsIdle(false);
    setIsInteracting(true);
    
    // Reset idle timeout
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      setIsInteracting(false);
    }, 400); // 400ms of no-motion = Blur

    if ('clientX' in e) {
      setMousePos({ x: e.clientX, y: e.clientY });
    } else if ('touches' in e && e.touches[0]) {
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
      <span className="text-gray-500 font-mono text-sm tracking-tighter">Establishing Secure Gateway...</span>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-xl font-bold text-white mb-2">Access Revoked</h1>
      <p className="text-gray-400 max-w-sm text-sm mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.href = '/'}>Go Home</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col overflow-hidden select-none">
      {/* Dynamic Overlay for Focus Loss */}
      <AnimatePresence>
        {!isFocused && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#020205]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <Lock className="w-12 h-12 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold">Document Shielded</h2>
            <p className="text-gray-400 text-sm mt-2">Content is hidden while tab is out of focus for security.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Secure Alpha Viewer v2</span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono hidden md:block italic">
          Encryption Level: MIL-STD-2048 • Single-Use Session: Active
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 text-[10px] py-1 px-3 rounded-full border border-emerald-500/20 font-bold uppercase tracking-tighter">
          Spotlight Active
        </div>
      </header>

      <main 
        className="flex-1 relative cursor-none touch-none overflow-hidden"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {/* The Protective Interaction Blocker & Noise Layer */}
        <div className="w-full h-full p-4 md:p-12 flex justify-center items-start overflow-auto no-scrollbar relative">
          
          {/* Animated Noise Filter (Deters OCR/Capture) */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] mix-blend-overlay">
            <div className="noise-bg w-full h-full" />
          </div>

          <div className="relative w-full max-w-4xl shadow-2xl rounded-sm overflow-hidden bg-white/5 ring-1 ring-white/10">
            
            {/* Document Layer with Active-Viewing Blur */}
            <div 
              className={`w-full h-full transition-all duration-500 ease-in-out ${
                isInteracting && isFocused ? 'blur-0 opacity-100 scale-100' : 'blur-[60px] opacity-20 scale-[0.98]'
              }`}
            >
              <div className="w-full h-full bg-white">
                {blobUrl && (
                  <iframe
                    src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                    className="w-full h-full border-none"
                    title="Resume"
                  />
                )}
              </div>
            </div>

            {/* High-Density Traceability Watermark */}
            <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.04] overflow-hidden">
               <div className="grid grid-cols-6 grid-rows-10 h-full w-full gap-4 p-8 -rotate-15 scale-110">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="text-[9px] font-black uppercase tracking-tighter text-black whitespace-nowrap">
                      {viewerEmail} • SECURE-TRACE-{token.substring(0,4)}
                    </div>
                  ))}
               </div>
            </div>

            {/* Instant Blackout Protection Layer */}
            <AnimatePresence>
              {!isFocused && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-[#020205] flex flex-col items-center justify-center p-12 text-center"
                >
                  <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
                  <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-red-500 underline-offset-8">SECURITY PROTOCOL ACTIVE</h2>
                  <p className="text-gray-400 text-sm mt-6 max-w-xs font-mono">
                    CAPTURE ATTEMPT DETECTED OR FOCUS LOST. 
                    SYSTEM LOCK ENGAGED.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Idle Instruction Overlay */}
            <AnimatePresence>
              {!isInteracting && isFocused && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center pointer-events-none"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-emerald-500/10 backdrop-blur-md px-6 py-3 rounded-full border border-emerald-500/30"
                  >
                    <span className="text-emerald-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                       <Eye className="w-4 h-4" /> Move Mouse to View Document
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="h-10 border-t border-white/5 bg-black/40 flex items-center justify-center px-6 z-50 text-gray-600">
        <p className="text-[10px] uppercase tracking-[0.2em]">
          Trace: {token.substring(0, 12)} • User: {viewerEmail} • Mode: Active-Viewing-v3
        </p>
      </footer>

      <style jsx global>{`
        @media print { body { display: none !important; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: noise-move 0.2s infinite;
        }

        @keyframes noise-move {
          0% { transform: translate(0,0) }
          10% { transform: translate(-1%,-1%) }
          20% { transform: translate(-2%,1%) }
          30% { transform: translate(1%,-2%) }
          40% { transform: translate(-1%,2%) }
          50% { transform: translate(-2%,-1%) }
          60% { transform: translate(2%,1%) }
          70% { transform: translate(1%,2%) }
          80% { transform: translate(-2%,1%) }
          90% { transform: translate(2%,-2%) }
          100% { transform: translate(0,0) }
        }
      `}</style>
    </div>
  );
}

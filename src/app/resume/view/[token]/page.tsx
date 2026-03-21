'use client';

import { useState, useEffect, useCallback, use } from 'react';
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(true);

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

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResume();
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
  }, [fetchResume, blobUrl]);

  // Anti-Screenshot & Focus Protections
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block all known capture/print shortcuts
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'c', 'u'].includes(e.key.toLowerCase())) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 's', 'c'].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setIsFocused(false); // Hide content on PrintScreen press
        setTimeout(() => setIsFocused(true), 1000);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    
    const handleVisibilityChange = () => {
      setIsFocused(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Spotlight Tracking
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    setIsIdle(false);
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
        {/* The Spotlight Container */}
        <div className="w-full h-full p-4 md:p-12 flex justify-center items-start overflow-auto no-scrollbar">
          <div className="relative w-full max-w-4xl shadow-2xl rounded-sm overflow-hidden bg-white/5 ring-1 ring-white/10">
            
            {/* Blurry Background Layer */}
            <div className={`w-full h-full transition-all duration-700 ${isFocused ? 'blur-[20px] opacity-40 scale-[1.02]' : 'blur-[50px] opacity-0'}`}>
               <div className="aspect-[1/1.41] bg-white/5 flex items-center justify-center">
                  <FileText className="w-32 h-32 text-white/10" />
               </div>
            </div>

            {/* Clear Spotlight Layer */}
            <div 
              className="absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none"
              style={{
                opacity: isFocused ? 1 : 0,
                WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y - 56}px, black 0%, transparent 100%)`,
                maskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y - 56}px, black 0%, transparent 100%)`,
              }}
            >
              <div className="w-full h-full bg-black">
                {blobUrl && (
                  <iframe
                    src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    className="w-full h-full border-none pointer-events-none"
                    title="Resume"
                  />
                )}
              </div>
            </div>

            {/* Advanced Watermark Grid */}
            <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.05] overflow-hidden">
               <div className="grid grid-cols-4 grid-rows-6 h-full w-full gap-8 p-12 -rotate-12 scale-125">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="text-[10px] font-black uppercase tracking-tighter text-white whitespace-nowrap">
                      {viewerEmail} • {new Date().toLocaleDateString()}
                    </div>
                  ))}
               </div>
            </div>

            {/* Visual Instruction Overlay (Fades out) */}
            <AnimatePresence>
              {isIdle && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center"
                >
                  <Eye className="w-12 h-12 text-emerald-500 mb-4" />
                  <h3 className="text-lg font-bold">Move pointer to reveal content</h3>
                  <p className="text-sm text-gray-400 mt-2 max-w-xs">
                    This document is protected by **Spotlight Shield**. You can only view small sections at a time 
                    to prevent unauthorized screen captures.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* The Flashlight Pointer (Custom Cursor) */}
        {!isIdle && isFocused && (
          <div 
            className="fixed pointer-events-none z-[100] w-[120px] h-[120px] rounded-full border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] ring-[100vw] ring-black/40"
            style={{ 
              left: mousePos.x - 60, 
              top: mousePos.y - 60,
              transition: 'transform 0.1s ease-out'
            }}
          />
        )}
      </main>

      <footer className="h-10 border-t border-white/5 bg-black/40 flex items-center justify-center px-6 z-50 text-gray-600">
        <p className="text-[10px] uppercase tracking-[0.2em]">
          Trace: {token.substring(0, 12)} • User: {viewerEmail} • Protocol: Spotlight-V2
        </p>
      </footer>

      <style jsx global>{`
        @media print { body { display: none !important; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

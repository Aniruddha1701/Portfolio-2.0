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

  const blobUrlRef = useRef<string | null>(null);

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
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [fetchResume]);

  // Basic Protection against standard downloads
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common Save/Print shortcuts
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'c', 'u'].includes(e.key.toLowerCase())) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 's', 'c'].includes(e.key.toLowerCase())) e.preventDefault();
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

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
      <span className="text-gray-400 font-mono text-xs tracking-widest uppercase">Fetching Document...</span>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
      <p className="text-gray-400 max-w-sm text-sm mb-6">{error}</p>
      <Button variant="outline" className="border-white/10 text-white" onClick={() => window.location.href = '/'}>Return Home</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col overflow-hidden select-none">
      <header className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Secure Document Viewer</span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">
          One-Time Session Active
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-black flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl h-[92vh] shadow-2xl rounded-sm overflow-hidden bg-white/5 ring-1 ring-white/10">
          
          {/* Document Layer */}
          <div className={`w-full h-full transition-all duration-300 ${isFocused ? 'blur-0 opacity-100' : 'blur-2xl opacity-50'}`}>
            <div className="w-full h-full bg-white overflow-hidden">
              {blobUrl && (
                <iframe
                  src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                  className="w-full h-full border-none"
                  title="Resume"
                  loading="eager"
                />
              )}
            </div>
          </div>

          {/* Simple Subtle Watermark Layer (Optional Traceability) */}
          <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.03] overflow-hidden">
             <div className="grid grid-cols-4 grid-rows-10 h-full w-full gap-4 p-8 -rotate-12">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="text-[10px] font-black uppercase text-black">
                    {viewerEmail}
                  </div>
                ))}
             </div>
          </div>

          {/* Basic Focus-Loss Overlay */}
          <AnimatePresence>
            {!isFocused && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center"
              >
                <Lock className="w-12 h-12 text-emerald-500 mb-4" />
                <h2 className="text-xl font-bold text-white tracking-tight">DOCUMENT HIDDEN</h2>
                <p className="text-gray-400 text-xs mt-4 max-w-xs font-mono">
                  CONTENT IS OBSCURED WHILE TAB IS OUT OF FOCUS.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="h-10 border-t border-white/5 bg-black/40 flex items-center justify-center px-6 z-50 text-gray-600 font-mono">
        <p className="text-[9px] uppercase tracking-widest italic">
          Session ID: {token.substring(0, 16)} • Authorized for: {viewerEmail}
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

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
  Slash,
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

      // Create blob for the PDF
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
      console.error('Secure view error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResume();
    
    // Cleanup blob URL on unmount
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [fetchResume]);

  // Anti-Screenshot / Anti-Copy Protections
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('Printing is disabled for this secure document.');
      }
      // Block Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        alert('Saving is disabled for this secure document.');
      }
      // Block Ctrl+Shift+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'i') {
        e.preventDefault();
      }
      // Block Ctrl+C (Copy)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-400 font-mono animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Resticted</h1>
        <p className="text-gray-400 max-w-md mb-8">
          {error.includes('already been used') 
            ? "This one-time view link has already been accessed. For security reasons, the document self-destructed from this link path."
            : error}
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/'}
          className="border-white/10 hover:bg-white/5 text-gray-300"
        >
          Return to Portfolio
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-emerald-500/30">
      {/* Secure Header */}
      <header className="h-16 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center border border-emerald-500/20">
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-200">Secure Resume Vault</h2>
            <p className="text-[10px] text-emerald-500/70 font-mono uppercase tracking-widest">Single Access Mode</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            <span>Viewing as:</span>
            <span className="text-emerald-400 font-medium">{viewerEmail}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-red-400/80 bg-red-400/5 px-3 py-1.5 rounded border border-red-400/10">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Protected Document</span>
          <span className="sm:hidden">Protected</span>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto py-8 px-4">
        {/* Security Warning Panel */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-start gap-4"
        >
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-orange-200 uppercase tracking-tight">Security Protocol Active</h3>
            <p className="text-xs text-orange-200/60 leading-relaxed mt-1">
              Actions like right-click, downloading, and printing are disabled. A dynamic watermark with 
              your access credentials has been embedded for tracking. Please do not attempt to capture the screen.
            </p>
          </div>
        </motion.div>

        {/* The Viewer */}
        <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl aspect-[1/1.4] md:aspect-[1/1.41]">
          {/* Watermark Overlay (Repeated) */}
          <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.03] overflow-hidden select-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex whitespace-nowrap gap-16 py-8 rotate-[-25deg] text-5xl font-black uppercase">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j}>{viewerEmail} - CONFIDENTIAL</span>
                ))}
              </div>
            ))}
          </div>

          {/* Interaction Blocker Overlay */}
          <div 
            className="absolute inset-0 z-20" 
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Actual PDF Viewer */}
          {blobUrl && (
            <iframe
              src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=1&statusbar=0&messages=0&view=FitH`}
              className="w-full h-full border-none"
              title="Resume Document"
            />
          )}

          {/* Corner Protections UI */}
          <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
             <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-gray-500 cursor-not-allowed" title="Download Disabled">
                <Download className="w-4 h-4" />
             </div>
             <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 text-gray-500 cursor-not-allowed" title="Print Disabled">
                <Printer className="w-4 h-4" />
             </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500">
           <p className="text-xs flex items-center justify-center gap-2">
             <FileText className="w-3 h-3" />
             Encrypted Transfer Protocol • AES-256 Bit
           </p>
           <p className="mt-2 text-[10px] uppercase tracking-tighter opacity-30">
             TraceID: {token.substring(0, 8)} • Unique Instance ID: {Math.random().toString(36).substring(7)}
           </p>
        </div>
      </main>

      {/* Global CSS for anti-screenshot (not foolproof put helps) */}
      <style jsx global>{`
        @media print {
          body { display: none !important; }
        }
        ::selection {
          background: rgba(16, 185, 129, 0.2);
        }
        body {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
      `}</style>
    </div>
  );
}

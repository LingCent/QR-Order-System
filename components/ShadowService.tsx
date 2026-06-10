import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, UserRound, UtensilsCrossed, X, FileText, GlassWater, CheckCircle2 } from 'lucide-react';
import { SERVICE_AGENT } from '../constants';

interface ShadowServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShadowService: React.FC<ShadowServiceProps> = ({ isOpen, onClose }) => {
  const [requestSent, setRequestSent] = useState<string | null>(null);

  const handleRequest = (requestType: string) => {
    // Simulate WAL (Write-Ahead Log) locking and network request
    if (navigator.vibrate) navigator.vibrate(10); // Subtle haptic ack
    setRequestSent(requestType);
    
    // Auto-close after acknowledgement to respect user flow
    setTimeout(() => {
        setRequestSent(null);
        onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop: Context preservation (Blur allows seeing the menu behind) */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm"
          />
          
          {/* Intelligent Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220, mass: 0.8 }}
            className="fixed top-0 right-0 h-full w-[75%] max-w-sm z-[80] bg-[#050505]/95 backdrop-blur-2xl border-l border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-12 shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-1">Shadow Service</span>
                <span className="text-xs text-neutral-500 font-mono">Connected to Table #12</span>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 -mr-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dynamic Content */}
            <div className="flex-1 space-y-8 overflow-y-auto">
              {requestSent ? (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-48 text-center space-y-4"
                 >
                    <div className="w-16 h-16 rounded-full bg-electric-mint/10 flex items-center justify-center text-electric-mint">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-white font-medium">Request Logged</h3>
                        <p className="text-sm text-neutral-500 mt-1">{SERVICE_AGENT.name} has been notified for "{requestSent}".</p>
                    </div>
                 </motion.div>
              ) : (
                <>
                    <ServiceOption 
                        icon={<Wine size={20}/>} 
                        label="Sommelier Advice" 
                        sub="Pairing for Wagyu" 
                        onClick={() => handleRequest('Sommelier')}
                    />
                    <ServiceOption 
                        icon={<GlassWater size={20}/>} 
                        label="Refill Water" 
                        sub="Sparkling or Still" 
                        onClick={() => handleRequest('Water Refill')}
                    />
                    <ServiceOption 
                        icon={<UtensilsCrossed size={20}/>} 
                        label="Missing Cutlery" 
                        sub="Forks, Napkins, etc." 
                        onClick={() => handleRequest('Cutlery')}
                    />
                    {/* Solving the Digital Divide */}
                    <div className="pt-4 border-t border-white/5">
                        <ServiceOption 
                            icon={<FileText size={20}/>} 
                            label="Request Paper Menu" 
                            sub="Prefer analog browsing" 
                            onClick={() => handleRequest('Paper Menu')}
                            highlight
                        />
                    </div>
                </>
              )}
            </div>

            {/* Human Connection Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                    <img 
                        src={SERVICE_AGENT.photoUrl} 
                        alt="Agent" 
                        className="w-10 h-10 rounded-full object-cover grayscale contrast-125 border border-white/10"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-electric-mint rounded-full border-2 border-[#050505]" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium flex items-center gap-2">
                      {SERVICE_AGENT.name} is nearby
                  </p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wide">Avg. response 90s</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ServiceOption = ({ icon, label, sub, onClick, highlight = false }: { icon: any; label: string; sub: string; onClick: () => void; highlight?: boolean }) => (
  <button 
    onClick={onClick}
    className="w-full text-left group relative"
  >
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-full transition-colors ${highlight ? 'bg-white/10 text-white' : 'bg-transparent text-neutral-500 group-hover:text-[#D4AF37]'}`}>
        {icon}
      </div>
      <div className="flex flex-col">
          <span className={`text-base font-medium transition-colors ${highlight ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
            {label}
          </span>
          <span className="text-xs text-neutral-600 group-hover:text-neutral-500">{sub}</span>
      </div>
    </div>
    {/* Hover Indicator */}
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[#D4AF37] group-hover:h-8 transition-all duration-300 opacity-0 group-hover:opacity-100 -ml-4" />
  </button>
);

export default ShadowService;
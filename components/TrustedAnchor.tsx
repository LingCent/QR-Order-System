import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface TrustedAnchorProps {
  onVerified: () => void;
}

const TrustedAnchor: React.FC<TrustedAnchorProps> = ({ onVerified }) => {
  const [stage, setStage] = useState<'scanning' | 'verifying' | 'verified' | 'expanded'>('scanning');

  useEffect(() => {
    // Sequence the animation stages
    const t1 = setTimeout(() => setStage('verifying'), 800);
    const t2 = setTimeout(() => setStage('verified'), 2000);
    const t3 = setTimeout(() => {
      setStage('expanded');
    }, 3000);
    const t4 = setTimeout(() => {
        onVerified();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // FIXED: Empty dependency array ensures this runs ONCE per mount, ignoring prop updates.

  // Dynamic Island States
  const isExpanded = stage === 'expanded';
  const isVerified = stage === 'verified' || stage === 'expanded';

  return (
    <div className={`fixed inset-x-0 top-0 z-50 flex justify-center items-start pt-2 transition-all duration-700 pointer-events-none ${isExpanded ? 'h-0 opacity-0' : 'h-full'}`}>
      
      {/* The Dynamic Island Capsule */}
      <div 
        className={`relative bg-obsidian border border-neutral-800 shadow-2xl overflow-hidden transition-all duration-500 ease-sovereign ${
            stage === 'scanning' ? 'w-12 h-8 rounded-full' :
            stage === 'verifying' ? 'w-48 h-10 rounded-full' :
            stage === 'verified' ? 'w-[90%] h-16 rounded-[2rem] border-electric-mint/30 shadow-[0_0_30px_rgba(0,245,212,0.2)]' :
            'w-[90%] h-16 rounded-[2rem] opacity-0 translate-y-[-100%]' // Exit state
        }`}
      >
        <div className="flex items-center justify-center h-full w-full relative">
            
            {/* Stage 1: Scanning Pulse */}
            {stage === 'scanning' && (
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-pulse" />
            )}

            {/* Stage 2: Verifying Text */}
            {stage === 'verifying' && (
                <span className="text-[10px] font-mono text-neutral-400 tracking-widest animate-pulse">
                    VERIFYING ANCHOR
                </span>
            )}

            {/* Stage 3: Success Pulse & Lock */}
            {isVerified && !isExpanded && (
                <div className="flex items-center gap-3 px-4 w-full justify-between animate-jump-in">
                    <div className="flex items-center gap-2">
                         <div className="relative">
                            <ShieldCheck size={20} className="text-electric-mint" />
                            <div className="absolute inset-0 bg-electric-mint blur-lg opacity-40 animate-pulse" />
                         </div>
                         <div className="flex flex-col">
                             <span className="text-xs font-bold text-white tracking-wide">Table #12</span>
                             <span className="text-[9px] text-electric-mint font-mono">SECURE</span>
                         </div>
                    </div>
                    <Lock size={14} className="text-neutral-600" />
                </div>
            )}

            {/* Background Liquid Fill Effect for verification */}
            <div className={`absolute bottom-0 left-0 h-1 bg-electric-mint transition-all duration-[1200ms] ease-out ${stage === 'verifying' ? 'w-full' : 'w-0'}`} />
        </div>
      </div>
    </div>
  );
};

export default TrustedAnchor;
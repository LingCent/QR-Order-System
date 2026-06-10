import React from 'react';
import { SERVICE_AGENT } from '../constants';
import { OrderStatus } from '../types';
import { Cpu, ShieldCheck, Heart, Activity } from 'lucide-react';

interface ShadowLaborProps {
  status: OrderStatus;
  orderId: string;
  isLegacy: boolean;
}

export const ShadowLaborMonitor: React.FC<ShadowLaborProps> = ({ status, orderId, isLegacy }) => {
  
  // Human-Centric Narrative Logic
  // Translates cold machine states into warm, labor-intensive actions performed by Alex.
  const getAgentNarrative = () => {
    switch (status) {
      case 'LOGGED': return `${SERVICE_AGENT.name} is personally verifying your table anchor for security protocols.`;
      case 'KITCHEN': return `${SERVICE_AGENT.name} has prioritized your request with the Head Chef and confirmed allergen safety.`;
      case 'CRAFTING': return `${SERVICE_AGENT.name} is performing a visual quality audit on your items before plating.`;
      case 'SERVED': return `${SERVICE_AGENT.name} is finalizing your table experience details for presentation.`;
      default: return 'Optimizing your service flow...';
    }
  };

  return (
    <div className={`relative overflow-hidden group border rounded-xl transition-all duration-500 ${
        isLegacy 
        ? 'bg-neutral-50 border-neutral-200 p-6' 
        : 'bg-neutral-900/40 border-white/5 p-6 hover:border-luxury-gold/20'
    }`}>
      
      {/* 1. Service Agent Identity Layer */}
      <div className="flex items-center gap-5 mb-6 relative z-10">
        <div className="relative">
          <img 
            src={SERVICE_AGENT.photoUrl} 
            className={`w-14 h-14 rounded-full object-cover border transition-all duration-700 ${
                isLegacy 
                ? 'border-neutral-300 grayscale-0' 
                : 'border-white/10 grayscale group-hover:grayscale-0 contrast-125'
            }`} 
            alt={SERVICE_AGENT.name} 
          />
          <div className="absolute -bottom-1 -right-1 bg-electric-mint w-3.5 h-3.5 rounded-full border-2 border-[#050505] animate-pulse" />
        </div>
        <div>
          <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${
              isLegacy ? 'text-neutral-900' : 'text-white'
          }`}>
            {SERVICE_AGENT.name}
          </h4>
          <p className={`text-[9px] uppercase tracking-tighter ${
              isLegacy ? 'text-neutral-500' : 'text-neutral-500'
          }`}>
            {SERVICE_AGENT.role} • Active
          </p>
        </div>
      </div>

      {/* 2. Narrative Stream (The "Why" behind the wait) */}
      <div className="relative pl-4 border-l border-dashed border-white/10 ml-2 space-y-4 z-10">
        <div className="flex flex-col gap-2">
            <div className={`text-[9px] uppercase font-bold tracking-widest flex items-center gap-2 ${
                isLegacy ? 'text-neutral-400' : 'text-luxury-gold'
            }`}>
                <Activity size={10} className="animate-pulse" />
                Live Shadow Work
            </div>
            <p className={`text-sm font-serif italic leading-relaxed transition-opacity duration-500 ${
                isLegacy ? 'text-neutral-700' : 'text-neutral-300'
            }`}>
               "{getAgentNarrative()}"
            </p>
        </div>
      </div>

      {/* 3. Transparency Metrics (The Proof of Work) */}
      <div className={`grid grid-cols-2 gap-4 mt-6 pt-4 border-t relative z-10 ${
          isLegacy ? 'border-neutral-200' : 'border-white/5'
      }`}>
           <div className="flex items-center gap-2">
              <ShieldCheck size={12} className={isLegacy ? 'text-neutral-600' : 'text-electric-mint'} />
              <span className={`text-[8px] uppercase font-mono ${
                  isLegacy ? 'text-neutral-400' : 'text-white/30'
              }`}>
                  Protocol: Secure
              </span>
           </div>
           <div className="flex items-center gap-2">
              <Cpu size={12} className={isLegacy ? 'text-neutral-400' : 'text-white/20'} />
              <span className={`text-[8px] uppercase font-mono ${
                  isLegacy ? 'text-neutral-400' : 'text-white/30'
              }`}>
                  Sync: 12ms
              </span>
           </div>
      </div>

      {/* Background Ambient Effect (Non-Legacy Only) */}
      {!isLegacy && (
          <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
             <Heart size={100} className="text-luxury-gold rotate-12" strokeWidth={0.5} />
          </div>
      )}
    </div>
  );
};

import React from 'react';
import { useSocial } from '../contexts/SocialContext';
import { Users, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SocialPresence: React.FC = () => {
  const { peers } = useSocial();
  
  // Filter active peers (excluding self, although self is not in peers array in this implementation)
  const activePeers = peers.filter(p => p.currentAction && !p.isSelf);

  return (
    <div className="fixed bottom-24 left-0 right-0 z-[60] pointer-events-none flex flex-col items-center gap-3">
      <AnimatePresence>
        {activePeers.map(peer => (
          <motion.div 
            key={peer.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-obsidian/80 backdrop-blur-xl border border-luxury-gold/30 px-4 py-2 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          >
            <div className="relative">
                <img src={peer.avatar} className="w-6 h-6 rounded-full grayscale border border-white/10" alt={peer.name} />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-electric-mint rounded-full border border-black animate-pulse" />
            </div>
            
            <div className="flex flex-col">
                <div className="text-[9px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                    <span>{peer.name}</span>
                    <span className="text-white/30">•</span>
                    <span className="italic">{peer.currentAction?.type}</span>
                </div>
                <div className="text-xs text-white font-medium flex items-center gap-1">
                    <Eye size={10} className="text-luxury-gold" />
                    <span className="text-luxury-gold truncate max-w-[120px]">{peer.currentAction?.itemName}</span>
                </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Persistent Table Anchor */}
      <div className="bg-black/40 border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm pointer-events-auto transition-all hover:bg-black/60">
         <Users size={10} className="text-neutral-500" />
         <span className="text-[8px] text-white/40 uppercase tracking-[0.2em]">Table Session Active • {peers.length + 1} Guests</span>
      </div>
    </div>
  );
};

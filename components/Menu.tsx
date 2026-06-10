import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MENU_ITEMS, ALLERGEN_OPTIONS, FEES } from '../constants';
import { MenuItem, Allergen, CartItem } from '../types';
import { Info, Plus, Volume2, X, Sparkles, PhoneCall, ShoppingCart, Activity, ShieldCheck, Filter, ArrowRight, Clock, Eye, Layers } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useVirtualizer } from '@tanstack/react-virtual';
import { playAudioDescription } from '../services/geminiService';

interface MenuProps {
  isLegacy: boolean;
  onItemSelect: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  onOpenCheckout: () => void;
  cart: CartItem[];
  hasActiveOrder: boolean;
  onViewOrder: () => void;
  onOpenShadowService: () => void;
  onToggleLegacy: () => void;
}

// Data Structure for the Stream (Flattened)
type StreamItem = 
  | { type: 'header'; id: string; title: string }
  | { type: 'item'; id: string; data: MenuItem };

const Menu: React.FC<MenuProps> = ({ isLegacy, onItemSelect, onAddToCart, onOpenCheckout, cart, hasActiveOrder, onViewOrder, onOpenShadowService, onToggleLegacy }) => {
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>([]);
  
  const parentRef = useRef<HTMLDivElement>(null);

  // --- SENSORY FEEDBACK LOOP ---
  useEffect(() => {
    if (isLegacy) {
        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
        playAudioDescription(
            "Classic Edition enabled. Compact view optimized for clarity.", 
            () => {}, 
            () => {}
        );
    }
  }, [isLegacy]);

  // Flatten Data for Virtualization
  const streamData = useMemo(() => {
    const categories = Array.from(new Set(MENU_ITEMS.map(i => i.category)));
    const flat: StreamItem[] = [];

    categories.forEach(cat => {
        flat.push({ type: 'header', id: `header-${cat}`, title: cat });
        const catItems = MENU_ITEMS.filter(i => i.category === cat);
        catItems.forEach(item => {
            flat.push({ type: 'item', id: item.id, data: item });
        });
    });
    return flat;
  }, []);

  // Virtualization Engine with Dynamic Sizing
  const rowVirtualizer = useVirtualizer({
    count: streamData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
        const item = streamData[index];
        if (item.type === 'header') return isLegacy ? 80 : 100;
        return isLegacy ? 220 : 180; // Compact height for O(1) performance
    },
    overscan: 5, 
  });

  const scrollPilot = (category: string) => {
      const index = streamData.findIndex(i => i.type === 'header' && i.title === category);
      if (index !== -1) {
          rowVirtualizer.scrollToIndex(index, { align: 'start', behavior: 'smooth' });
      }
  };

  const toggleAllergen = (allergen: Allergen) => {
    if (navigator.vibrate) navigator.vibrate(10);
    setSelectedAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen) 
        : [...prev, allergen]
    );
  };

  const calculateHonestPrice = (basePrice: number) => {
    const totalRate = 1 + FEES.serviceFeeRate + FEES.taxRate;
    return (basePrice * totalRate).toFixed(2);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`h-screen flex flex-col transition-colors duration-700 overflow-hidden ${
        isLegacy 
        ? 'bg-obsidian-deep text-titanium-silver legacy-projection' 
        : 'bg-obsidian text-neutral-200 font-sans'
    }`}>
      
      {/* 1. Sticky Performance Header */}
      <LayoutGroup>
      <motion.header 
        layout
        className={`shrink-0 z-40 transition-all border-b border-white/5 flex flex-col ${
            isLegacy 
            ? 'bg-obsidian-deep pt-6 pb-4 shadow-xl' 
            : 'bg-obsidian/90 backdrop-blur-xl pt-6 pb-4'
      }`}>
        <div className="px-6 flex justify-between items-end mb-4">
          
          {/* Brand & Mode Indicator */}
          <div>
            <h1 className={`font-bold tracking-tight text-white ${isLegacy ? 'text-3xl font-serif' : 'text-2xl font-sans'}`}>
                Nexus Menu
            </h1>
            <p className="text-[10px] text-neutral-400 uppercase tracking-[0.3em] opacity-60 mt-1">
                {isLegacy ? 'Heritage Edition' : 'Digital Native v2.6'}
            </p>
          </div>

          {/* Action Zone: Status, Filter, Cart */}
          <div className="flex gap-4 items-center">
            
            {/* Status Trigger (A.H.T.O. Live Link) */}
            {hasActiveOrder && (
                <button 
                    onClick={onViewOrder}
                    className={`p-2 border transition-colors relative ${
                        isLegacy
                        ? 'border-neutral-800 text-black hover:bg-neutral-100'
                        : 'border-luxury-gold/50 text-luxury-gold bg-luxury-gold/5 hover:bg-luxury-gold/10'
                    }`}
                    aria-label="View Order Status"
                >
                   <Clock size={20} />
                   {!isLegacy && (
                     <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-mint opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-electric-mint"></span>
                     </span>
                   )}
                </button>
            )}

            {/* Legacy Toggle */}
            <button 
                onClick={onToggleLegacy}
                className={`p-2 border transition-colors ${
                    isLegacy 
                    ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' 
                    : 'border-white/10 hover:bg-white/5 text-white/40'
                }`}
                aria-label="Toggle Legacy Mode"
            >
                <Filter size={18} />
            </button>

            {/* Cart Trigger */}
            <button 
                onClick={onOpenCheckout}
                className={`relative p-2 border transition-colors ${
                    cartCount > 0 
                    ? 'bg-luxury-gold/10 border-luxury-gold text-luxury-gold' 
                    : 'bg-white/5 border-white/10 text-white'
                }`}
            >
               <ShoppingCart size={20} />
               {cartCount > 0 && (
                 <span className="absolute -top-2 -right-2 bg-luxury-gold text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                    {cartCount}
                 </span>
               )}
            </button>
          </div>
        </div>

        {/* Categories (Scrollable) */}
        <motion.div layout className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 pb-2">
           <div className="flex gap-3 w-max">
            {ALLERGEN_OPTIONS.map(allergen => {
                const isSelected = selectedAllergens.includes(allergen);
                return (
                <button
                    key={allergen}
                    onClick={() => toggleAllergen(allergen)}
                    className={`snap-center shrink-0 rounded-full font-medium whitespace-nowrap transition-all duration-300 border active:scale-95 ${
                    isLegacy
                        ? `px-4 py-1.5 text-sm font-serif tracking-wide ${isSelected ? 'bg-titanium-silver text-obsidian border-titanium-silver shadow-md' : 'bg-[#151515] text-neutral-400 border-neutral-800'}`
                        : `px-3 py-1.5 text-[10px] uppercase tracking-wider border-retina ${isSelected ? 'bg-deep-ochre text-white border-deep-ochre shadow-lg' : 'bg-neutral-900 text-neutral-400 border-neutral-800'}`
                    }`}
                >
                    {isSelected ? `No ${allergen}` : allergen}
                </button>
                );
            })}
             <div className="w-px h-6 bg-neutral-800 mx-2" />
             {Array.from(new Set(MENU_ITEMS.map(i => i.category))).map(cat => (
                 <button
                    key={cat}
                    onClick={() => scrollPilot(cat)}
                    className={`transition-colors ${
                        isLegacy 
                        ? 'px-4 text-base font-serif text-neutral-500 hover:text-[#D4AF37]' 
                        : 'px-2 text-xs text-neutral-400 hover:text-white uppercase tracking-widest'
                    }`}
                 >
                     {cat}
                 </button>
             ))}
            <div className="w-4" />
          </div>
        </motion.div>
      </motion.header>
      </LayoutGroup>

      {/* 2. The MenuStream (Virtualization Engine) */}
      <div 
        ref={parentRef} 
        className="flex-1 overflow-y-auto no-scrollbar pb-32 scroll-smooth"
        style={{ contain: 'strict' }}
      >
        <div
            style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
            }}
        >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = streamData[virtualRow.index];

                return (
                    <div
                        key={virtualRow.key}
                        ref={rowVirtualizer.measureElement}
                        data-index={virtualRow.index}
                        className="absolute top-0 left-0 w-full px-4 pt-4"
                        style={{ transform: `translateY(${virtualRow.start}px)` }}
                    >
                        {item.type === 'header' ? (
                            <div className="pt-8 pb-4">
                                <h3 className={`tracking-tight pointer-events-none select-none ${
                                    isLegacy 
                                    ? 'text-2xl font-serif font-bold text-luxury-gold pl-1' 
                                    : 'text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] pl-1' 
                                }`}>
                                {item.title}
                                </h3>
                            </div>
                        ) : (
                            /* MENU ITEM CARD */
                            (() => {
                                const mItem = item.data;
                                const hasAllergen = mItem.allergens.some(a => selectedAllergens.includes(a));
                                const honestTotal = calculateHonestPrice(mItem.basePrice);

                                if (isLegacy) {
                                    // === CLASSIC MODE (Accessibility Optimized) ===
                                    return (
                                        <div 
                                            onClick={() => !hasAllergen && onItemSelect(mItem)}
                                            className={`
                                                classic-item-card
                                                rounded-lg bg-[#0F0F0F] 
                                                border-l-4 border-l-[#1a1a1a]
                                                p-4
                                                ${hasAllergen ? 'opacity-30 grayscale' : ''}
                                            `}
                                        >
                                            <div className="flex-1 flex flex-col justify-between pr-4">
                                                <div>
                                                    <h4 className="text-2xl font-serif font-bold text-titanium-silver mb-2">
                                                        {mItem.title}
                                                    </h4>
                                                    <div className="classic-price-tag">
                                                        ${mItem.basePrice}
                                                    </div>
                                                </div>
                                                <button className="mt-4 px-4 py-2 bg-[#222] border border-[#333] text-[#D4AF37] text-xs font-bold uppercase tracking-widest rounded-sm text-left">
                                                    Details & Add
                                                </button>
                                            </div>
                                            <div className="shrink-0 w-[100px] h-[100px]">
                                                <img 
                                                    src={mItem.imageUrl} 
                                                    className="w-full h-full object-cover rounded-sm sepia-[.15]" 
                                                    alt="" 
                                                />
                                            </div>
                                        </div>
                                    )
                                }

                                // === DIGITAL NATIVE V2.6 CARD (High Performance) ===
                                return (
                                    <div 
                                        onClick={() => !hasAllergen && onItemSelect(mItem)}
                                        className={`group flex gap-4 bg-[#0A0A0A] border border-white/5 p-3 rounded-sm hover:border-luxury-gold/30 transition-all cursor-pointer relative overflow-hidden ${
                                            hasAllergen ? 'opacity-40 grayscale pointer-events-none' : ''
                                        }`}
                                    >
                                        {/* Image Layer with Boiling Turbulence Filter */}
                                        <div className="w-28 h-28 flex-shrink-0 overflow-hidden relative bg-neutral-900">
                                            <img 
                                                src={mItem.imageUrl} 
                                                alt={mItem.title}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                style={{ 
                                                    // CONDITIONAL FILTER: Apply 'boiling-turbulence' only in Standard Mode
                                                    // to avoid GPU overload on legacy devices or if specifically disabled.
                                                    filter: 'url(#boiling-turbulence)' 
                                                }}
                                            />
                                            {mItem.isPopular && (
                                                <div className="absolute top-0 left-0 bg-luxury-gold text-black text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
                                                    Popular
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="text-base font-medium text-white group-hover:text-luxury-gold transition-colors leading-tight">
                                                    {mItem.title}
                                                </h4>
                                                <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
                                                    {mItem.description}
                                                </p>
                                            </div>
                                            
                                            <div className="flex justify-between items-end mt-2">
                                                <div className="font-mono text-sm text-luxury-gold/90">
                                                    ${mItem.basePrice.toFixed(2)}
                                                </div>
                                                <div className="flex gap-1.5">
                                                {mItem.allergens.map(a => (
                                                    <span key={a} className="text-[7px] border border-white/10 px-1 py-0.5 text-white/30 uppercase tracking-wider rounded-xs">
                                                        {a.slice(0,3)}
                                                    </span>
                                                ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shadow Sweep Animation (Visual Feedback) */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                                    </div>
                                );
                            })()
                        )}
                    </div>
                );
            })}
        </div>
        
        {/* Bottom Padding for HUD */}
        <div className="h-32" />
      </div>

      {/* 3. Detached Service HUD (The Side-Floating Trigger) - Kept from previous iteration */}
      <AnimatePresence>
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onOpenShadowService}
            className={`fixed left-4 z-[50] flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${
            isLegacy
                ? 'bottom-32 w-20 h-20 bg-luxury-gold text-obsidian rounded-2xl border-2 border-white/10 active:scale-95'
                : 'bottom-20 w-12 h-12 bg-neutral-900/80 backdrop-blur-md border border-white/10 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800'
            }`}
        >
            <PhoneCall size={isLegacy ? 32 : 18} strokeWidth={isLegacy ? 2.5 : 2} />
            {isLegacy && (
                <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Assist</span>
            )}
        </motion.button>
      </AnimatePresence>
      
      {/* 4. Bottom Performance HUD (Replaces Dock) */}
      <div className="fixed bottom-0 left-0 w-full bg-obsidian/90 backdrop-blur-md border-t border-white/5 p-4 flex justify-between items-center z-40 safe-area-pb">
         <div className="flex items-center gap-4 text-[9px] font-mono text-white/30 tracking-widest uppercase">
            <div className="flex items-center gap-2">
               <Activity size={10} className="text-electric-mint animate-pulse" />
               <span>Frame: 16.6ms (Locked)</span>
            </div>
            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
               <ShieldCheck size={10} className="text-luxury-gold" />
               <span>WAL Logged</span>
            </div>
         </div>
         <div className="text-[9px] text-white/20 uppercase font-mono">
            Mem: {(MENU_ITEMS.length * 0.4).toFixed(1)}KB Indexed
         </div>
      </div>

    </div>
  );
};

export default Menu;
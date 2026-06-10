import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, ModifierOption, FeeStructure } from '../types';
import { FEES } from '../constants';
import { ChevronDown, Info, Plus, Volume2, ShieldCheck, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAudioDescription, playAudioDescription } from '../services/geminiService';
import { useSocial } from '../contexts/SocialContext';
import { LargeActionButton } from './LegacyAdapter';

interface MenuItemDetailsProps {
  item: MenuItem;
  isLegacy: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, modifiers: ModifierOption[]) => void;
}

const MenuItemDetails: React.FC<MenuItemDetailsProps> = ({ item, isLegacy, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<ModifierOption[]>([]);
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);
  const [isWalLocked, setIsWalLocked] = useState(false);
  
  // Social Engine Hook
  const { broadcastIntent } = useSocial();

  // Oracle Voice State
  const [oracleText, setOracleText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cancelSpeechRef = useRef<(() => void) | null>(null);

  // --- SOCIAL BROADCASTING TRIGGERS ---
  useEffect(() => {
    // 1. Broadcast "Viewing" when mounted
    broadcastIntent({ 
        type: 'viewing', 
        itemId: item.id, 
        itemName: item.title 
    });

    return () => {
        // 2. Clear intent when unmounted (or send 'idle')
        if (cancelSpeechRef.current) cancelSpeechRef.current();
        broadcastIntent(undefined); 
    };
  }, [item, broadcastIntent]);


  // Calculate Prices
  const modifiersCost = selectedModifiers.reduce((sum, mod) => sum + mod.price, 0);
  const currentBaseTotal = (item.basePrice + modifiersCost) * quantity;
  
  // Honest Pricing Logic (Base + Service + Tax)
  const serviceFee = currentBaseTotal * FEES.serviceFeeRate;
  const tax = currentBaseTotal * FEES.taxRate;
  const honestTotal = currentBaseTotal + serviceFee + tax;

  const handleModifierToggle = (groupMulti: boolean, option: ModifierOption) => {
    setSelectedModifiers(prev => {
      if (groupMulti) {
        return prev.find(m => m.id === option.id)
          ? prev.filter(m => m.id !== option.id)
          : [...prev, option];
      } else {
        const group = item.modifiers?.find(g => g.options.some(o => o.id === option.id));
        if (!group) return prev;
        const cleaned = prev.filter(m => !group.options.some(o => o.id === m.id));
        return [...cleaned, option];
      }
    });
  };

  const toggleOracle = async () => {
    if (isSpeaking) {
      if (cancelSpeechRef.current) cancelSpeechRef.current();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    if (!oracleText) {
       const text = await generateAudioDescription(item);
       setOracleText(text);
       cancelSpeechRef.current = playAudioDescription(text, () => {}, () => setIsSpeaking(false));
    } else {
       cancelSpeechRef.current = playAudioDescription(oracleText, () => {}, () => setIsSpeaking(false));
    }
  };

  const handleAddToCartAction = () => {
     const missingRequired = item.modifiers?.filter(g => g.required && !selectedModifiers.some(m => g.options.some(o => o.id === m.id)));
     if (missingRequired && missingRequired.length > 0) {
         if (isLegacy) {
            // High Perception Alert
            alert(`ATTENTION: Please select ${missingRequired.map(g => g.name).join(', ')}`);
         } else {
            alert(`Please make a selection for: ${missingRequired.map(g => g.name).join(', ')}`);
         }
         return;
     }

     // Broadcast "Adding" Intent - Social Proof
     broadcastIntent({ type: 'adding', itemId: item.id, itemName: item.title });

     setIsWalLocked(true);
     if (navigator.vibrate) navigator.vibrate([20, 50, 20]); // WAL Lock Haptic

     setTimeout(() => {
         onAddToCart(item, quantity, selectedModifiers);
     }, 2000);
  };

  if (isLegacy) {
      // === HERITAGE EDITION: STONE CARVING PROJECTION (High Perception) ===
      return (
        <div className="fixed inset-0 z-50 flex flex-col bg-heritage-paper text-black overflow-y-auto pb-10">
            <div className="max-w-3xl mx-auto w-full min-h-screen p-6 legacy-projection-light">
                
                {/* 1. Giant Visual Anchor */}
                <div className="w-full aspect-square mb-8 border-4 border-black shadow-stone-block bg-white relative">
                    <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale-0"
                    />
                     {/* Close Button - High Contrast */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                    >
                        <X size={32} strokeWidth={3} />
                    </button>
                </div>

                {/* 2. Price Sovereignty: Honest & Impossible to Ignore */}
                <div className="mb-10 border-b-4 border-black pb-8">
                    <h1 className="text-5xl font-serif font-black mb-6 leading-tight tracking-tight">
                        {item.title}
                    </h1>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xl font-mono uppercase font-bold tracking-widest opacity-60">Price</span>
                            <span className="text-6xl font-mono font-bold tracking-tighter">
                                ${honestTotal.toFixed(2)}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-neutral-500 text-right">Includes Service Fee & Tax</p>
                    </div>
                </div>

                <p className="text-2xl font-serif font-medium leading-relaxed mb-10 border-l-4 border-black pl-6">
                    {item.description}
                </p>

                {/* 3. Minimal Allergen Warning (High Safety) */}
                {item.allergens.length > 0 && (
                    <div className="mb-12 p-6 border-4 border-deep-ochre bg-white text-deep-ochre shadow-[6px_6px_0px_#800020]">
                        <h4 className="text-lg font-black uppercase mb-2 tracking-widest flex items-center gap-2">
                            <ShieldCheck size={24} />
                            Allergen Warning
                        </h4>
                        <p className="text-2xl font-bold">{item.allergens.join(' • ')}</p>
                    </div>
                )}

                {/* Modifiers - Stone Carving Style */}
                {item.modifiers && item.modifiers.length > 0 && (
                    <div className="mb-12 space-y-8">
                        {item.modifiers.map(group => (
                            <div key={group.id} className="p-6 border-4 border-black bg-white">
                                <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest border-b-2 border-black pb-2 inline-block">
                                    {group.name} {group.required && '(Required)'}
                                </h3>
                                <div className="space-y-4">
                                    {group.options.map(option => {
                                        const isSelected = selectedModifiers.some(m => m.id === option.id);
                                        return (
                                            <label 
                                                key={option.id} 
                                                className={`flex items-center justify-between p-6 border-4 cursor-pointer transition-all ${
                                                    isSelected 
                                                    ? 'border-black bg-neutral-100 shadow-[inset_0_0_0_2px_black]' 
                                                    : 'border-neutral-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-10 h-10 border-4 border-black flex items-center justify-center ${isSelected ? 'bg-black' : 'bg-white'}`}>
                                                        {isSelected && <Check size={28} className="text-white" strokeWidth={4} />}
                                                    </div>
                                                    <span className={`text-2xl font-bold ${isSelected ? 'underline decoration-4' : ''}`}>
                                                        {option.name}
                                                    </span>
                                                </div>
                                                <input type="checkbox" className="hidden" checked={isSelected} onChange={() => handleModifierToggle(group.multiSelect, option)} />
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 4. 200% Heatmap Buttons (Fitts's Law) */}
                <div className="mt-auto pt-8 space-y-6 pb-12">
                    <LargeActionButton 
                        label={isWalLocked ? "Order Locked" : "Confirm Order"}
                        subLabel={isWalLocked ? "Secured in WAL" : "Add to Cart"}
                        onClick={handleAddToCartAction}
                        disabled={isWalLocked}
                    />
                    
                    {!isWalLocked && (
                        <LargeActionButton 
                            label="Back to Menu"
                            variant="secondary"
                            onClick={onClose}
                        />
                    )}
                </div>
            </div>
        </div>
      );
  }

  // === STANDARD OBSIDIAN VIEW ===
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-obsidian text-neutral-200 font-sans">
        
        {/* 1. Immersive Header (Ken Burns Effect) */}
        <div className="relative h-[40vh] w-full overflow-hidden bg-neutral-900">
             <motion.img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover opacity-90"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />

             <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-20">
                 <button onClick={onClose} className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-colors">
                     <ChevronDown size={24} />
                 </button>
                 <button 
                    onClick={toggleOracle}
                    className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                        isSpeaking 
                        ? 'bg-luxury-gold text-obsidian border-luxury-gold animate-pulse' 
                        : 'bg-black/20 text-white border-white/10'
                    }`}
                 >
                     <Volume2 size={20} />
                 </button>
             </div>

             <div className="absolute bottom-0 inset-x-0 p-6 z-20">
                 <h1 className="text-4xl leading-tight mb-2 font-light text-white">
                     {item.title}
                 </h1>
                 {item.isPopular && (
                     <span className="inline-block px-2 py-1 bg-luxury-gold text-obsidian text-[10px] font-bold uppercase tracking-widest rounded mb-2">
                         Popular
                     </span>
                 )}
                 <div className="flex flex-wrap gap-2">
                     {item.allergens.map(alg => (
                         <span key={alg} className="px-2 py-1 rounded border border-deep-ochre/50 bg-deep-ochre/10 text-deep-ochre text-xs font-medium">
                             Contains {alg}
                         </span>
                     ))}
                 </div>
             </div>
        </div>

        {/* 2. Scrollable Decision Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
             <p className="py-6 text-lg leading-relaxed border-b text-neutral-400 border-neutral-800">
                 {item.description}
             </p>

             {item.modifiers && item.modifiers.length > 0 && (
                 <div className="py-6 space-y-8">
                     {item.modifiers.map(group => (
                         <div key={group.id}>
                             <div className="flex justify-between items-end mb-4">
                                 <h3 className="text-lg text-neutral-200">{group.name}</h3>
                                 {group.required && <span className="text-xs text-luxury-gold uppercase tracking-wider">Required</span>}
                             </div>
                             <div className="space-y-3">
                                 {group.options.map(option => {
                                     const isSelected = selectedModifiers.some(m => m.id === option.id);
                                     return (
                                         <label 
                                            key={option.id}
                                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                                                isSelected
                                                 ? 'bg-neutral-800 border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                                                 : 'border-neutral-800 hover:border-neutral-600'
                                            }`}
                                         >
                                             <div className="flex items-center gap-4">
                                                 <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                                     isSelected 
                                                     ? 'border-luxury-gold bg-luxury-gold text-obsidian' 
                                                     : 'border-neutral-600'
                                                 }`}>
                                                     {isSelected && <Check size={12} strokeWidth={4} />}
                                                 </div>
                                                 <span className="text-neutral-300">{option.name}</span>
                                             </div>
                                             {option.price > 0 && (
                                                 <span className="font-mono text-neutral-500">+${option.price.toFixed(2)}</span>
                                             )}
                                             <input 
                                                type="checkbox"
                                                className="hidden"
                                                checked={isSelected}
                                                onChange={() => handleModifierToggle(group.multiSelect, option)}
                                             />
                                         </label>
                                     );
                                 })}
                             </div>
                         </div>
                     ))}
                 </div>
             )}
             
             <div className="py-6 flex items-center justify-center gap-8">
                 <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full flex items-center justify-center border text-xl border-neutral-700 text-neutral-400"
                 >
                     -
                 </button>
                 <span className="text-3xl font-mono text-white">{quantity}</span>
                 <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full flex items-center justify-center border text-xl border-neutral-700 text-neutral-400"
                 >
                     +
                 </button>
             </div>
        </div>

        {/* 3. Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-40 border-t backdrop-blur-xl bg-obsidian/90 border-neutral-800">
             <div className="flex justify-between items-center mb-4">
                 <button 
                    onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors"
                 >
                     <Info size={14} />
                     <span>Honest Total</span>
                 </button>
                 <div className="flex flex-col items-end">
                     <span className="text-2xl font-mono text-white">
                         ${honestTotal.toFixed(2)}
                     </span>
                     {showFeeBreakdown && (
                         <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full right-6 mb-2 p-4 rounded-xl shadow-2xl border text-xs font-mono w-64 bg-neutral-900 text-neutral-300 border-neutral-700"
                         >
                             <div className="flex justify-between mb-1">
                                 <span>Item Subtotal</span>
                                 <span>${(item.basePrice * quantity).toFixed(2)}</span>
                             </div>
                             {modifiersCost > 0 && (
                                 <div className="flex justify-between mb-1 text-neutral-500">
                                     <span>Modifiers</span>
                                     <span>${(modifiersCost * quantity).toFixed(2)}</span>
                                 </div>
                             )}
                             <div className="flex justify-between mb-1 text-neutral-500">
                                 <span>Service Fee ({(FEES.serviceFeeRate * 100)}%)</span>
                                 <span>${serviceFee.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-neutral-500">
                                 <span>Est. Tax ({(FEES.taxRate * 100)}%)</span>
                                 <span>${tax.toFixed(2)}</span>
                             </div>
                         </motion.div>
                     )}
                 </div>
             </div>

             <button
                onClick={handleAddToCartAction}
                disabled={isWalLocked}
                className={`relative w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 active:scale-95 ${
                    isWalLocked
                    ? 'bg-electric-mint text-obsidian cursor-default'
                    : 'bg-luxury-gold text-obsidian shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                }`}
             >
                 {isWalLocked ? (
                     <>
                        <ShieldCheck size={20} />
                        <span>WAL Locked (Table #12)</span>
                     </>
                 ) : (
                     <>
                        <Plus size={20} />
                        <span>Add to Order</span>
                     </>
                 )}
                 
                 {isWalLocked && (
                     <motion.div 
                        className="absolute inset-0 bg-white"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                     />
                 )}
             </button>
        </div>
    </div>
  );
};

export default MenuItemDetails;
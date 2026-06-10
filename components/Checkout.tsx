import React, { useState, useEffect } from 'react';
import { CartItem, FeeStructure } from '../types';
import { FEES, SERVICE_AGENT } from '../constants';
import { ChevronDown, CreditCard, Sparkles, Check, Coffee, Flame, Users, Clock, Receipt, ShieldCheck, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playAudioDescription } from '../services/geminiService';

interface CheckoutProps {
  cart: CartItem[];
  isLegacy: boolean;
  onClose: () => void;
  onPaymentComplete: (tipAmount: number) => void;
}

// The "Seamless" Signature for Alex
const SignatureAlex: React.FC<{ isLegacy: boolean }> = ({ isLegacy }) => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.8, 
        ease: [0.16, 1, 0.3, 1], 
        delay: 0.4
      }
    }
  };

  return (
    <div className="h-8 w-28 ml-3 flex items-center opacity-90" aria-label="Alex's Signature">
      <motion.svg 
        viewBox="0 0 140 45" 
        className="w-full h-full overflow-visible"
        style={{ filter: isLegacy ? 'none' : 'drop-shadow(0 0 2px rgba(212, 175, 55, 0.3))' }}
      >
        <motion.path
          d="M10,35 C20,10 35,5 35,25 C35,40 20,40 25,25 C30,10 50,15 55,25 C60,35 60,20 65,25 C70,30 80,30 95,15 L120,10"
          fill="transparent"
          stroke={isLegacy ? "#000000" : "#D4AF37"}
          strokeWidth={isLegacy ? "2" : "2.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.svg>
    </div>
  );
};

// 1. Shadow Work Visualization (The Service Log)
const ServiceLog: React.FC<{ isLegacy: boolean }> = ({ isLegacy }) => {
    const logs = [
        { time: '18:02', action: 'Table meticulously prepared' },
        { time: '18:15', action: 'Sparkling water chilled & served' },
        { time: '18:45', action: 'High-temp sanitation completed' }
    ];

    return (
        <div className={`mx-6 mb-6 p-4 rounded-xl border ${isLegacy ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/40 border-white/5'}`}>
            <div className="flex items-center gap-2 mb-3 opacity-60">
                <Clock size={12} className={isLegacy ? 'text-black' : 'text-champagne-gold'} />
                <span className={`text-[10px] uppercase tracking-widest font-bold ${isLegacy ? 'text-neutral-500' : 'text-champagne-gold'}`}>Service Log (Shadow Work)</span>
            </div>
            <div className="space-y-3 relative">
                {/* Timeline Line */}
                <div className={`absolute left-[5px] top-1 bottom-1 w-px ${isLegacy ? 'bg-neutral-300' : 'bg-neutral-800'}`} />
                
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 relative z-10">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isLegacy ? 'bg-neutral-400' : 'bg-neutral-700'}`} />
                        <div className="flex flex-col">
                             <span className={`text-xs font-mono ${isLegacy ? 'text-neutral-500' : 'text-neutral-500'}`}>{log.time}</span>
                             <span className={`text-sm ${isLegacy ? 'text-black font-medium' : 'text-neutral-300'}`}>{log.action}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Checkout: React.FC<CheckoutProps> = ({ cart, isLegacy, onClose, onPaymentComplete }) => {
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed'>('idle');

  // Calculations
  const itemTotal = cart.reduce((acc, item) => acc + (item.basePrice + (item.selectedModifiers?.reduce((s,m) => s+m.price,0)||0)) * item.quantity, 0);
  const fairWageSurcharge = itemTotal * FEES.serviceFeeRate; // Previously "Service Fee"
  const tax = itemTotal * FEES.taxRate;
  const grandTotal = itemTotal + fairWageSurcharge + tax + FEES.techFeeFixed + tipAmount;

  // Audio Guidance for Silver Mode
  useEffect(() => {
    if (isLegacy) {
        const breakdown = `Checkout. Total amount is ${grandTotal.toFixed(2)} dollars. This includes the fair wage surcharge for the team.`;
        playAudioDescription(breakdown, () => {}, () => {});
    }
  }, [isLegacy]);

  // 2. Concrete Tipping Gifts Options
  const gratitudeOptions = [
      { id: 'coffee', label: "Energy Boost", sub: "For Alex", value: 3.00, icon: Coffee },
      { id: 'chef', label: "Chef's Praise", sub: "Kitchen Beer", value: 5.00, icon: Flame },
      { id: 'team', label: "Team Support", sub: "Shared Fund", value: 10.00, icon: Users },
      { id: 'percent', label: "Generous", sub: "20% Tip", value: itemTotal * 0.20, icon: Heart }
  ];

  const handleTipSelect = (val: number) => {
      setTipAmount(val === tipAmount ? 0 : val);
      if (isLegacy && val !== tipAmount) {
         playAudioDescription("Thank you for your generosity.", () => {}, () => {});
      }
      if (navigator.vibrate) navigator.vibrate(10);
  };

  const handlePayment = () => {
    if (paymentStatus !== 'idle') return;

    setPaymentStatus('processing');
    
    // Simulate Payment Processing
    setTimeout(() => {
        setPaymentStatus('completed');
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]); 
        
        // Oracle Voice Affirmation
        if (isLegacy) {
            playAudioDescription("Payment Confirmed. Alex thanks you.", () => {}, () => {});
        }

        setTimeout(() => {
            onPaymentComplete(tipAmount);
        }, 1200);
    }, 1500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isLegacy ? 'bg-white text-black' : 'bg-obsidian text-neutral-200'}`}>
      
      {/* Header */}
      <div className={`p-6 border-b shrink-0 ${isLegacy ? 'border-neutral-200' : 'border-neutral-800 bg-neutral-900/30'}`}>
        <div className="flex items-center justify-between mb-6">
           <h2 className={`${isLegacy ? 'text-3xl font-serif font-bold' : 'text-xl font-light text-white'}`}>Gratitude Hub</h2>
           <button onClick={onClose} className="p-2 opacity-50 hover:opacity-100">
             <ChevronDown />
           </button>
        </div>

        {/* The Human Element */}
        <div className="flex items-center gap-4">
           <div className={`relative p-0.5 rounded-full ${tipAmount > 0 ? 'bg-champagne-gold shadow-[0_0_20px_rgba(247,231,206,0.4)]' : 'bg-neutral-800'} transition-all duration-700`}>
             <img 
               src={SERVICE_AGENT.photoUrl} 
               alt={SERVICE_AGENT.name} 
               className={`w-16 h-16 rounded-full object-cover filter ${isLegacy ? 'grayscale-0' : 'grayscale contrast-125 brightness-90'}`} 
             />
           </div>
           <div className="flex-1">
             <p className={`text-xs uppercase tracking-widest ${isLegacy ? 'text-neutral-500' : 'text-neutral-500'}`}>Service Specialist</p>
             <div className="flex items-end">
                <h3 className={`text-lg font-medium leading-none ${isLegacy ? 'text-black' : 'text-white'}`}>{SERVICE_AGENT.name}</h3>
                <SignatureAlex isLegacy={isLegacy} />
             </div>
           </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
          {/* Shadow Work Log */}
          <div className="mt-6">
             <ServiceLog isLegacy={isLegacy} />
          </div>

          {/* 3. Honest Pricing Guard (Receipt Detail) */}
          <div className="px-6 space-y-4 mb-8">
            <h3 className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 ${isLegacy ? 'text-neutral-400' : 'text-neutral-600'}`}>
                <Receipt size={12} />
                Honest Pricing
            </h3>
            
            {/* Items */}
            <div className="space-y-2 pb-4 border-b border-dashed border-neutral-800">
                {cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex justify-between text-sm">
                        <span className={isLegacy ? 'text-neutral-600' : 'text-neutral-400'}>{item.quantity}x {item.title}</span>
                        <span className="font-mono">${((item.basePrice + (item.selectedModifiers?.reduce((s,m) => s+m.price,0)||0)) * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Fees */}
            <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                    <span className={isLegacy ? 'text-neutral-600' : 'text-neutral-400'}>Subtotal</span>
                    <span>${itemTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-champagne-gold/80">
                    <span className="flex items-center gap-1"><ShieldCheck size={12}/> Fair Wage Share (Mandatory)</span>
                    <span>${fairWageSurcharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between opacity-60">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between opacity-60">
                    <span>Platform Tech Fee</span>
                    <span>${FEES.techFeeFixed.toFixed(2)}</span>
                </div>
                {tipAmount > 0 && (
                    <div className="flex justify-between text-electric-mint font-bold pt-2">
                        <span className="flex items-center gap-1"><Heart size={12} /> Gratitude Gift</span>
                        <span>${tipAmount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            <div className={`flex justify-between items-end pt-4 border-t ${isLegacy ? 'border-black' : 'border-neutral-700'}`}>
                <span className="text-xs uppercase tracking-widest">Total to Pay</span>
                <span className={`text-3xl font-mono ${isLegacy ? 'font-black' : 'font-light'}`}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* 2. Concrete Tipping Gifts */}
          <div className={`p-6 pb-32 space-y-4 ${isLegacy ? 'bg-neutral-100' : 'bg-neutral-900/20'}`}>
               <h3 className={`text-xs uppercase tracking-widest font-bold ${isLegacy ? 'text-neutral-500' : 'text-neutral-500'}`}>Express Gratitude</h3>
               <div className="grid grid-cols-2 gap-3">
                   {gratitudeOptions.map((opt) => {
                       const isSelected = Math.abs(tipAmount - opt.value) < 0.01;
                       return (
                           <button
                                key={opt.id}
                                onClick={() => handleTipSelect(opt.value)}
                                className={`p-4 rounded-xl border flex flex-col gap-3 transition-all duration-300 relative overflow-hidden ${
                                    isSelected 
                                    ? (isLegacy ? 'bg-black text-white border-black ring-2 ring-offset-2 ring-black' : 'bg-champagne-gold text-obsidian border-champagne-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]')
                                    : (isLegacy ? 'bg-white border-neutral-300 text-neutral-600' : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:border-neutral-500')
                                }`}
                           >
                               <div className="flex justify-between w-full items-start">
                                    <opt.icon size={20} />
                                    <span className="font-mono text-xs font-bold">+${opt.value.toFixed(2)}</span>
                               </div>
                               <div className="text-left">
                                   <div className="font-bold text-sm leading-tight">{opt.label}</div>
                                   <div className={`text-[10px] uppercase tracking-wider mt-1 ${isSelected ? 'opacity-80' : 'opacity-50'}`}>{opt.sub}</div>
                               </div>
                           </button>
                       )
                   })}
               </div>
          </div>
      </div>

      {/* Footer / Pay */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 ${isLegacy ? 'bg-neutral-50 border-t border-neutral-200' : 'bg-obsidian/90 backdrop-blur-xl border-t border-neutral-800'}`}>
        <button 
          onClick={handlePayment}
          disabled={paymentStatus !== 'idle'}
          className={`relative w-full rounded-xl font-bold flex items-center justify-center gap-3 overflow-hidden transition-all duration-200 ease-sovereign active:scale-[0.98] ${
          isLegacy 
           ? 'py-8 text-2xl bg-black text-white shadow-2xl' // Silver Mode: Giant Button
           : 'py-4 text-lg bg-obsidian text-champagne-gold border border-neutral-800 shadow-inner active:shadow-sovereign-press'
        }`}>
          {/* Infusion Layer */}
          {!isLegacy && paymentStatus !== 'idle' && (
             <div className="absolute inset-0 bg-luxury-gold animate-sovereign-infusion origin-center pointer-events-none" />
          )}

          {/* Label Content */}
          <div className={`relative z-10 flex items-center gap-3 transition-all duration-300 ${
              paymentStatus === 'completed' && !isLegacy ? 'text-obsidian font-extrabold' : ''
          }`}>
             {paymentStatus === 'completed' ? (
                <>
                  <Check size={isLegacy ? 32 : 20} className="animate-shake-subtle" />
                  <span>{isLegacy ? 'PAYMENT SUCCESSFUL' : 'Payment Confirmed'}</span>
                </>
             ) : (
                <>
                    {isLegacy ? (
                        /* Silver Mode Explicit Text */
                        <span className="tracking-widest">CONFIRM & SCAN FACE</span>
                    ) : (
                        <>
                            <CreditCard size={20} className={paymentStatus === 'processing' ? 'animate-pulse' : ''} />
                            <span>Pay ${grandTotal.toFixed(2)}</span>
                        </>
                    )}
                </>
             )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Checkout;
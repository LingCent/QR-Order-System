import React, { useEffect, useState, useRef } from 'react';
import { OrderReceipt, OrderStatus, ServiceAgent, CartItem } from '../types';
import { FEES, SERVICE_AGENT } from '../constants';
import { CheckCircle2, ChefHat, Heart, ShieldCheck, Volume2, Wifi, WifiOff, Copy, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playAudioDescription } from '../services/geminiService';
import { ShadowLaborMonitor } from './ShadowLaborMonitor';

interface OrderDetailsProps {
  receipt: OrderReceipt;
  isLegacy: boolean;
  onBack: () => void;
}

// 1. Core Unfolding Curve (The Gravity Physics)
const receiptContainerVariants = {
  hidden: { 
    opacity: 0, 
    scaleY: 0, 
    transformOrigin: "top" 
  },
  show: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // Asymmetric Spring: Fast start, tight finish
      when: "beforeChildren", // Ensure container exists before data flows in
      staggerChildren: 0.08, // The Cascade Interval
    },
  },
};

// 2. Cascading Line Items (The Data Flow)
const lineItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      ease: "easeOut", 
      duration: 0.4 
    } 
  },
};

// --- PARTICLE PHYSICS ENGINE ---
class LightPixel {
  x: number;
  y: number;
  angle: number;
  velocity: number;
  friction: number;
  alpha: number;
  color: string;
  size: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2; // Omnidirectional scatter
    this.velocity = Math.random() * 8 + 4; // Initial burst force
    this.friction = 0.92; // Atmospheric drag
    this.alpha = 1;
    this.color = '#00F5D4'; // Mint Green
    this.size = Math.random() < 0.3 ? 2 : 1.5; // Varied pixel size
  }

  update() {
    this.velocity *= this.friction; // Simulate energy loss
    this.x += Math.cos(this.angle) * this.velocity;
    this.y += Math.sin(this.angle) * this.velocity;
    this.alpha -= 0.015; // Slow fade
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(0, 245, 212, ${this.alpha})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// 3. The Gold-Green Resonance Lamp (Algorithm Component)
const LedgerStatusLamp: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  const lampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOnline) return;

    let animationFrameId: number;
    const start = performance.now();
    const duration = 2.5; // 2.5s duration until lock

    // Initial Haptic Conflict (High Frequency Buzz)
    if (navigator.vibrate) navigator.vibrate([15, 30, 15, 30]);

    const animate = (time: number) => {
      const elapsed = (time - start) / 1000;

      // Phase 3: Final Lock (t > 2.5s)
      if (elapsed >= duration) {
        if (lampRef.current) {
            lampRef.current.style.backgroundColor = '#00F5D4'; // Mint Green
            // The "Gold Core" via inset shadow to symbolize the locked transaction
            lampRef.current.style.boxShadow = 'inset 0 0 0 1.5px #D4AF37, 0 0 12px rgba(0, 245, 212, 0.5)';
            lampRef.current.style.transform = 'scale(1)';
        }
        // Final "Lock" Thud (Long Vibration)
        if (navigator.vibrate) navigator.vibrate(70);
        return;
      }

      // Phase 1 & 2: Frequency Decay
      // Formula: freq = 10 * exp(-0.8 * t)
      const freq = 10 * Math.exp(-0.8 * elapsed);
      
      // Intensity (-1 to 1)
      const intensity = Math.cos(2 * Math.PI * freq * elapsed);
      
      // Normalized (0 to 1), where 0 is Gold, 1 is Green
      const t = (intensity + 1) / 2;

      // HSL Interpolation
      // Gold: hsl(45, 65%, 52%)
      // Green: hsl(172, 100%, 48%)
      const h = 45 + (172 - 45) * t;
      const s = 65 + (100 - 65) * t;
      const l = 52 + (48 - 52) * t;

      if (lampRef.current) {
        lampRef.current.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
        // Resonance Breathing: Scale pulses slightly with intensity
        lampRef.current.style.transform = `scale(${0.9 + 0.2 * t})`; 
        // Dynamic Glow
        lampRef.current.style.boxShadow = `0 0 ${12 * t}px hsla(${h}, ${s}%, ${l}%, 0.6)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isOnline]);

  if (!isOnline) {
      // Offline fallback: Amber pulse
      return <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse-slow shadow-[0_0_8px_rgba(245,158,11,0.6)]" />;
  }

  return (
    <div 
        ref={lampRef}
        className="w-2.5 h-2.5 rounded-full will-change-transform"
        style={{ backgroundColor: '#D4AF37' }} // Start Gold
    />
  );
};

// 4. Perception Heatmap Component & Pixel Supernova
const ThermalLineItem: React.FC<{ item: CartItem; status: OrderStatus; isLegacy: boolean; index: number }> = ({ item, status, isLegacy, index }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasExploded, setHasExploded] = useState(false);

    // Trigger Supernova on 'SERVED' status
    useEffect(() => {
        if (status === 'SERVED' && !hasExploded && !isLegacy) {
            setHasExploded(true);
            triggerSupernova();
        }
    }, [status, isLegacy, hasExploded]);

    const triggerSupernova = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Sync Resolution
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const particles: LightPixel[] = [];
        // Generate 150 high-fidelity particles
        for (let i = 0; i < 150; i++) {
            particles.push(new LightPixel(centerX, centerY));
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let activeParticles = 0;
            particles.forEach(p => {
                if (p.alpha > 0) {
                    p.update();
                    p.draw(ctx);
                    activeParticles++;
                }
            });

            if (activeParticles > 0) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        requestAnimationFrame(animate);
    };

    // Determine Heat State
    const getThermalConfig = () => {
        switch (status) {
            case 'KITCHEN': // Prepping
                return {
                    color: 'rgba(192, 192, 192, 0.15)', // Titanium Silver
                    animate: { opacity: [0.3, 0.6, 0.3], scale: [0.98, 1.02, 0.98] },
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }
                };
            case 'CRAFTING': // Cooking - High Heat
                return {
                    color: 'rgba(212, 175, 55, 0.35)', // Champagne Gold
                    animate: { opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.1, 0.95] }, // The "Breathing" Sine Wave
                    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }
                };
            case 'SERVED': // Plating/Done - Cooling/Solid
                return {
                    color: 'rgba(0, 245, 212, 0.1)', // Electric Mint (Faint Glow after explosion)
                    animate: { opacity: 1, scale: 1 },
                    transition: { duration: 0.5 }
                };
            case 'LOGGED':
            default:
                return null;
        }
    };

    const thermal = getThermalConfig();

    return (
        <motion.div variants={lineItemVariants} className="relative flex justify-between items-center py-2 z-10">
            {/* The Pixel Supernova Layer */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20 mix-blend-screen" />
            
            {/* The Thermal Field (WebGL Shader Simulation via CSS) */}
            {!isLegacy && thermal && (
                <motion.div
                    className="absolute inset-0 z-[-1] rounded-lg pointer-events-none mix-blend-color-dodge"
                    initial={{ opacity: 0 }}
                    animate={thermal.animate}
                    transition={thermal.transition}
                >
                    <div 
                        className="w-full h-full blur-xl"
                        style={{ 
                            background: `radial-gradient(circle at 30% 50%, ${thermal.color} 0%, transparent 70%)` 
                        }} 
                    />
                </motion.div>
            )}

            <div className="flex items-center gap-3">
                 <span className={`font-mono text-xs ${isLegacy ? 'text-neutral-500' : 'text-neutral-500'}`}>{item.quantity}x</span>
                 <span className={`text-sm ${isLegacy ? 'text-black' : 'text-neutral-200'}`}>{item.title}</span>
            </div>
            <span className={`font-mono text-sm ${isLegacy ? 'text-black font-bold' : 'text-neutral-300'}`}>
                ${(item.basePrice * item.quantity).toFixed(2)}
            </span>
        </motion.div>
    );
};


const OrderDetails: React.FC<OrderDetailsProps> = ({ receipt, isLegacy, onBack }) => {
  const [status, setStatus] = useState<OrderStatus>('LOGGED');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Simulation of A.H.T.O. (Asynchronous Hospitality Tracking Object) Status Progression
  useEffect(() => {
    const t1 = setTimeout(() => setStatus('KITCHEN'), 4000);
    const t2 = setTimeout(() => setStatus('CRAFTING'), 12000);
    const t3 = setTimeout(() => setStatus('SERVED'), 25000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleReadReceipt = () => {
     const text = `Order confirmed. Total amount ${receipt.total.toFixed(2)} dollars. Your status is currently: ${status.toLowerCase()}.`;
     playAudioDescription(text, () => {}, () => {});
  };

  // Status Nodes Config
  const steps: { id: OrderStatus; label: string }[] = [
      { id: 'LOGGED', label: 'Logged' },
      { id: 'KITCHEN', label: 'Confirmed' },
      { id: 'CRAFTING', label: 'Crafting' },
      { id: 'SERVED', label: 'Served' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className={`min-h-screen flex flex-col pb-10 ${isLegacy ? 'bg-white text-black font-serif' : 'bg-obsidian text-neutral-200 font-sans'}`}>
      
      {/* 1. WAL Security Header */}
      <div className={`px-6 py-6 border-b ${isLegacy ? 'border-neutral-200' : 'border-neutral-800 bg-neutral-900/30'}`}>
         {/* Top Row: Back Button & ID */}
         <div className="flex justify-between items-center mb-4">
             <button 
                onClick={onBack}
                className={`p-2 -ml-2 rounded-full transition-colors ${isLegacy ? 'hover:bg-neutral-100 text-black' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}
                aria-label="Back to Menu"
             >
                <ArrowLeft size={24} />
             </button>
             <span className="font-mono text-xs text-neutral-500">#{receipt.id.slice(-6).toUpperCase()}</span>
         </div>
         
         {/* Status Lamp Container */}
         <div className="flex items-center gap-2 mb-2">
             <LedgerStatusLamp isOnline={isOnline} />
             <span className={`text-[10px] uppercase tracking-widest font-mono ${isLegacy ? 'text-neutral-500' : 'text-neutral-400'}`}>
                 {isOnline ? 'WAL Ledger Active' : 'Offline Token Generated'}
             </span>
         </div>

         <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`text-3xl font-bold ${isLegacy ? 'text-black' : 'text-white'}`}
         >
             {isOnline ? 'Order Confirmed' : 'Proof of Purchase'}
         </motion.h1>
      </div>

      {/* 2. A.H.T.O. Live Tracker */}
      <div className="px-6 py-8">
          <div className="relative mb-8">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 rounded-full" />
              
              {/* Active Progress Fill */}
              <motion.div 
                className="absolute top-1/2 left-0 h-0.5 bg-luxury-gold -translate-y-1/2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              <div className="relative flex justify-between">
                  {steps.map((step, idx) => {
                      const isActive = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                          <div key={step.id} className="flex flex-col items-center gap-3">
                              <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 z-10 bg-obsidian ${
                                  isActive ? 'border-luxury-gold bg-luxury-gold' : 'border-neutral-700'
                              } ${isCurrent ? 'ring-4 ring-luxury-gold/20' : ''}`} />
                              <span className={`text-[10px] uppercase tracking-wider transition-colors duration-300 ${
                                  isActive ? (isLegacy ? 'text-black font-bold' : 'text-champagne-gold') : 'text-neutral-600'
                              }`}>
                                  {step.label}
                              </span>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>

      {/* 3. Shadow Labor Monitor (Transparency Engine) */}
      <div className="px-6 mb-8">
          <ShadowLaborMonitor 
             status={status} 
             orderId={receipt.id} 
             isLegacy={isLegacy} 
          />
      </div>

      {/* 4. Honest Pricing Guard (Receipt) */}
      <div className="flex-1 px-6">
          <motion.div
              variants={receiptContainerVariants}
              initial="hidden"
              animate="show"
              className={`p-6 rounded-t-3xl border-t border-x relative overflow-hidden ${
                  isLegacy 
                  ? 'bg-white border-neutral-300 shadow-sm' 
                  : 'bg-neutral-950 border-neutral-800 shadow-[0_-10px_50px_-20px_rgba(0,0,0,0.9)]' // Deep shadow for gravity feel
              }`}
          >
             {/* Receipt Perforation Visual */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neutral-500/10 to-transparent" />

             <motion.div variants={lineItemVariants} className="flex justify-between items-center mb-6">
                 <h3 className={`text-lg font-mono ${isLegacy ? 'font-bold' : 'text-neutral-300'}`}>Receipt</h3>
                 <button onClick={handleReadReceipt} className="opacity-60 hover:opacity-100">
                     <Volume2 size={18} />
                 </button>
             </motion.div>

             {/* Dynamic Thermal Receipt List */}
             <div className="space-y-1 mb-6">
                 {receipt.items.map((item, i) => (
                    <ThermalLineItem 
                        key={i} 
                        item={item} 
                        status={status} 
                        isLegacy={isLegacy} 
                        index={i} 
                    />
                 ))}
             </div>

             <motion.div variants={lineItemVariants} className={`h-px w-full my-4 ${isLegacy ? 'bg-neutral-200' : 'bg-neutral-800'}`} />

             <div className="space-y-2 text-xs font-mono text-neutral-500">
                 <motion.div variants={lineItemVariants} className="flex justify-between">
                     <span>Subtotal</span>
                     <span>${receipt.subtotal.toFixed(2)}</span>
                 </motion.div>
                 <motion.div variants={lineItemVariants} className="flex justify-between">
                     <span>Service Fee ({(FEES.serviceFeeRate * 100)}%)</span>
                     <span>${receipt.serviceFee.toFixed(2)}</span>
                 </motion.div>
                 <motion.div variants={lineItemVariants} className="flex justify-between">
                     <span>Tax ({(FEES.taxRate * 100)}%)</span>
                     <span>${receipt.tax.toFixed(2)}</span>
                 </motion.div>
                 <motion.div variants={lineItemVariants} className="flex justify-between">
                     <span>Tech Fee</span>
                     <span>${FEES.techFeeFixed.toFixed(2)}</span>
                 </motion.div>
                 {receipt.tip > 0 && (
                     <motion.div variants={lineItemVariants} className="flex justify-between text-luxury-gold">
                         <span>Gratuity</span>
                         <span>${receipt.tip.toFixed(2)}</span>
                     </motion.div>
                 )}
             </div>

             <motion.div variants={lineItemVariants} className="mt-8 flex justify-between items-end mb-6"> {/* Increased Spacing */}
                 <span className="text-xs uppercase tracking-widest text-neutral-500">Total Paid</span>
                 <span className={`text-2xl font-mono relative ${isLegacy ? 'font-bold text-black' : 'text-white'}`}>
                     ${receipt.total.toFixed(2)}
                     {!isLegacy && (
                        <motion.span 
                            className="absolute inset-0 bg-champagne-gold/20 blur-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.6, 0] }}
                            transition={{ duration: 1, delay: 0.8 }}
                        />
                     )}
                 </span>
             </motion.div>

             {/* Offline WAL Hash Proof */}
             <motion.div variants={lineItemVariants} className="pt-6 border-t border-dashed border-neutral-800">
                 <div className="flex items-center gap-3 opacity-60">
                     <ShieldCheck size={14} className="text-electric-mint" />
                     <span className="text-[10px] font-mono text-electric-mint tracking-wider break-all">
                         WAL_HASH: {receipt.walHash}
                     </span>
                 </div>
                 {!isOnline && (
                     <div className="mt-4 p-4 bg-white rounded-xl flex justify-center">
                         {/* Simulation of an offline QR code rendering */}
                         <div className="w-32 h-32 bg-black opacity-10 pattern-grid-lg" />
                         <span className="absolute self-center text-xs text-black font-mono font-bold bg-white px-2">OFFLINE TOKEN</span>
                     </div>
                 )}
             </motion.div>
          </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;
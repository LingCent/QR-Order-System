
import React, { useState, useEffect, useCallback } from 'react';
import TrustedAnchor from './components/TrustedAnchor';
import Menu from './components/Menu';
import Checkout from './components/Checkout';
import OrderDetails from './components/OrderDetails';
import MenuItemDetails from './components/MenuItemDetails';
import OfflineIndicator from './components/OfflineIndicator';
import LegacyToggle from './components/LegacyToggle';
import ShadowService from './components/ShadowService';
import { SocialPresence } from './components/SocialPresence'; // Social HUD
import { MenuItem, CartItem, AppView, OrderReceipt, ModifierOption } from './types';
import { FEES } from './constants';
import { WalService, WalEntry } from './services/WalService';
import { ShieldCheck, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialProvider } from './contexts/SocialContext'; // Context Provider

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('anchor');
  const [isLegacy, setIsLegacy] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasVerified, setHasVerified] = useState(false);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isShadowServiceOpen, setIsShadowServiceOpen] = useState(false);
  
  // System State
  const [isSyncing, setIsSyncing] = useState(false);
  const [showRecoveryToast, setShowRecoveryToast] = useState(false);

  // --- CRASH RECOVERY ENGINE (The "God Mode" Persistence) ---
  useEffect(() => {
    // 1. Garbage Collect Old Logs
    WalService.garbageCollection();

    // 2. Check for Pending Orders (Crash Recovery)
    const logs = WalService.getLogs();
    const pendingOrders = logs.filter(l => !l.isSynced);
    
    // 3. Restore State if needed
    if (pendingOrders.length > 0) {
        const latestMissedOrder = pendingOrders[pendingOrders.length - 1];
        console.log(`[System] ⚠️ Detected ${pendingOrders.length} pending orders. Initializing replay...`);
        
        // Restore UI to Order Status immediately
        setReceipt(latestMissedOrder);
        setHasVerified(true); // Skip Anchor animation on recovery
        setView('order-status');
        setShowRecoveryToast(true);

        // Auto-hide toast
        setTimeout(() => setShowRecoveryToast(false), 5000);

        // Trigger Background Sync
        triggerAutoSync(pendingOrders);
    } else {
        // If no pending orders, check if we have a recent (last 1 hour) synced order to show
        // This is optional but good UX for "refreshing the page to check status"
        const recentSynced = logs.filter(l => l.isSynced && (Date.now() - l.timestamp < 3600000));
        if (recentSynced.length > 0) {
             const latest = recentSynced[recentSynced.length - 1];
             setReceipt(latest);
             // We don't force view change here, let user navigate, unless we want strict session restoration
             // For now, we leave it to standard flow.
        }
    }
  }, []);

  // Background Sync Simulation
  const triggerAutoSync = async (orders: WalEntry[]) => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    // Simulate discrete network packets
    for (const order of orders) {
      console.log(`[Sync] 📡 Attempting to push Order ${order.id.slice(-6)} to Kitchen...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Network Latency
      WalService.markSynced(order.id);
    }
    
    setIsSyncing(false);
  };

  const handleVerified = useCallback(() => {
    setHasVerified(true);
    setView('menu');
  }, []);

  const handleItemSelect = (item: MenuItem) => {
    setSelectedItem(item);
    setView('item-detail');
  };

  const handleAddToCart = (item: MenuItem, quantity: number = 1, modifiers: ModifierOption[] = []) => {
    setCart(prev => {
      return [...prev, { ...item, quantity, selectedModifiers: modifiers }];
    });
    
    setView('menu');
    setSelectedItem(null);
  };

  const handlePaymentComplete = (tipAmount: number) => {
    // 1. Calculate Receipt Data
    const calculateItemTotal = (item: CartItem) => {
        const mods = item.selectedModifiers?.reduce((s, m) => s + m.price, 0) || 0;
        return (item.basePrice + mods) * item.quantity;
    };

    const subtotal = cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);
    const serviceFee = subtotal * FEES.serviceFeeRate;
    const tax = subtotal * FEES.taxRate;
    const total = subtotal + serviceFee + tax + FEES.techFeeFixed + tipAmount;

    // Cryptographic Proof Simulation
    const walHash = "0x" + Math.random().toString(36).substring(2, 15).toUpperCase() + Math.random().toString(36).substring(2, 15).toUpperCase();

    const newReceipt: OrderReceipt = {
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        timestamp: Date.now(),
        items: [...cart],
        subtotal,
        serviceFee,
        tax,
        tip: tipAmount,
        total,
        walHash
    };

    // 2. LOG FIRST: Persist to Disk immediately
    // This guarantees that even if the browser crashes in the next millisecond, the order is safe.
    WalService.persist(newReceipt);

    // 3. Fire and Forget Sync
    triggerAutoSync([newReceipt as WalEntry]);

    // 4. Update UI
    setReceipt(newReceipt);
    setCart([]); 
    setView('order-status');
  };

  const toggleLegacyMode = () => {
    setIsLegacy(!isLegacy);
  };

  return (
    <SocialProvider>
      <div className={`min-h-screen relative ${isLegacy ? 'font-serif' : 'font-sans'}`}>
        
        {/* 1. Security Layer */}
        <TrustedAnchor onVerified={handleVerified} />

        {/* 2. Global Utilities */}
        <OfflineIndicator />
        <SocialPresence /> {/* The Social HUD */}
        
        {/* Recovery Toast */}
        <AnimatePresence>
          {showRecoveryToast && (
              <motion.div 
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-neutral-900 border border-electric-mint/30 shadow-[0_0_30px_rgba(0,245,212,0.15)] px-4 py-3 rounded-full flex items-center gap-3"
              >
                  <div className="w-2 h-2 rounded-full bg-electric-mint animate-pulse" />
                  <div className="flex flex-col">
                      <span className="text-xs font-bold text-white tracking-wide">SYSTEM RECOVERED</span>
                      <span className="text-[9px] text-neutral-400 font-mono">Restored from Write-Ahead Log</span>
                  </div>
                  <ShieldCheck size={14} className="text-electric-mint ml-2" />
              </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Shadow Service (Side Drawer) */}
        <ShadowService isOpen={isShadowServiceOpen} onClose={() => setIsShadowServiceOpen(false)} />

        {/* 4. Main Views */}
        {view === 'menu' && (
          <Menu 
              isLegacy={isLegacy} 
              onItemSelect={handleItemSelect} 
              onAddToCart={handleAddToCart}
              onOpenCheckout={() => setView('checkout')}
              cart={cart}
              hasActiveOrder={!!receipt}
              onViewOrder={() => setView('order-status')}
              onOpenShadowService={() => setIsShadowServiceOpen(true)}
              onToggleLegacy={toggleLegacyMode}
          />
        )}

        {/* 5. Food Detail Layer (The Sensory Hub) */}
        {view === 'item-detail' && selectedItem && (
          <MenuItemDetails 
              item={selectedItem}
              isLegacy={isLegacy}
              onClose={() => setView('menu')}
              onAddToCart={handleAddToCart}
          />
        )}

        {/* 6. Checkout Layer */}
        {view === 'checkout' && (
          <Checkout 
            cart={cart} 
            isLegacy={isLegacy} 
            onClose={() => setView('menu')} 
            onPaymentComplete={handlePaymentComplete}
          />
        )}

        {/* 7. Order Status & Transparency Hub */}
        {view === 'order-status' && receipt && (
          <OrderDetails 
            receipt={receipt}
            isLegacy={isLegacy}
            onBack={() => setView('menu')}
          />
        )}
      </div>
    </SocialProvider>
  );
};

export default App;

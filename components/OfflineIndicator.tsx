import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`fixed bottom-4 left-6 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-500 border ${isOnline ? 'bg-neutral-900/50 border-neutral-800' : 'bg-amber-900/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'}`}>
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-electric-mint' : 'bg-amber-500'} ${isOnline ? 'animate-pulse' : 'animate-pulse-slow'}`} />
        {!isOnline && <div className="absolute inset-0 bg-amber-500 rounded-full blur animate-ping opacity-20" />}
      </div>
      
      <span className={`text-[10px] uppercase tracking-wider font-mono ${isOnline ? 'text-neutral-400' : 'text-amber-500'}`}>
        {isOnline ? 'Ledger Synced' : 'Offline Mode • WAL Active'}
      </span>
      
      {!isOnline && <WifiOff size={10} className="text-amber-500 ml-1" />}
    </div>
  );
};

export default OfflineIndicator;
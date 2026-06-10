import React from 'react';

// High Perception Button: Solves precision issues caused by hand tremors (Report Section 3.1)
// Implements Fitts's Law by expanding the target area by ~200%.
export const LargeActionButton: React.FC<{ 
    onClick: () => void; 
    label: string; 
    subLabel?: string;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}> = ({ onClick, label, subLabel, variant = 'primary', disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-6 px-6 border-4 flex flex-col items-center justify-center text-center 
               uppercase tracking-widest shadow-stone-block transition-all transform active:translate-x-1 active:translate-y-1 active:shadow-none
               ${disabled ? 'opacity-50 cursor-not-allowed border-neutral-400 text-neutral-400' : ''}
               ${variant === 'primary' 
                 ? 'bg-black text-white border-black hover:bg-neutral-800' 
                 : 'bg-transparent text-black border-black hover:bg-neutral-100'
               }`}
  >
    <span className="text-2xl font-serif font-bold leading-tight">{label}</span>
    {subLabel && <span className="text-sm font-mono mt-1 opacity-80">{subLabel}</span>}
  </button>
);

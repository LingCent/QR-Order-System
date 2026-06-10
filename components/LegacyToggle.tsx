import React from 'react';
import { Eye, Smartphone } from 'lucide-react';

interface LegacyToggleProps {
  isLegacy: boolean;
  onToggle: () => void;
}

const LegacyToggle: React.FC<LegacyToggleProps> = ({ isLegacy, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-4 right-4 z-50 p-2 rounded-full border transition-all duration-300 backdrop-blur-md ${
        isLegacy 
          ? 'bg-white border-black text-black shadow-lg hover:scale-105' 
          : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
      }`}
      aria-label="Toggle Legacy Accessibility Mode"
    >
      {isLegacy ? <Smartphone size={24} /> : <Eye size={20} />}
    </button>
  );
};

export default LegacyToggle;
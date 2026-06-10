import { MenuItem } from '../types';

// In a real implementation, this would call the Gemini API
// utilizing GoogleGenAI to generate semantic descriptions.
export const generateAudioDescription = async (item: MenuItem): Promise<string> => {
  // Simulating network latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // A slightly more "Oracle" like narrative structure
  return `The ${item.title}. Priced at ${item.basePrice} dollars. ${item.description} This selection contains ${item.allergens.length > 0 ? item.allergens.join(' and ') : 'no major allergens'}.`;
};

// Enhanced TTS trigger with boundary events for Oracle visualization
export const playAudioDescription = (
  text: string, 
  onBoundary: (charIndex: number) => void,
  onEnd: () => void
): (() => void) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Rate set to 0.9 to match the "Rhythmic Curve" specs
    utterance.rate = 0.9; 
    
    // The heartbeat of Oracle.Voice
    utterance.onboundary = (event) => {
      // We are interested in word boundaries to trigger the pulsation
      if (event.name === 'word') {
        onBoundary(event.charIndex);
      }
    };

    utterance.onend = () => {
      onEnd();
    };

    utterance.onerror = () => {
      onEnd();
    };

    window.speechSynthesis.speak(utterance);

    // Return a cleanup/cancel function
    return () => window.speechSynthesis.cancel();
  } else {
    console.warn("Text-to-speech not supported in this browser context.");
    onEnd();
    return () => {};
  }
};
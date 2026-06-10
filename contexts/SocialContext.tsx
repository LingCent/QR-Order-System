
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Peer } from '../types';

interface SocialContextType {
  peers: Peer[];
  broadcastIntent: (action: Peer['currentAction']) => void;
  myProfile: Peer;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. My Identity (The "Self" Node)
  const [myProfile] = useState<Peer>({ 
      id: 'p1', 
      name: 'You', 
      avatar: 'https://i.pravatar.cc/150?u=me',
      isSelf: true
  });

  // 2. The Table Session (Simulated Ghost Peers)
  const [peers, setPeers] = useState<Peer[]>([
    { id: 'p2', name: 'John', avatar: 'https://i.pravatar.cc/150?u=john', isSelf: false },
    { id: 'p3', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah', isSelf: false }
  ]);

  // 3. The Broadcasting Engine (Mocking WebSocket)
  const broadcastIntent = useCallback((action: Peer['currentAction']) => {
    // In a real app, this emits to socket.io/supabase
    console.log(`[Social] 📡 Broadcasting: ${myProfile.name} is ${action?.type} ${action?.itemName || '...'}`);
    
    // 4. SIMULATION: Trigger Ghost Peer Reactions (The "Social Proof" Logic)
    if (action?.type === 'viewing') {
       // Randomly decide if a peer gets "interested" in what you are looking at
       const shouldReact = Math.random() > 0.4;
       
       if (shouldReact) {
           const reactorId = Math.random() > 0.5 ? 'p2' : 'p3';
           
           // Latency simulation (Human reaction time: ~1.5s)
           setTimeout(() => {
               setPeers(prev => prev.map(p => p.id === reactorId ? {
                   ...p,
                   currentAction: { 
                       type: 'viewing', 
                       itemId: action.itemId, 
                       itemName: action.itemName 
                   }
               } : p));

               // Clear the reaction after a while
               setTimeout(() => {
                    setPeers(prev => prev.map(p => p.id === reactorId ? { ...p, currentAction: undefined } : p));
               }, 4000);
           }, 1500);
       }
    } else if (!action) {
        // If I stopped looking, eventually peers stop looking too
        setTimeout(() => {
            setPeers(prev => prev.map(p => ({ ...p, currentAction: undefined })));
        }, 2000);
    }
  }, [myProfile]);

  return (
    <SocialContext.Provider value={{ peers, broadcastIntent, myProfile }}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) throw new Error("useSocial must be used within SocialProvider");
  return context;
};

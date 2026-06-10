
export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  multiSelect: boolean;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  category: string;
  allergens: Allergen[];
  isPopular?: boolean;
  modifiers?: ModifierGroup[];
}

export enum Allergen {
  GLUTEN = 'Gluten',
  DAIRY = 'Dairy',
  NUTS = 'Nuts',
  SHELLFISH = 'Shellfish',
  VEGAN_FRIENDLY = 'Not Vegan', // Inverse logic for filter: show if contains meat
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedModifiers?: ModifierOption[];
  notes?: string;
}

export type AppView = 'anchor' | 'menu' | 'item-detail' | 'checkout' | 'order-status';

export interface FeeStructure {
  serviceFeeRate: number; // e.g. 0.18
  taxRate: number; // e.g. 0.08
  techFeeFixed: number; // e.g. 0.50
}

export interface ServiceAgent {
  name: string;
  photoUrl: string;
  role: string;
  bio: string;
}

export type OrderStatus = 'LOGGED' | 'KITCHEN' | 'CRAFTING' | 'SERVED';

export interface OrderReceipt {
  id: string;
  timestamp: number;
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  tax: number;
  tip: number;
  total: number;
  walHash: string; // Cryptographic proof of local ledger entry
}

// --- SOCIAL ENGINE MODELS ---
export interface Peer {
  id: string;
  name: string;
  avatar: string;
  isSelf: boolean;
  currentAction?: {
    type: 'viewing' | 'adding' | 'paying';
    itemId?: string;
    itemName?: string;
  };
}

export interface SocialSession {
  tableId: string;
  peers: Peer[];
}

import { MenuItem, Allergen, FeeStructure, ServiceAgent, ModifierGroup } from './types';

export const FEES: FeeStructure = {
  serviceFeeRate: 0.18,
  taxRate: 0.085,
  techFeeFixed: 0.99
};

export const SERVICE_AGENT: ServiceAgent = {
  name: "Alex",
  role: "Service Specialist",
  photoUrl: "https://picsum.photos/id/64/200/200", // Placeholder for a friendly face
  bio: "Ensuring your evening flow is seamless."
};

const COMMON_MODIFIERS: ModifierGroup[] = [
    {
        id: 'spicy',
        name: 'Spiciness Level',
        required: false,
        multiSelect: false,
        options: [
            { id: 'not-spicy', name: 'Not Spicy', price: 0 },
            { id: 'mild', name: 'Mild', price: 0 },
            { id: 'normal', name: 'Normal (Standard Spicy)', price: 0 },
            { id: 'extra-spicy', name: 'Extra Spicy', price: 0 }
        ]
    },
    {
        id: 'add-ons',
        name: 'Add-ons',
        required: false,
        multiSelect: true,
        options: [
            { id: 'egg', name: 'Fried Egg (Telur Mata)', price: 2 },
            { id: 'rice', name: 'Extra Rice', price: 3 },
            { id: 'sambal', name: 'Extra Sambal', price: 1 }
        ]
    }
];

const BASE_ITEMS: MenuItem[] = [
  {
    id: '1',
    title: 'Signature Nasi Lemak',
    description: 'Fragrant coconut rice served with spicy sambal, crispy anchovies, roasted peanuts, cucumber, and a hard-boiled egg.',
    basePrice: 12.00,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Nasi_Lemak%2C_Mamak%2C_Sydney.jpg',
    category: 'Local Favourites',
    allergens: [Allergen.NUTS],
    isPopular: true,
    modifiers: [COMMON_MODIFIERS[0], COMMON_MODIFIERS[1]]
  },
  {
    id: '2',
    title: 'Penang Char Kway Teow',
    description: 'Stir-fried flat rice noodles with prawns, cockles, bean sprouts, egg, and chives in dark soy sauce.',
    basePrice: 14.00,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Char_kway_teow.JPG',
    category: 'Noodles',
    allergens: [Allergen.SHELLFISH, Allergen.GLUTEN],
    isPopular: true,
    modifiers: [COMMON_MODIFIERS[0]]
  },
  {
    id: '3',
    title: 'Chicken Satay (6 Skewers)',
    description: 'Charcoal-grilled marinated chicken skewers, served with rich peanut sauce, cucumber, and onions.',
    basePrice: 15.00,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Chicken_satay.jpg',
    category: 'Starters',
    allergens: [Allergen.NUTS],
  },
  {
    id: '4',
    title: 'Curry Laksa',
    description: 'Rich and spicy coconut curry noodle soup with prawns, tofu puffs, fish cakes, and cockles.',
    basePrice: 16.00,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Curry_Laksa.jpg',
    category: 'Noodles',
    allergens: [Allergen.SHELLFISH, Allergen.DAIRY],
    modifiers: [COMMON_MODIFIERS[0]]
  },
  {
    id: '5',
    title: 'Roti Canai with Dhal',
    description: 'Crispy and flaky Malaysian flatbread, served with a side of warm dhal curry.',
    basePrice: 4.50,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Roti_canai_susu.jpg',
    category: 'Local Favourites',
    allergens: [Allergen.GLUTEN]
  },
  {
    id: '6',
    title: 'Cendol',
    description: 'Shaved ice dessert with green rice flour jelly, red beans, coconut milk, and palm sugar syrup.',
    basePrice: 8.00,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Cendol_in_Penang.jpg',
    category: 'Desserts',
    allergens: [Allergen.DAIRY]
  }
];

// Procedurally generate a larger menu to demonstrate the Virtualization Engine (MenuStream)
const EXTRA_CATEGORIES = ['Wok Hei', 'Mamak Specials', 'Rice Dishes', 'Kuih & Snacks', 'Beverages'];

const generatedItems: MenuItem[] = [];
let idCounter = 10;

EXTRA_CATEGORIES.forEach((cat, catIdx) => {
    for (let i = 0; i < 6; i++) {
        generatedItems.push({
            id: String(idCounter++),
            title: `${cat} Selection ${i + 1}`,
            description: `A masterfully curated selection from our ${cat.toLowerCase()} station. Prepared with authentic Malaysian flavours.`,
            basePrice: 8 + (i * 2) + (catIdx * 2),
            imageUrl: `https://loremflickr.com/400/300/malaysia,food,${cat.toLowerCase().replace(' ', '')}?lock=${idCounter}`,
            category: cat,
            allergens: i % 3 === 0 ? [Allergen.GLUTEN] : i % 4 === 0 ? [Allergen.NUTS] : [],
        });
    }
});

export const MENU_ITEMS: MenuItem[] = [...BASE_ITEMS, ...generatedItems];

export const ALLERGEN_OPTIONS = Object.values(Allergen);
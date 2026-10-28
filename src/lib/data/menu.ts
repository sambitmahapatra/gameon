export type MenuCategory = 'snacks' | 'mains' | 'drinks' | 'combos';

export type MenuItem = {
  name: string;
  description: string;
  price: number;
  veg: boolean;
  category: MenuCategory;
};

export const MENU_CATEGORIES: { id: MenuCategory; label: string; note: string }[] = [
  { id: 'snacks', label: 'Snacks', note: 'One-handed food, built for mid-match.' },
  { id: 'mains', label: 'Mains', note: 'Enough to carry you through a long session.' },
  { id: 'drinks', label: 'Drinks', note: 'Cold, caffeinated, or both.' },
  { id: 'combos', label: 'Combos', note: 'Food and play time, bundled.' },
];

export const MENU: MenuItem[] = [
  // Snacks
  {
    name: 'Headshot Nachos',
    description: 'Corn chips, melted cheddar, jalapeño, pico de gallo, sour cream.',
    price: 240,
    veg: true,
    category: 'snacks',
  },
  {
    name: 'Peri Peri Fries',
    description: 'Hand-cut, double-fried, dusted with peri peri and lime.',
    price: 180,
    veg: true,
    category: 'snacks',
  },
  {
    name: 'Chilli Paneer Poppers',
    description: 'Crisp paneer cubes tossed in sweet chilli, spring onion.',
    price: 260,
    veg: true,
    category: 'snacks',
  },
  {
    name: 'Buffalo Wings',
    description: 'Six wings, buffalo or honey garlic, blue cheese dip.',
    price: 320,
    veg: false,
    category: 'snacks',
  },
  {
    name: 'Keema Pav Sliders',
    description: 'Two Mumbai-style mutton keema sliders on buttered pav.',
    price: 290,
    veg: false,
    category: 'snacks',
  },
  {
    name: 'Masala Popcorn Chicken',
    description: 'Bite-sized, spiced and salted, with a mint mayo.',
    price: 270,
    veg: false,
    category: 'snacks',
  },
  // Mains
  {
    name: 'Victory Burger',
    description: 'Double patty, smoked cheese, caramelised onion, house sauce, fries.',
    price: 420,
    veg: false,
    category: 'mains',
  },
  {
    name: 'Respawn Veg Burger',
    description: 'Spiced potato and corn patty, slaw, chipotle mayo, fries.',
    price: 340,
    veg: true,
    category: 'mains',
  },
  {
    name: 'Clutch Chicken Rice Bowl',
    description: 'Burnt garlic rice, grilled chicken, charred veg, fried egg.',
    price: 390,
    veg: false,
    category: 'mains',
  },
  {
    name: 'Paneer Tikka Wrap',
    description: 'Tandoori paneer, pickled onion, mint chutney, roomali roll.',
    price: 310,
    veg: true,
    category: 'mains',
  },
  {
    name: 'Margherita Flatbread',
    description: 'Thin-crust flatbread, San Marzano tomato, basil, mozzarella.',
    price: 330,
    veg: true,
    category: 'mains',
  },
  {
    name: 'Butter Chicken Mac',
    description: 'Macaroni in a butter chicken sauce, under a cheese crust.',
    price: 410,
    veg: false,
    category: 'mains',
  },
  // Drinks
  {
    name: 'Health Potion Mocktail',
    description: 'Watermelon, lime, mint, pink salt, soda. Served over crushed ice.',
    price: 190,
    veg: true,
    category: 'drinks',
  },
  {
    name: 'Mana Blue Lemonade',
    description: 'Blue pea flower, lemon, honey, sparkling water.',
    price: 190,
    veg: true,
    category: 'drinks',
  },
  {
    name: 'Double Shot Cold Brew',
    description: '18-hour cold brew, over ice, with or without milk.',
    price: 220,
    veg: true,
    category: 'drinks',
  },
  {
    name: 'Filter Coffee',
    description: 'South Indian filter decoction, hot, strong, by the tumbler.',
    price: 120,
    veg: true,
    category: 'drinks',
  },
  {
    name: 'Masala Chai',
    description: 'Cardamom, ginger, clove. Bottomless on weekday mornings.',
    price: 90,
    veg: true,
    category: 'drinks',
  },
  {
    name: 'Belgian Chocolate Shake',
    description: 'Thick, cocoa-heavy, topped with cacao nibs.',
    price: 260,
    veg: true,
    category: 'drinks',
  },
  // Combos
  {
    name: 'Solo Queue',
    description: 'One hour on an esports station, peri peri fries, any cold brew.',
    price: 650,
    veg: true,
    category: 'combos',
  },
  {
    name: 'Duo Lane',
    description: 'Two hours in the console lounge, nachos, two mocktails.',
    price: 1150,
    veg: true,
    category: 'combos',
  },
  {
    name: 'Squad Night',
    description: 'Four esports stations for two hours, two large snack platters.',
    price: 3400,
    veg: false,
    category: 'combos',
  },
  {
    name: 'First Flight',
    description: 'A 45-minute simulator session with a briefing, plus filter coffee.',
    price: 1050,
    veg: true,
    category: 'combos',
  },
  {
    name: 'Grid Start',
    description: 'One hour in a racing cockpit, wings, and a Mana Blue lemonade.',
    price: 900,
    veg: false,
    category: 'combos',
  },
  {
    name: 'Creator Hour',
    description: 'An hour in a streaming pod, recording files, and a cold brew.',
    price: 700,
    veg: true,
    category: 'combos',
  },
];

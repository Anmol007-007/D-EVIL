export const initialCategories = [
  { id: 'all', name: 'Full Feast', icon: '🔥' },
  { id: 'steaks', name: 'Primal Steaks & Cuts', icon: '🥩' },
  { id: 'starters', name: 'Ember Starters', icon: '🥓' },
  { id: 'woodfire', name: 'Inferno Woodfire', icon: '🍕' },
  { id: 'seafood', name: 'Charred Ocean', icon: '🦞' },
  { id: 'desserts', name: 'Molten Desserts', icon: '🌋' },
  { id: 'drinks', name: 'Smoked Alchemy & Brews', icon: '🥃' }
];

export const initialMenuItems = [
  {
    id: 'm1',
    name: 'Hellfire Wagyu Tomahawk (32oz)',
    category: 'steaks',
    price: 135.00,
    description: 'Dry-aged 45 days, seared over white-hot Japanese binchotan charcoal, basted in smoked bone marrow butter and roasted garlic.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    dietary: ['Gluten-Free', 'Chef Favorite', 'Signature Cut'],
    prepTime: '25-30 min',
    inStock: true,
    rating: 5.0,
    calories: '1150 kcal'
  },
  {
    id: 'm2',
    name: 'D\'EVIL Miyazaki A5 Ribeye (10oz)',
    category: 'steaks',
    price: 88.00,
    description: 'Authentic A5 black cattle ribeye, torched table-side with flaming bourbon, maldon smoked sea salt and charred broccolini.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    dietary: ['Gluten-Free', 'Chef Favorite'],
    prepTime: '18-22 min',
    inStock: true,
    rating: 4.98,
    calories: '890 kcal'
  },
  {
    id: 'm3',
    name: 'Charred Bone Marrow & Brisket Toast',
    category: 'starters',
    price: 21.00,
    description: 'Split beef marrow canoes flame-roasted with 14-hour smoked brisket burnt ends, chimichurri rojo and grilled artisan sourdough.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb228cc?auto=format&fit=crop&w=600&q=80',
    dietary: ['Chef Favorite'],
    prepTime: '12-15 min',
    inStock: true,
    rating: 4.92,
    calories: '560 kcal'
  },
  {
    id: 'm4',
    name: 'Smoked Devil Wings & Ghost Chili Glaze',
    category: 'starters',
    price: 18.50,
    description: 'Hickory-smoked jumbo chicken wings tossed in fiery ghost chili honey glaze, pickled jalapenos and gorgonzola crema.',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
    dietary: ['Spicy', 'Gluten-Free'],
    prepTime: '10-12 min',
    inStock: true,
    rating: 4.88,
    calories: '620 kcal'
  },
  {
    id: 'm5',
    name: 'Inferno Diavola & Hot Honey Pizza',
    category: 'woodfire',
    price: 24.00,
    description: 'Fermented double-zero dough, crushed San Marzano DOP, smoked scamorza, fiery spianata calabrese and habanero-infused blossom honey.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    dietary: ['Spicy', 'Signature Cut'],
    prepTime: '12-15 min',
    inStock: true,
    rating: 4.95,
    calories: '920 kcal'
  },
  {
    id: 'm6',
    name: 'Black Truffle & Smoked Short Rib Pizza',
    category: 'woodfire',
    price: 27.00,
    description: 'Braised prime short rib, fontina, charred wild chanterelles, black garlic crema and freshly shaved winter truffle.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    dietary: ['Chef Favorite'],
    prepTime: '14-16 min',
    inStock: true,
    rating: 4.9,
    calories: '960 kcal'
  },
  {
    id: 'm7',
    name: 'Flame-Kissed Jumbo Tiger Prawns',
    category: 'seafood',
    price: 36.00,
    description: 'Wild colossal tiger prawns roasted in garlic-habanero compound butter, charred lemon and blistered heirloom peppers.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    dietary: ['Gluten-Free', 'Spicy'],
    prepTime: '12-14 min',
    inStock: true,
    rating: 4.9,
    calories: '440 kcal'
  },
  {
    id: 'm8',
    name: 'Cedar Plank Chilean Sea Bass',
    category: 'seafood',
    price: 46.00,
    description: 'Wild sea bass smoked over red cedar with a charred miso-bourbon glaze, sesame crackling and wilted baby bok choy.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    dietary: ['Gluten-Free'],
    prepTime: '18-20 min',
    inStock: true,
    rating: 4.94,
    calories: '520 kcal'
  },
  {
    id: 'm9',
    name: 'Lucifer\'s Molten Lava Fondant',
    category: 'desserts',
    price: 16.00,
    description: '80% dark Belgian cocoa cake with an oozing ancho-chili spiced molten core, smoked vanilla ice cream and spun gold embers.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    dietary: ['Vegetarian', 'Chef Favorite'],
    prepTime: '10 min',
    inStock: true,
    rating: 4.99,
    calories: '580 kcal'
  },
  {
    id: 'm10',
    name: 'Smoked Bourbon & Caramel Bread Pudding',
    category: 'desserts',
    price: 14.00,
    description: 'Brioche soaked in spiced custard, baked in cast iron, drizzled with flambéed Buffalo Trace bourbon caramel and pecan praline.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    dietary: ['Vegetarian'],
    prepTime: '8 min',
    inStock: true,
    rating: 4.87,
    calories: '540 kcal'
  },
  {
    id: 'm11',
    name: 'The Devil\'s Breath Smoked Old Fashioned',
    category: 'drinks',
    price: 18.00,
    description: 'High-proof rye whiskey, charred hickory smoke, black walnut bitters, flamed orange peel served inside an ember mist dome.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    dietary: ['Signature Drink'],
    prepTime: '4 min',
    inStock: true,
    rating: 4.96,
    calories: '210 kcal'
  },
  {
    id: 'm12',
    name: 'Blood Orange & Mezcal Paloma',
    category: 'drinks',
    price: 17.00,
    description: 'Oaxacan artisanal mezcal, freshly squeezed blood orange, pink grapefruit soda, agave nectar and black volcanic salt rim.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    dietary: ['Signature Drink'],
    prepTime: '3 min',
    inStock: true,
    rating: 4.89,
    calories: '175 kcal'
  }
];

export const initialTables = [
  { id: 'T1', number: 1, capacity: 2, section: 'Ember Pit Room', status: 'available', currentOrderId: null },
  { id: 'T2', number: 2, capacity: 2, section: 'Ember Pit Room', status: 'occupied', currentOrderId: 'ord-101', guestName: 'Marcus Kane', seatedAt: '35 mins ago' },
  { id: 'T3', number: 3, capacity: 4, section: 'Ember Pit Room', status: 'reserved', currentOrderId: null, reservationTime: '19:30', guestName: 'Viktor Thorne' },
  { id: 'T4', number: 4, capacity: 4, section: 'Flames & Forge', status: 'occupied', currentOrderId: 'ord-102', guestName: 'Jaxson & Raven', seatedAt: '15 mins ago' },
  { id: 'T5', number: 5, capacity: 6, section: 'Hellfire Terrace', status: 'available', currentOrderId: null },
  { id: 'T6', number: 6, capacity: 4, section: 'Hellfire Terrace', status: 'cleaning', currentOrderId: null },
  { id: 'T7', number: 7, capacity: 2, section: 'Inferno Rooftop', status: 'occupied', currentOrderId: 'ord-103', guestName: 'Damon Salvatore', seatedAt: '10 mins ago' },
  { id: 'T8', number: 8, capacity: 8, section: 'VIP Warlock Vault', status: 'reserved', currentOrderId: null, reservationTime: '20:30', guestName: 'Syndicate Feast' }
];

export const initialOrders = [
  {
    id: 'ord-101',
    orderNumber: '#101',
    type: 'dine-in',
    tableNumber: 2,
    customerName: 'Marcus Kane',
    items: [
      { id: 'm1', name: 'Hellfire Wagyu Tomahawk (32oz)', price: 135.00, quantity: 1, notes: 'Medium rare, extra smoked bone marrow butter' },
      { id: 'm11', name: 'The Devil\'s Breath Smoked Old Fashioned', price: 18.00, quantity: 2, notes: '' }
    ],
    status: 'cooking',
    subtotal: 171.00,
    tax: 15.39,
    tip: 30.00,
    total: 216.39,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    paymentStatus: 'unpaid'
  },
  {
    id: 'ord-102',
    orderNumber: '#102',
    type: 'dine-in',
    tableNumber: 4,
    customerName: 'Jaxson & Raven',
    items: [
      { id: 'm5', name: 'Inferno Diavola & Hot Honey Pizza', price: 24.00, quantity: 1, notes: 'Extra crispy charred crust' },
      { id: 'm4', name: 'Smoked Devil Wings & Ghost Chili Glaze', price: 18.50, quantity: 1, notes: '' },
      { id: 'm12', name: 'Blood Orange & Mezcal Paloma', price: 17.00, quantity: 2, notes: '' }
    ],
    status: 'pending',
    subtotal: 76.50,
    tax: 6.88,
    tip: 15.00,
    total: 98.38,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    paymentStatus: 'unpaid'
  },
  {
    id: 'ord-103',
    orderNumber: '#103',
    type: 'dine-in',
    tableNumber: 7,
    customerName: 'Damon Salvatore',
    items: [
      { id: 'm2', name: 'D\'EVIL Miyazaki A5 Ribeye (10oz)', price: 88.00, quantity: 1, notes: 'Rare, flamed table-side' },
      { id: 'm9', name: 'Lucifer\'s Molten Lava Fondant', price: 16.00, quantity: 1, notes: '' }
    ],
    status: 'ready',
    subtotal: 104.00,
    tax: 9.36,
    tip: 20.00,
    total: 133.36,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    paymentStatus: 'paid'
  }
];

export const initialReservations = [
  {
    id: 'res-501',
    guestName: 'Viktor Thorne',
    phone: '+1 (555) 666-8201',
    email: 'viktor@devilgrill.com',
    guests: 4,
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    section: 'Ember Pit Room',
    specialRequests: 'Pit-side seating preferred, celebrating victory.',
    status: 'confirmed',
    tableAssigned: 3,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  },
  {
    id: 'res-502',
    guestName: 'Syndicate Feast',
    phone: '+1 (555) 666-9912',
    email: 'vip@devilgrill.com',
    guests: 8,
    date: new Date().toISOString().split('T')[0],
    time: '20:30',
    section: 'VIP Warlock Vault',
    specialRequests: 'Whiskey flight pairing and whole Tomahawk carved table-side.',
    status: 'confirmed',
    tableAssigned: 8,
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString()
  }
];

export const restaurantConfig = {
  name: 'D’EVIL STEAKHOUSE & GRILL',
  tagline: 'Infernal Flames, Dry-Aged Prime Cuts & Wicked Mixology',
  address: '666 Brimstone Alley, Downtown Arts District',
  phone: '+1 (555) 666-3845',
  hours: 'Wed - Mon: 5:00 PM - 2:00 AM (Tue: Closed)',
  currency: '$',
  taxRate: 0.09,
  wifiPassword: 'DEVIL_GUEST_WIFI'
};

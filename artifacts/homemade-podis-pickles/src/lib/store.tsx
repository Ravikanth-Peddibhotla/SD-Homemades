import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Category = 'Podi' | 'Pickle' | 'Combo';
export type Heat = 'gentle' | 'medium' | 'fiery';
export type Product = {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  description: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  accent: string;
  tags: string[];
  ingredients: string[];
  shelf: string;
  heat: Heat;
  vegetarian: boolean;
  offer?: { name: string; type: 'percentage' | 'fixed'; value: number };
};
export type CartLine = { key: string; product: Product; quantity: number; weight: string; saved: boolean };

export const products: Product[] = [
  { id: 'nalla-karam', name: 'Nalla Karam Garlic Podi', shortName: 'Garlic Podi', category: 'Podi', description: 'Roasted urad dal, sesame and whole garlic, ground coarse so every spoon has a little crunch.', price: 245, compareAt: 280, rating: 4.9, reviews: 128, image: '/images/podis-products.jpg', accent: '#b65b3d', tags: ['Bestseller', 'No preservatives'], ingredients: ['Urad dal', 'Sesame', 'Whole garlic', 'Byadgi chilli', 'Curry leaves'], shelf: '45 days · pantry stable', heat: 'medium', vegetarian: true },
  { id: 'gongura', name: 'Gongura & Green Chilli Pickle', shortName: 'Gongura Pickle', category: 'Pickle', description: 'Tangy gongura leaves with green chilli and cold-pressed sesame oil. A bright Andhra classic.', price: 295, rating: 4.8, reviews: 94, image: '/images/podis-hero.jpg', accent: '#6f7a4b', tags: ['Fresh batch', 'Andhra recipe'], ingredients: ['Gongura leaves', 'Green chilli', 'Mustard', 'Sesame oil', 'Garlic'], shelf: '60 days · refrigerate after opening', heat: 'fiery', vegetarian: true },
  { id: 'curry-leaf', name: 'Karivepaku Curry Leaf Podi', shortName: 'Curry Leaf Podi', category: 'Podi', description: 'Fragrant curry leaves, roasted coconut and lentils. Spoon over hot rice and ghee.', price: 225, rating: 4.7, reviews: 67, image: '/images/podis-kitchen.jpg', accent: '#66724e', tags: ['Mild', 'Small batch'], ingredients: ['Curry leaves', 'Chana dal', 'Coconut', 'Black pepper', 'Cumin'], shelf: '45 days · pantry stable', heat: 'gentle', vegetarian: true },
  { id: 'avakaya', name: 'Mango Avakaya Pickle', shortName: 'Mango Avakaya', category: 'Pickle', description: 'Raw summer mangoes, dark mustard and chilli. Bold, briny and made to wake up plain dal.', price: 315, compareAt: 350, rating: 4.9, reviews: 151, image: '/images/podis-products.jpg', accent: '#c4793d', tags: ['Seasonal', 'Customer favourite'], ingredients: ['Raw mango', 'Mustard', 'Red chilli', 'Sea salt', 'Sesame oil'], shelf: '90 days · refrigerate after opening', heat: 'fiery', vegetarian: true },
  { id: 'comfort-combo', name: 'The Comfort Rice Combo', shortName: 'Comfort Combo', category: 'Combo', description: 'One jar each of garlic podi, gongura pickle and curry leaf podi for the weekday rice ritual.', price: 690, compareAt: 765, rating: 4.9, reviews: 43, image: '/images/podis-hero.jpg', accent: '#a44e32', tags: ['Save ₹75', 'Giftable'], ingredients: ['Garlic podi', 'Gongura pickle', 'Curry leaf podi'], shelf: '45–90 days · see individual jars', heat: 'medium', vegetarian: true },
];

export const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

type StoreValue = {
  catalog: Product[];
  lines: CartLine[];
  wishlist: string[];
  addToBag: (product: Product, quantity?: number, weight?: string) => void;
  updateQuantity: (key: string, amount: number) => void;
  removeLine: (key: string) => void;
  toggleSaved: (key: string) => void;
  toggleWishlist: (id: string) => void;
  bagCount: number;
};
const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [lines, setLines] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem('hp-lines') ?? '[]') as CartLine[]; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('hp-wishlist') ?? '[]') as string[]; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('hp-lines', JSON.stringify(lines)); }, [lines]);
  useEffect(() => { localStorage.setItem('hp-wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => {
    fetch('/api/catalog/products').then((response) => response.ok ? response.json() : Promise.reject()).then((liveProducts: Array<Product & { variants?: Array<{ price: number; compareAt: number | null }>; offers?: Array<{ name: string; type: 'percentage' | 'fixed'; value: number }> }>) => {
      setCatalog(liveProducts.map((product) => {
        const variant = product.variants?.[0];
        const offer = product.offers?.[0];
        const basePrice = variant?.price ?? product.price;
        const offerPrice = offer ? offer.type === 'percentage' ? Math.max(0, Math.round(basePrice * (100 - offer.value) / 100)) : Math.max(0, basePrice - offer.value) : basePrice;
        return { ...product, price: offerPrice, compareAt: variant?.compareAt ?? (offer ? basePrice : product.compareAt), offer };
      }));
    }).catch(() => undefined);
  }, []);
  const value = useMemo<StoreValue>(() => ({
    catalog, lines, wishlist,
    addToBag: (product, quantity = 1, weight = '250 g') => setLines((current) => {
      const key = `${product.id}-${weight}`;
      const found = current.find((line) => line.key === key);
      if (found) return current.map((line) => line.key === key ? { ...line, quantity: line.quantity + quantity, saved: false } : line);
      return [...current, { key, product, quantity, weight, saved: false }];
    }),
    updateQuantity: (key, amount) => setLines((current) => current.map((line) => line.key === key ? { ...line, quantity: Math.max(1, line.quantity + amount) } : line)),
    removeLine: (key) => setLines((current) => current.filter((line) => line.key !== key)),
    toggleSaved: (key) => setLines((current) => current.map((line) => line.key === key ? { ...line, saved: !line.saved } : line)),
    toggleWishlist: (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    bagCount: lines.filter((line) => !line.saved).reduce((sum, line) => sum + line.quantity, 0),
  }), [catalog, lines, wishlist]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be used inside StoreProvider');
  return value;
}
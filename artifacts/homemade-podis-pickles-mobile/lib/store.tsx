import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Category = 'Podi' | 'Pickle' | 'Combo';
export type Product = { id: string; name: string; shortName: string; category: Category; description: string; price: number; rating: number; reviews: number; image: number; tags: string[]; ingredients: string[]; shelf: string; heat: 'gentle' | 'medium' | 'fiery' };
export type CartLine = { product: Product; quantity: number; size: string };
const images = {
  hero: require('@/assets/images/podis-hero.jpg'),
  products: require('@/assets/images/podis-products.jpg'),
  kitchen: require('@/assets/images/podis-kitchen.jpg'),
};
export const products: Product[] = [
  { id: 'nalla-karam', name: 'Nalla Karam Garlic Podi', shortName: 'Garlic Podi', category: 'Podi', description: 'Roasted urad dal, sesame and whole garlic, ground coarse so every spoon has a little crunch.', price: 245, rating: 4.9, reviews: 128, image: images.products, tags: ['Bestseller', 'No preservatives'], ingredients: ['Urad dal', 'Sesame', 'Whole garlic', 'Byadgi chilli', 'Curry leaves'], shelf: '45 days · pantry stable', heat: 'medium' },
  { id: 'gongura', name: 'Gongura & Green Chilli Pickle', shortName: 'Gongura Pickle', category: 'Pickle', description: 'Tangy gongura leaves with green chilli and cold-pressed sesame oil. A bright Andhra classic.', price: 295, rating: 4.8, reviews: 94, image: images.hero, tags: ['Fresh batch', 'Andhra recipe'], ingredients: ['Gongura leaves', 'Green chilli', 'Mustard', 'Sesame oil', 'Garlic'], shelf: '60 days · refrigerate after opening', heat: 'fiery' },
  { id: 'curry-leaf', name: 'Karivepaku Curry Leaf Podi', shortName: 'Curry Leaf Podi', category: 'Podi', description: 'Fragrant curry leaves, roasted coconut and lentils. Spoon over hot rice and ghee.', price: 225, rating: 4.7, reviews: 67, image: images.kitchen, tags: ['Mild', 'Small batch'], ingredients: ['Curry leaves', 'Chana dal', 'Coconut', 'Black pepper', 'Cumin'], shelf: '45 days · pantry stable', heat: 'gentle' },
  { id: 'avakaya', name: 'Mango Avakaya Pickle', shortName: 'Mango Avakaya', category: 'Pickle', description: 'Raw summer mangoes, dark mustard and chilli. Bold, briny and made to wake up plain dal.', price: 315, rating: 4.9, reviews: 151, image: images.products, tags: ['Seasonal', 'Customer favourite'], ingredients: ['Raw mango', 'Mustard', 'Red chilli', 'Sea salt', 'Sesame oil'], shelf: '90 days · refrigerate after opening', heat: 'fiery' },
  { id: 'comfort-combo', name: 'The Comfort Rice Combo', shortName: 'Comfort Combo', category: 'Combo', description: 'One jar each of garlic podi, gongura pickle and curry leaf podi for the weekday rice ritual.', price: 690, rating: 4.9, reviews: 43, image: images.hero, tags: ['Save ₹75', 'Giftable'], ingredients: ['Garlic podi', 'Gongura pickle', 'Curry leaf podi'], shelf: '45–90 days', heat: 'medium' },
];
type Store = { cart: CartLine[]; wishlist: string[]; add: (product: Product, size?: string, quantity?: number) => void; change: (id: string, delta: number) => void; remove: (id: string) => void; toggleWish: (id: string) => void; isSignedIn: boolean };
const StoreContext = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  useEffect(() => { AsyncStorage.getItem('podis-cart').then((raw) => { if (raw) setCart(JSON.parse(raw) as CartLine[]); }); AsyncStorage.getItem('podis-wishlist').then((raw) => { if (raw) setWishlist(JSON.parse(raw) as string[]); }); }, []);
  useEffect(() => { AsyncStorage.setItem('podis-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { AsyncStorage.setItem('podis-wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  const value = useMemo<Store>(() => ({ cart, wishlist, isSignedIn: false,
    add: (product, size = '250 g', quantity = 1) => setCart((lines) => { const old = lines.find((l) => l.product.id === product.id && l.size === size); return old ? lines.map((l) => l === old ? { ...l, quantity: l.quantity + quantity } : l) : [...lines, { product, size, quantity }]; }),
    change: (id, delta) => setCart((lines) => lines.map((l) => l.product.id === id ? { ...l, quantity: Math.max(1, l.quantity + delta) } : l)),
    remove: (id) => setCart((lines) => lines.filter((l) => l.product.id !== id)),
    toggleWish: (id) => setWishlist((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]),
  }), [cart, wishlist]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore(): Store { const value = useContext(StoreContext); if (!value) throw new Error('useStore must be used inside StoreProvider'); return value; }
export const formatPrice = (value: number) => `₹${value.toLocaleString('en-IN')}`;
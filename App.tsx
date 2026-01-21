
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Discover from './components/Discover';
import Invent from './components/Invent';
import Destroy from './components/Destroy';
import NovaAssistant from './components/NovaAssistant';
import Contact from './components/Contact';
import Products from './components/Products';
import AdminCommand from './components/Admin/AdminCommand';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  // Wishlist
  wishlist: any[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  // Load from local storage on mount (simulating neural cache)
  useEffect(() => {
    const savedCart = localStorage.getItem('rv_cart');
    const savedWishlist = localStorage.getItem('rv_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('rv_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rv_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.priceNum || product.price, 
        image: product.image, 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: any) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, cartCount,
      wishlist, toggleWishlist, isInWishlist, wishlistCount
    }}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/invent" element={<Invent />} />
            <Route path="/destroy" element={<Destroy />} />
            <Route path="/market" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/*" element={<AdminCommand />} />
          </Routes>
          <NovaAssistant />
        </Layout>
      </HashRouter>
    </CartContext.Provider>
  );
};

export default App;

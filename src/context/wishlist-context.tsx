
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/lib/data';

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// A simple in-memory store using localStorage for persistence across reloads.
const getInitialState = (): string[] => {
    if (typeof window !== 'undefined') {
        try {
            const item = window.localStorage.getItem('wishlist');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error("Error reading wishlist from localStorage", error);
            return [];
        }
    }
    return [];
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(getInitialState);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
        } catch (error) {
            console.error("Error writing wishlist to localStorage", error);
        }
    }
    // Filter full product objects based on IDs
    const items = products.filter(p => wishlistIds.includes(p.id));
    setWishlistItems(items);
  }, [wishlistIds]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds(prevIds => {
      const product = products.find(p => p.id === productId);
      if (!product) return prevIds;

      const isInWishlist = prevIds.includes(productId);
      if (isInWishlist) {
        toast({
            title: "Removed from Wishlist",
            description: `${product.name} has been removed from your wishlist.`
        });
        return prevIds.filter(id => id !== productId);
      } else {
        toast({
            title: "Added to Wishlist",
            description: `${product.name} has been added to your wishlist.`
        });
        return [...prevIds, productId];
      }
    });
  };
  
  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

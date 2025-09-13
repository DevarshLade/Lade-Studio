"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart-context";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { AuthModal } from "@/components/auth/AuthModal";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { executeProtectedAction, showAuthModal, setShowAuthModal } = useProtectedAction();

  // Safe image URL handling with fallback
  const getImageUrl = () => {
    if (product.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    // Fallback to a placeholder image
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center';
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent link navigation
    e.stopPropagation();
    
    executeProtectedAction(() => {
      addToCart(product, 1);
      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
      });
    });
  };

  return (
    <>
      <Card className="group relative flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`}>
          <span className="sr-only">View {product.name}</span>
        </Link>
        <CardHeader className="p-0 relative">
          <div className="overflow-hidden">
            <Image
              src={getImageUrl()}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={product.aiHint}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          {product.originalPrice && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">Sale</Badge>
          )}
          <div className="absolute top-3 left-3 z-20">
            <WishlistButton 
              productId={product.id}
              productName={product.name}
              size="sm"
              variant="ghost"
              className="bg-white/80 hover:bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <CardTitle className="mt-1 text-lg font-headline leading-tight">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </CardTitle>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</p>
            )}
          </div>
          <Button size="icon" variant="outline" className="z-20 relative" aria-label="Add to cart" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        title="Sign in to Add to Cart"
        description={`Please sign in to add ${product.name} to your cart.`}
      />
    </>
  );
}

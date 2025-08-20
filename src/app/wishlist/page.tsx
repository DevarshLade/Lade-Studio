
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import ProductCard from "@/components/product-card";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-headline text-center mb-12">My Wishlist</h1>
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistItems.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center flex flex-col items-center">
            <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                <Heart className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-headline mb-2">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
                Looks like you haven't added any favorite items yet. Click the heart icon on a product to save it here.
            </p>
            <Button asChild>
                <Link href="/products">Explore Products</Link>
            </Button>
        </Card>
      )}
    </div>
  );
}

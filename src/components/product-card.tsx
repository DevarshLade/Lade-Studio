"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent link navigation
    e.stopPropagation();
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group relative flex flex-col overflow-hidden h-full transition-all duration-300 hover:shadow-xl">
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`}>
        <span className="sr-only">View {product.name}</span>
      </Link>
      <CardHeader className="p-0 relative">
        <div className="overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={product.aiHint}
          />
        </div>
        {product.originalPrice && (
          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">Sale</Badge>
        )}
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
  );
}


"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArtworkSuggestions } from "./artwork-suggestions";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const params = use(paramsPromise);
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${quantity} x ${product.name}`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Proceeding to Checkout",
      description: "You will be redirected shortly.",
    });
    // In a real app, you would redirect to the checkout page.
    // window.location.href = '/checkout';
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from Wishlist" : "Added to Wishlist",
      description: product.name,
    });
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Column: Image Gallery */}
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-lg mb-4 border">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              data-ai-hint={product.aiHint}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, index) => (
              <div key={index} className={`aspect-square w-full overflow-hidden rounded-md border-2 ${index === 0 ? 'border-primary' : 'border-transparent'}`}>
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover cursor-pointer"
                  data-ai-hint={product.aiHint}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div>
          <h1 className="text-4xl md:text-5xl font-headline mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <p className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</p>
            )}
          </div>
          <p className="text-lg text-muted-foreground mb-8">{product.description}</p>
          
          <div className="flex items-center gap-4 mb-8">
            <p>Quantity:</p>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" variant="secondary" className="flex-1" onClick={handleBuyNow}>Buy Now</Button>
            <Button size="lg" variant="outline" className="px-4" onClick={handleFavorite}>
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          <Accordion type="single" collapsible defaultValue="description" className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger className="font-headline text-lg">Full Description</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {product.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specifications">
              <AccordionTrigger className="font-headline text-lg">Specifications</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {product.specification}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* Similar Artwork Section */}
      <ArtworkSuggestions currentArtworkId={product.id} />
    </div>
  );
}


"use client";

import { useState, use } from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArtworkSuggestions } from "./artwork-suggestions";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart-context";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function StarRating({ rating, onRatingChange, readOnly = false }: { rating: number, onRatingChange?: (rating: number) => void, readOnly?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${rating >= star ? 'text-primary fill-primary' : 'text-muted-foreground'} ${!readOnly && 'cursor-pointer'}`}
          onClick={() => onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
}

function ProductReviews() {
  const params = use(useParams());
  const product = products.find((p) => p.slug === params.slug);
  const { toast } = useToast();
  const [newRating, setNewRating] = useState(0);

  const averageRating = product?.reviews ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length : 0;
  
  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would submit this data to your backend
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    });
    (e.target as HTMLFormElement).reset();
    setNewRating(0);
  };

  return (
    <div className="mt-16 md:mt-24">
      <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Ratings & Reviews</h2>
      <div className="grid md:grid-cols-2 gap-12">
        {/* Existing Reviews */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-4">
                <span>{product?.reviews?.length || 0} Reviews</span>
                {product?.reviews && product.reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={averageRating} readOnly />
                    <span className="text-lg font-bold text-primary">{averageRating.toFixed(1)}</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-h-96 overflow-y-auto">
              {product?.reviews && product.reviews.length > 0 ? (
                product.reviews.map(review => (
                  <div key={review.id}>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                        <p className="font-semibold">{review.name}</p>
                        <StarRating rating={review.rating} readOnly />
                       </div>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to share your thoughts!</p>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Add a Review Form */}
        <div>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleReviewSubmit}>
                <div className="space-y-2">
                  <Label>Your Rating</Label>
                  <StarRating rating={newRating} onRatingChange={setNewRating} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-name">Your Name</Label>
                  <Input id="review-name" placeholder="Your name" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-comment">Your Review</Label>
                  <Textarea id="review-comment" placeholder="Share your thoughts about the product..." rows={4} required/>
                </div>
                <Button type="submit" className="w-full">Submit Review</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


export default function ProductDetailPage() {
  const params = use(useParams());
  const product = products.find((p) => p.slug === params.slug);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();


  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to Cart!",
      description: `${quantity} x ${product.name}`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
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

      <Separator className="my-16" />
      
      {/* Ratings and Reviews Section */}
      <ProductReviews />
      
      {/* Similar Artwork Section */}
      <ArtworkSuggestions currentArtworkId={product.id} />
    </div>
  );
}

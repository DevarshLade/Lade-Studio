
"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/api/products";
import { addProductReview, canUserReviewProduct, getUserReviewsForProduct, getUserReviewCount } from "@/lib/api/reviews";
import { useAuthContext } from "@/context/AuthContext";
import { EditReviewDialog } from "@/components/review/EditReviewDialog";
import { ImageUpload } from "@/components/review/ImageUpload";
import type { Product, Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingCart, Star, Loader2, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart-context";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import Link from "next/link";
import { Edit2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ArtworkSuggestions = dynamic(
  () => import('./artwork-suggestions').then(mod => mod.ArtworkSuggestions),
  {
    loading: () => (
      <div className="mt-16 md:mt-24">
        <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    ),
    ssr: false
  }
);


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

function ProductReviews({ product }: { product: Product }) {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthContext();
  const [newRating, setNewRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewEligibilityReason, setReviewEligibilityReason] = useState<string>('');
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState({ count: 0, remaining: 10 });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditReview, setCurrentEditReview] = useState<Review | null>(null);
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  // Check if user can review this product and get their existing reviews
  useEffect(() => {
    async function checkReviewEligibility() {
      if (!isAuthenticated) {
        setCanReview(false);
        setReviewEligibilityReason('Please sign in to write a review');
        setCheckingEligibility(false);
        return;
      }

      // Get user's existing reviews for this product
      const { data: existingReviews } = await getUserReviewsForProduct(product.id);
      
      if (existingReviews && existingReviews.length > 0) {
        // Convert to legacy format
        const legacyReviews: Review[] = existingReviews.map(review => ({
          id: review.id,
          name: review.author_name,
          rating: review.rating,
          comment: review.comment || '',
          date: new Date(review.created_at).toISOString().split('T')[0]
        }));
        setUserReviews(legacyReviews);
      }

      // Get review count and remaining
      const { data: countData } = await getUserReviewCount(product.id);
      if (countData) {
        setReviewCount(countData);
      }

      // Check eligibility (now based on 10 review limit)
      const { canReview: eligible, reason } = await canUserReviewProduct(product.id);
      setCanReview(eligible);
      setReviewEligibilityReason(reason || '');
      setCheckingEligibility(false);
    }

    checkReviewEligibility();
  }, [product.id, isAuthenticated]);

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

  // Check if a review belongs to the current user
  const isUserReview = (review: Review) => {
    if (!isAuthenticated || !user) return false;
    const userName = user.user_metadata?.name || user.email?.split('@')[0];
    const userEmail = user.email;
    return review.name === userName || review.name === userEmail;
  };

  // Handle edit review
  const handleEditReview = (review: Review) => {
    setCurrentEditReview(review);
    setEditDialogOpen(true);
  };

  // Handle review update from dialog
  const handleReviewUpdated = (updatedReview: Review) => {
    // Update the review in userReviews
    setUserReviews(prev => prev.map(review => 
      review.id === updatedReview.id ? updatedReview : review
    ));
    // Update the review in the main reviews list
    setReviews(prev => prev.map(review => 
      review.id === updatedReview.id ? updatedReview : review
    ));
    setCurrentEditReview(null);
  };
  
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const authorName = formData.get('review-name') as string;
    const comment = formData.get('review-comment') as string;
    
    if (newRating === 0) {
      toast({
        title: "Please select a rating",
        description: "You must provide a rating from 1 to 5 stars.",
        variant: "destructive"
      });
      setSubmitting(false);
      return;
    }
    
    const { data, error } = await addProductReview(product.id, authorName, newRating, comment, reviewImages);
    
    if (error) {
      toast({
        title: "Error submitting review",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
      
      // Add the new review to the local state
      const newReview: Review = {
        id: data?.id || Math.random().toString(),
        name: authorName,
        rating: newRating,
        comment,
        date: new Date().toISOString().split('T')[0],
        images: reviewImages
      };
      setReviews(prev => [newReview, ...prev]);
      setUserReviews(prev => [newReview, ...prev]);
      
      // Update review count
      setReviewCount(prev => ({
        count: prev.count + 1,
        remaining: prev.remaining - 1
      }));
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      setNewRating(0);
      setReviewImages([]);
    }
    
    setSubmitting(false);
  };

  if (!product) {
    return null;
  }

  return (
    <div className="mt-16 md:mt-24">
      <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Ratings & Reviews</h2>
      <div className="grid md:grid-cols-2 gap-12">
        {/* Existing Reviews */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-4">
                <span>{reviews.length || 0} Reviews</span>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={averageRating} readOnly />
                    <span className="text-lg font-bold text-primary">{averageRating.toFixed(1)}</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-h-96 overflow-y-auto">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                        <p className="font-semibold">{review.name}</p>
                        <StarRating rating={review.rating} readOnly />
                       </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                        {isUserReview(review) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditReview(review)}
                            className="h-8 px-3"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                        {review.images.map((imageUrl, imageIndex) => (
                          <div key={imageIndex} className="aspect-square bg-muted rounded-lg overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={`Review image ${imageIndex + 1}`}
                              width={150}
                              height={150}
                              className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => window.open(imageUrl, '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                    )}
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
              {checkingEligibility ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Checking eligibility...</span>
                </div>
              ) : userReviews.length >= 10 ? (
                <div className="text-center py-8">
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Review Limit Reached</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      You have reached the maximum limit of 10 reviews for this product.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can edit your existing reviews below.
                    </p>
                  </div>
                </div>
              ) : userReviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Show user's existing reviews */}
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Your Reviews ({userReviews.length}/10)</h3>
                    <div className="space-y-4">
                      {userReviews.map((review) => (
                        <div key={review.id} className="flex items-center justify-between bg-background p-4 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <StarRating rating={review.rating} readOnly />
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                            {review.images && review.images.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                {review.images.map((imageUrl, imageIndex) => (
                                  <div key={imageIndex} className="aspect-square bg-muted rounded-md overflow-hidden">
                                    <Image
                                      src={imageUrl}
                                      alt={`Review image ${imageIndex + 1}`}
                                      width={100}
                                      height={100}
                                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => window.open(imageUrl, '_blank')}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditReview(review)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Add Another Review Form */}
                  {canReview && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Add Another Review ({reviewCount.remaining} remaining)</h3>
                      <form className="space-y-4" onSubmit={handleReviewSubmit}>
                        <div className="space-y-2">
                          <Label>Your Rating</Label>
                          <StarRating rating={newRating} onRatingChange={setNewRating} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="review-name">Your Name</Label>
                          <Input id="review-name" name="review-name" placeholder="Your name" required/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="review-comment">Your Review</Label>
                          <Textarea id="review-comment" name="review-comment" placeholder="Share your thoughts about the product..." rows={4} required/>
                        </div>
                        <ImageUpload
                          onImagesChange={setReviewImages}
                          maxImages={5}
                          disabled={submitting}
                        />
                        <Button type="submit" className="w-full" disabled={submitting}>
                          {submitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              ) : !canReview ? (
                <div className="text-center py-8">
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium mb-2">Unable to Write Review</p>
                    <p className="text-sm text-muted-foreground">{reviewEligibilityReason}</p>
                    {!isAuthenticated && (
                      <Button asChild className="mt-4">
                        <Link href="/auth">Sign In to Review</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleReviewSubmit}>
                  <div className="space-y-2">
                    <Label>Your Rating</Label>
                    <StarRating rating={newRating} onRatingChange={setNewRating} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-name">Your Name</Label>
                    <Input id="review-name" name="review-name" placeholder="Your name" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-comment">Your Review</Label>
                    <Textarea id="review-comment" name="review-comment" placeholder="Share your thoughts about the product..." rows={4} required/>
                  </div>
                  <ImageUpload
                    onImagesChange={setReviewImages}
                    maxImages={5}
                    disabled={submitting}
                  />
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Edit Review Dialog */}
      {currentEditReview && (
        <EditReviewDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          review={currentEditReview}
          onUpdated={handleReviewUpdated}
        />
      )}
    </div>
  )
}


export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      if (!params.slug || typeof params.slug !== 'string') {
        setError('Invalid product slug');
        setLoading(false);
        return;
      }

      const { data, error } = await getProductBySlug(params.slug);
      
      if (error) {
        setError(error.message);
      } else if (!data) {
        setError('Product not found');
      } else {
        setProduct(data);
      }
      
      setLoading(false);
    }
    
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
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
              priority
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
            <WishlistButton 
              productId={product.id}
              productName={product.name}
              size="lg"
              variant="outline"
              className="px-4"
            />
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
      <ProductReviews product={product} />
      
      {/* Similar Artwork Section */}
      <ArtworkSuggestions currentArtworkId={product.id} />
    </div>
  );
}

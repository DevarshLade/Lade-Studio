// Import types from Supabase
import type { Product as SupabaseProduct, Review as SupabaseReview } from './database'

// Legacy Review type (for compatibility with existing UI components)
export type Review = {
  id: string;
  name: string; // This maps to author_name in Supabase
  rating: number; // 1-5
  comment: string;
  date: string; // This maps to created_at in Supabase
  images?: string[]; // This maps to image_urls in Supabase
};

// Legacy Product type (for compatibility with existing UI components)
export type Product = {
  id: string;
  name: string;
  category: 'Painting' | 'Pots' | 'Canvas' | 'Hand Painted Jewelry' | 'Terracotta Pots' | 'Fabric Painting' | 'Portrait' | 'Wall Hanging';
  price: number;
  originalPrice?: number; // This maps to original_price in Supabase
  slug: string;
  images: string[];
  description: string;
  specification: string;
  size?: string;
  isFeatured?: boolean; // This maps to is_featured in Supabase
  aiHint: string; // This maps to ai_hint in Supabase
  delivery_charge: number; // This maps to delivery_charge in Supabase
  reviews?: Review[];
};

// Helper functions to convert between Supabase and legacy types
export function supabaseProductToLegacy(product: SupabaseProduct, reviews?: SupabaseReview[]): Product {
  // Ensure images array is never null/undefined and contains valid URLs
  const safeImages = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
    : [];

  return {
    id: product.id,
    name: product.name,
    category: product.category as any,
    price: product.price,
    originalPrice: product.original_price || undefined,
    slug: product.slug,
    images: safeImages,
    description: product.description || '',
    specification: product.specification || '',
    size: product.size || undefined,
    isFeatured: product.is_featured || false,
    aiHint: product.ai_hint || '',
    delivery_charge: (product as any).delivery_charge ?? 50,
    reviews: reviews?.map(supabaseReviewToLegacy)
  }
}

export function supabaseReviewToLegacy(review: SupabaseReview): Review {
  return {
    id: review.id,
    name: review.author_name,
    rating: review.rating,
    comment: review.comment || '',
    date: new Date(review.created_at).toISOString().split('T')[0],
    images: review.image_urls || []
  }
}

export type Category = {
  name: string;
  image: string;
  hint: string;
};

export type Testimonial = {
  id: string;
  name: string;
  image: string;
  quote: string;
};

export type BlogPost = {
  id: string;
  title: string;
  image: string;
  excerpt: string;
  hint: string;
};

// Cart and Order types
export type CartItem = {
  product: Product;
  quantity: number;
};

export type CheckoutData = {
  customerName: string;
  customerPhone?: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  paymentMethod: string;
  paymentId?: string;
};

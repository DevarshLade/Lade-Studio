export type Review = {
  id: string;
  name: string;
  rating: number; // 1-5
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  category: 'Painting' | 'Pots' | 'Canvas' | 'Hand Painted Jewelry' | 'Terracotta Pots' | 'Fabric Painting' | 'Portrait' | 'Wall Hanging';
  price: number;
  originalPrice?: number;
  slug: string;
  images: string[];
  description: string;
  specification: string;
  size?: string;
  isFeatured?: boolean;
  aiHint: string;
  reviews?: Review[];
};

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

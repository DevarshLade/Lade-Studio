export type Product = {
  id: string;
  name: string;
  category: 'Paintings' | 'Hand-Painted Pots' | 'Terracotta Jewelry';
  price: number;
  originalPrice?: number;
  slug: string;
  images: string[];
  description: string;
  specification: string;
  size?: string;
  isFeatured?: boolean;
  aiHint: string;
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

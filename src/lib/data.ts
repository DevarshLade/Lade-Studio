import type { Product, Category, Testimonial, BlogPost } from "@/types";

export const categories: Category[] = [
  { name: 'Painting', image: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxwYWludGluZ3xlbnwwfHx8fDE3NTU2MjA5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'abstract painting' },
  { name: 'Pots', image: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxQb3RzfGVufDB8fHx8MTc1NTYyMTAwMHww&ixlib=rb-4.1.0&q=80&w=1080', hint: 'painted pot' },
  { name: 'Canvas', image: 'https://images.unsplash.com/photo-1577720643272-265f09367456?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxDYW52YXMlMjBwYWludGluZ3xlbnwwfHx8fDE3NTU2MjEwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080', hint: 'artist canvas' },
  { name: 'Hand Painted Jewelry', image: 'https://placehold.co/400x500.png', hint: 'terracotta necklace' },
  { name: 'Terracotta Pots', image: 'https://placehold.co/400x500.png', hint: 'terracotta pot' },
  { name: 'Fabric Painting', image: 'https://placehold.co/400x500.png', hint: 'painted fabric' },
  { name: 'Portrait', image: 'https://placehold.co/400x500.png', hint: 'portrait painting' },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Celestial Dreams',
    category: 'Painting',
    price: 4500,
    slug: 'celestial-dreams',
    images: ['https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjedMhWoToqXz_7P2HWCpXVh89fr1tpjuU0BwiIyjYxwnC00ULsurlcPvZL_-v-Th_oN0WJY1XPdauo95gcLsxX1zdtvDYo2JxarSwKTgo5nz3dxusew22c5CFjt8GBg_gZLF2OXZJlPRl5n-e2Yydb-eQm5AX0HfKnIGWHA-74Akc6tmNOBhh66GqZQ376/s845/1d614277-e409-4895-86b8-c4df32173339.png', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjedMhWoToqXz_7P2HWCpXVh89fr1tpjuU0BwiIyjYxwnC00ULsurlcPvZL_-v-Th_oN0WJY1XPdauo95gcLsxX1zdtvDYo2JxarSwKTgo5nz3dxusew22c5CFjt8GBg_gZLF2OXZJlPRl5n-e2Yydb-eQm5AX0HfKnIGWHA-74Akc6tmNOBhh66GqZQ376/s845/1d614277-e409-4895-86b8-c4df32173339.png', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjedMhWoToqXz_7P2HWCpXVh89fr1tpjuU0BwiIyjYxwnC00ULsurlcPvZL_-v-Th_oN0WJY1XPdauo95gcLsxX1zdtvDYo2JxarSwKTgo5nz3dxusew22c5CFjt8GBg_gZLF2OXZJlPRl5n-e2Yydb-eQm5AX0HfKnIGWHA-74Akc6tmNOBhh66GqZQ376/s845/1d614277-e409-4895-86b8-c4df32173339.png'],
    description: 'An abstract exploration of the night sky, blending deep blues with shimmering gold accents.',
    specification: 'Acrylic on canvas, 24x36 inches. Varnished for protection.',
    isFeatured: true,
    aiHint: 'abstract painting'
  },
  {
    id: 'prod-2',
    name: 'Earthen Jar',
    category: 'Pots',
    price: 1200,
    originalPrice: 1500,
    slug: 'earthen-jar',
    images: ['https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjGp7Q5fz5k5X9EPYigw0q4wjcOQ5kBaqe-yxNzS9AqUACphK3nqt0OlQVtDiVFfjy4aceK2ccuxT1YOCQMjYoHu1Q2_Nha7LSiBA2mcT64w6HqMvASW7q8xCHtjlugJ8LuwAAPqdD7YDA7bPn-nUID_l8eUIK2KFpOq8dnbMK9bCr6DZt8dQLc2TBH7Uh7/s1280/WhatsApp%20Image%202025-08-19%20at%209.43.50%20PM%20(1).jpeg'],
    description: 'A rustic terracotta pot hand-painted with traditional folk motifs. Perfect for indoor plants.',
    specification: 'Terracotta, acrylic paint, waterproof sealant. 8-inch diameter.',
    isFeatured: true,
    aiHint: 'painted pot'
  },
  {
    id: 'prod-3',
    name: 'Tribal Pendant',
    category: 'Hand Painted Jewelry',
    price: 850,
    slug: 'tribal-pendant',
    images: ['https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEicMC3_psCn7s0u7ixVD2EBxT1T12tejwp4UroUV6K7GICThVMH_dUMCIN0zko8RtH5u1ief9zicW-WHKrAf_WhwpW1H1nJ6ciDrkDlYv3tpNK3bCoJNhU2spEgAGV2NVNdEY8kXwmNhZUw54blxtAWdgm4MHYCXugSi4jZ0murKlVVmnkSQMStHSyJrRxl/s1080/WhatsApp%20Image%202025-08-19%20at%209.43.50%20PM.jpeg'],
    description: 'A bold, hand-molded terracotta pendant on an adjustable black cord. A true statement piece.',
    specification: 'Baked terracotta clay, non-toxic colors. Pendant size: 2.5 inches.',
    isFeatured: true,
    aiHint: 'terracotta jewelry'
  },
  {
    id: 'prod-4',
    name: 'Forest Whispers',
    category: 'Canvas',
    price: 6200,
    slug: 'forest-whispers',
    images: ['https://placehold.co/600x600.png'],
    description: 'A textured painting capturing the serene and mysterious atmosphere of a misty forest.',
    specification: 'Oil and mixed media on canvas, 30x40 inches.',
    isFeatured: true,
    aiHint: 'forest painting'
  },
  {
    id: 'prod-5',
    name: 'Sunset Bloom Pot',
    category: 'Pots',
    price: 950,
    slug: 'sunset-bloom-pot',
    images: ['https://placehold.co/600x600.png'],
    description: 'A vibrant pot painted with a floral design inspired by sunset hues.',
    specification: 'Ceramic, acrylic paint, gloss varnish. 6-inch diameter.',
    isFeatured: true,
    aiHint: 'flower pot'
  },
  {
    id: 'prod-6',
    name: 'Geometric Earrings',
    category: 'Hand Painted Jewelry',
    price: 600,
    originalPrice: 750,
    slug: 'geometric-earrings',
    images: ['https://placehold.co/600x600.png'],
    description: 'Lightweight, hand-painted terracotta earrings featuring a modern geometric pattern.',
    specification: 'Baked terracotta clay, sterling silver hooks.',
    isFeatured: true,
    aiHint: 'handmade earrings'
  },
  {
    id: 'prod-7',
    name: 'Oceanic Depths',
    category: 'Painting',
    price: 8000,
    originalPrice: 10000,
    slug: 'oceanic-depths',
    images: ['https://placehold.co/600x600.png'],
    description: 'A large-scale abstract piece that captures the powerful movement of the ocean.',
    specification: 'Acrylic on canvas, 48x48 inches.',
    isFeatured: true,
    aiHint: 'ocean painting'
  },
  {
    id: 'prod-8',
    name: 'Mandala Planter',
    category: 'Terracotta Pots',
    price: 1800,
    slug: 'mandala-planter',
    images: ['https://placehold.co/600x600.png'],
    description: 'An intricately detailed mandala design hand-drawn on a large ceramic planter.',
    specification: 'Ceramic, permanent markers, sealant. 12-inch diameter.',
    isFeatured: true,
    aiHint: 'mandala art'
  },
  {
    id: 'prod-9',
    name: 'Earth Goddess Necklace',
    category: 'Hand Painted Jewelry',
    price: 1500,
    slug: 'earth-goddess-necklace',
    images: ['https://placehold.co/600x600.png'],
    description: 'A multi-strand necklace featuring various hand-molded and painted terracotta beads.',
    specification: 'Baked terracotta clay, glass beads, adjustable cord.',
    aiHint: 'beaded necklace'
  },
  {
    id: 'prod-10',
    name: 'City at Dusk',
    category: 'Canvas',
    price: 3800,
    slug: 'city-at-dusk',
    images: ['https://placehold.co/600x600.png'],
    description: 'An impressionistic view of a city skyline as night begins to fall.',
    specification: 'Watercolor on paper, 18x24 inches, framed.',
    aiHint: 'cityscape painting'
  },
  {
    id: 'prod-11',
    name: 'Azure Dream',
    category: 'Painting',
    price: 5200,
    slug: 'azure-dream',
    images: ['https://placehold.co/600x600.png'],
    description: 'A soothing abstract piece dominated by shades of azure and white.',
    specification: 'Acrylic on canvas, 30x30 inches.',
    aiHint: 'blue abstract'
  },
  {
    id: 'prod-12',
    name: 'Golden Radiance',
    category: 'Hand Painted Jewelry',
    price: 950,
    originalPrice: 1100,
    slug: 'golden-radiance',
    images: ['https://placehold.co/600x600.png'],
    description: 'Elegant terracotta jhumkas painted in a radiant gold finish.',
    specification: 'Baked terracotta clay, gold-plated hooks.',
    aiHint: 'indian jewelry'
  },
  {
    id: 'prod-13',
    name: 'Floral Fabric',
    category: 'Fabric Painting',
    price: 2500,
    slug: 'floral-fabric',
    images: ['https://placehold.co/600x600.png'],
    description: 'A beautiful piece of cotton fabric hand-painted with a vibrant floral design.',
    specification: 'Cotton fabric, fabric paint. 2 meters.',
    aiHint: 'painted fabric'
  },
  {
    id: 'prod-14',
    name: 'The Old Man',
    category: 'Portrait',
    price: 7500,
    slug: 'the-old-man',
    images: ['https://placehold.co/600x600.png'],
    description: 'A striking portrait capturing the wisdom and character of an old man.',
    specification: 'Charcoal on paper, 24x30 inches, framed.',
    aiHint: 'portrait drawing'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Priya Sharma',
    image: 'https://placehold.co/100x100.png',
    quote: 'The painting I bought is the centerpiece of my living room! The quality and detail are simply breathtaking. It feels like a piece of my soul on the wall.'
  },
  {
    id: 'test-2',
    name: 'Arjun Verma',
    image: 'https://placehold.co/100x100.png',
    quote: 'I gifted my wife the terracotta necklace and she absolutely adores it. It\'s so unique and beautifully crafted. Fast shipping and lovely packaging too!'
  },
  {
    id: 'test-3',
    name: 'Anika Reddy',
    image: 'https://placehold.co/100x100.png',
    quote: 'My hand-painted pot brings so much joy to my workspace. It’s a daily reminder of the beauty of handmade art. I can’t wait to buy more!'
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Story Behind My Latest Collection',
    image: 'https://placehold.co/400x250.png',
    excerpt: 'Dive deep into the inspiration and process that brought the "Forest Whispers" collection to life. From initial sketches to the final brushstroke.',
    hint: 'art studio'
  },
  {
    id: 'blog-2',
    title: '5 Ways to Style Your Home with Art',
    image: 'https://placehold.co/400x250.png',
    excerpt: 'Art isn\'t just for galleries. Discover creative and simple ways to integrate handmade art into your home decor for a personal touch.',
    hint: 'interior design'
  },
  {
    id: 'blog-3',
    title: 'A Glimpse into Terracotta Crafting',
    image: 'https://placehold.co/400x250.png',
    excerpt: 'From a simple block of clay to a beautiful piece of jewelry. Join me in the studio for a visual journey of how my terracotta pieces are made.',
    hint: 'pottery making'
  },
];

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { products, testimonials, blogPosts, categories } from "@/lib/data";
import { ArrowRight, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/product-card";

export default function Home() {
  const homeCategories = categories.slice(0, 3);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        <Image
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgGVgAMpigIHSkXgx34IditgJ5aqG7aV5hxnpyzQzAsMPf_LVqPSNxsDbxiYblxab2szl-a5lzKkkDrwHTs0KerABmiQXJUBVPAiis8NKGT7WJV-1jSUNj7Z4Or8EhDj3FWCeFxDUHowLrsd1kyIdAx9Ci1gpNiM6MXalrDeY5VgvpS7itkBesuhxrcqoEf/s4008/654fe177-8f99-444a-9cf3-0abf779567d9%20(1).png"
          alt="Artist at work"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint="artist workspace"
        />
        <div className="z-10 p-4 max-w-3xl">
          
        </div>
      </section>

      {/* Explore Categories */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Explore Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeCategories.map((category) => (
              <Link href={`/products?category=${category.name.toLowerCase().replace(/ /g, '-')}`} key={category.name} className="group">
                <Card className="overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={400}
                      height={500}
                      className="w-full h-auto object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={category.hint}
                    />
                  </CardContent>
                  <CardFooter className="p-6 bg-background">
                    <h3 className="text-xl font-headline w-full text-center">{category.name}</h3>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 md:py-24 bg-accent/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Featured Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Discount on Original Artworks */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Discount on Original Artworks</h2>
          <Carousel opts={{ loop: true, align: "start" }} className="w-full">
            <CarouselContent className="-ml-4">
              {products.filter(p => p.originalPrice).map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* Blog & Videos */}
      <section className="py-16 md:py-24 bg-accent/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">From the Studio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-auto object-cover"
                  data-ai-hint={post.hint}
                />
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href="/blog">Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">What Our Customers Say</h2>
          <Carousel opts={{ loop: true }} className="w-full max-w-3xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <div className="p-4">
                    <Card className="bg-accent/50 border-0">
                      <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="w-16 h-16 mb-4">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint="portrait person" />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                        <p className="font-bold font-headline text-foreground">{testimonial.name}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>
    </div>
  );
}

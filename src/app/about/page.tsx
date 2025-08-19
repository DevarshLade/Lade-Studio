import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">About Lade Studio</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            A celebration of handmade artistry, where every creation has a soul and a story.
          </p>
        </section>

        {/* Studio Image */}
        <section className="mb-16">
          <Image
            src="https://placehold.co/1200x600.png"
            alt="The Lade Studio workspace"
            width={1200}
            height={600}
            className="rounded-lg object-cover w-full"
            data-ai-hint="bright artist studio"
          />
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-headline mb-6">Our Story</h2>
          <div className="text-lg text-foreground/80 space-y-6">
            <p>
              Lade Studio began not in a gallery, but in a small, sunlit corner of a humble apartment, fueled by a passion for creating and a deep appreciation for the imperfect beauty of handmade goods. It started with a single paintbrush, a lump of clay, and the simple idea that art should be accessible, personal, and part of our daily lives.
            </p>
            <p>
              Our founder, a self-taught artist, found solace and expression in transforming simple materials into objects of beauty. What began as a personal hobby soon blossomed into a calling. Friends and family admired the unique charm of the hand-painted pots, the intricate detail of the terracotta jewelry, and the vibrant energy of the paintings. Their encouragement sparked the idea for Lade Studio.
            </p>
            <p>
              Today, Lade Studio is a small, independent venture dedicated to bringing you authentic, handcrafted pieces. Each item is a labor of love, meticulously crafted and infused with a unique character that mass-produced items simply cannot replicate. We believe in the power of art to connect, inspire, and bring joy.
            </p>
          </div>
        </section>

        {/* Our Philosophy */}
        <section>
          <h2 className="text-3xl md:text-4xl font-headline mb-6">Our Philosophy</h2>
           <div className="text-lg text-foreground/80 space-y-6">
            <p>
              At Lade Studio, we cherish the slow, deliberate process of creating by hand. We embrace the slight variations and unique marks that make each piece one-of-a-kind. Our philosophy is rooted in three core principles:
            </p>
            <ul className="list-disc list-inside space-y-4 pl-4">
              <li>
                <strong>Authenticity:</strong> Every product is a genuine expression of creativity, free from industrial uniformity.
              </li>
              <li>
                <strong>Quality Craftsmanship:</strong> We use high-quality materials and time-honored techniques to ensure our creations are not only beautiful but also durable.
              </li>
              <li>
                <strong>Sustainable Practices:</strong> We are mindful of our environmental impact, using eco-friendly materials and processes whenever possible.
              </li>
            </ul>
             <p>
              Thank you for being part of our journey. When you bring a piece from Lade Studio into your life, you're not just buying an object; you're supporting an artist's dream and embracing a story of passion and creativity.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

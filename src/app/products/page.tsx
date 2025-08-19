import { products } from "@/lib/data";
import ProductCard from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

function ProductFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Category Filter */}
        <div className="space-y-4">
          <Label className="text-lg font-headline">Category</Label>
          <RadioGroup defaultValue="all">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" />
              <Label htmlFor="cat-all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="painting" id="cat-painting" />
              <Label htmlFor="cat-painting">Painting</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pots" id="cat-pots" />
              <Label htmlFor="cat-pots">Pots</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="canvas" id="cat-canvas" />
              <Label htmlFor="cat-canvas">Canvas</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="hand-painted-jewelry" id="cat-hand-painted-jewelry" />
              <Label htmlFor="cat-hand-painted-jewelry">Hand Painted Jewelry</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="terracotta-pots" id="cat-terracotta-pots" />
              <Label htmlFor="cat-terracotta-pots">Terracotta Pots</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="fabric-painting" id="cat-fabric-painting" />
              <Label htmlFor="cat-fabric-painting">Fabric Painting</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="portrait" id="cat-portrait" />
              <Label htmlFor="cat-portrait">Portrait</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="wall-hanging" id="cat-wall-hanging" />
              <Label htmlFor="cat-wall-hanging">Wall Hanging</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-4">
          <Label className="text-lg font-headline">Price Range</Label>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹0</span>
            <span>₹10,000</span>
          </div>
          <Slider defaultValue={[0, 10000]} max={10000} step={100} />
        </div>

        {/* Size Filter */}
        <div className="space-y-4">
          <Label className="text-lg font-headline">Size</Label>
          <div className="flex items-center space-x-2">
            <Checkbox id="size-small" />
            <Label htmlFor="size-small">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="size-medium" />
            <Label htmlFor="size-medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="size-large" />
            <Label htmlFor="size-large">Large</Label>
          </div>
        </div>
        
        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-headline text-center mb-12">Our Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="sticky top-20">
            <ProductFilters />
          </div>
        </aside>
        <main className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

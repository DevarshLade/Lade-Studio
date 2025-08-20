
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/lib/data";
import type { Product } from "@/types";
import ProductCard from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const SIZES = ["Small", "Medium", "Large"];

function ProductFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const applyFilters = () => {
    onFilterChange({ category, priceRange, sizes: selectedSizes });
  };
  
  useEffect(() => {
    applyFilters();
  }, [category, priceRange, selectedSizes]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Category Filter */}
        <div className="space-y-4">
          <Label className="text-lg font-headline">Category</Label>
          <RadioGroup value={category} onValueChange={setCategory}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="cat-all" />
              <Label htmlFor="cat-all">All</Label>
            </div>
            {categories.map(cat => (
                <div className="flex items-center space-x-2" key={cat.name}>
                    <RadioGroupItem value={cat.name.toLowerCase().replace(/ /g, '-')} id={`cat-${cat.name.toLowerCase().replace(/ /g, '-')}`} />
                    <Label htmlFor={`cat-${cat.name.toLowerCase().replace(/ /g, '-')}`}>{cat.name}</Label>
                </div>
            ))}
          </RadioGroup>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-4">
          <Label className="text-lg font-headline">Price Range</Label>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
          <Slider 
            defaultValue={priceRange} 
            max={10000} 
            step={100} 
            onValueCommit={setPriceRange}
          />
        </div>

        {/* Size Filter */}
        <div className="space-y-4">
          <Label className="text-lg font-headline">Size</Label>
          {SIZES.map(size => (
            <div className="flex items-center space-x-2" key={size}>
              <Checkbox id={`size-${size.toLowerCase()}`} onCheckedChange={() => handleSizeChange(size)} />
              <Label htmlFor={`size-${size.toLowerCase()}`}>{size}</Label>
            </div>
          ))}
        </div>
        
        <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    sizes: [],
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = filters.category === 'all' || product.category.toLowerCase().replace(/ /g, '-') === filters.category;
      const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const sizeMatch = filters.sizes.length === 0 || (product.size && filters.sizes.includes(product.size));
      
      return categoryMatch && priceMatch && sizeMatch;
    });
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-headline text-center mb-12">Our Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="sticky top-20">
            <ProductFilters onFilterChange={setFilters} />
          </div>
        </aside>
        <main className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
                <p className="col-span-full text-center text-muted-foreground">No products match the selected filters.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

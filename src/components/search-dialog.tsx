
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/data";
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query.length > 1) {
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredProducts);
    } else {
      setResults([]);
    }
  }, [query]);

  // Add keyboard shortcut to open search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleLinkClick = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for paintings, pots, jewelry..."
              className="pl-10 h-11"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="max-h-[60vh]">
            <div className="p-6 pt-0">
            {results.length > 0 ? (
                <div className="mt-4 space-y-4">
                {results.map(product => (
                    <Link key={product.id} href={`/product/${product.slug}`} onClick={handleLinkClick} className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent">
                        <Image src={product.images[0]} alt={product.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint={product.aiHint}/>
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <p className="ml-auto font-semibold text-primary">₹{product.price.toLocaleString()}</p>
                    </Link>
                ))}
                </div>
            ) : query.length > 1 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No products found for "{query}"</p>
                </div>
            ) : (
                 <div className="text-center py-8 text-muted-foreground">
                    <p>Search for art, pots, and more.</p>
                </div>
            )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

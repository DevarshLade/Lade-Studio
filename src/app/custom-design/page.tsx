
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import React, { useState } from "react";
import { products } from "@/lib/data";
import type { Product } from "@/types";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CustomDesignPage() {
    const { toast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showContactButton, setShowContactButton] = useState(false);

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category.toLowerCase().replace(/ /g, '-') === selectedCategory)
        : [];

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, you would handle form submission,
        // e.g., send data to a server or an email service.
        toast({
            title: "Request Submitted!",
            description: "Thank you for your custom design request. We will get back to you shortly.",
        });
        setShowContactButton(true);
        // (e.target as HTMLFormElement).reset();
        // setSelectedCategory('');
        // setSelectedProduct(null);
    };

    const handleContactClick = () => {
        window.open(
          'https://form.jotform.com/252305862627459',
          'blank',
          'scrollbars=yes,toolbar=no,width=700,height=500'
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <section className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">Custom Designs</h1>
                    <p className="text-lg md:text-xl text-muted-foreground">
                        Have a unique vision? Let's bring it to life together.
                    </p>
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Request a Custom Piece</CardTitle>
                        <CardDescription>
                            Fill out the form to start a conversation about your custom artwork. Please be as detailed as possible. We will get back to you to discuss the details, timeline, and pricing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Category Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-lg font-headline">1. Select a Category</Label>
                                <Select name="category" required onValueChange={setSelectedCategory} value={selectedCategory}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Choose a product category..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="painting">Painting</SelectItem>
                                        <SelectItem value="pots">Pots</SelectItem>
                                        <SelectItem value="canvas">Canvas</SelectItem>
                                        <SelectItem value="hand-painted-jewelry">Hand Painted Jewelry</SelectItem>
                                        <SelectItem value="terracotta-pots">Terracotta Pots</SelectItem>
                                        <SelectItem value="fabric-painting">Fabric Painting</SelectItem>
                                        <SelectItem value="portrait">Portrait</SelectItem>
                                        <SelectItem value="wall-hanging">Wall Hanging</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Product for Custom Designing */}
                            <div className="space-y-2">
                                <Label htmlFor="product-name" className="text-lg font-headline">2. Product Name/Type</Label>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={!selectedCategory}>
                                            {selectedProduct ? selectedProduct.name : 'Select a product...'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Select a Product</DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="max-h-[60vh]">
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                                {filteredProducts.length > 0 ? (
                                                    filteredProducts.map(product => (
                                                        <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleProductSelect(product)}>
                                                            <Image src={product.images[0]} alt={product.name} width={200} height={200} className="rounded-t-lg object-cover aspect-square" data-ai-hint={product.aiHint} />
                                                            <div className="p-2">
                                                                <p className="font-medium text-sm truncate">{product.name}</p>
                                                            </div>
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <p>No products found in this category.</p>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                                <Input id="product-name" name="productName" value={selectedProduct ? selectedProduct.name : ''} required readOnly className="hidden" />
                            </div>

                            {/* Upload Photo */}
                            <div className="space-y-2">
                                <Label htmlFor="file-upload" className="text-lg font-headline">3. Upload a Design Reference</Label>
                                <p className="text-sm text-muted-foreground">Share an image for inspiration (optional).</p>
                                <Input id="file-upload" name="fileUpload" type="file" className="h-auto p-0 file:mr-4 file:py-3 file:px-4 file:border-0 file:bg-muted file:text-muted-foreground hover:file:bg-muted/80" />
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="text-lg font-headline">4. Quantity</Label>
                                <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" className="w-32" required />
                            </div>

                            {/* Additional Features */}
                            <div className="space-y-2">
                                <Label htmlFor="additional-details" className="text-lg font-headline">5. Additional Details</Label>
                                <Textarea id="additional-details" name="details" placeholder="Describe your vision, colors, style, dimensions, or any other specific requirements." rows={5} />
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                <Button type="submit" size="lg" className="w-full">Submit Custom Request</Button>
                                {showContactButton && (
                                    <Button type="button" size="lg" variant="secondary" className="w-full" onClick={handleContactClick}>
                                        Contact With Designer
                                    </Button>
                                )}
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

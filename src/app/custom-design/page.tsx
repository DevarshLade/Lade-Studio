
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import React from "react";

export default function CustomDesignPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, you would handle form submission,
        // e.g., send data to a server or an email service.
        toast({
            title: "Request Submitted!",
            description: "Thank you for your custom design request. We will get back to you shortly.",
        });
        (e.target as HTMLFormElement).reset();
    };

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
                        <Select name="category" required>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Choose a product category..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="painting">Painting</SelectItem>
                                <SelectItem value="pots">Pots</SelectItem>
                                <SelectItem value="canvas">Canvas</SelectItem>
                                <SelectItem value="hand-painted-jewelry">Hand Painted Jewelry</SelectItem>
                                <SelectItem value="fabric-painting">Fabric Painting</SelectItem>
                                <SelectItem value="portrait">Portrait</SelectItem>
                                <SelectItem value="wall-hanging">Wall Hanging</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Product for Custom Designing */}
                     <div className="space-y-2">
                        <Label htmlFor="product-name" className="text-lg font-headline">2. Product Name/Type</Label>
                        <Input id="product-name" name="productName" placeholder="e.g., 'Large Round Pot', 'Abstract Canvas', 'Pendant Necklace'" required />
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

                    <Button type="submit" size="lg" className="w-full">Submit Custom Request</Button>
               </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

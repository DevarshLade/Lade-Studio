
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CustomDesignPage() {

    const openJotform = () => {
        window.open('https://form.jotform.com/252305862627459','blank','scrollbars=yes,toolbar=no,width=700,height=500')
    }
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
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
               <div className="flex justify-center">
                 <Button onClick={openJotform}>Open Custom Design Form</Button>
               </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

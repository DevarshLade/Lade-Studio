
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import Script from "next/script";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">Get in Touch</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            We'd love to hear from you! Whether you have a question about our products, a custom order request, or just want to say hello.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-headline">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Our Studio</h3>
                  <p className="text-muted-foreground">123 Art Avenue, Creativity City, 10101</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Email Us</h3>
                  <p className="text-muted-foreground">hello@ladestudio.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Call Us</h3>
                  <p className="text-muted-foreground">(123) 456-7890</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Script
                  type="text/javascript"
                  src="https://form.jotform.com/jsform/252305862627459"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

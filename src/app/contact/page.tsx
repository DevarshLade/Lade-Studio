
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Script from "next/script";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-6xl font-headline font-bold mb-8 text-center">Contact Us</h1>
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-2 md:p-6">
          <Script
            type="text/javascript"
            src="https://form.jotform.com/jsform/252305862627459"
          />
        </CardContent>
      </Card>
    </div>
  );
}

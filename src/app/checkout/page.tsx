
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";


function AddressForm() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your full name" required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Your phone number" required/>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street address, apartment, etc." required/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="State" required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="Pincode" required/>
                </div>
            </div>
        </div>
    );
}

function PaymentOptions({ selectedMethod, onMethodChange } : { selectedMethod: string, onMethodChange: (value: string) => void }) {
    return (
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
            <Label className="text-lg font-headline mb-4 block">Payment Method</Label>
            <div className="space-y-4">
                <Label htmlFor="razorpay" className="p-4 flex items-center gap-4 border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <span className="flex-grow font-medium">Online Payment (Razorpay)</span>
                    <span className="text-sm text-muted-foreground">Credit/Debit Card, UPI, Netbanking</span>
                </Label>
                <Label htmlFor="cod" className="p-4 flex items-center gap-4 border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                    <RadioGroupItem value="cod" id="cod" />
                    <span className="flex-grow font-medium">Cash on Delivery</span>
                </Label>
            </div>
        </RadioGroup>
    );
}

export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const [isLoading, setIsLoading] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 150;
    const total = subtotal + shipping;

    // This function loads the Razorpay script
    const loadScript = (src: string) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        if (paymentMethod === 'cod') {
            // Handle Cash on Delivery logic
            toast({ title: "Order Placed!", description: "Your order has been successfully placed with Cash on Delivery." });
            clearCart();
            router.push('/my-account');
            setIsLoading(false);
            return;
        }

        // Handle Razorpay logic
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast({ title: "Error", description: "Razorpay SDK failed to load. Are you online?", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        // YOU WILL NEED TO CREATE THIS SERVER ACTION
        // This action will securely create an order on Razorpay's servers
        // and return the order details.
        
        // Mocking order creation for now
        const orderAmount = total * 100; // Amount in paise
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // YOUR RAZORPAY KEY ID
            amount: orderAmount.toString(),
            currency: "INR",
            name: "Lade Studio",
            description: "Artwork Purchase",
            // order_id: from your server action,
            handler: function (response: any) {
                // On successful payment
                toast({ title: "Payment Successful!", description: "Thank you for your order." });
                console.log(response);
                clearCart();
                router.push('/my-account');
            },
            prefill: {
                // You can prefill customer details here
                name: "Your Customer",
                email: "customer@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#A87C7C",
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

        paymentObject.on('payment.failed', function (response: any) {
            toast({ title: "Payment Failed", description: "Please try again.", variant: "destructive" });
            console.error(response.error);
        });
        
        setIsLoading(false);
    };


    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-headline text-center mb-12">Checkout</h1>
            {cartItems.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-xl text-muted-foreground">Your cart is empty. You can't proceed to checkout.</p>
                    <Button asChild className="mt-4">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left side: Form */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">1. Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AddressForm />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">2. Confirm Payment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PaymentOptions selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Right side: Order Summary */}
                    <div>
                    <Card className="sticky top-20">
                        <CardHeader>
                        <CardTitle className="font-headline text-2xl">Your Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Image src={item.images[0]} alt={item.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint={item.aiHint} />
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-2">
                            <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>₹{shipping.toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                        <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Place Order'}
                        </Button>
                        </CardFooter>
                    </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

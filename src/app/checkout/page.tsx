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

function AddressForm() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Your phone number" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street address, apartment, etc." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="State" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="Pincode" />
                </div>
            </div>
        </div>
    );
}

function PaymentOptions() {
    return (
        <RadioGroup defaultValue="stripe">
            <Label className="text-lg font-headline mb-4 block">Payment Method</Label>
            <div className="space-y-4">
                <Card className="p-4 flex items-center gap-4">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex-grow font-medium">Credit/Debit Card (Stripe)</Label>
                </Card>
                 <Card className="p-4 flex items-center gap-4">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex-grow font-medium">UPI / Netbanking (Razorpay)</Label>
                </Card>
            </div>
        </RadioGroup>
    );
}

export default function CheckoutPage() {
    const { cartItems } = useCart();
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 150;
    const total = subtotal + shipping;

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
                                <PaymentOptions />
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
                        <Button size="lg" className="w-full">Place Order</Button>
                        </CardFooter>
                    </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

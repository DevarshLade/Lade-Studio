
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
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/api/orders";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import type { CheckoutData } from "@/types";


function AddressForm({ formData, setFormData }: { 
    formData: CheckoutData; 
    setFormData: (data: CheckoutData) => void; 
}) {
    const handleInputChange = (field: keyof CheckoutData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                        id="name" 
                        placeholder="Your full name" 
                        value={formData.customerName}
                        onChange={handleInputChange('customerName')}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                        id="phone" 
                        placeholder="Your phone number" 
                        value={formData.customerPhone || ''}
                        onChange={handleInputChange('customerPhone')}
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address Line 1</Label>
                <Input 
                    id="address" 
                    placeholder="Street address, apartment, etc." 
                    value={formData.shippingAddressLine1}
                    onChange={handleInputChange('shippingAddressLine1')}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input 
                    id="address2" 
                    placeholder="Apartment, suite, unit, building, floor, etc." 
                    value={formData.shippingAddressLine2 || ''}
                    onChange={handleInputChange('shippingAddressLine2')}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                        id="city" 
                        placeholder="City" 
                        value={formData.shippingCity}
                        onChange={handleInputChange('shippingCity')}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                        id="state" 
                        placeholder="State" 
                        value={formData.shippingState}
                        onChange={handleInputChange('shippingState')}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input 
                        id="pincode" 
                        placeholder="Pincode" 
                        value={formData.shippingPincode}
                        onChange={handleInputChange('shippingPincode')}
                        required
                    />
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

function CheckoutForm() {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuthContext();
    const { toast } = useToast();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CheckoutData>({
        customerName: '',
        customerPhone: '',
        shippingAddressLine1: '',
        shippingAddressLine2: '',
        shippingCity: '',
        shippingState: '',
        shippingPincode: '',
        paymentMethod: 'razorpay'
    });

    // Pre-fill form with user data when available
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.user_metadata?.name || user.email?.split('@')[0] || '',
                customerPhone: user.user_metadata?.phone || ''
            }));
        }
    }, [user]);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 100;
    const total = subtotal + shipping;

    // Validation function
    const validateForm = (): boolean => {
        const requiredFields = [
            'customerName',
            'customerPhone', 
            'shippingAddressLine1',
            'shippingCity',
            'shippingState',
            'shippingPincode'
        ] as const;
        
        for (const field of requiredFields) {
            if (!formData[field]?.trim()) {
                toast({
                    title: "Please fill all required fields",
                    description: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`,
                    variant: "destructive"
                });
                return false;
            }
        }
        return true;
    };

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
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Update form data with selected payment method
            const orderData = { ...formData, paymentMethod };
            
            if (paymentMethod === 'cod') {
                // Handle Cash on Delivery - create order directly
                // Convert cart items to the format expected by createOrder
                const orderCartItems = cartItems.map(item => ({
                    product: item,
                    quantity: item.quantity
                }));
                
                const { data: order, error } = await createOrder(
                    orderData,
                    orderCartItems,
                    subtotal,
                    shipping
                );
                
                if (error) {
                    throw new Error(error.message);
                }
                
                toast({ 
                    title: "Order Placed!", 
                    description: `Your order #${order?.id?.slice(0, 8)} has been successfully placed with Cash on Delivery.` 
                });
                clearCart();
                router.push('/my-account');
                return;
            }

            // Handle Razorpay logic
            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!res) {
                throw new Error("Razorpay SDK failed to load. Are you online?");
            }

            // Convert cart items to the format expected by createOrder
            const orderCartItems = cartItems.map(item => ({
                product: item,
                quantity: item.quantity
            }));
            
            // Create order first (for Razorpay integration)
            const { data: pendingOrder, error: orderError } = await createOrder(
                { ...orderData, paymentMethod: 'razorpay' },
                orderCartItems,
                subtotal,
                shipping
            );
            
            if (orderError || !pendingOrder) {
                throw new Error(orderError?.message || 'Failed to create order');
            }

            const orderAmount = total * 100; // Amount in paise
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // YOUR RAZORPAY KEY ID
                amount: orderAmount.toString(),
                currency: "INR",
                name: "Lade Studio",
                description: "Artwork Purchase",
                order_id: pendingOrder.id, // Use the created order ID
                handler: function (response: any) {
                    // On successful payment - you might want to verify payment on server
                    toast({ 
                        title: "Payment Successful!", 
                        description: `Thank you for your order #${pendingOrder.id.slice(0, 8)}.` 
                    });
                    console.log(response);
                    clearCart();
                    router.push('/my-account');
                },
                prefill: {
                    name: formData.customerName,
                    email: "customer@example.com", // You might want to add email to form
                    contact: formData.customerPhone,
                },
                theme: {
                    color: "#A87C7C",
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

            paymentObject.on('payment.failed', function (response: any) {
                toast({ 
                    title: "Payment Failed", 
                    description: "Please try again.", 
                    variant: "destructive" 
                });
                console.error(response.error);
            });
            
        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
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
                                <AddressForm formData={formData} setFormData={setFormData} />
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

export default function CheckoutPage() {
    return (
        <ProtectedRoute 
            title="Sign in to Complete Your Purchase"
            description="Please sign in to proceed with checkout and place your order."
        >
            <CheckoutForm />
        </ProtectedRoute>
    );
}

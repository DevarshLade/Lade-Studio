"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import { getUserWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart-context";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import type { Wishlist } from "@/types/database";
import type { Product } from "@/types";

type WishlistWithProduct = Wishlist & { products: Product };

function EmptyWishlist() {
    return (
        <div className="text-center p-12">
            <div className="bg-primary/10 text-primary p-6 rounded-full mb-6 inline-block">
                <Heart className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-headline mb-4">Your Wishlist is Empty</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Save your favorite products to your wishlist so you can easily find them later.
            </p>
            <Button asChild size="lg">
                <Link href="/products">Discover Products</Link>
            </Button>
        </div>
    );
}

function WishlistItem({ item, onRemove, onAddToCart }: {
    item: WishlistWithProduct;
    onRemove: (productId: string) => void;
    onAddToCart: (product: Product) => void;
}) {
    const [isRemoving, setIsRemoving] = useState(false);
    const product = item.products;

    const handleRemove = async () => {
        setIsRemoving(true);
        await onRemove(product.id);
        setIsRemoving(false);
    };

    const handleAddToCart = () => {
        onAddToCart(product);
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex">
                <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                        src={product.images?.[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={product.aiHint || product.ai_hint}
                    />
                </div>
                <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-headline text-lg font-semibold">
                                <Link 
                                    href={`/product/${product.slug}`}
                                    className="hover:text-primary transition-colors"
                                >
                                    {product.name}
                                </Link>
                            </h3>
                            {product.category && (
                                <p className="text-sm text-muted-foreground capitalize">
                                    {product.category.toLowerCase()}
                                </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRemove}
                            disabled={isRemoving}
                            className="text-muted-foreground hover:text-red-500"
                            title="Remove from wishlist"
                        >
                            {isRemoving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                        {product.original_price && product.original_price > product.price && (
                            <span className="text-muted-foreground line-through">
                                ₹{product.original_price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleAddToCart}
                            size="sm"
                            className="flex-1"
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                        >
                            <Link href={`/product/${product.slug}`}>
                                View Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function WishlistContent() {
    const { user } = useAuthContext();
    const { addItem } = useCart();
    const { toast } = useToast();
    const [wishlistItems, setWishlistItems] = useState<WishlistWithProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWishlist() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await getUserWishlist();
                if (error) {
                    setError(error.message);
                } else {
                    setWishlistItems(data || []);
                }
            } catch (err) {
                setError('Failed to load wishlist');
            } finally {
                setLoading(false);
            }
        }

        fetchWishlist();
    }, [user]);

    const handleRemoveItem = async (productId: string) => {
        try {
            const { error } = await removeFromWishlist(productId);
            if (error) {
                throw new Error(error.message);
            }

            setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
            
            toast({
                title: "Removed from Wishlist",
                description: "The item has been removed from your wishlist.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to remove item",
                variant: "destructive"
            });
        }
    };

    const handleAddToCart = (product: Product) => {
        addItem(product);
        toast({
            title: "Added to Cart",
            description: `${product.name} has been added to your cart.`,
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <span>Loading your wishlist...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center p-8">
                    <p className="text-red-600 mb-4">Error loading wishlist: {error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-headline">My Wishlist</h1>
                    {wishlistItems.length > 0 && (
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {wishlistItems.length === 0 ? (
                    <EmptyWishlist />
                ) : (
                    <div className="space-y-4">
                        {wishlistItems.map((item) => (
                            <WishlistItem
                                key={item.id}
                                item={item}
                                onRemove={handleRemoveItem}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function WishlistPage() {
    return (
        <ProtectedRoute>
            <WishlistContent />
        </ProtectedRoute>
    );
}
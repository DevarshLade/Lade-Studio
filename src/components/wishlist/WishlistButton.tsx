'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { toggleWishlistItem, isProductInWishlist } from '@/lib/api/wishlist'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  productName?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
  showText?: boolean
}

export function WishlistButton({ 
  productId, 
  productName = 'Product',
  size = 'md',
  variant = 'outline',
  className,
  showText = false
}: WishlistButtonProps) {
  const { isAuthenticated, user } = useAuthContext()
  const { toast } = useToast()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  // Check initial wishlist status
  useEffect(() => {
    async function checkWishlistStatus() {
      if (!isAuthenticated || !user) {
        setCheckingStatus(false)
        return
      }

      try {
        const { isInWishlist: inWishlist } = await isProductInWishlist(productId)
        setIsInWishlist(inWishlist)
      } catch (error) {
        console.error('Error checking wishlist status:', error)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkWishlistStatus()
  }, [productId, isAuthenticated, user])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if button is inside a link
    e.stopPropagation() // Prevent event bubbling
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const { isInWishlist: newWishlistStatus, error } = await toggleWishlistItem(productId)
      
      if (error) {
        throw new Error(error.message)
      }

      setIsInWishlist(newWishlistStatus)
      
      toast({
        title: newWishlistStatus ? "Added to Wishlist" : "Removed from Wishlist",
        description: newWishlistStatus 
          ? `${productName} has been added to your wishlist.`
          : `${productName} has been removed from your wishlist.`,
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update wishlist",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const buttonSize = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }[size]

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[size]

  if (checkingStatus) {
    return (
      <Button
        variant={variant}
        size={showText ? undefined : 'icon'}
        className={cn(showText ? '' : buttonSize, className)}
        disabled
      >
        <Heart className={cn(iconSize, 'animate-pulse')} />
        {showText && <span className="ml-2">Loading...</span>}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={showText ? undefined : 'icon'}
      className={cn(showText ? '' : buttonSize, className)}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      title={isInWishlist ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
    >
      <Heart 
        className={cn(
          iconSize,
          isInWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground',
          isLoading && 'animate-pulse'
        )} 
      />
      {showText && (
        <span className="ml-2">
          {isLoading 
            ? 'Updating...' 
            : isInWishlist 
              ? 'In Wishlist' 
              : 'Add to Wishlist'
          }
        </span>
      )}
    </Button>
  )
}
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import { Plus, MapPin, Phone, Edit, Trash2, MoreVertical, Star } from 'lucide-react'
import { AddressForm } from './AddressForm'
import { getUserAddresses, deleteUserAddress, setDefaultAddress } from '@/lib/api/addresses'
import type { UserAddress } from '@/types/database'

interface AddressListProps {
  onSelectAddress?: (address: UserAddress) => void
  selectionMode?: boolean
  selectedAddressId?: string
}

export function AddressList({ onSelectAddress, selectionMode = false, selectedAddressId }: AddressListProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const { data, error } = await getUserAddresses()
      if (error) throw error
      setAddresses(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (addressId: string) => {
    setDeletingId(addressId)
    try {
      const { error } = await deleteUserAddress(addressId)
      if (error) throw error
      
      setAddresses(addresses.filter(addr => addr.id !== addressId))
      toast({
        title: "Address Deleted",
        description: "Address has been removed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const { error } = await setDefaultAddress(addressId)
      if (error) throw error
      
      // Update local state
      setAddresses(addresses.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      })))
      
      toast({
        title: "Default Address Updated",
        description: "This address has been set as your default.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default address",
        variant: "destructive"
      })
    }
  }

  const handleFormSuccess = () => {
    setShowAddForm(false)
    setEditingAddress(null)
    fetchAddresses()
  }

  const handleAddressSelect = (address: UserAddress) => {
    if (selectionMode && onSelectAddress) {
      onSelectAddress(address)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-headline">My Addresses</h2>
          <p className="text-muted-foreground">Manage your saved delivery addresses</p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <AddressForm onSuccess={handleFormSuccess} onCancel={() => setShowAddForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Addresses Saved</h3>
            <p className="text-muted-foreground mb-4">
              Add your first delivery address to get started.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card 
              key={address.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectionMode && selectedAddressId === address.id 
                  ? 'ring-2 ring-primary border-primary' 
                  : ''
              }`}
              onClick={() => handleAddressSelect(address)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{address.label}</CardTitle>
                    {address.is_default && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingAddress(address)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {!address.is_default && (
                        <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          Set as Default
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDelete(address.id)}
                        disabled={deletingId === address.id}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deletingId === address.id ? 'Deleting...' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">{address.full_name}</p>
                    {address.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {address.phone}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    <p>{address.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Address Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={(open) => !open && setEditingAddress(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editingAddress && (
            <AddressForm 
              address={editingAddress} 
              onSuccess={handleFormSuccess} 
              onCancel={() => setEditingAddress(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
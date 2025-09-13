'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { getCategories, getProductsByCategory, submitCustomDesignRequest } from '@/lib/api/customDesigns'
import { DesignImageUpload } from './DesignImageUpload'
import type { Category } from '@/lib/api/customDesigns'
import type { Product } from '@/types/database'

interface CustomDesignFormProps {
  onSuccess?: () => void
}

interface FormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  categoryId: string
  productId: string
  designReferenceImages: string[]
  quantity: number
  additionalDetails: string
}

export function CustomDesignForm({ onSuccess }: CustomDesignFormProps) {
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    categoryId: '',
    productId: '',
    designReferenceImages: [],
    quantity: 1,
    additionalDetails: ''
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load products when category changes
  useEffect(() => {
    if (formData.categoryId) {
      loadProducts(formData.categoryId)
    } else {
      setProducts([])
      setFormData(prev => ({ ...prev, productId: '' }))
    }
  }, [formData.categoryId])

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const { data, error } = await getCategories()
      
      if (error) {
        console.error('Error loading categories:', error)
        return
      }
      
      if (data) {
        setCategories(data)
      }
    } catch (error) {
      console.error('Unexpected error loading categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const loadProducts = async (categoryId: string) => {
    try {
      setLoadingProducts(true)
      const { data, error } = await getProductsByCategory(categoryId)
      
      if (error) {
        console.error('Error loading products:', error)
        return
      }
      
      if (data) {
        setProducts(data)
      }
    } catch (error) {
      console.error('Unexpected error loading products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category'
    }

    if (!formData.productId) {
      newErrors.productId = 'Please select a product'
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1'
    }

    if (formData.designReferenceImages.length === 0) {
      newErrors.designReferenceImages = 'Please upload at least one design reference image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const { data, error } = await submitCustomDesignRequest({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        categoryId: formData.categoryId,
        productId: formData.productId,
        designReferenceImages: formData.designReferenceImages,
        quantity: formData.quantity,
        additionalDetails: formData.additionalDetails || undefined
      })

      if (error) {
        setErrors({ submit: error.message })
        return
      }

      if (data) {
        setSubmitSuccess(true)
        // Reset form after success
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          categoryId: '',
          productId: '',
          designReferenceImages: [],
          quantity: 1,
          additionalDetails: ''
        })
        
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      console.error('Unexpected error submitting form:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId)
  const selectedProduct = products.find(prod => prod.id === formData.productId)

  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Custom Design Request Submitted!
        </h3>
        <p className="text-gray-600 mb-4">
          Thank you for your custom design request. We'll review your requirements and get back to you within 2-3 business days.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name *
          </label>
          <input
            type="text"
            id="customerName"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.customerName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="customerEmail"
            value={formData.customerEmail}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.customerEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.customerEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="customerPhone"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
          )}
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Category *
        </label>
        {loadingCategories ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-500">Loading categories...</span>
          </div>
        ) : (
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => handleInputChange('categoryId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
        )}
      </div>

      {/* Product Selection */}
      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name/Type *
        </label>
        {loadingProducts ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-500">Loading products...</span>
          </div>
        ) : formData.categoryId ? (
          <select
            id="productId"
            value={formData.productId}
            onChange={(e) => handleInputChange('productId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.productId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Choose a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ₹{product.price}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-sm text-gray-500 italic py-2">
            Please select a category first
          </div>
        )}
        {errors.productId && (
          <p className="text-red-500 text-sm mt-1">{errors.productId}</p>
        )}
      </div>

      {/* Design Reference Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Design Reference Images *
        </label>
        <DesignImageUpload
          onImagesChange={(images) => handleInputChange('designReferenceImages', images)}
          existingImages={formData.designReferenceImages}
          customerId={formData.customerEmail || 'temp'}
          maxImages={10}
        />
        {errors.designReferenceImages && (
          <p className="text-red-500 text-sm mt-1">{errors.designReferenceImages}</p>
        )}
      </div>

      {/* Additional Details */}
      <div>
        <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Details
        </label>
        <textarea
          id="additionalDetails"
          rows={4}
          value={formData.additionalDetails}
          onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Please provide any additional details about your custom design requirements..."
        />
      </div>

      {/* Submit Button */}
      <div>
        {errors.submit && (
          <div className="flex items-center space-x-2 mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errors.submit}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting Request...</span>
            </div>
          ) : (
            'Submit Custom Request'
          )}
        </button>
      </div>

      {/* Selection Summary */}
      {(selectedCategory || selectedProduct) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Request Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {selectedCategory && <p>Category: {selectedCategory.name}</p>}
            {selectedProduct && <p>Product: {selectedProduct.name} (₹{selectedProduct.price})</p>}
            <p>Quantity: {formData.quantity}</p>
            {formData.designReferenceImages.length > 0 && (
              <p>Design Images: {formData.designReferenceImages.length} uploaded</p>
            )}
          </div>
        </div>
      )}
    </form>
  )
}
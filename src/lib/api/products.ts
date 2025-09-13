import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { Product, ProductInsert, ProductUpdate, Review } from '@/types/database'
import { supabaseProductToLegacy, supabaseReviewToLegacy } from '@/types'
import type { Product as LegacyProduct } from '@/types'

/**
 * Get all products with optional filtering
 */
export async function getProducts(options: {
  category?: string
  featured?: boolean
  limit?: number
  offset?: number
} = {}): Promise<{ data: LegacyProduct[] | null; error: Error | null }> {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        reviews (*)
      `)
      .order('created_at', { ascending: false })

    if (options.category) {
      query = query.eq('category', options.category)
    }

    if (options.featured !== undefined) {
      query = query.eq('is_featured', options.featured)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data: products, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    if (!products) {
      return { data: null, error: null }
    }

    // Convert to legacy format
    const legacyProducts = products.map(product => 
      supabaseProductToLegacy(product, product.reviews || [])
    )

    return { data: legacyProducts, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<{ data: LegacyProduct | null; error: Error | null }> {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        reviews (*)
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { data: null, error: null } // Not found
      }
      throw new Error(error.message)
    }

    if (!product) {
      return { data: null, error: null }
    }

    // Convert to legacy format
    const legacyProduct = supabaseProductToLegacy(product, product.reviews || [])

    return { data: legacyProduct, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<{ data: LegacyProduct | null; error: Error | null }> {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        reviews (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { data: null, error: null } // Not found
      }
      throw new Error(error.message)
    }

    if (!product) {
      return { data: null, error: null }
    }

    // Convert to legacy format
    const legacyProduct = supabaseProductToLegacy(product, product.reviews || [])

    return { data: legacyProduct, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 6): Promise<{ data: LegacyProduct[] | null; error: Error | null }> {
  return getProducts({ featured: true, limit })
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string, limit: number = 20): Promise<{ data: LegacyProduct[] | null; error: Error | null }> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        reviews (*)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    if (!products) {
      return { data: null, error: null }
    }

    // Convert to legacy format
    const legacyProducts = products.map(product => 
      supabaseProductToLegacy(product, product.reviews || [])
    )

    return { data: legacyProducts, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Create a new product (Admin function)
 */
export async function createProduct(productData: ProductInsert): Promise<{ data: Product | null; error: Error | null }> {
  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return { data: product, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Update a product (Admin function)
 */
export async function updateProduct(id: string, productData: ProductUpdate): Promise<{ data: Product | null; error: Error | null }> {
  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return { data: product, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Delete a product (Admin function)
 */
export async function deleteProduct(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}
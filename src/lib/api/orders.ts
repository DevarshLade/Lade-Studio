import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { Order, OrderInsert, OrderItem, OrderItemInsert } from '@/types/database'
import type { CartItem, CheckoutData } from '@/types'

/**
 * Create a new order with order items
 */
export async function createOrder(
  checkoutData: CheckoutData,
  cartItems: CartItem[],
  subtotal: number,
  shippingCost: number = 100
): Promise<{ data: Order | null; error: Error | null }> {
  try {
    const totalAmount = subtotal + shippingCost

    // Create the order
    const orderData: OrderInsert = {
      customer_name: checkoutData.customerName,
      customer_phone: checkoutData.customerPhone,
      shipping_address_line1: checkoutData.shippingAddressLine1,
      shipping_address_line2: checkoutData.shippingAddressLine2,
      shipping_city: checkoutData.shippingCity,
      shipping_state: checkoutData.shippingState,
      shipping_pincode: checkoutData.shippingPincode,
      subtotal,
      shipping_cost: shippingCost,
      total_amount: totalAmount,
      payment_method: checkoutData.paymentMethod,
      payment_id: checkoutData.paymentId,
      status: 'Processing'
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    // Create order items
    const orderItems: OrderItemInsert[] = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_purchase: item.product.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      // If order items fail, we should delete the order to maintain consistency
      await supabase.from('orders').delete().eq('id', order.id)
      throw new Error(`Failed to create order items: ${itemsError.message}`)
    }

    return { data: order, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Get order by ID with order items
 */
export async function getOrderById(orderId: string): Promise<{ 
  data: (Order & { order_items: (OrderItem & { products: any })[] }) | null; 
  error: Error | null 
}> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { data: null, error: null } // Not found
      }
      throw new Error(error.message)
    }

    return { data: order as any, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Get orders by customer phone
 */
export async function getOrdersByPhone(customerPhone: string): Promise<{ 
  data: (Order & { order_items: (OrderItem & { products: any })[] })[] | null; 
  error: Error | null 
}> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('customer_phone', customerPhone)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return { data: orders as any, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Get orders for the current authenticated user
 */
export async function getUserOrders(): Promise<{ 
  data: (Order & { order_items: (OrderItem & { products: any })[] })[] | null; 
  error: Error | null 
}> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return { data: orders as any, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

/**
 * Cancel an order with a reason
 */
export async function cancelOrder(
  orderId: string,
  cancellationReason: string
): Promise<{ data: Order | null; error: Error | null }> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: 'Cancelled',
        cancellation_reason: cancellationReason
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to cancel order: ${error.message}`)
    }

    return { data: order, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
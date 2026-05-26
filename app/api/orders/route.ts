import { NextResponse } from 'next/server'
import { createOrder, type CreateOrderParams } from '@/lib/printful'
import { z } from 'zod'

const orderSchema = z.object({
  recipient: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address1: z.string().min(1),
    city: z.string().min(1),
    state_code: z.string().min(1),
    zip: z.string().min(1),
    country_code: z.string().length(2),
  }),
  items: z.array(z.object({
    sync_variant_id: z.number(),
    quantity: z.number().min(1),
  })).min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = orderSchema.parse(body)

    const order = await createOrder(validatedData as CreateOrderParams)
    
    return NextResponse.json({ 
      success: true, 
      order,
      message: 'Order placed successfully' 
    })
  } catch (error) {
    console.error('Error creating order:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid order data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

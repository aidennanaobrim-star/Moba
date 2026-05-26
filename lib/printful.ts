import type { 
  PrintfulResponse, 
  PrintfulSyncProduct, 
  PrintfulProductDetails,
  Product,
  ProductVariant 
} from '@/types/printful'

const PRINTFUL_API_URL = 'https://api.printful.com'

async function printfulFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const apiKey = process.env.PRINTFUL_API_KEY
  
  if (!apiKey) {
    throw new Error('PRINTFUL_API_KEY is not configured')
  }

  const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Printful API error: ${response.status} - ${error}`)
  }

  return response.json()
}

export async function getProducts(): Promise<Product[]> {
  const data = await printfulFetch<PrintfulResponse<PrintfulSyncProduct[]>>('/store/products')
  
  return data.result.map(product => ({
    id: product.id,
    name: product.name,
    thumbnail: product.thumbnail_url,
    price: 0, // Will be populated from variants
    currency: 'USD',
    variants: [],
  }))
}

export async function getProductDetails(productId: number): Promise<Product | null> {
  try {
    const data = await printfulFetch<PrintfulResponse<PrintfulProductDetails>>(
      `/store/products/${productId}`
    )
    
    const { sync_product, sync_variants } = data.result
    
    const variants: ProductVariant[] = sync_variants.map(variant => {
      // Extract size from variant name (usually in format "Product Name - Size")
      const nameParts = variant.name.split(' - ')
      const size = nameParts[nameParts.length - 1] || 'One Size'
      
      return {
        id: variant.id,
        variantId: variant.variant_id,
        name: variant.name,
        size,
        price: parseFloat(variant.retail_price),
        currency: variant.currency,
        sku: variant.sku,
        image: variant.files.find(f => f.type === 'preview')?.preview_url || 
               variant.product.image || 
               sync_product.thumbnail_url,
        inStock: variant.availability_status === 'active',
      }
    })

    // Get the lowest price from variants
    const lowestPrice = variants.length > 0 
      ? Math.min(...variants.map(v => v.price))
      : 0

    return {
      id: sync_product.id,
      name: sync_product.name,
      thumbnail: sync_product.thumbnail_url,
      price: lowestPrice,
      currency: variants[0]?.currency || 'USD',
      variants,
    }
  } catch (error) {
    console.error('Error fetching product details:', error)
    return null
  }
}

export async function getAllProductsWithDetails(): Promise<Product[]> {
  const products = await getProducts()
  
  const productsWithDetails = await Promise.all(
    products.map(async (product) => {
      const details = await getProductDetails(product.id)
      return details || product
    })
  )
  
  return productsWithDetails.filter(Boolean)
}

export interface CreateOrderParams {
  recipient: {
    name: string
    email: string
    phone: string
    address1: string
    city: string
    state_code: string
    zip: string
    country_code: string
  }
  items: {
    sync_variant_id: number
    quantity: number
  }[]
}

export async function createOrder(params: CreateOrderParams) {
  const orderData = {
    recipient: params.recipient,
    items: params.items,
  }

  const data = await printfulFetch<PrintfulResponse<unknown>>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  })

  return data.result
}

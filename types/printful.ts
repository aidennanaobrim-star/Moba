// Printful API Types
export interface PrintfulProduct {
  id: number
  external_id: string
  name: string
  variants: number
  synced: number
  thumbnail_url: string
  is_ignored: boolean
}

export interface PrintfulSyncProduct {
  id: number
  external_id: string
  name: string
  variants: number
  synced: number
  thumbnail_url: string
  is_ignored: boolean
}

export interface PrintfulSyncVariant {
  id: number
  external_id: string
  sync_product_id: number
  name: string
  synced: boolean
  variant_id: number
  main_category_id: number
  warehouse_product_variant_id: number | null
  retail_price: string
  sku: string
  currency: string
  is_ignored: boolean
  product: {
    variant_id: number
    product_id: number
    image: string
    name: string
  }
  files: PrintfulFile[]
  options: PrintfulOption[]
  availability_status: string
}

export interface PrintfulFile {
  id: number
  type: string
  hash: string
  url: string | null
  filename: string
  mime_type: string
  size: number
  width: number
  height: number
  dpi: number | null
  status: string
  created: number
  thumbnail_url: string
  preview_url: string
  visible: boolean
  is_temporary: boolean
}

export interface PrintfulOption {
  id: string
  value: string | string[]
}

export interface PrintfulProductDetails {
  sync_product: PrintfulSyncProduct
  sync_variants: PrintfulSyncVariant[]
}

// Cart Types
export interface CartItem {
  id: string
  productId: number
  variantId: number
  name: string
  size: string
  price: number
  quantity: number
  image: string
  sku: string
}

export interface ShippingAddress {
  name: string
  email: string
  phone: string
  address1: string
  city: string
  state_code: string
  zip: string
  country_code: string
}

export interface OrderItem {
  sync_variant_id: number
  quantity: number
  retail_price: string
}

export interface PrintfulOrderRequest {
  recipient: ShippingAddress
  items: OrderItem[]
}

// Transformed Product for UI
export interface Product {
  id: number
  name: string
  thumbnail: string
  price: number
  currency: string
  variants: ProductVariant[]
}

export interface ProductVariant {
  id: number
  variantId: number
  name: string
  size: string
  price: number
  currency: string
  sku: string
  image: string
  inStock: boolean
}

// API Response Types
export interface PrintfulResponse<T> {
  code: number
  result: T
  extra?: unknown[]
  paging?: {
    total: number
    offset: number
    limit: number
  }
}

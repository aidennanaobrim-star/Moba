'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import type { Product } from '@/types/printful'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ShopPage() {
  const { data, error, isLoading } = useSWR<{ products: Product[] }>('/api/products', fetcher)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
              Collection
            </span>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase mb-6"
              style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
            >
              Shop the <span className="text-primary">Drop</span>
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Explore our latest collection. Bold designs, premium quality, 
              limited availability. Find your statement piece.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-destructive mb-4">Failed to load products</p>
              <p className="text-muted-foreground text-sm">
                Please check your Printful API connection and try again.
              </p>
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
              <h2 
                className="text-2xl font-bold uppercase tracking-wider mb-4"
                style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
              >
                No Products Yet
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Products will appear here once they are synced from your Printful store.
                Make sure your Printful API key is configured correctly.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // If product has variants, redirect to product page
    if (product.variants.length > 1) {
      window.location.href = `/shop/${product.id}`
      return
    }

    // Quick add for single variant products
    const variant = product.variants[0]
    if (!variant) {
      toast.error('Product variant not available')
      return
    }

    setIsAdding(true)
    
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      price: variant.price,
      quantity: 1,
      image: product.thumbnail,
      sku: variant.sku,
    })

    toast.success('Added to cart')
    setIsAdding(false)
  }

  return (
    <Link 
      href={`/shop/${product.id}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-card border border-border group-hover:border-primary/50 transition-colors">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 mr-2" />
                {product.variants.length > 1 ? 'View Options' : 'Add to Cart'}
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 
          className="font-semibold uppercase tracking-wider text-sm group-hover:text-primary transition-colors line-clamp-1"
          style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
        >
          {product.name}
        </h3>
        <p className="text-primary font-semibold">
          {product.price > 0 ? (
            `$${product.price.toFixed(2)}`
          ) : product.variants.length > 0 ? (
            `From $${Math.min(...product.variants.map(v => v.price)).toFixed(2)}`
          ) : (
            'Price TBD'
          )}
        </p>
      </div>
    </Link>
  )
}

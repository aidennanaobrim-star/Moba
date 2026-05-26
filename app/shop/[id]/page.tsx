'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { ArrowLeft, Loader2, Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import type { Product } from '@/types/printful'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, error, isLoading } = useSWR<{ product: Product }>(
    `/api/products/${id}`,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data?.product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-6" />
        <h1 
          className="text-2xl font-bold uppercase tracking-wider mb-4"
          style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
        >
          Product Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </Button>
      </div>
    )
  }

  return <ProductDetails product={data.product} />
}

function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)

  // Get unique sizes from variants
  const availableSizes = [...new Set(product.variants.map(v => v.size))]
    .filter(size => SIZES.includes(size))
    .sort((a, b) => SIZES.indexOf(a) - SIZES.indexOf(b))

  // Get all variant images for gallery
  const images = [
    product.thumbnail,
    ...product.variants.map(v => v.image).filter(img => img !== product.thumbnail)
  ].filter((img, index, arr) => img && arr.indexOf(img) === index)

  // Get selected variant
  const selectedVariant = product.variants.find(v => v.size === selectedSize)
  const currentPrice = selectedVariant?.price || product.price

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }

    if (!selectedVariant) {
      toast.error('Selected size is not available')
      return
    }

    setIsAdding(true)

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedSize,
      price: selectedVariant.price,
      quantity,
      image: product.thumbnail,
      sku: selectedVariant.sku,
    })

    toast.success(`${product.name} added to cart`)
    setIsAdding(false)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm uppercase tracking-wider">Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-card border border-border">
              {images[selectedImageIndex] ? (
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <ShoppingBag className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 
              className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-4"
              style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
            >
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-primary mb-8">
              ${currentPrice.toFixed(2)}
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium uppercase tracking-wider mb-4">
                Select Size
              </label>
              <div className="flex flex-wrap gap-3">
                {SIZES.map((size) => {
                  const isAvailable = availableSizes.includes(size)
                  const isSelected = selectedSize === size
                  
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={cn(
                        'w-14 h-14 rounded-lg border-2 font-semibold uppercase transition-all',
                        isSelected 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : isAvailable
                            ? 'border-border hover:border-primary/50 bg-card'
                            : 'border-border/50 bg-muted text-muted-foreground cursor-not-allowed line-through'
                      )}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              {availableSizes.length === 0 && (
                <p className="text-muted-foreground text-sm mt-2">
                  Sizes will be available once product variants are synced.
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium uppercase tracking-wider mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border border-border bg-card hover:bg-secondary flex items-center justify-center transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-xl font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg border border-border bg-card hover:bg-secondary flex items-center justify-center transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || !selectedSize}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold uppercase tracking-wider"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart - ${(currentPrice * quantity).toFixed(2)}
                </>
              )}
            </Button>

            {/* Product Features */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 
                className="text-lg font-semibold uppercase tracking-wider mb-4"
                style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
              >
                Product Details
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary" />
                  Premium quality materials
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary" />
                  Print-on-demand, made just for you
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary" />
                  Worldwide shipping available
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary" />
                  30-day return policy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

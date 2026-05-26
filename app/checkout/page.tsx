'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    city: '',
    state_code: '',
    zip: '',
    country_code: 'US',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <ShoppingBag className="w-20 h-20 text-muted-foreground/50 mb-6" />
        <h1 
          className="text-3xl font-bold uppercase tracking-tighter mb-4"
          style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
        >
          Nothing to Checkout
        </h1>
        <p className="text-muted-foreground mb-8">
          Add some items to your cart before checking out.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Shop
          </Link>
        </Button>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 
          className="text-3xl font-bold uppercase tracking-tighter mb-4"
          style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
        >
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Thank you for your order. You&apos;ll receive a confirmation email shortly 
          with tracking information once your order ships.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/shop">
            Continue Shopping
          </Link>
        </Button>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address1.trim()) newErrors.address1 = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state_code.trim()) newErrors.state_code = 'State is required'
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required'
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
    if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required'
    if (!formData.cardCvc.trim()) newErrors.cardCvc = 'CVC is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        recipient: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address1: formData.address1,
          city: formData.city,
          state_code: formData.state_code,
          zip: formData.zip,
          country_code: formData.country_code,
        },
        items: items.map(item => ({
          sync_variant_id: item.variantId,
          quantity: item.quantity,
        })),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      clearCart()
      setOrderComplete(true)
      toast.success('Order placed successfully!')
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-8 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Back to Cart */}
        <Link 
          href="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm uppercase tracking-wider">Back to Cart</span>
        </Link>

        <h1 
          className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-8"
          style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
        >
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <section className="bg-card border border-border rounded-xl p-6">
                <h2 
                  className="text-xl font-bold uppercase tracking-wider mb-6"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
                >
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    placeholder="John Doe"
                  />
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    placeholder="john@example.com"
                  />
                  <FormInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    placeholder="+1 (555) 000-0000"
                    className="md:col-span-2"
                  />
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-card border border-border rounded-xl p-6">
                <h2 
                  className="text-xl font-bold uppercase tracking-wider mb-6"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
                >
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Street Address"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    error={errors.address1}
                    placeholder="123 Main Street"
                    className="md:col-span-2"
                  />
                  <FormInput
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                    placeholder="Los Angeles"
                  />
                  <FormInput
                    label="State / Province"
                    name="state_code"
                    value={formData.state_code}
                    onChange={handleInputChange}
                    error={errors.state_code}
                    placeholder="CA"
                  />
                  <FormInput
                    label="ZIP / Postal Code"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    error={errors.zip}
                    placeholder="90001"
                  />
                  <div>
                    <label className="block text-sm font-medium uppercase tracking-wider mb-2">
                      Country
                    </label>
                    <select
                      name="country_code"
                      value={formData.country_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                      {COUNTRIES.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Payment Details */}
              <section className="bg-card border border-border rounded-xl p-6">
                <h2 
                  className="text-xl font-bold uppercase tracking-wider mb-6"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
                >
                  Payment Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    error={errors.cardNumber}
                    placeholder="4242 4242 4242 4242"
                    className="md:col-span-2"
                  />
                  <FormInput
                    label="Expiry Date"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    error={errors.cardExpiry}
                    placeholder="MM/YY"
                  />
                  <FormInput
                    label="CVC"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    error={errors.cardCvc}
                    placeholder="123"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  This is a demo checkout. No real payments will be processed.
                </p>
              </section>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 
                  className="text-xl font-bold uppercase tracking-wider mb-6"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
                >
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground">Calculated by Printful</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  className,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-3 bg-input border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground',
          error ? 'border-destructive' : 'border-border'
        )}
      />
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  )
}

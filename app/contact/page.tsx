'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone, Send, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address'
    if (!formData.message.trim()) newErrors.message = 'Message is required'

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

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    toast.success('Message sent successfully!')
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 
          className="text-3xl font-bold uppercase tracking-tighter mb-4"
          style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
        >
          Message Sent!
        </h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <Button 
          onClick={() => {
            setIsSubmitted(false)
            setFormData({ name: '', email: '', message: '' })
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 lg:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
              Get in Touch
            </span>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase mb-6"
              style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
            >
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Have a question, feedback, or just want to say hi? 
              We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className={cn(
                      'w-full px-4 py-3 bg-input border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground',
                      errors.name ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className={cn(
                      'w-full px-4 py-3 bg-input border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground',
                      errors.email ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="What&apos;s on your mind?"
                    rows={6}
                    className={cn(
                      'w-full px-4 py-3 bg-input border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none',
                      errors.message ? 'border-destructive' : 'border-border'
                    )}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive mt-1">{errors.message}</p>
                  )}
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 
                  className="text-2xl font-bold uppercase tracking-tighter mb-6"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
                >
                  Other Ways to <span className="text-primary">Reach Us</span>
                </h2>
                <p className="text-muted-foreground mb-8">
                  Whether you have a question about products, orders, or anything else, 
                  our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-6">
                <ContactInfo
                  icon={<Mail className="w-5 h-5" />}
                  title="Email"
                  value="hello@theaiden.com"
                  href="mailto:hello@theaiden.com"
                />
                <ContactInfo
                  icon={<Phone className="w-5 h-5" />}
                  title="Phone"
                  value="+1 (555) 123-4567"
                  href="tel:+15551234567"
                />
                <ContactInfo
                  icon={<MapPin className="w-5 h-5" />}
                  title="Location"
                  value="Los Angeles, California"
                />
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-border">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-sm"
                  >
                    Instagram
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-sm"
                  >
                    Twitter
                  </a>
                  <a 
                    href="https://tiktok.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-sm"
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ContactInfo({ 
  icon, 
  title, 
  value, 
  href 
}: { 
  icon: React.ReactNode
  title: string
  value: string
  href?: string 
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    )
  }

  return content
}

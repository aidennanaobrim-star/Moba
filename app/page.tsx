import Link from 'next/link'
import { ArrowRight, Flame, Crown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Full Screen Cinematic */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/20" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                New Collection Available
              </span>
            </div>

            {/* Main Heading */}
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase leading-none mb-6"
              style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
            >
              <span className="block text-balance">Wear Your</span>
              <span className="block text-primary">Attitude</span>
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
              Where streetwear collides with luxury. Bold designs for those who refuse 
              to blend in. Unapologetically unique. Undeniably you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold uppercase tracking-wider"
              >
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-border hover:bg-secondary px-8 py-6 text-lg uppercase tracking-wider"
              >
                <Link href="/about">
                  Our Story
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <FeatureCard
              icon={<Flame className="w-8 h-8" />}
              title="Bold Designs"
              description="Every piece is crafted to make a statement. Stand out, don&apos;t blend in."
            />
            <FeatureCard
              icon={<Crown className="w-8 h-8" />}
              title="Premium Quality"
              description="Luxury materials meet streetwear edge. Feel the difference in every thread."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Limited Drops"
              description="Exclusive collections that keep you ahead of the curve. Be first, be unique."
            />
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase mb-8"
              style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
            >
              Not Just Clothing.
              <span className="block text-primary">A Movement.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 text-pretty">
              TheAiDEN is more than a brand. It&apos;s a declaration. For the rebels, 
              the dreamers, the ones who carve their own path. We don&apos;t follow trends. 
              We ignite them.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold uppercase tracking-wider"
            >
              <Link href="/shop">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-b from-background to-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 
              className="text-2xl md:text-3xl font-bold tracking-tighter uppercase mb-4"
              style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
            >
              Join the <span className="text-primary">Movement</span>
            </h3>
            <p className="text-muted-foreground mb-8">
              Be the first to know about new drops, exclusive offers, and events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                required
              />
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 font-semibold uppercase tracking-wider"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="p-4 rounded-xl bg-primary/10 text-primary mb-6">
        {icon}
      </div>
      <h3 
        className="text-xl font-bold uppercase tracking-wider mb-3"
        style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
      >
        {title}
      </h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

import { Flame, Target, Sparkles, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              Our Story
            </span>
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase mb-6"
              style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
            >
              Born from the
              <span className="block text-primary">Streets</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              TheAiDEN isn&apos;t just a brand. It&apos;s the embodiment of raw ambition, 
              unapologetic self-expression, and the relentless pursuit of greatness.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Manifesto */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Quote marks */}
              <div className="absolute -top-8 -left-4 text-primary/20 text-9xl font-serif leading-none">
                &ldquo;
              </div>
              
              <blockquote className="relative z-10">
                <p 
                  className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-relaxed mb-8"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
                >
                  We create for the <span className="text-primary">fearless</span>. 
                  The ones who walk into a room and own it. The visionaries who see 
                  fashion not as clothing, but as <span className="text-accent">armor</span>.
                </p>
                <footer className="text-muted-foreground">
                  <span className="block text-primary font-semibold uppercase tracking-wider">
                    The AiDEN Manifesto
                  </span>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
              What We Stand For
            </span>
            <h2 
              className="text-3xl md:text-5xl font-bold tracking-tighter uppercase"
              style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
            >
              Our <span className="text-primary">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ValueCard
              icon={<Flame className="w-6 h-6" />}
              title="Boldness"
              description="We don&apos;t whisper. We roar. Every design, every stitch, every thread 
                          speaks with unwavering confidence."
            />
            <ValueCard
              icon={<Target className="w-6 h-6" />}
              title="Authenticity"
              description="Real recognizes real. We stay true to our roots while constantly 
                          pushing boundaries."
            />
            <ValueCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Innovation"
              description="Where tradition meets disruption. We blend luxury craftsmanship 
                          with street-born creativity."
            />
            <ValueCard
              icon={<Users className="w-6 h-6" />}
              title="Community"
              description="TheAiDEN is a family. A collective of individuals united by 
                          their refusal to be ordinary."
            />
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-24 bg-gradient-to-b from-card to-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
                  The Journey
                </span>
                <h2 
                  className="text-3xl md:text-4xl font-bold tracking-tighter uppercase mb-6"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
                >
                  From Vision to
                  <span className="text-primary block">Reality</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    TheAiDEN was born from a simple belief: fashion should be fearless. 
                    In a world of fast fashion and fleeting trends, we chose to build 
                    something that lasts.
                  </p>
                  <p>
                    Our journey started in the underground, where street culture meets 
                    high fashion. We saw a gap between mass-produced clothing and 
                    exclusive luxury - and we filled it.
                  </p>
                  <p>
                    Today, TheAiDEN stands as a testament to what happens when you 
                    refuse to compromise. Every piece we create carries our DNA: 
                    bold, authentic, and unapologetically unique.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <div 
                    className="text-6xl md:text-8xl font-bold tracking-tighter text-primary/30 uppercase"
                    style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
                  >
                    EST.<br/>2024
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/30 rounded-2xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-accent/30 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <StatCard number="10K+" label="Customers" />
            <StatCard number="50+" label="Countries" />
            <StatCard number="100%" label="Authentic" />
            <StatCard number="24/7" label="Support" />
          </div>
        </div>
      </section>
    </div>
  )
}

function ValueCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
      <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
        {icon}
      </div>
      <h3 
        className="text-xl font-bold uppercase tracking-wider mb-3"
        style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
      >
        {title}
      </h3>
      <p className="text-muted-foreground text-sm">
        {description}
      </p>
    </div>
  )
}

function StatCard({ 
  number, 
  label 
}: { 
  number: string
  label: string 
}) {
  return (
    <div className="text-center">
      <div 
        className="text-3xl md:text-4xl font-bold text-primary mb-2"
        style={{ fontFamily: 'var(--font-oswald), sans-serif' }}
      >
        {number}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}

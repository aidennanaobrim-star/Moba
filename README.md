# Moba
- Framework: React 18 + Next.js 14 (App Router)
- Styling: Tailwind CSS + shadcn/ui
- State Management: Zustand + React Query
- Forms: React Hook Form + Zod validation
- Analytics: Vercel Analytics + PostHog
- Payments UI: Stripe Elements
-Runtime: Node.js 20 + TypeScript
- API Framework: Next.js API Routes + tRPC
- Database: PostgreSQL 15 (Supabase)
- File Storage: Supabase Storage / Cloudflare R2
- Cache: Redis (Upstash)
- Queue System: BullMQ + Redis
- Auth: Clerk / Supabase Auth
- LLM Orchestration: Claude 3.5 Sonnet (via Anthropic API)
- Image Generation: 
  - DALL-E 3 (OpenAI) for hero images
  - Stable Diffusion XL for product variations
- SEO Tools: 
  - Custom RAG system for keyword research
  - Schema.org structured data generator
- Analytics AI: Custom recommendation engine
- Hosting: Vercel (frontend + API routes)
- Database: Supabase (PostgreSQL + Storage)
- CDN: Cloudflare
- Email: Resend API
- Domain Management: Vercel Domains API
- Payment Processing: Stripe Connect
- Monitoring: Sentry + Better Stack
- CI/CD: GitHub Actions + Vercel
- Testing: Vitest + Playwright
- Code Quality: ESLint + Prettier + TypeScript strict
- Documentation: Mintlify
-- Merchants (Store Owners)
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    subscription_tier VARCHAR(50) DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    onboarding_completed BOOLEAN DEFAULT false
);

-- Stores (Each merchant can have multiple stores)
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    store_name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255),
    niche VARCHAR(100),
    brand_voice VARCHAR(50), -- casual, professional, luxury, playful
    primary_color VARCHAR(7),
    logo_url TEXT,
    favicon_url TEXT,
    is_live BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    last_ai_optimization TIMESTAMP,
    
    -- SEO
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    
    -- Business Info
    business_email VARCHAR(255),
    business_phone VARCHAR(50),
    business_address TEXT,
    
    -- Analytics
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(300),
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    cost DECIMAL(10,2),
    
    -- Inventory
    sku VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    track_inventory BOOLEAN DEFAULT true,
    
    -- Media
    featured_image_url TEXT,
    image_urls TEXT[], -- Array of image URLs
    
    -- SEO (AI Generated)
    seo_title VARCHAR(60),
    seo_description VARCHAR(160),
    seo_keywords TEXT[],
    
    -- AI Metadata
    ai_generated BOOLEAN DEFAULT false,
    ai_confidence_score DECIMAL(3,2),
    last_ai_update TIMESTAMP,
    
    -- Status
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Stats
    views INTEGER DEFAULT 0,
    add_to_cart_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    
    UNIQUE(store_id, slug)
);

-- Product Variants (sizes, colors, etc.)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_name VARCHAR(100), -- "Small / Red"
    sku VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_category_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(store_id, slug)
);

-- Product-Category Junction
CREATE TABLE product_categories (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Customer Info
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    
    -- Shipping
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),
    
    -- Billing
    billing_address_line1 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(100),
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_method VARCHAR(50),
    stripe_payment_intent_id VARCHAR(255),
    
    -- Fulfillment
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled', -- unfulfilled, fulfilled, shipped, delivered
    tracking_number VARCHAR(255),
    tracking_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    fulfilled_at TIMESTAMP,
    shipped_at TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    
    -- Snapshot (in case product changes)
    product_title VARCHAR(255) NOT NULL,
    variant_name VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI Generation Jobs (Track AI tasks)
CREATE TABLE ai_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- store_generation, product_description, image_generation, seo_optimization
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- AI Recommendations
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- pricing, upsell, copy_improvement, seo, conversion
    target_entity_type VARCHAR(50), -- product, store, category
    target_entity_id UUID,
    recommendation_text TEXT NOT NULL,
    expected_impact VARCHAR(50), -- high, medium, low
    is_applied BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Store Pages (About, Contact, etc.)
CREATE TABLE store_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    page_type VARCHAR(50) NOT NULL, -- about, contact, shipping, returns, privacy, terms
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    slug VARCHAR(100) NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(store_id, page_type)
);

-- Analytics Events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- page_view, product_view, add_to_cart, checkout_start, purchase
    session_id VARCHAR(255),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    
    -- User Info
    user_ip VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    
    -- Event Data
    event_data JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_slug ON products(store_id, slug);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_analytics_store_date ON analytics_events(store_id, created_at);
CREATE INDEX idx_ai_jobs_store_status ON ai_jobs(store_id, status);
/app
  /(auth)
    /login
    /signup
    /onboarding          # AI-guided setup wizard
  /(dashboard)
    /dashboard
      /overview          # Main analytics dashboard
      /products          # Product management
      /orders            # Order management
      /ai-assistant      # AI recommendations hub
      /settings          # Store settings
  /(storefront)
    /[subdomain]         # Dynamic store rendering
      /products/[slug]
      /cart
      /checkout
      /thank-you
  /api                   # tRPC routes
  
/components
  /dashboard
    /AnalyticsCard.tsx
    /AIRecommendationCard.tsx
    /ProductTable.tsx
  /storefront
    /ProductCard.tsx
    /CheckoutForm.tsx
  /ai
    /OnboardingWizard.tsx
    /AIProductGenerator.tsx
  /ui                    # shadcn components
  
/lib
  /ai
    /claude-client.ts
    /prompts.ts
    /image-generation.ts
  /stripe
    /checkout.ts
    /webhooks.ts
  /database
    /queries.ts
  /utils

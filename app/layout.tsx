import type { Metadata, Viewport } from 'next'
import { Inter, Oswald, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { CartProvider } from '@/context/cart-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const oswald = Oswald({ 
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TheAiDEN | Bold Streetwear & Luxury Fashion',
  description: 'Discover TheAiDEN - where streetwear meets luxury. Bold, edgy, and unapologetically unique fashion for those who dare to stand out.',
  keywords: ['streetwear', 'luxury fashion', 'urban clothing', 'designer streetwear', 'TheAiDEN'],
  openGraph: {
    title: 'TheAiDEN | Bold Streetwear & Luxury Fashion',
    description: 'Where streetwear meets luxury. Bold, edgy, and unapologetically unique.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#141414',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster 
            theme="dark" 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'oklch(0.12 0 0)',
                border: '1px solid oklch(0.25 0 0)',
                color: 'oklch(0.98 0 0)',
              },
            }}
          />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

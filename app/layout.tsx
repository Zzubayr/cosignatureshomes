import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import PolicyBanner from '@/components/PolicyBanner'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'CO Signatures Homes - Premium Serviced Apartments in Nigeria',
  description: 'Discover luxury serviced apartments across Nigeria with CO Signatures Homes. Featuring Pa Claudius Apartments at Alatishe, Phase 2, Ile Ayo, Ilesha, Claudius Elite Lofts, and Omolaja Flats - premium accommodation with 24/7 power, security, and world-class amenities.',
  keywords: 'serviced apartments, Nigeria, luxury accommodation, Pa Claudius, Alatishe, Ile Ayo, Claudius Elite, Omolaja Flats, Ilesha, Osun State, 24/7 power, security, premium amenities',
  authors: [{ name: 'CO Signatures Homes' }],
  openGraph: {
    title: 'CO Signatures Homes - Premium Serviced Apartments in Nigeria',
    description: 'Luxury serviced apartments across Nigeria with premium amenities and 24/7 services',
    type: 'website',
    siteName: 'CO Signatures Homes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CO Signatures Homes - Premium Serviced Apartments',
    description: 'Luxury serviced apartments across Nigeria with premium amenities and 24/7 services',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <AuthProvider>
          {children}
          <PolicyBanner />
        </AuthProvider>
        
        {/* Toast Notifications */}
        <Toaster position="top-center" richColors />
        
        {/* Paystack Script */}
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </body>
    </html>
  )
}

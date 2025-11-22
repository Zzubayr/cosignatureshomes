import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'CO Signature Homes - Premium Serviced Apartments in Nigeria',
  description: 'Discover luxury serviced apartments across Nigeria with CO Signature Homes. Featuring Pa Cladius Apartments, Cladius Elite Lofts, and Omolaja Flats - premium accommodation with 24/7 power, security, and world-class amenities.',
  keywords: 'serviced apartments, Nigeria, luxury accommodation, Pa Cladius, Cladius Elite, Omolaja Flats, Ilesha, Osun State, 24/7 power, security, premium amenities',
  authors: [{ name: 'CO Signature Homes' }],
  openGraph: {
    title: 'CO Signature Homes - Premium Serviced Apartments in Nigeria',
    description: 'Luxury serviced apartments across Nigeria with premium amenities and 24/7 services',
    type: 'website',
    siteName: 'CO Signature Homes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CO Signature Homes - Premium Serviced Apartments',
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
        {children}
      </body>
    </html>
  )
}

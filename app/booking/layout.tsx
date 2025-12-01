import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Your Stay - CO Signatures Homes | Luxury Serviced Apartments',
  description: 'Book your luxury accommodation with CO Signatures Homes. Choose from Pa Claudius Apartments at Alatishe, Phase 2, Ile Ayo, Ilesha, Claudius Elite Lofts, or Omolaja Flats. Easy online booking with premium amenities and 24/7 services.',
  keywords: 'book accommodation, luxury apartments, serviced apartments booking, Pa Claudius booking, CO Signatures Homes reservation, Nigeria accommodation',
  openGraph: {
    title: 'Book Your Stay - CO Signatures Homes',
    description: 'Book luxury serviced apartments across Nigeria with premium amenities and 24/7 services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Your Stay - CO Signatures Homes',
    description: 'Reserve your luxury accommodation with CO Signatures Homes',
  },
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

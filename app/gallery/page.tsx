'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const GalleryPage = () => {
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Luxury living room with modern furnishing',
      category: 'Living Areas'
    },
    {
      src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Elegant bedroom with premium bedding',
      category: 'Bedrooms'
    },
    {
      src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Modern kitchen with premium appliances',
      category: 'Kitchen'
    },
    {
      src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Spacious dining area',
      category: 'Dining'
    },
    {
      src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Luxury bathroom with modern fixtures',
      category: 'Bathrooms'
    },
    {
      src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Comfortable seating area',
      category: 'Living Areas'
    },
    {
      src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Master bedroom suite',
      category: 'Bedrooms'
    },
    {
      src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Premium kitchen facilities',
      category: 'Kitchen'
    },
    {
      src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Building exterior at night',
      category: 'Exterior'
    },
    {
      src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Elegant living space',
      category: 'Living Areas'
    },
    {
      src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Cozy bedroom atmosphere',
      category: 'Bedrooms'
    },
    {
      src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Modern kitchen design',
      category: 'Kitchen'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-dark-950 to-black">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Gallery
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our modern luxury interiors and discover the elegant spaces 
              that await you at Pa CO Signatures Homes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-dark-900"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block bg-gold-500 text-black text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {image.category}
                    </span>
                    <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.alt}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-gold-600 to-gold-500">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-black mb-6">
              Experience Luxury Firsthand
            </h2>
            <p className="text-lg md:text-xl text-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ready to experience these beautiful spaces? Book your stay today and 
              enjoy the perfect blend of comfort and elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/booking"
                className="bg-black hover:bg-gray-900 text-gold-400 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Book Your Stay
              </a>
              <a
                href="/apartments"
                className="border-2 border-black text-black hover:bg-black hover:text-gold-400 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
              >
                View Apartments
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default GalleryPage

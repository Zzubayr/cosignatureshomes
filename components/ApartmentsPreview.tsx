'use client'

import { motion } from 'framer-motion'
import { Bed, Users, Utensils, Wifi, Car, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const ApartmentsPreview = () => {
  const apartments = [
    {
      id: 1,
      title: 'Premium 3-Bedroom Ensuite Unit',
      description: 'Spacious luxury living with premium furnishings, modern amenities, and elegant design perfect for families or groups.',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      features: [
        { icon: Bed, text: '3 Ensuite Bedrooms' },
        { icon: Users, text: 'Spacious Living Area' },
        { icon: Utensils, text: 'Fully Equipped Kitchen' },
      ]
    },
    {
      id: 2,
      title: 'Executive 3-Bedroom Ensuite Unit',
      description: 'Executive-level comfort with sophisticated design, premium amenities, and professional-grade facilities.',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      features: [
        { icon: Bed, text: '3 Ensuite Bedrooms' },
        { icon: Users, text: 'Work Space' },
        { icon: Wifi, text: 'High-Speed WiFi' },
      ]
    },
    {
      id: 3,
      title: 'Deluxe 1-Bedroom Ensuite Unit',
      description: 'Intimate luxury perfect for couples or business travelers, featuring modern design and premium comfort.',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      features: [
        { icon: Bed, text: '1 Ensuite Bedroom' },
        { icon: Heart, text: 'Romantic Setting' },
        { icon: Car, text: 'Secure Parking' },
      ]
    }
  ]

  return (
    <section className="py-20 bg-dark-950" id="apartments">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
            Our Apartments
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Choose from our three fully ensuite serviced units, each designed to provide the ultimate luxury experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {apartments.map((apartment, index) => (
            <motion.div
              key={apartment.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-dark-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-gold-500/20 transition-all duration-300 group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={apartment.image}
                  alt={apartment.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    href="/apartments"
                    className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-3 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-playfair font-semibold text-white mb-3">
                  {apartment.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {apartment.description}
                </p>
                <ul className="space-y-2">
                  {apartment.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <feature.icon className="w-4 h-4 text-gold-400 mr-3" />
                      <span className="text-sm">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ApartmentsPreview

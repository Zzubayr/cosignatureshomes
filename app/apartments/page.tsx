'use client'

import { motion } from 'framer-motion'
import { Bed, Users, Utensils, Wifi, Car, Heart, Bath, Tv, Shield, AirVent, Thermometer } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const ApartmentsPage = () => {
  const apartments = [
    {
      id: 1,
      title: 'Premium 3-Bedroom Ensuite Apartment (Unit 1)',
      description: 'A spacious, modern home ideal for families and groups.',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      idealFor: '4–6 guests',
      features: [
        { icon: Bed, text: '3 fully ensuite bedrooms' },
        { icon: Users, text: 'Large living & dining area' },
        { icon: Utensils, text: 'Fully equipped kitchen (gas cooker, fridge, microwave, utensils)' },
        { icon: Tv, text: 'Smart TV' },
        { icon: Wifi, text: 'High-speed WiFi' },
        { icon: AirVent, text: 'AC in all rooms' },
        { icon: Thermometer, text: 'Water heater in all bathrooms' },
        { icon: Users, text: 'Large windows' },
        { icon: Car, text: 'Secure parking' },
      ]
    },
    {
      id: 2,
      title: 'Executive 3-Bedroom Ensuite Apartment (Unit 2)',
      description: 'Modern and professionally styled — great for executives and long stays.',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      idealFor: '4–6 guests',
      features: [
        { icon: Bed, text: '3 fully ensuite bedrooms' },
        { icon: Users, text: 'Executive-style furnishing & décor' },
        { icon: Users, text: 'Modern living room' },
        { icon: Tv, text: 'Smart TV' },
        { icon: Users, text: 'Work desk area' },
        { icon: Utensils, text: 'Fully equipped kitchen' },
        { icon: Wifi, text: 'WiFi & AC' },
        { icon: Thermometer, text: 'Water heater' },
        { icon: Shield, text: 'Secure compound' },
      ]
    },
    {
      id: 3,
      title: 'Deluxe 1-Bedroom Ensuite Apartment (Unit 3)',
      description: 'A quiet, private, beautifully designed space.',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      idealFor: '1–2 guests',
      features: [
        { icon: Bed, text: '1 fully ensuite bedroom' },
        { icon: Users, text: 'Modern living room' },
        { icon: Utensils, text: 'Fitted kitchen' },
        { icon: Tv, text: 'Smart TV' },
        { icon: AirVent, text: 'AC' },
        { icon: Wifi, text: 'High-speed WiFi' },
        { icon: Thermometer, text: 'Water heater' },
      ]
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
              Our Apartments
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Choose from our three fully ensuite serviced units, each designed to provide 
              the ultimate luxury experience with modern amenities and premium comfort.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Apartments Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-16">
            {apartments.map((apartment, index) => (
              <motion.div
                key={apartment.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative h-96 rounded-2xl overflow-hidden ${
                  index % 2 === 1 ? 'lg:col-start-2' : ''
                }`}>
                  <Image
                    src={apartment.image}
                    alt={apartment.title}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Content */}
                <div className={`space-y-6 ${
                  index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''
                }`}>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
                      {apartment.title}
                    </h2>
                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-lg font-semibold text-gold-400">Ideal for:</span>
                      <span className="text-gray-300">{apartment.idealFor}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {apartment.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4">
                    {apartment.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <feature.icon className="w-5 h-5 text-gold-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/booking"
                    className="inline-block bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ApartmentsPage

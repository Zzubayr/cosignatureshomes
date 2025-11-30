'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Building2, Users, Shield, Star } from 'lucide-react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const companies = [
    {
      id: 'pa-cladius',
      name: 'Pa Cladius Apartments',
      description: '3 fully serviced ensuite units at Alatishe, Phase 2, Ile Ayo, Ilesha, Osun State with 24/7 power, security, and premium amenities.',
      status: 'available',
      location: 'Alatishe, Phase 2, Ile Ayo, Ilesha, Osun State',
      units: '3 Units Available',
      href: '/pa-cladius',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cladius-elite',
      name: 'Cladius Elite Lofts',
      description: 'Premium loft-style accommodations with modern amenities and sophisticated design.',
      status: 'coming-soon',
      location: 'Location TBA',
      units: 'Coming Soon',
      href: '/cladius-elite',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'omolaja-flats',
      name: 'Omolaja Flats',
      description: 'Comfortable and affordable apartment living with essential amenities and convenient location.',
      status: 'coming-soon',
      location: 'Location TBA',
      units: 'Coming Soon',
      href: '/omolaja-flats',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-400 text-2xl font-playfair">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/MasterLogo.svg"
                alt="CO Signature Homes"
                width={200}
                height={200}
                className="h-[200px] w-[120px]"
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/booking" className="text-white hover:text-gold-400 transition-colors font-medium">
                BOOK NOW
              </Link>
              <Link href="/contact" className="text-white hover:text-gold-400 transition-colors font-medium">
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-dark-950 to-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
                Welcome to{' '}
                <span className="text-gold-400">CO Signature Homes</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                Your premier destination for luxury serviced apartments across Nigeria. 
                Choose from our portfolio of premium accommodations designed for comfort, security, and elegance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link
                  href="/booking"
                  className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Book Your Stay
                </Link>
                <Link
                  href="#companies"
                  className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300"
                >
                  Explore Properties
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl border border-gold-400/20">
                <Image
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Luxury apartment interior"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-gold-400/30">
                    <h3 className="text-gold-400 font-playfair font-semibold text-lg mb-2">
                      Premium Accommodations
                    </h3>
                    <p className="text-white text-sm">
                      Experience luxury living with 24/7 power, security, and world-class amenities
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold-400/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold-400/5 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
              Our Properties
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover our collection of premium serviced apartments, each offering unique experiences 
              and exceptional comfort across different locations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {companies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative bg-dark-950 rounded-3xl overflow-hidden border border-gray-800 hover:border-gold-400 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={company.image}
                    alt={company.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {company.status === 'available' ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Available Now
                      </span>
                    ) : (
                      <span className="bg-gold-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-playfair font-bold text-white mb-4">
                    {company.name}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {company.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-gold-400" />
                      <span className="text-gray-300">{company.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gold-400" />
                      <span className="text-gray-300">{company.units}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={company.href}
                    className={`inline-flex items-center space-x-2 w-full justify-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      company.status === 'available'
                        ? 'bg-gold-500 hover:bg-gold-600 text-black'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    <span>{company.status === 'available' ? 'View Details' : 'Learn More'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-dark-950">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
              Why Choose CO Signature Homes
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Experience the difference with our commitment to luxury, security, and exceptional service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Premium Security',
                description: '24/7 security and CCTV monitoring across all properties'
              },
              {
                icon: Star,
                title: 'Luxury Amenities',
                description: 'High-end furnishings and modern amenities in every unit'
              },
              {
                icon: Building2,
                title: 'Prime Locations',
                description: 'Strategically located properties with easy access to key areas'
              },
              {
                icon: Users,
                title: 'Exceptional Service',
                description: 'Dedicated support team and professional property management'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-dark-900 rounded-2xl p-6 border border-gray-800 hover:border-gold-400 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to Experience Luxury?
            </h2>
            <p className="text-lg md:text-xl text-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Book your stay with CO Signature Homes and discover premium comfort across our portfolio of properties.
            </p>
            <Link
              href="/booking"
              className="inline-block bg-black hover:bg-gray-900 text-gold-400 font-semibold px-12 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg"
            >
              Book Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center mb-6">
              <Image
                src="/MasterLogo.svg"
                alt="CO Signature Homes"
                width={200}
                height={200}
                className="h-[200px] w-[120px]"
              />
            </Link>
            <p className="text-gray-300 mb-8">
              Premium serviced apartments across Nigeria
            </p>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-center text-gray-400">
                &copy; 2025 CO Signature Homes. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

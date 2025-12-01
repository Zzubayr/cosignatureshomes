'use client'

import { motion } from 'framer-motion'
import { Home, Zap, Tv, Thermometer, Shield, Wifi, Car, MapPin } from 'lucide-react'

const FeaturedAmenities = () => {
  const amenities = [
    {
      icon: Home,
      title: 'Fully Ensuite Units',
      description: 'Every bedroom features its own private bathroom with modern fixtures and premium finishes'
    },
    {
      icon: Zap,
      title: '24/7 Power Supply (Generator + Inverter Backup)',
      description: 'Uninterrupted power supply with backup generators and inverter systems'
    },
    {
      icon: Shield,
      title: '24/7 CCTV Security Monitoring',
      description: 'Round-the-clock surveillance and monitoring for your safety and peace of mind'
    },
    {
      icon: Shield,
      title: 'On-Site Security Guard',
      description: 'Professional security personnel on-site 24/7 for enhanced protection'
    },
    {
      icon: Wifi,
      title: 'High-Speed WiFi',
      description: 'Complimentary high-speed internet access throughout the property'
    },
    {
      icon: Home,
      title: 'Modern Furnishings & Décor',
      description: 'Contemporary design and premium furnishings in all living spaces'
    },
    {
      icon: Car,
      title: 'Gated Compound & Secure Parking',
      description: 'Fully secured compound with controlled access and dedicated parking spaces'
    },
    {
      icon: MapPin,
      title: 'Prime Location – Alatishe, Ile Ayo, Ilesha',
      description: 'Strategically located at Alatishe, Phase 2, Ile Ayo with easy access to amenities'
    }
  ]

  return (
    <section className="py-20 bg-black" id="amenities">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
            Why Choose Pa Claudius
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience the perfect blend of comfort, security, and luxury at our premium serviced apartments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-400 transition-colors duration-300">
                <amenity.icon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-white mb-3">
                {amenity.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {amenity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedAmenities

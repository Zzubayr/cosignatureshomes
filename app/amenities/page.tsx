'use client'

import { motion } from 'framer-motion'
import { 
  Home, Bed, Tv, Thermometer, Zap, Shield, Eye, 
  Utensils, Refrigerator, Microwave, Wifi, Shirt, 
  Car, Droplets, Wind, Coffee, Users, Phone
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const AmenitiesPage = () => {
  const amenityCategories = [
    {
      title: "Comfort & Interior",
      icon: Home,
      amenities: [
        { icon: Bed, text: "Fully ensuite bedrooms" },
        { icon: Bed, text: "High-quality beds & linens" },
        { icon: Home, text: "Modern living & dining spaces" },
        { icon: Home, text: "Elegant décor & lighting" },
        { icon: Wind, text: "Air conditioning in all rooms" },
        { icon: Tv, text: "Smart TVs with streaming capability" },
        { icon: Home, text: "Spacious wardrobes" },
        { icon: Thermometer, text: "Water heaters in all bathrooms" }
      ]
    },
    {
      title: "Power & Security",
      icon: Shield,
      amenities: [
        { icon: Zap, text: "24/7 power supply" },
        { icon: Zap, text: "Standby generator" },
        { icon: Zap, text: "Inverter/backup power system" },
        { icon: Eye, text: "24/7 CCTV surveillance" },
        { icon: Shield, text: "On-site security personnel" },
        { icon: Shield, text: "Controlled access gate" },
        { icon: Shield, text: "Well-lit compound" }
      ]
    },
    {
      title: "Kitchen & Dining",
      icon: Utensils,
      amenities: [
        { icon: Utensils, text: "Gas cooker" },
        { icon: Refrigerator, text: "Refrigerator" },
        { icon: Microwave, text: "Microwave" },
        { icon: Coffee, text: "Electric kettle" },
        { icon: Utensils, text: "Pots, pans & utensils" },
        { icon: Users, text: "Breakfast bar or dining table" },
        { icon: Droplets, text: "Water dispenser (if applicable)" }
      ]
    },
    {
      title: "Connectivity & Services",
      icon: Wifi,
      amenities: [
        { icon: Wifi, text: "High-speed fiber WiFi" },
        { icon: Home, text: "Weekly housekeeping" },
        { icon: Bed, text: "Fresh towels & linen changes" },
        { icon: Shirt, text: "Washer in each Suite" },
        { icon: Phone, text: "On-call maintenance & support" },
        { icon: Home, text: "Long-stay discounts" },
        { icon: Utensils, text: "Optional private chef/catering" }
      ]
    },
    {
      title: "Outdoor & Extras",
      icon: Car,
      amenities: [
        { icon: Car, text: "Secured parking" },
        { icon: Shield, text: "Gated compound" },
        { icon: Home, text: "Calm residential neighborhood" },
        { icon: Droplets, text: "Borehole water with purification" },
        { icon: Home, text: "Balcony/terrace (in applicable units)" }
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
              Luxury Amenities & Services
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience premium comfort with our comprehensive range of amenities designed 
              to make your stay exceptional at Pa C.O Service Apartments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Amenities Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-16">
            {amenityCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
                className="bg-dark-950 rounded-3xl p-8 lg:p-12 border border-gray-800"
              >
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mr-6">
                    <category.icon className="w-8 h-8 text-black" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white">
                    {category.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.amenities.map((amenity, amenityIndex) => (
                    <motion.div
                      key={amenityIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: amenityIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-4 p-4 bg-dark-900 rounded-xl hover:bg-dark-800 transition-colors duration-300"
                    >
                      <amenity.icon className="w-6 h-6 text-gold-400 flex-shrink-0" />
                      <span className="text-gray-300 font-medium">{amenity.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Highlights */}
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
              Why Choose Pa C.O Service Apartments?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                "24/7 Power & Security",
                "Fully Ensuite Units",
                "Premium Amenities",
                "Prime Location"
              ].map((highlight, index) => (
                <div key={index} className="bg-black/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-black">{highlight}</h3>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <a
                href="/booking"
                className="inline-block bg-black hover:bg-gray-900 text-gold-400 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Book Your Stay
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AmenitiesPage

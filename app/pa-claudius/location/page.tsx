'use client'

import { motion } from 'framer-motion'
import { MapPin, ShoppingCart, Heart, Utensils, Building2, Camera, Car, Shield } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const PaClaudiusLocationPage = () => {
  const nearbyAttractions = [
    {
      icon: ShoppingCart,
      title: "Local Markets",
      description: "Fresh produce and local goods within walking distance",
      distance: "5 mins"
    },
    {
      icon: Heart,
      title: "Hospitals & Pharmacies", 
      description: "Quality healthcare facilities and medical services nearby",
      distance: "10 mins"
    },
    {
      icon: Heart,
      title: "Churches",
      description: "Various places of worship for spiritual needs",
      distance: "3 mins"
    },
    {
      icon: Utensils,
      title: "Restaurants",
      description: "Local cuisine and international dining options",
      distance: "7 mins"
    },
    {
      icon: Building2,
      title: "Business Hubs",
      description: "Commercial centers and office complexes",
      distance: "15 mins"
    },
    {
      icon: Camera,
      title: "Scenic Spots",
      description: "Beautiful locations and cultural attractions",
      distance: "20 mins"
    }
  ]

  const locationFeatures = [
    {
      icon: Shield,
      title: "Secure Neighborhood",
      description: "Located in a calm, safe residential area with 24/7 security"
    },
    {
      icon: Car,
      title: "Easy Access",
      description: "Fast access to major roads and transportation hubs"
    },
    {
      icon: Building2,
      title: "Business District",
      description: "Close proximity to Ilesha's main business and commercial areas"
    },
    {
      icon: MapPin,
      title: "Central Location",
      description: "Strategically positioned in the heart of Ilesha, Osun State"
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
              Located in the Heart of <span className="text-gold-400">Ilesha</span>, Osun State
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Pa Claudius Apartments at Alatishe, Phase 2, Ile Ayo sit in a secure, peaceful community with fast access to markets, 
              restaurants, major roads, and business districts. Experience the perfect blend of tranquility 
              and convenience in Nigeria's historic city.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-dark-950">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6">
              Our Prime Location
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Strategically positioned for easy access to all of Ilesha's key attractions and amenities
            </p>
          </motion.div>

          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-dark-900 rounded-3xl overflow-hidden border border-gray-800 mb-12"
          >
            <div className="p-6 border-b border-gray-800">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                <h3 className="text-2xl font-playfair font-semibold text-white mb-2">
                  Interactive Map
                </h3>
                <p className="text-gray-300 mb-1">Pa Claudius Apartments</p>
                <p className="text-gold-400 font-semibold">Alatishe, Phase 2, Ile Ayo, Ilesha, Osun State, Nigeria</p>
              </div>
            </div>
            
            {/* Google Maps Embed */}
            <div className="h-80 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.2!2d4.7419!3d7.6279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzcnNDAuNCJOIDTCsDQ0JzMwLjgiRQ!5e0!3m2!1sen!2sng!4v1635000000000!5m2!1sen!2sng&q=Alatishe+Phase+2+Ile+Ayo+Ilesha+Osun+State+Nigeria"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pa Claudius Apartments Location - Alatishe, Phase 2, Ile Ayo, Ilesha, Osun State, Nigeria"
              ></iframe>
            </div>
            
            {/* Address Details */}
            <div className="p-6 bg-dark-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gold-400 font-semibold mb-1">Full Address:</p>
                  <p className="text-gray-300">Alatishe, Phase 2, Ile Ayo</p>
                  <p className="text-gray-300">Ilesha, Osun State, Nigeria</p>
                </div>
                <div>
                  <p className="text-gold-400 font-semibold mb-1">Contact:</p>
                  <p className="text-gray-300">+2348110384179</p>
                  <p className="text-gray-300">info@cosignatureshomes.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6">
              Why Our Location is Perfect
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover the advantages of staying in our carefully chosen location
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {locationFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-dark-950 rounded-2xl p-6 border border-gray-800 hover:border-gold-400 transition-colors duration-300"
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

      {/* Nearby Attractions */}
      <section className="py-20 bg-dark-950">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6">
              Nearby Attractions
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Everything you need is just minutes away from your doorstep
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nearbyAttractions.map((attraction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-dark-900 rounded-2xl p-6 border border-gray-800 hover:border-gold-400 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gold-400 transition-colors duration-300">
                    <attraction.icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-playfair font-semibold text-white">
                        {attraction.title}
                      </h3>
                      <span className="text-gold-400 text-sm font-semibold">
                        {attraction.distance}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {attraction.description}
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
              Experience Ilesha's Best Location
            </h2>
            <p className="text-lg md:text-xl text-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Book your stay at Pa Claudius Apartments and enjoy the perfect combination 
              of peaceful living and urban convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/booking"
                className="bg-black hover:bg-gray-900 text-gold-400 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Book Your Stay
              </a>
              <a
                href="/pa-claudius"
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

export default PaClaudiusLocationPage

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Head from 'next/head'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ApartmentsPreview from '@/components/ApartmentsPreview'
import FeaturedAmenities from '@/components/FeaturedAmenities'
import CallToAction from '@/components/CallToAction'
import Footer from '@/components/Footer'

export default function PaClaudiusPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-400 text-2xl font-playfair">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Pa Claudius Apartments - Luxury Serviced Apartments in Ilesha | CO Signatures Homes</title>
        <meta name="description" content="Experience luxury at Pa Claudius Apartments at Alatishe, Phase 2, Ile Ayo, Ilesha, Osun State. 3 fully serviced ensuite units with 24/7 power, security, and premium amenities. Part of CO Signatures Homes portfolio." />
        <meta name="keywords" content="Pa Claudius Apartments, Alatishe apartments, Ile Ayo, Ilesha apartments, Osun State accommodation, serviced apartments, luxury accommodation, 24/7 power, security, premium amenities" />
        <meta property="og:title" content="Pa Claudius Apartments - Luxury Serviced Apartments in Ilesha" />
        <meta property="og:description" content="3 fully serviced ensuite units at Alatishe, Phase 2, Ile Ayo, Ilesha with 24/7 power, security, and premium amenities" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pa Claudius Apartments - Luxury Serviced Apartments" />
        <meta name="twitter:description" content="Experience luxury accommodation at Alatishe, Phase 2, Ile Ayo, Ilesha, Osun State with premium amenities" />
      </Head>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-black"
      >
        <Navigation />
        <Hero />
        <ApartmentsPreview />
        <FeaturedAmenities />
        <CallToAction />
        <Footer />
      </motion.main>
    </>
  )
}

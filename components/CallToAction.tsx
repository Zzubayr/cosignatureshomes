'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import whatsappicon from "@/public/whatsapp.svg"
import Link from 'next/link'

const CallToAction = () => {
  return (
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
            Ready to Book Your Stay?
          </h2>
          <p className="text-lg md:text-xl text-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Contact us today to reserve your preferred apartment at Pa Claudius
            Service Apartments. 📞+2348110384179 |{" "}
            <Image
              src={whatsappicon}
              alt="whatsapp"
              width={20}
              height={20}
              className="w-5 h-5"
            />{" "}
            +2349028425896 | 🌐 cosignatureshomes.com
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
  );
}

export default CallToAction

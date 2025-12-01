'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-dark-950 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/pa-claudius" className="flex items-center">
              <Image
                src="/PA Claudius.svg"
                alt="Pa Claudius Apartments"
                width={200}
                height={200}
                className="h-[200px] w-[120px]"
              />
            </Link>
            <p className="text-gray-300 leading-relaxed">
              3 fully serviced ensuite units at Alatishe, Phase 2, Ile Ayo, Ilesha, Osun State with 24/7 power, 
              security, and premium amenities. Experience comfort and luxury.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-gold-400 font-playfair font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/apartments" className="text-gray-300 hover:text-gold-400 transition-colors">Apartments</Link></li>
              <li><Link href="/amenities" className="text-gray-300 hover:text-gold-400 transition-colors">Amenities</Link></li>
              <li><Link href="/gallery" className="text-gray-300 hover:text-gold-400 transition-colors">Gallery</Link></li>
              <li><Link href="/booking" className="text-gray-300 hover:text-gold-400 transition-colors">Booking</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-gold-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-gold-400 font-playfair font-semibold text-lg">Contact Info</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gold-400" />
              <span className="text-gray-300">+2348110384179</span>
            </div>
            <div className="flex items-center space-x-3">
              <Image
                src="/whatsapp.svg"
                alt="WhatsApp"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-gray-300">+2349028425896</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gold-400" />
              <span className="text-gray-300">info@cosignatureshomes.com</span>
            </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gold-400" />
                <span className="text-gray-300">Alatishe, Phase 2, Ile Ayo, Ilesha, Osun State, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400">
            &copy; 2025 CO Signatures Homes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

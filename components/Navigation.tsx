'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Settings, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, userData, logout } = useAuth()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/apartments', label: 'APARTMENTS' },
    { href: '/amenities', label: 'AMENITIES' },
    { href: '/gallery', label: 'GALLERY' },
    { href: '/location', label: 'LOCATION' },
    { href: '/booking', label: 'RATES & BOOKING' },
    { href: '/contact', label: 'CONTACT' },
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/pa-claudius" className="flex items-center">
            <Image
              src="/PA Claudius.svg"
              alt="Pa Claudius Apartments"
              width={200}
              height={200}
              className="h-[200px] w-[120px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-gold-400 transition-colors duration-300 font-inter text-sm tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            
            {/* User Avatar or Auth Button */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-white hover:text-gold-400 transition-colors"
                >
                  <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                    {userData?.photoURL ? (
                      <img 
                        src={userData.photoURL} 
                        alt={userData.displayName || 'User'} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-black" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{userData?.displayName?.split(' ')[0] || 'User'}</span>
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-900 border border-gray-800 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-3 border-b border-gray-800">
                        <p className="text-white font-medium">{userData?.displayName}</p>
                        <p className="text-gray-400 text-sm">{userData?.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        
                        <Link
                          href="/profile?tab=bookings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>My Bookings</span>
                        </Link>
                        
                        <Link
                          href="/profile?tab=settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        
                        {userData?.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-gold-400 hover:text-gold-300 hover:bg-dark-800 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-800 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-dark-800 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="text-white hover:text-gold-400"
                >
                  <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                    {userData?.photoURL ? (
                      <img 
                        src={userData.photoURL} 
                        alt={userData.displayName || 'User'} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-black" />
                    )}
                  </div>
                </button>

                {/* Mobile User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-900 border border-gray-800 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-3 border-b border-gray-800">
                        <p className="text-white font-medium truncate">{userData?.displayName}</p>
                        <p className="text-gray-400 text-sm truncate">{userData?.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        
                        <Link
                          href="/profile?tab=bookings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>My Bookings</span>
                        </Link>
                        
                        <Link
                          href="/profile?tab=settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        
                        {userData?.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-gold-400 hover:text-gold-300 hover:bg-dark-800 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-800 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-dark-800 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <button
              className="text-white hover:text-gold-400 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="lg:hidden bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-white hover:text-gold-400 transition-colors duration-300 font-inter text-sm tracking-wide py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Policy Links */}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Legal</p>
                <Link
                  href="/terms"
                  className="block text-white hover:text-gold-400 transition-colors duration-300 font-inter text-sm tracking-wide py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy"
                  className="block text-white hover:text-gold-400 transition-colors duration-300 font-inter text-sm tracking-wide py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navigation

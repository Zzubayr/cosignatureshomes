'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Calendar, MapPin, Phone, Mail, Clock, CreditCard, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Booking } from '@/lib/types'

const ProfilePage = () => {
  const { user, userData, logout } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }
    fetchBookings()
  }, [user, router])

  const fetchBookings = async () => {
    if (!user) return

    try {
      const bookingsRef = collection(db, 'bookings')
      const q = query(
        bookingsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const userBookings: Booking[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        userBookings.push({
          id: doc.id,
          ...data,
          checkIn: data.checkIn.toDate(),
          checkOut: data.checkOut.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Booking)
      })
      
      setBookings(userBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-900/20'
      case 'pending': return 'text-yellow-400 bg-yellow-900/20'
      case 'checked-in': return 'text-blue-400 bg-blue-900/20'
      case 'checked-out': return 'text-gray-400 bg-gray-900/20'
      case 'cancelled': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-400 text-2xl font-playfair">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-dark-900 rounded-2xl p-8 border border-gray-800 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-24 h-24 bg-gold-500 rounded-full flex items-center justify-center">
                {userData.photoURL ? (
                  <img 
                    src={userData.photoURL} 
                    alt={userData.displayName || 'User'} 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-black" />
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-playfair font-bold text-white mb-2">
                  {userData.displayName || 'Guest User'}
                </h1>
                <p className="text-gray-400 mb-4">{userData.email}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData.role === 'admin' 
                      ? 'text-gold-400 bg-gold-900/20' 
                      : 'text-blue-400 bg-blue-900/20'
                  }`}>
                    {userData.role === 'admin' ? 'Administrator' : 'Member'}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Member since {userData.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-3 bg-red-900/20 hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-dark-900 rounded-lg p-1 mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'bookings', label: 'My Bookings', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gold-500 text-black'
                    : 'text-gray-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-dark-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center space-x-4 mb-4">
                    <Calendar className="w-8 h-8 text-gold-400" />
                    <div>
                      <h3 className="text-white font-semibold">Total Bookings</h3>
                      <p className="text-gray-400 text-sm">All time</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{bookings.length}</p>
                </div>

                <div className="bg-dark-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center space-x-4 mb-4">
                    <CreditCard className="w-8 h-8 text-green-400" />
                    <div>
                      <h3 className="text-white font-semibold">Total Spent</h3>
                      <p className="text-gray-400 text-sm">All bookings</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(bookings.reduce((total, booking) => total + booking.totalAmount, 0))}
                  </p>
                </div>

                <div className="bg-dark-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center space-x-4 mb-4">
                    <Clock className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-white font-semibold">Upcoming Stays</h3>
                      <p className="text-gray-400 text-sm">Next 30 days</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {bookings.filter(b => 
                      b.checkIn > new Date() && 
                      b.checkIn < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-gold-400 text-lg">Loading bookings...</div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
                    <p className="text-gray-400 mb-6">Start your luxury experience with CO Signature Homes</p>
                    <button
                      onClick={() => router.push('/booking')}
                      className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                      Make Your First Booking
                    </button>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-dark-900 rounded-xl p-6 border border-gray-800">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="text-xl font-semibold text-white">{booking.propertyName}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2 text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.apartmentName}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                              <User className="w-4 h-4" />
                              <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-white mb-1">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <p className="text-gray-400 text-sm">Ref: {booking.bookingReference}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            Booked on {booking.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-dark-900 rounded-xl p-8 border border-gray-800">
                <h2 className="text-2xl font-playfair font-bold text-white mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gold-400 font-semibold mb-2">Display Name</label>
                    <input
                      type="text"
                      value={userData.displayName || ''}
                      className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <label className="block text-gold-400 font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={userData.email || ''}
                      disabled
                      className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <button className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors mr-4">
                      Save Changes
                    </button>
                    <button className="bg-red-900/20 hover:bg-red-900/30 text-red-400 font-semibold px-6 py-3 rounded-lg transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

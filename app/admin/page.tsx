'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Mail, 
  Phone, 
  MapPin,
  Eye,
  Check,
  X,
  AlertTriangle,
  CreditCard,
  Filter,
  Search
} from 'lucide-react'
import { collection, query, orderBy, getDocs, doc, updateDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Booking } from '@/lib/types'

const AdminDashboard = () => {
  const { user, userData } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }
    
    if (userData && userData.role !== 'admin') {
      router.push('/')
      return
    }

    fetchBookings()
  }, [user, userData, router])

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'bookings')
      const q = query(bookingsRef, orderBy('createdAt', 'desc'))
      
      const querySnapshot = await getDocs(q)
      const allBookings: Booking[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        allBookings.push({
          id: doc.id,
          ...data,
          checkIn: data.checkIn.toDate(),
          checkOut: data.checkOut.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Booking)
      })
      
      setBookings(allBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdating(bookingId)
    try {
      const bookingRef = doc(db, 'bookings', bookingId)
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: new Date()
      })

      // Send confirmation email to user
      if (newStatus === 'confirmed') {
        await fetch('/api/bookings/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId })
        })
      }

      // Refresh bookings
      await fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
    } finally {
      setUpdating(null)
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

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter
    const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    checkedIn: bookings.filter(b => b.status === 'checked-in').length,
    revenue: bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out')
                    .reduce((sum, b) => sum + b.totalAmount, 0)
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-400 text-2xl font-playfair">Loading...</div>
      </div>
    )
  }

  if (userData.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              Admin <span className="text-gold-400">Dashboard</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome back, {userData.displayName}. Manage bookings and oversee operations.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'blue' },
              { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'yellow' },
              { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'green' },
              { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: CreditCard, color: 'gold' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-dark-900 rounded-xl p-6 border border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.color === 'gold' ? 'bg-gold-500' : 
                    stat.color === 'green' ? 'bg-green-500' :
                    stat.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}>
                    <stat.icon className="w-6 h-6 text-black" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark-900 rounded-xl p-6 border border-gray-800 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or booking reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-dark-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked In</option>
                  <option value="checked-out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Bookings List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gold-400 text-lg">Loading bookings...</div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
                <p className="text-gray-400">No bookings match your current filters.</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-dark-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-xl font-semibold text-white">{booking.propertyName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <span className="text-gray-400 text-sm">#{booking.bookingReference}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Users className="w-4 h-4" />
                          <span>{booking.userName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Mail className="w-4 h-4" />
                          <span>{booking.userEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Phone className="w-4 h-4" />
                          <span>{booking.userPhone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.apartmentName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Users className="w-4 h-4" />
                          <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''} • {booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Booked {booking.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-dark-800 hover:bg-dark-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              disabled={updating === booking.id}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                              <span>Confirm</span>
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              disabled={updating === booking.id}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'checked-in')}
                            disabled={updating === booking.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Check In</span>
                          </button>
                        )}
                        
                        {booking.status === 'checked-in' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'checked-out')}
                            disabled={updating === booking.id}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Check Out</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-900 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-playfair font-bold text-white">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gold-400 font-semibold mb-3">Guest Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Name:</span> {selectedBooking.userName}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedBooking.userEmail}</p>
                    <p><span className="text-gray-400">Phone:</span> {selectedBooking.userPhone}</p>
                    <p><span className="text-gray-400">Guests:</span> {selectedBooking.guests}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gold-400 font-semibold mb-3">Booking Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Reference:</span> {selectedBooking.bookingReference}</p>
                    <p><span className="text-gray-400">Property:</span> {selectedBooking.propertyName}</p>
                    <p><span className="text-gray-400">Apartment:</span> {selectedBooking.apartmentName}</p>
                    <p><span className="text-gray-400">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gold-400 font-semibold mb-3">Stay Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Check-in:</span> {selectedBooking.checkIn.toLocaleDateString()}</p>
                    <p><span className="text-gray-400">Check-out:</span> {selectedBooking.checkOut.toLocaleDateString()}</p>
                    <p><span className="text-gray-400">Nights:</span> {selectedBooking.nights}</p>
                    <p><span className="text-gray-400">Total Amount:</span> {formatCurrency(selectedBooking.totalAmount)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gold-400 font-semibold mb-3">Timestamps</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Created:</span> {selectedBooking.createdAt.toLocaleString()}</p>
                    <p><span className="text-gray-400">Updated:</span> {selectedBooking.updatedAt.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="text-gold-400 font-semibold mb-3">Special Requests</h3>
                  <p className="text-gray-300 text-sm bg-dark-800 rounded-lg p-4">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

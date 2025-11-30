'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from './firebase'

interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Create or update user document in Firestore
  const createUserDocument = async (user: User, additionalData?: any) => {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user
      const createdAt = new Date()
      const role = 'user' // Default role

      try {
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
          createdAt,
          role,
          ...additionalData
        })
      } catch (error) {
        console.error('Error creating user document:', error)
      }
    }

    // Get user data
    const updatedUserSnap = await getDoc(userRef)
    if (updatedUserSnap.exists()) {
      const data = updatedUserSnap.data()
      setUserData({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: data.createdAt?.toDate() || new Date(),
        role: data.role || 'user'
      })
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName })
    await createUserDocument(user, { displayName })
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider)
    await createUserDocument(user)
  }

  // Logout
  const logout = async () => {
    await signOut(auth)
    setUserData(null)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        await createUserDocument(user)
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

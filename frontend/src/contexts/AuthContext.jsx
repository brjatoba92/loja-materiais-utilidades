import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/verify')
      setAdmin(response.data.user)
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('admin_token')
      delete api.defaults.headers.Authorization
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password })
      
      const { token, admin } = response.data
      
      localStorage.setItem('admin_token', token)
      api.defaults.headers.Authorization = `Bearer ${token}`
      
      setAdmin(admin)
      toast.success('Login successful!')

      return { sucess: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    delete api.defaults.headers.Authorization
    setAdmin(null)
    toast.success('Logged out successfully!')
  }

  const value = {
    admin,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

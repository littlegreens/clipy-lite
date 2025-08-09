'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import MaterialIcon from '../components/icons/MaterialIcon'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('clipy-user')
    if (user) {
      router.push('/dashboard')
    }
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        const userData = await response.json()
        localStorage.setItem('clipy-user', JSON.stringify(userData))
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Login fallito')
      }
    } catch (error) {
      console.error('Errore login:', error)
      setError('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo Clipy */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-24 h-12 mx-auto mb-4"
          >
            <img src="/clipy.svg" alt="Clipy Logo" className="w-full h-full object-contain filter brightness-0 invert" />
          </motion.div>
          <p className="text-primary-100 text-lg font-light">Condividi cose con amore</p>
        </div>

        {/* Form Login */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onSubmit={handleLogin}
          className="md-card p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-surface-800 mb-2">
              Nome/Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="md-text-field w-full"
              placeholder="Nome / Email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-800 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="md-text-field w-full"
              placeholder="password"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center"
            >
              <MaterialIcon name="error" size="16" className="mr-2" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`md-button w-full h-12 flex items-center justify-center ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Accesso...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <MaterialIcon name="login" size="16" />
                <span>Entra</span>
              </div>
            )}
          </button>


        </motion.form>
      </motion.div>
    </div>
  )
}
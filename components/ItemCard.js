'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useDrag } from '@use-gesture/react'

export default function ItemCard({ item, categories, onToggleFavorite, onComplete, onDelete, user }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showActions, setShowActions] = useState(false)
  
  // Gesture per swipe
  const x = useMotionValue(0)
  const background = useTransform(x, [-150, -75, 0, 75, 150], [
    '#ef4444', '#f97316', 'transparent', '#10b981', '#eab308'
  ])
  
  const category = categories.find(c => c.id === item.category)
  const createdByUser = user?.id === item.createdBy

  // Gesture handlers
  const bind = useDrag(({ movement: [mx], direction: [dx], cancel }) => {
    // Swipe destro = completa
    if (mx > 100 && dx > 0) {
      onComplete(item.id)
      cancel()
      return
    }
    
    // Swipe sinistro = elimina
    if (mx < -100 && dx < 0) {
      handleDelete()
      cancel()
      return
    }
    
    x.set(mx)
  }, {
    axis: 'x',
    bounds: { left: -200, right: 200 },
    rubberband: true
  })

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(item.id)
  }

  const handleLongPress = () => {
    setShowActions(!showActions)
    // Haptic feedback se supportato
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'oggi'
    if (diffDays === 2) return 'ieri'
    if (diffDays < 7) return `${diffDays} giorni fa`
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
  }

  if (isDeleting) {
    return (
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.8 }}
        className="h-20"
      />
    )
  }

  return (
    <motion.div
      {...bind()}
      style={{ x, background }}
      className="relative"
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Swipe Indicators */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: x.get() < -50 ? 1 : 0 }}
          className="text-white text-xl"
        >
          🗑️
        </motion.div>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: x.get() > 50 ? 1 : 0 }}
          className="text-white text-xl"
        >
          ✅
        </motion.div>
      </div>

      {/* Main Card */}
      <motion.div
        className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 p-4 border-l-4 ${
          item.completed ? 'opacity-60' : ''
        }`}
        style={{ 
          borderLeftColor: category?.color || '#6b7280',
          touchAction: 'pan-x'
        }}
        onTouchStart={handleLongPress}
        whileTap={{ scale: 0.98 }}
        layout
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Titolo */}
            <h3 className={`font-semibold text-gray-900 mb-1 ${
              item.completed ? 'line-through' : ''
            }`}>
              {item.title}
            </h3>
            
            {/* Categoria e Data */}
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <span>{category?.name || '📋 Generale'}</span>
              </span>
              <span>•</span>
              <span>{formatDate(item.createdAt)}</span>
              {!createdByUser && (
                <>
                  <span>•</span>
                  <span className="text-pink-500">❤️ Condiviso</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-3">
            {/* Favorite Button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onToggleFavorite(item.id)}
              className="btn-touch w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <span className={`text-lg ${item.favorite ? 'text-yellow-500' : 'text-gray-300'}`}>
                {item.favorite ? '⭐' : '☆'}
              </span>
            </motion.button>

            {/* Complete Button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onComplete(item.id)}
              className={`btn-touch w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                item.completed 
                  ? 'bg-green-100 text-green-600' 
                  : 'hover:bg-green-50 text-gray-400 hover:text-green-500'
              }`}
            >
              <span className="text-lg">
                {item.completed ? '✅' : '○'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Actions Panel (Long Press) */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100 flex space-x-3"
          >
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2 px-4 rounded-xl font-medium transition-colors"
            >
              {item.favorite ? '⭐ Rimuovi preferito' : '☆ Aggiungi preferito'}
            </button>
            
            <button
              onClick={handleDelete}
              className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-xl font-medium transition-colors"
            >
              🗑️ Elimina
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Swipe Hints (primo utilizzo) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 2 }}
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 flex items-center space-x-4"
      >
        <span>← Elimina</span>
        <span>Completa →</span>
      </motion.div>
    </motion.div>
  )
}

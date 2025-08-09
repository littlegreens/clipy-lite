'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AddItemModal({ isOpen, onClose, onAdd, categories }) {
  const [title, setTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  // Focus automatico quando si apre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [isOpen])

  // Reset form quando si chiude
  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setSelectedCategory('')
      setLoading(false)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !selectedCategory) return

    setLoading(true)
    
    try {
      await onAdd({
        title: title.trim(),
        category: selectedCategory,
        favorite: false,
        completed: false
      })
      
      // Reset form
      setTitle('')
      setSelectedCategory('')
    } catch (error) {
      console.error('Errore aggiunta item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-floating"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="gradient-clipy text-white p-6 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Aggiungi nuovo</h2>
                <button
                  onClick={onClose}
                  className="btn-touch w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-1">Cosa vuoi condividere?</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Input Titolo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cosa?
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-clipy-500 focus:ring-2 focus:ring-clipy-200 transition-all duration-200 text-lg"
                  placeholder="Es: Latte e pane, Weekend a Roma..."
                  required
                />
              </div>

              {/* Selezione Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categoria
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`btn-touch p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedCategory === category.id
                          ? 'border-clipy-500 bg-clipy-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-sm">
                          {category.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!title.trim() || !selectedCategory || loading}
                className={`w-full btn-touch py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  !title.trim() || !selectedCategory || loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-clipy-500 hover:bg-clipy-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Aggiungendo...</span>
                  </div>
                ) : (
                  'Aggiungi 🚀'
                )}
              </button>
            </form>

            {/* Quick Add Hints */}
            <div className="px-6 pb-6 pt-0">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>💡 Suggerimenti rapidi:</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Latte', 'Weekend romantico', 'Riparare rubinetto', 'Film Marvel'].map((hint) => (
                    <button
                      key={hint}
                      type="button"
                      onClick={() => setTitle(hint)}
                      className="text-xs bg-white hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-full transition-colors"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

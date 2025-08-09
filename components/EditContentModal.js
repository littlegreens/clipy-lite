'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RichEditor from './RichEditor'
import CategoryFilter from './CategoryFilter'
import MaterialIcon from './icons/MaterialIcon'

export default function EditContentModal({ isOpen, onClose, onSave, item, categories }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && item) {
      setTitle(item.title || '')
      setContent(item.content || '')
      setSelectedCategory(item.category || '')
    } else if (!isOpen) {
      // Reset only when closing, not when opening
      setLoading(false)
      setTitle('')
      setContent('')
      setSelectedCategory('')
    }
  }, [isOpen, item])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !selectedCategory) return

    setLoading(true)
    
    try {
      await onSave({
        title: title.trim(),
        content: content,
        category: selectedCategory
      })
      
    } catch (error) {
      console.error('Errore modifica contenuto:', error)
    } finally {
      setLoading(false)
    }
  }



  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto"
          onClick={() => {}}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md-card w-full max-w-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-primary-500 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">Modifica Contenuto</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <MaterialIcon name="close" size="20" />
                </button>
              </div>
              <p className="text-primary-100 text-sm mt-1">Aggiorna le informazioni</p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Titolo */}
              <div>
                <label className="block text-sm font-medium text-surface-800 mb-2">
                  Titolo *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="md-text-field w-full"
                  placeholder="Es: Weekend a Roma, Ristorante da provare..."
                  required
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-surface-800 mb-3">
                  Categoria *
                </label>
                <div className="bg-surface-50 rounded-lg">
                  <CategoryFilter
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                    showAll={false}
                  />
                </div>
              </div>

              {/* Editor Ricco */}
              <div>
                <label className="block text-sm font-medium text-surface-800 mb-2">
                  Contenuto
                </label>
                <RichEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Scrivi qui il contenuto... Puoi aggiungere link, immagini, video YouTube e formattare il testo."
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-surface-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="md-button-outline flex-1"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!title.trim() || !selectedCategory || loading}
                  className={`md-button flex-1 flex items-center justify-center ${
                    !title.trim() || !selectedCategory || loading
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando...</span>
                    </div>
                  ) : (
                    'Salva'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

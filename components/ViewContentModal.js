'use client'

import { motion, AnimatePresence } from 'framer-motion'
import MaterialIcon from './icons/MaterialIcon'

export default function ViewContentModal({ isOpen, onClose, onEdit, item, categories }) {
  if (!item) return null

  const category = categories.find(c => c.id === item.category)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto"
          onClick={onClose}
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
                <h2 className="text-xl font-medium">Contenuto completo</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <MaterialIcon name="close" size="20" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Category and Title */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  {category && (
                    <MaterialIcon 
                      name={category.icon} 
                      size="16"
                      className="text-current"
                      style={{ color: category.color }}
                    />
                  )}
                  <span className="text-xs text-surface-600 font-medium">
                    {category?.name || 'Generale'}
                  </span>
                </div>
                <h3 className="text-2xl font-medium text-surface-900 mb-4">
                  {item.title}
                </h3>
              </div>

              {/* Full Content */}
              <div className="prose prose-sm max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: item.content }}
                  className="text-surface-700 leading-relaxed"
                />
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between text-xs text-surface-500 pt-6 mt-6 border-t border-surface-100">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <MaterialIcon name="schedule" size="12" className="mr-1" />
                    {(() => {
                      const dateString = item.updatedAt || item.createdAt
                      if (!dateString) return 'Data sconosciuta'
                      const date = new Date(dateString)
                      if (isNaN(date.getTime())) return 'Data non valida'
                      return date.toLocaleDateString('it-IT')
                    })()}
                  </span>
                  {item.favorite && (
                    <span className="flex items-center text-yellow-600">
                      <MaterialIcon name="star" size="12" className="mr-1" />
                      Preferito
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 p-6 pt-0">
              <button
                onClick={onClose}
                className="md-button-outline flex-1"
              >
                Chiudi
              </button>
              <button
                onClick={() => {
                  onEdit()
                  onClose()
                }}
                className="md-button flex-1 flex items-center justify-center"
              >
                <div className="flex items-center space-x-2">
                  <MaterialIcon name="edit" size="16" />
                  <span>Modifica</span>
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

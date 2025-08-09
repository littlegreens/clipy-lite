'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import EditContentModal from './EditContentModal'
import ViewContentModal from './ViewContentModal'
import MaterialIcon from './icons/MaterialIcon'

export default function ContentCard({ item, categories, onToggleFavorite, onDelete, onEdit, user }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  
  const category = categories.find(c => c.id === item.category)
  const createdByUser = user?.id === item.createdBy
  const isLongContent = item.content && item.content.length > 300

  const formatDate = (dateString) => {
    if (!dateString) return 'Data sconosciuta'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Data non valida'
    
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'oggi'
    if (diffDays === 2) return 'ieri'
    if (diffDays < 7) return `${diffDays} giorni fa`
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
  }

  const handleEdit = async (updatedData) => {
    await onEdit(item.id, updatedData)
    setShowEditModal(false)
  }

  // Estrae il contenuto testuale per l'anteprima
  const getTextPreview = (htmlContent) => {
    if (!htmlContent) return ''
    const div = document.createElement('div')
    div.innerHTML = htmlContent
    const text = div.textContent || div.innerText || ''
    return text.length > 150 ? text.substring(0, 150) + '...' : text
  }

  return (
    <>
      <motion.div
        className="md-card p-4 border-l-4 hover:shadow-lg transition-all duration-200"
        style={{ borderLeftColor: category?.color || '#607d8b' }}
        whileHover={{ y: -2 }}
        layout
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
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
            <h3 className="font-medium text-surface-900 text-lg leading-tight">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center space-x-1 ml-3">
            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="p-2 rounded-full hover:bg-surface-100 transition-colors"
            >
              <MaterialIcon 
                name={item.favorite ? 'star' : 'star_border'}
                size="20"
                className={item.favorite ? 'text-yellow-500' : 'text-surface-600'}
              />
            </button>

            {/* Edit Button */}
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-full hover:bg-surface-100 transition-colors"
            >
              <MaterialIcon name="edit" size="18" className="text-surface-700" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 rounded-full hover:bg-red-50 transition-colors"
            >
              <MaterialIcon name="delete" size="18" className="text-red-600" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        {item.content && (
          <div className="mb-3">
            <div>
              <p className="text-surface-700 text-sm leading-relaxed">
                {getTextPreview(item.content)}
              </p>
              {isLongContent && (
                <button
                  onClick={() => setShowViewModal(true)}
                  className="text-primary-500 text-sm font-medium mt-2 hover:text-primary-600 transition-colors"
                >
                  Mostra tutto
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-surface-500 pt-3 border-t border-surface-100">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <MaterialIcon name="schedule" size="12" className="mr-1" />
              {formatDate(item.updatedAt || item.createdAt)}
            </span>
            {!createdByUser && (
                          <span className="flex items-center text-primary-500">
              <MaterialIcon name="share" size="12" />
            </span>
            )}
          </div>
          
          {createdByUser && (
            <span className="flex items-center text-surface-400">
              <MaterialIcon name="person" size="12" className="mr-1" />
              Da te
            </span>
          )}
        </div>
      </motion.div>

      {/* View Modal */}
      <ViewContentModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onEdit={() => setShowEditModal(true)}
        item={item}
        categories={categories}
      />

      {/* Edit Modal */}
      <EditContentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEdit}
        item={item}
        categories={categories}
      />
    </>
  )
}

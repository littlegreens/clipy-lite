'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import MaterialIcon from './icons/MaterialIcon'

export default function CategoryFilter({ categories, selected, onSelect, showAll = true }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current && selected !== 'all') {
      const selectedElement = scrollRef.current.querySelector(`[data-category="${selected}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ 
          behavior: 'smooth', 
          inline: 'center',
          block: 'nearest'
        })
      }
    }
  }, [selected])

  const allCategories = showAll 
    ? [{ id: 'all', name: 'Tutto', icon: 'view_list', color: '#607d8b' }, ...categories]
    : categories

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex space-x-3 px-4 py-4 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allCategories.map((category, index) => (
          <motion.button
            key={category.id}
            data-category={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              selected === category.id
                ? 'text-white shadow-lg'
                : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
            }`}
            style={{
              backgroundColor: selected === category.id ? category.color : undefined,
              boxShadow: selected === category.id ? `0 4px 12px ${category.color}40` : undefined
            }}
          >
            <MaterialIcon name={category.icon} size="18" />
            <span className="whitespace-nowrap text-sm font-medium">
              {category.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Gradient Fade Effects */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
    </div>
  )
}
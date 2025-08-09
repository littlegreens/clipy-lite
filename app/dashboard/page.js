'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ContentCard from '../../components/ContentCard'
import CategoryFilter from '../../components/CategoryFilter'
import CreateContentModal from '../../components/CreateContentModal'
import MaterialIcon from '../../components/icons/MaterialIcon'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('clipy-user')
    if (!userData) {
      router.push('/')
      return
    }

    const parsedData = JSON.parse(userData)
    console.log('Dati utente caricati:', parsedData)
    setUser(parsedData.user || parsedData)
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/categories')
      ])
      
      const itemsData = await itemsRes.json()
      const categoriesData = await categoriesRes.json()
      
      setItems(itemsData.items || [])
      setCategories(categoriesData.categories || [])
    } catch (error) {
      console.error('Errore loading dati:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtra items per categoria e ricerca
  let filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory)
  
  // Applica filtro di ricerca
  if (searchQuery.trim()) {
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Separa favoriti da normali
  const favoriteItems = filteredItems.filter(item => item.favorite)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
  const normalItems = filteredItems.filter(item => !item.favorite)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))

  const handleLogout = () => {
    localStorage.removeItem('clipy-user')
    router.push('/')
  }

  const handleCreateContent = async (newItem) => {
    try {

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          userId: user.id
        })
      })

      if (response.ok) {
        await loadData()
        setShowCreateModal(false)
      } else {
        const errorData = await response.json()
        console.error('Errore API:', errorData)
        throw new Error(errorData.message || 'Errore server')
      }
    } catch (error) {
      console.error('Errore creazione contenuto:', error)
      throw error // Rilancia l'errore per il modal
    }
  }

  const handleToggleFavorite = async (itemId) => {
    try {
      await fetch(`/api/items/${itemId}/favorite`, {
        method: 'POST'
      })
      await loadData()
    } catch (error) {
      console.error('Errore toggle favorite:', error)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Eliminare questo contenuto?')) {
      try {
        await fetch(`/api/items/${itemId}`, {
          method: 'DELETE'
        })
        await loadData()
      } catch (error) {
        console.error('Errore eliminazione:', error)
      }
    }
  }

  const handleEditItem = async (itemId, updatedData) => {
    try {

      await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      await loadData()
    } catch (error) {
      console.error('Errore modifica:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-16 flex items-center justify-center mb-6 mx-auto">
            <img src="/clipy.svg" alt="Clipy" className="w-24 h-12 object-contain animate-pulse" />
          </div>
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header Material Design */}
      <div className="bg-primary-500 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-24 h-12 flex items-center justify-center">
                <img src="/clipy.svg" alt="Clipy" className="w-20 h-10 object-contain filter brightness-0 invert" />
              </div>
              <p className="text-primary-100 text-sm mt-1">Ciao {user?.name}!</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <MaterialIcon name="search" size="20" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <MaterialIcon name="logout" size="20" />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          {showSearch && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
              <div className="relative bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <input
                  type="text"
                  placeholder="Cerca contenuti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-primary-100 border-0 rounded-xl px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-white/40"
                  autoFocus
                />
                <MaterialIcon 
                  name="search" 
                  size="20" 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-100" 
                />
                <button
                  onClick={() => {
                    setShowSearch(false)
                    setSearchQuery('')
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <MaterialIcon name="close" size="18" className="text-primary-100" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className={`sticky ${showSearch ? 'top-32' : 'top-20'} z-30 bg-white shadow-sm border-b border-surface-200`}>
        <CategoryFilter
          categories={categories.filter(category => 
            items.some(item => item.category === category.id)
          )}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Sezione Preferiti */}
        {favoriteItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 mb-4">
              <MaterialIcon name="star" size="20" className="text-yellow-600" />
              <h2 className="text-lg font-medium text-surface-800">Preferiti</h2>
              <div className="h-px bg-gradient-to-r from-yellow-200 to-transparent flex-1 ml-3"></div>
            </div>
            
            <div className="space-y-4">
              {favoriteItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ContentCard
                    item={item}
                    categories={categories}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteItem}
                    onEdit={handleEditItem}
                    user={user}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sezione Contenuti Normali */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <MaterialIcon 
              name={selectedCategory === 'all' ? 'view_list' : categories.find(c => c.id === selectedCategory)?.icon}
              size="20"
              className="text-surface-600"
            />
            <h2 className="text-lg font-medium text-surface-800">
              {selectedCategory === 'all' ? 'Tutti i contenuti' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="h-px bg-gradient-to-r from-surface-200 to-transparent flex-1 ml-3"></div>
          </div>

          {normalItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MaterialIcon name="add_circle_outline" size="32" className="text-surface-400" />
              </div>
              <p className="text-surface-600 text-lg font-medium">Nessun contenuto</p>
              <p className="text-surface-400 text-sm">Aggiungi il primo contenuto!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {normalItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <ContentCard
                      item={item}
                      categories={categories}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDeleteItem}
                      onEdit={handleEditItem}
                      user={user}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        onClick={() => setShowCreateModal(true)}
        className="md-fab fixed bottom-6 right-6 z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MaterialIcon name="add" size="24" />
      </motion.button>

      {/* Create Content Modal */}
      <CreateContentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateContent}
        categories={categories}
      />
    </div>
  )
}
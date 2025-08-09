import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Helper per leggere file JSON
export async function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Errore lettura ${filename}:`, error)
    return null
  }
}

// Helper per scrivere file JSON
export async function writeJsonFile(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error(`Errore scrittura ${filename}:`, error)
    return false
  }
}

// Genera ID unico
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Verifica credenziali utente
export async function verifyUser(username, password) {
  const usersData = await readJsonFile('users.json')
  if (!usersData) return null

  const user = usersData.users.find(u => 
    (u.name === username || u.email === username) && u.password === password
  )
  
  if (user) {
    // Non restituire la password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  
  return null
}

// Ottieni tutti gli items
export async function getItems() {
  const itemsData = await readJsonFile('items.json')
  return itemsData?.items || []
}

// Aggiungi nuovo item
export async function addItem(itemData) {
  const itemsData = await readJsonFile('items.json') || { items: [] }
  
  const newItem = {
    id: generateId(),
    ...itemData,
    createdAt: new Date().toISOString(),
    completed: false,
    favorite: false,
    order: itemsData.items.length
  }
  
  itemsData.items.push(newItem)
  
  const success = await writeJsonFile('items.json', itemsData)
  return success ? newItem : null
}

// Aggiorna item
export async function updateItem(itemId, updates) {
  const itemsData = await readJsonFile('items.json')
  if (!itemsData) return null
  
  const itemIndex = itemsData.items.findIndex(item => item.id === itemId)
  if (itemIndex === -1) return null
  
  itemsData.items[itemIndex] = {
    ...itemsData.items[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  const success = await writeJsonFile('items.json', itemsData)
  return success ? itemsData.items[itemIndex] : null
}

// Elimina item
export async function deleteItem(itemId) {
  const itemsData = await readJsonFile('items.json')
  if (!itemsData) return false
  
  const initialLength = itemsData.items.length
  itemsData.items = itemsData.items.filter(item => item.id !== itemId)
  
  if (itemsData.items.length === initialLength) return false
  
  return await writeJsonFile('items.json', itemsData)
}

// Toggle favorite
export async function toggleFavorite(itemId) {
  const itemsData = await readJsonFile('items.json')
  if (!itemsData) return null
  
  const item = itemsData.items.find(item => item.id === itemId)
  if (!item) return null
  
  item.favorite = !item.favorite
  item.updatedAt = new Date().toISOString()
  
  const success = await writeJsonFile('items.json', itemsData)
  return success ? item : null
}

// Toggle completato
export async function toggleComplete(itemId) {
  const itemsData = await readJsonFile('items.json')
  if (!itemsData) return null
  
  const item = itemsData.items.find(item => item.id === itemId)
  if (!item) return null
  
  item.completed = !item.completed
  item.completedAt = item.completed ? new Date().toISOString() : null
  item.updatedAt = new Date().toISOString()
  
  const success = await writeJsonFile('items.json', itemsData)
  return success ? item : null
}

// Ottieni categorie
export async function getCategories() {
  const categoriesData = await readJsonFile('categories.json')
  return categoriesData?.categories || []
}

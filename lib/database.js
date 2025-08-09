import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'clipy.db')
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

// Assicurati che le cartelle esistano
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Database SQLite inizializzato
const db = new Database(dbPath)

// Abilita WAL mode per migliori performance
db.pragma('journal_mode = WAL')

// Crea le tabelle se non esistono
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    user_id TEXT NOT NULL,
    favorite INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (category) REFERENCES categories (id)
  );

  CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
  CREATE INDEX IF NOT EXISTS idx_items_user ON items(user_id);
  CREATE INDEX IF NOT EXISTS idx_items_favorite ON items(favorite);
  CREATE INDEX IF NOT EXISTS idx_items_order ON items(order_index);
`)

// Inserisci utenti predefiniti se non esistono
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, email, name, password, avatar, color)
  VALUES (?, ?, ?, ?, ?, ?)
`)

insertUser.run('user1', 'gab.verdini@gmail.com', 'Mimmo', '123456789', '👤', '#0ea5e9')
insertUser.run('user2', 'elisa.dadduzio@gmail.com', 'Mimmi', '123456789', '💕', '#ec4899')

// Inserisci categorie predefinite se non esistono
const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (id, name, icon, color)
  VALUES (?, ?, ?, ?)
`)

const categories = [
  ['shopping', 'Spesa', 'shopping_cart', '#4caf50'],
  ['travel', 'Viaggi', 'flight', '#2196f3'],
  ['home', 'Casa', 'home', '#ff9800'],
  ['gifts', 'Regali', 'card_giftcard', '#e91e63'],
  ['entertainment', 'Intrattenimento', 'movie', '#9c27b0'],
  ['food', 'Ristoranti', 'restaurant', '#f44336'],
  ['sports', 'Sport', 'sports_esports', '#00bcd4'],
  ['books', 'Libri', 'menu_book', '#795548'],
  ['health', 'Salute', 'local_hospital', '#4caf50'],
  ['fitness', 'Fitness', 'fitness_center', '#ff5722'],
  ['work', 'Lavoro', 'work', '#607d8b'],
  ['ideas', 'Idee', 'lightbulb', '#ffeb3b']
]

categories.forEach(([id, name, icon, color]) => {
  insertCategory.run(id, name, icon, color)
})

// Funzioni del database
export const dbQueries = {
  // Users
  getUserByCredentials: db.prepare(`
    SELECT id, email, name, avatar, color 
    FROM users 
    WHERE (name = ? OR email = ?) AND password = ?
  `),

  // Categories  
  getAllCategories: db.prepare(`
    SELECT * FROM categories ORDER BY name
  `),

  // Items
  getAllItems: db.prepare(`
    SELECT i.*, u.name as user_name, u.color as user_color,
           i.created_at,
           i.updated_at
    FROM items i
    JOIN users u ON i.user_id = u.id
    ORDER BY i.favorite DESC, i.order_index ASC, i.created_at DESC
  `),

  getItemById: db.prepare(`
    SELECT i.*, u.name as user_name, u.color as user_color,
           i.created_at,
           i.updated_at
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.id = ?
  `),

  insertItem: db.prepare(`
    INSERT INTO items (id, title, content, category, user_id, favorite, completed, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  updateItem: db.prepare(`
    UPDATE items 
    SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  deleteItem: db.prepare(`
    DELETE FROM items WHERE id = ?
  `),

  toggleFavorite: db.prepare(`
    UPDATE items 
    SET favorite = 1 - favorite, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  toggleComplete: db.prepare(`
    UPDATE items 
    SET completed = 1 - completed, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
}

// Genera ID unico
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Salva immagine come file e restituisce il path
export function saveImageFile(dataUrl, itemId) {
  try {
    // Estrai i dati base64
    const matches = dataUrl.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/)
    if (!matches) return null
    
    const [, extension, base64Data] = matches
    const filename = `${itemId}_${Date.now()}.${extension === 'jpeg' ? 'jpg' : extension}`
    const filepath = path.join(uploadsDir, filename)
    
    // Salva il file
    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(filepath, buffer)
    
    // Restituisci il path API per servire l'immagine
    return `/api/uploads/${filename}`
  } catch (error) {
    console.error('Errore salvando immagine:', error)
    return null
  }
}

// Pulisci immagini orfane quando elimini un item
export function cleanupItemImages(content) {
  try {
    // Trova tutti i path delle immagini nel contenuto (sia /uploads/ che /api/uploads/)
    const imgMatches = content.match(/src="\/(?:api\/)?uploads\/[^"]+"/g)
    if (imgMatches) {
      imgMatches.forEach(match => {
        const imgPath = match.replace(/src="|"/g, '')
        // Rimuovi /api/ se presente per ottenere il path fisico
        const physicalPath = imgPath.replace('/api/uploads/', '/uploads/')
        const fullPath = path.join(process.cwd(), 'public', physicalPath)
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
        }
      })
    }
  } catch (error) {
    console.error('Errore pulendo immagini:', error)
  }
}

export default db

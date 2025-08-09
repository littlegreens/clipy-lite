# 📎 Clipy Lite

**Ultra-semplice app per condividere cose in coppia ❤️**

Bella, veloce, touch-first. Perfetta per te e la tua compagna!

## 🚀 Avvio Rapido

```bash
# Installa dipendenze
npm install

# Avvia in sviluppo
npm run dev

# Apri http://localhost:3001
```

## 🔧 Configurazione

### 1. **Modifica Utenti**
Edita `data/users.json` con le vostre credenziali:

```json
{
  "users": [
    {
      "id": "user1",
      "email": "tua@email.com", 
      "password": "tuapassword",
      "name": "Il Tuo Nome",
      "avatar": "👤",
      "color": "#0ea5e9"
    },
    {
      "id": "user2",
      "email": "sua@email.com",
      "password": "suapassword", 
      "name": "Nome Compagna",
      "avatar": "💕",
      "color": "#ec4899"
    }
  ]
}
```

### 2. **Personalizza Categorie** (opzionale)
Modifica `data/categories.json` per aggiungere/rimuovere categorie.

## 🎯 Funzionalità

### ✨ **Gesture Touch**
- **Swipe destro** → Completa item
- **Swipe sinistro** → Elimina item  
- **Long press** → Menu azioni
- **Tap** → Seleziona categoria

### 🌟 **Preferiti**
- Stella per aggiungere ai preferiti
- Sezione dedicata sempre in alto
- Drag & drop per riordinare

### 🎨 **12 Categorie Predefinite**
🛒 Spesa • ✈️ Viaggi • 🏠 Casa • 🎁 Regali • 🎬 Film & Serie • 🍽️ Ristoranti • 🎯 Attività • 📚 Libri • 💊 Salute • 🏃‍♂️ Sport • 💼 Lavoro • ✨ Sogni

### 📱 **PWA Ready**
- Installabile come app
- Funziona offline
- Push notifications (future)

## 🗂️ Struttura

```
clipy-lite/
├── app/                    # Next.js App Router
│   ├── page.js            # Login
│   ├── dashboard/page.js  # App principale
│   └── api/               # API routes
├── components/             # Componenti React
│   ├── ItemCard.js        # Card con gesture
│   ├── CategoryFilter.js  # Filtro categorie
│   └── AddItemModal.js    # Modal aggiunta
├── data/                   # Dati JSON
│   ├── users.json         # Utenti (modifica qui!)
│   ├── categories.json    # Categorie
│   └── items.json         # Items condivisi
└── lib/                    # Utilities
    └── data.js            # CRUD functions
```

## 🎨 Design System

- **Colori**: Clipy Blue (#0ea5e9) + categorie colorate
- **Font**: Inter (Google Fonts)
- **Animazioni**: Framer Motion + gesture smooth
- **Shadows**: Soft, Material-inspired
- **Responsive**: Mobile-first, desktop-friendly

## 🚀 Deploy

### Vercel (Raccomandato)
```bash
npm run build
# Deploy su Vercel
```

### Manuale
```bash
npm run build
npm run start
```

## 💡 Tips

1. **Modifica `data/users.json`** con le vostre email/password
2. **Swipe** per azioni rapide sui task
3. **Stella** per mettere in preferiti
4. **Long press** per più opzioni
5. **Installa come app** dal browser

## 🛠️ Tech Stack

- **Next.js 15** - Framework React
- **Tailwind CSS** - Styling
- **Framer Motion** - Animazioni
- **@use-gesture/react** - Gesture touch
- **JSON Files** - Database semplice

---

**Fatto con ❤️ per condividere momenti speciali insieme**

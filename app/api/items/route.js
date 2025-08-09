import { dbQueries, generateId, saveImageFile } from '../../../lib/database'

// Funzione per convertire le date SQLite in formato JavaScript
function formatItemDates(item) {
  return {
    ...item,
    createdAt: item.created_at ? new Date(item.created_at).toISOString() : null,
    updatedAt: item.updated_at ? new Date(item.updated_at).toISOString() : null,
  }
}

export async function GET() {
  try {
    const rawItems = dbQueries.getAllItems.all()
    const items = rawItems.map(formatItemDates)
    return Response.json({ items })
  } catch (error) {
    console.error('Errore get items:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const itemData = await request.json()
    
    if (!itemData.title || !itemData.category) {
      return Response.json(
        { message: 'Titolo e categoria richiesti' }, 
        { status: 400 }
      )
    }
    
    const itemId = generateId()
    
    // Processa le immagini nel contenuto
    let processedContent = itemData.content || ''
    const imgMatches = processedContent.match(/src="data:image\/[^"]+"/g)
    
    if (imgMatches) {
      for (const match of imgMatches) {
        const dataUrl = match.replace(/src="|"/g, '')
        const imagePath = saveImageFile(dataUrl, itemId)
        if (imagePath) {
          processedContent = processedContent.replace(dataUrl, imagePath)
        }
      }
    }
    
    // Salva nel database
    dbQueries.insertItem.run(
      itemId,
      itemData.title,
      processedContent,
      itemData.category,
      itemData.userId || 'user1', // Default user
      0, // favorite (0 = false)
      0, // completed (0 = false)
      0  // order_index
    )
    
    // Restituisci l'item creato
    const rawItem = dbQueries.getItemById.get(itemId)
    const newItem = formatItemDates(rawItem)
    return Response.json(newItem, { status: 201 })
    
  } catch (error) {
    console.error('Errore add item:', error)
    return Response.json(
      { message: 'Errore server: ' + error.message }, 
      { status: 500 }
    )
  }
}
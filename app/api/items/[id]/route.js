import { dbQueries, saveImageFile, cleanupItemImages } from '../../../../lib/database'

// Funzione per convertire le date SQLite in formato JavaScript
function formatItemDates(item) {
  return {
    ...item,
    createdAt: item.created_at ? new Date(item.created_at).toISOString() : null,
    updatedAt: item.updated_at ? new Date(item.updated_at).toISOString() : null,
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const rawItem = dbQueries.getItemById.get(id)
    
    if (!rawItem) {
      return Response.json(
        { message: 'Item non trovato' }, 
        { status: 404 }
      )
    }
    
    const item = formatItemDates(rawItem)
    return Response.json(item)
    
  } catch (error) {
    console.error('Errore get item:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const { title, content, category } = await request.json()
    
    if (!title || !category) {
      return Response.json(
        { message: 'Titolo e categoria richiesti' }, 
        { status: 400 }
      )
    }
    
    // Ottieni l'item esistente per pulire le vecchie immagini
    const existingItem = dbQueries.getItemById.get(id)
    if (!existingItem) {
      return Response.json(
        { message: 'Item non trovato' }, 
        { status: 404 }
      )
    }
    
    // Processa le nuove immagini nel contenuto
    let processedContent = content || ''
    const imgMatches = processedContent.match(/src="data:image\/[^"]+"/g)
    
    if (imgMatches) {
      for (const match of imgMatches) {
        const dataUrl = match.replace(/src="|"/g, '')
        const imagePath = saveImageFile(dataUrl, id)
        if (imagePath) {
          processedContent = processedContent.replace(dataUrl, imagePath)
        }
      }
    }
    
    // Pulisci le vecchie immagini che non sono più nel contenuto
    if (existingItem.content !== processedContent) {
      cleanupItemImages(existingItem.content)
    }
    
    // Aggiorna nel database
    dbQueries.updateItem.run(title, processedContent, category, id)
    
    // Restituisci l'item aggiornato
    const updatedItem = dbQueries.getItemById.get(id)
    return Response.json(updatedItem)
    
  } catch (error) {
    console.error('Errore update item:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    
    // Ottieni l'item per pulire le immagini
    const item = dbQueries.getItemById.get(id)
    if (!item) {
      return Response.json(
        { message: 'Item non trovato' }, 
        { status: 404 }
      )
    }
    
    // Pulisci le immagini associate
    cleanupItemImages(item.content)
    
    // Elimina dal database
    const result = dbQueries.deleteItem.run(id)
    
    if (result.changes === 0) {
      return Response.json(
        { message: 'Item non trovato' }, 
        { status: 404 }
      )
    }
    
    return Response.json({ message: 'Item eliminato' })
    
  } catch (error) {
    console.error('Errore delete item:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}
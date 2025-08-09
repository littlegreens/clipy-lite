import { getItems, updateItem, deleteItem, cleanupItemImages, saveImageFile } from '../../../../lib/data'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const items = await getItems()
    const item = items.find(item => item.id === id)
    
    if (!item) {
      return Response.json(
        { message: 'Item non trovato' }, 
        { status: 404 }
      )
    }

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
    const updates = await request.json()

    // Processa il contenuto per salvare le immagini come file
    let processedContent = updates.content
    
    if (processedContent) {
      // Trova tutte le immagini data URL nel contenuto
      const dataUrlMatches = processedContent.match(/src="data:image\/[^"]+"/g)
      
      if (dataUrlMatches) {
        for (const match of dataUrlMatches) {
          const dataUrl = match.replace(/src="|"/g, '')
          const filePath = saveImageFile(dataUrl, id)
          
          if (filePath) {
            // Sostituisci il data URL con il path del file
            processedContent = processedContent.replace(dataUrl, filePath)
          }
        }
      }
    }

    const updatedItem = await updateItem(id, {
      ...updates,
      content: processedContent
    })

    if (!updatedItem) {
      return Response.json(
        { message: 'Item non trovato' }, 
        { status: 404 }
      )
    }

    return Response.json(updatedItem)
  } catch (error) {
    console.error('Errore aggiornamento item:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    
    // Prima recupera l'item per pulire le immagini
    const items = await getItems()
    const item = items.find(item => item.id === id)
    
    if (item && item.content) {
      cleanupItemImages(item.content)
    }

    const success = await deleteItem(id)

    if (!success) {
      return Response.json(
        { message: 'Item non trovato' }, 
        { status: 404 }
      )
    }

    return Response.json({ message: 'Item eliminato' })
  } catch (error) {
    console.error('Errore eliminazione item:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}
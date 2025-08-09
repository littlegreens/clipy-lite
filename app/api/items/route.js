import { getItems, addItem, saveImageFile } from '../../../lib/data'

export async function GET() {
  try {
    const items = await getItems()
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
        { message: 'Dati mancanti' }, 
        { status: 400 }
      )
    }

    // Processa il contenuto per salvare le immagini come file
    let processedContent = itemData.content
    
    if (processedContent) {
      // Trova tutte le immagini data URL nel contenuto
      const dataUrlMatches = processedContent.match(/src="data:image\/[^"]+"/g)
      
      if (dataUrlMatches) {
        // Genera un ID temporaneo per l'item
        const tempId = Date.now().toString(36) + Math.random().toString(36).substr(2)
        
        for (const match of dataUrlMatches) {
          const dataUrl = match.replace(/src="|"/g, '')
          const filePath = saveImageFile(dataUrl, tempId)
          
          if (filePath) {
            // Sostituisci il data URL con il path del file
            processedContent = processedContent.replace(dataUrl, filePath)
          }
        }
      }
    }

    const newItem = await addItem({
      ...itemData,
      content: processedContent,
      userId: itemData.userId || 'user1'
    })

    if (newItem) {
      return Response.json(newItem, { status: 201 })
    } else {
      return Response.json(
        { message: 'Errore creazione item' }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Errore creazione item:', error)
    return Response.json(
      { message: 'Errore server: ' + error.message }, 
      { status: 500 }
    )
  }
}
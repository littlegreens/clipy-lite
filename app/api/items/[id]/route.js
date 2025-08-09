import { getItems, updateItem, deleteItem } from '../../../../lib/data'

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

    // Su Netlify manteniamo le immagini come Base64 nel JSON
    let processedContent = updates.content

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
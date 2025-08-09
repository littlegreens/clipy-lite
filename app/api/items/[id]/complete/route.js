import { dbQueries } from '../../../../../lib/database'

export async function POST(request, { params }) {
  try {
    const { id } = await params
    
    // Verifica che l'item esista
    const item = dbQueries.getItemById.get(id)
    if (!item) {
      return Response.json(
        { message: 'Item non trovato' }, 
        { status: 404 }
      )
    }
    
    // Toggle complete
    dbQueries.toggleComplete.run(id)
    
    // Restituisci l'item aggiornato
    const updatedItem = dbQueries.getItemById.get(id)
    return Response.json(updatedItem)
    
  } catch (error) {
    console.error('Errore toggle complete:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}
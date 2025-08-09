import { toggleFavorite } from '../../../../../lib/data'

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const item = await toggleFavorite(id)

    if (!item) {
      return Response.json(
        { message: 'Item non trovato' }, 
        { status: 404 }
      )
    }

    return Response.json(item)
  } catch (error) {
    console.error('Errore toggle favorite:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}
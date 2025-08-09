import { dbQueries } from '../../../lib/database'

export async function GET() {
  try {
    const categories = dbQueries.getAllCategories.all()
    return Response.json({ categories })
  } catch (error) {
    console.error('Errore get categories:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}

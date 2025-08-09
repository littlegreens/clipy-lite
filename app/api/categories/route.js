import { getCategories } from '../../../lib/data'

export async function GET() {
  try {
    const categories = await getCategories()
    return Response.json({ categories })
  } catch (error) {
    console.error('Errore get categories:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}
import { verifyUser } from '../../../lib/data'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return Response.json(
        { message: 'Nome e password richiesti' }, 
        { status: 400 }
      )
    }

    const user = await verifyUser(username, password)

    if (!user) {
      return Response.json(
        { message: 'Credenziali non valide' }, 
        { status: 401 }
      )
    }

    return Response.json({ user })
  } catch (error) {
    console.error('Errore login:', error)
    return Response.json(
      { message: 'Errore server' }, 
      { status: 500 }
    )
  }
}
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-static'

export async function GET(request, { params }) {
  try {
    const { filename } = await params
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    // Controlla se il file esiste
    if (!fs.existsSync(filePath)) {
      return new Response('File not found', { status: 404 })
    }
    
    // Leggi il file
    const fileBuffer = fs.readFileSync(filePath)
    
    // Determina il content type
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
    }
    
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache per 1 anno
      },
    })
    
  } catch (error) {
    console.error('Errore serving upload:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

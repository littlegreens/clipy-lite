'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Heading from '@tiptap/extension-heading'
import { useState, useCallback, useEffect } from 'react'
import MaterialIcon from './icons/MaterialIcon'

const MenuBar = ({ editor }) => {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)

  const [showYouTubeInput, setShowYouTubeInput] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  // Controlla se è selezionato un media (immagine o video)
  const hasSelectedMedia = editor?.isActive('image') || editor?.isActive('youtube')

  // Tutti gli hooks PRIMA del return null
  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      const { from, to } = editor.state.selection
      const hasSelection = from !== to
      
      if (hasSelection) {
        // Se c'è testo selezionato, aggiungi il link
        editor.chain().focus().setLink({ href: linkUrl }).run()
      } else {
        // Se non c'è testo selezionato, inserisci l'URL come testo e link
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run()
      }
      
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }, [editor, linkUrl])



  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0]
    if (file && editor) {
      // Ridimensiona l'immagine per ridurre le dimensioni
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new window.Image()
      
      img.onload = () => {
        // Ridimensiona mantenendo le proporzioni, max 800px di larghezza
        const maxWidth = 800
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Disegna l'immagine ridimensionata
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Converti a JPEG con qualità ridotta (0.7 = 70%)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
        editor.chain().focus().setImage({ src: dataUrl }).run()
        
        // Aggiungi un paragrafo vuoto dopo l'immagine per permettere di continuare a scrivere
        setTimeout(() => {
          editor.commands.insertContent('<p></p>')
        }, 100)
        
        setShowImageInput(false)
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }, [editor])

  const addYouTube = useCallback(() => {
    if (youtubeUrl && editor) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: Math.min(480, window.innerWidth - 32),
        height: Math.min(320, (window.innerWidth - 32) * 0.6),
      })
      
      // Aggiungi un paragrafo vuoto dopo il video per permettere di continuare a scrivere
      setTimeout(() => {
        editor.commands.insertContent('<p></p>')
      }, 100)
      
      setYoutubeUrl('')
      setShowYouTubeInput(false)
    }
  }, [editor, youtubeUrl])

  if (!editor) return null

  return (
          <div className="sticky top-0 z-20 border-b border-surface-300 p-2 bg-white shadow-sm -mx-2 px-4" style={{position: '-webkit-sticky'}}>
      {/* Tutti i bottoni su una riga */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bold') 
              ? 'bg-surface-200 font-bold text-surface-900' 
              : 'text-surface-700 hover:bg-surface-100'
          }`}
        >
          <MaterialIcon name="format_bold" size="18" className="text-current" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('italic') 
              ? 'bg-surface-200 font-bold text-surface-900' 
              : 'text-surface-700 hover:bg-surface-100'
          }`}
        >
          <MaterialIcon name="format_italic" size="18" className="text-current" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 1 }) 
              ? 'bg-surface-200 font-bold text-surface-900' 
              : 'text-surface-700 hover:bg-surface-100'
          }`}
        >
          <span className="text-current font-bold text-sm">H1</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-surface-200 font-bold text-surface-900' 
              : 'text-surface-700 hover:bg-surface-100'
          }`}
        >
          <span className="text-current font-bold text-sm">H2</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bulletList') 
              ? 'bg-surface-200 font-bold text-surface-900' 
              : 'text-surface-700 hover:bg-surface-100'
          }`}
        >
          <MaterialIcon name="format_list_bulleted" size="18" className="text-current" />
        </button>
        <button
          onClick={() => {
            setShowLinkInput(!showLinkInput)
            setShowImageInput(false)
            setShowYouTubeInput(false)
          }}
          className={`p-2 rounded transition-colors ${
            showLinkInput 
              ? 'bg-surface-200 font-bold text-surface-900' 
              : 'text-surface-700 hover:bg-surface-100'
          }`}
        >
          <MaterialIcon name="link" size="18" className="text-current" />
        </button>
        <button
          onClick={() => {
            setShowImageInput(!showImageInput)
            setShowLinkInput(false)
            setShowYouTubeInput(false)
          }}
          className={`p-2 rounded transition-colors ${
            showImageInput 
              ? 'bg-surface-200 font-bold text-surface-900' 
              : 'text-surface-700 hover:bg-surface-100'
          }`}
        >
          <MaterialIcon name="image" size="18" className="text-current" />
        </button>
        <button
          onClick={() => {
            setShowYouTubeInput(!showYouTubeInput)
            setShowLinkInput(false)
            setShowImageInput(false)
          }}
          className={`p-2 rounded transition-colors ${
            showYouTubeInput 
              ? 'bg-surface-200 font-bold text-surface-900' 
              : 'text-surface-700 hover:bg-surface-100'
          }`}
        >
          <MaterialIcon name="smart_display" size="18" className="text-current" />
        </button>
        
        {/* Bottone cancellazione per media selezionati */}
        {hasSelectedMedia && (
          <button
            onClick={() => editor.commands.deleteSelection()}
            className="p-2 rounded transition-colors text-red-600 hover:bg-red-50 ml-2"
            title="Cancella elemento selezionato"
          >
            <MaterialIcon name="delete" size="18" className="text-current" />
          </button>
        )}
      </div>

      {/* Input per Link */}
      {showLinkInput && (
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            placeholder="https://esempio.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="md-text-field flex-1 text-sm py-2"
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
          />
          <button 
            onClick={addLink} 
            className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
          >
            <MaterialIcon name="add" size="16" />
          </button>
        </div>
      )}

      {/* Input per Immagine */}
      {showImageInput && (
        <div className="mt-2">
          <label className="bg-primary-500 text-white px-4 py-3 rounded-lg w-full cursor-pointer text-center hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <MaterialIcon name="image" size="16" />
            <span>Carica dal telefono</span>
          </label>
        </div>
      )}

      {/* Input per YouTube */}
      {showYouTubeInput && (
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="md-text-field flex-1 text-sm py-2"
            onKeyDown={(e) => e.key === 'Enter' && addYouTube()}
          />
          <button 
            onClick={addYouTube} 
            className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
          >
            <MaterialIcon name="add" size="16" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function RichEditor({ content, onChange, placeholder = "Scrivi qui..." }) {
  const [hasLoadedContent, setHasLoadedContent] = useState(false)
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disabilita heading in StarterKit per usare la nostra configurazione
      }),
      Heading.configure({
        levels: [1, 2],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'w-full h-auto rounded-lg cursor-pointer',
          style: 'margin-top: 24px; margin-bottom: 0; width: 100% !important; max-width: 100% !important;',
        },
        allowBase64: true,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-500 underline',
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: false,
        modestBranding: false,
        HTMLAttributes: {
          class: 'w-full max-w-md mx-auto block rounded-lg cursor-pointer',
          style: 'margin-top: 24px; margin-bottom: 0; height: 200px;',
          frameborder: '0',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: 'true',
        },
      }),
    ],
    content: '', // Inizia vuoto
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        placeholder: placeholder,
      },
    },
  })

  // Carica il contenuto SOLO UNA VOLTA quando l'editor è pronto
  useEffect(() => {
    if (editor && content && !hasLoadedContent) {
      editor.commands.setContent(content, false)
      setHasLoadedContent(true)
    }
  }, [editor, content, hasLoadedContent])
  
  // Reset quando il contenuto cambia dall'esterno (nuovo item)
  useEffect(() => {
    setHasLoadedContent(false)
  }, [content])



  return (
    <div className="bg-white relative">
      <MenuBar editor={editor} />
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="min-h-[200px] pt-2"
        />
      </div>
    </div>
  )
}

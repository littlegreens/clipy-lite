import './globals.css'

export const metadata = {
  title: 'Clipy Lite - Content Sharing',
  description: 'Rich content sharing system for couples with Material Design',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#1976d2',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#1976d2" />
        <link rel="icon" href="/clipy.svg" />
      </head>
      <body className="h-full bg-surface-50">
        <div className="min-h-full mobile-container">
          {children}
        </div>
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import { getSiteSettings } from '../lib/getSiteSettings'
import { FONT_MAP } from '../globals/SiteSettings'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Offhand',
  description: 'A personal creative publication.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const theme = settings?.theme || 'vintage'
  const fontKey = settings?.fontFamily || 'playfair'
  const font = FONT_MAP[fontKey] || FONT_MAP['system-sans']

  return (
    <html lang="en" data-theme={theme} data-color-scheme="dark">
      <head>
        {font.url && <link rel="preconnect" href="https://fonts.googleapis.com" />}
        {font.url && <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />}
        {font.url && <link href={font.url} rel="stylesheet" />}
        <style dangerouslySetInnerHTML={{ __html: `body { font-family: ${font.family}; }` }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.setAttribute('data-theme', '${theme}');
                var saved = localStorage.getItem('theme-mode');
                if (saved === 'light') {
                  document.documentElement.setAttribute('data-color-scheme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

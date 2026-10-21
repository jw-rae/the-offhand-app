import type { Metadata } from 'next'
import { getSiteSettings } from '../../lib/getSiteSettings'
import { FONT_MAP } from '../../globals/SiteSettings'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import '../globals.css'
import './frontend.css'
import styles from './layout.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.title || 'The Offhand'
  return {
    title: `${title} — A Personal Creative Publication`,
    description: 'A personal creative publication.',
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const theme = settings?.theme || 'vintage'
  const fontKey = settings?.fontFamily || 'playfair'
  const font = FONT_MAP[fontKey] || FONT_MAP['system-sans']

  return (
    <html lang="en" data-theme={theme} data-color-scheme="dark" suppressHydrationWarning>
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
      <body>
        <div className={styles.layout}>
          <Header title={settings?.title || 'The Offhand'} logo={typeof settings?.logo === 'object' && settings?.logo ? settings.logo : null} />
          <main className={styles.main}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

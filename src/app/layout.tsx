import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Offhand',
  description: 'A personal creative publication.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="warm" data-color-scheme="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.setAttribute('data-theme', 'warm');
                var saved = localStorage.getItem('theme-mode');
                if (saved === 'dark') {
                  document.documentElement.setAttribute('data-color-scheme', 'dark');
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

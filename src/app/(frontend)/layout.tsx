import type { Metadata } from 'next'
import { getSiteSettings } from '../../lib/getSiteSettings'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
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

  return (
    <div className={styles.layout}>
      <Header title={settings?.title || 'The Offhand'} logo={typeof settings?.logo === 'object' && settings?.logo ? settings.logo : null} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import styles from './layout.module.css'

export const metadata: Metadata = {
  title: 'The Offhand — A Personal Creative Publication',
  description: 'A personal creative publication.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

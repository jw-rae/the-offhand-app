'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

export function Header() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.brand}>
            THE OFFHAND
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link
            href="/posts"
            className={`${styles.navLink} ${pathname === '/posts' ? styles.active : ''}`}
          >
            Work
          </Link>
          <div className={styles.controls}>
            <button
              className={styles.themeToggle}
              onClick={() => {
                const isDark = document.documentElement.getAttribute('data-color-scheme') === 'dark'
                if (isDark) {
                  document.documentElement.setAttribute('data-color-scheme', 'light')
                  localStorage.setItem('theme-mode', 'light')
                } else {
                  document.documentElement.setAttribute('data-color-scheme', 'dark')
                  localStorage.setItem('theme-mode', 'dark')
                }
              }}
              aria-label="Toggle dark/light mode"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

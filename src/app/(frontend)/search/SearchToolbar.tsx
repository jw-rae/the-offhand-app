'use client'

import React, { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'

/* eslint-disable @typescript-eslint/no-explicit-any */
export function SearchToolbar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = searchParams.get('q') || ''
  const dateFrom = searchParams.get('from') || ''
  const dateTo = searchParams.get('to') || ''
  const hasFilters = !!(query || dateFrom || dateTo)

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    router.push(`/search?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by title or description..."
          defaultValue={query}
          onChange={(e) => {
            const val = e.target.value
            clearTimeout((e.target as any)._t);
            (e.target as any)._t = setTimeout(() => updateParams({ q: val }), 300)
          }}
        />
        {hasFilters && (
          <a href="/search" className={styles.clearAll}>Clear all</a>
        )}
      </div>

      <div className={styles.dateRow}>
        <label className={styles.dateLabel}>
          <span>From</span>
          <input
            className={styles.dateInput}
            type="date"
            defaultValue={dateFrom}
            onChange={(e) => updateParams({ from: e.target.value })}
          />
        </label>
        <label className={styles.dateLabel}>
          <span>To</span>
          <input
            className={styles.dateInput}
            type="date"
            defaultValue={dateTo}
            onChange={(e) => updateParams({ to: e.target.value })}
          />
        </label>
      </div>

    </div>
  )
}

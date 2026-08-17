<template>
  <div class="page-catalog">

    <div class="page-header">
      <p class="page-eyebrow">Work</p>
      <h1 class="page-title">Catalog</h1>
    </div>

    <!-- Tag filter -->
    <div v-if="allGenres.length" class="filter-bar" role="group" aria-label="Filter by genre">
      <button
        class="filter-chip"
        :class="{ active: !activeGenre }"
        @click="activeGenre = null"
      >All</button>
      <button
        v-for="genre in allGenres"
        :key="genre"
        class="filter-chip"
        :class="{ active: activeGenre === genre }"
        @click="activeGenre = genre"
      >{{ genre }}</button>
    </div>

    <ol v-if="filteredReleases?.length" class="releases-list">
      <li v-for="r in filteredReleases" :key="r.slug">
        <NuxtLink :to="releasePath(r)" class="release-row">

          <!-- Thumbnail / placeholder -->
          <div
            class="row-thumb"
            :style="r.videoId ? { backgroundImage: `url(${thumbUrl(r.videoId, 'mq')})` } : {}"
            role="img"
            :aria-label="r.title"
          >
            <div class="row-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="7,5 21,12 7,19"/></svg>
            </div>
          </div>

          <div class="row-content">
            <div class="row-meta">
              <time class="row-date">{{ formatDate(r.date) }}</time>
              <span v-if="r.genre" class="row-genre">{{ r.genre }}</span>
              <span v-if="r.bpm" class="row-bpm">{{ r.bpm }} BPM</span>
            </div>
            <h2 class="row-title">{{ r.title }}</h2>
            <p class="row-excerpt">{{ r.excerpt }}</p>
          </div>

          <span class="row-cta" aria-hidden="true">Listen &rarr;</span>

        </NuxtLink>
      </li>
    </ol>

    <p v-else class="empty-msg">No releases yet. Check back soon.</p>

  </div>
</template>

<script setup>
useHead({ title: 'Catalog — Ezabad' })
const { formatDate, thumbUrl, releasePath } = useReleases()

const { data: allReleases } = await useAsyncData('releases-all', () =>
  queryCollection('releases').order('date', 'DESC').all()
)

const activeGenre = ref(null)

const allGenres = computed(() => {
  const genres = new Set()
  allReleases.value?.forEach(r => { if (r.genre) genres.add(r.genre) })
  return [...genres].sort()
})

const filteredReleases = computed(() =>
  activeGenre.value
    ? allReleases.value?.filter(r => r.genre === activeGenre.value)
    : allReleases.value
)
</script>

<style scoped>
.page-catalog {
  max-width: 860px;
  margin: 0 auto;
  padding: var(--space-lg) var(--space-lg) var(--space-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ── Page header ── */
.page-header {
  text-align: center;
  padding-top: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-eyebrow {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.page-title {
  margin: 0;
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  font-weight: var(--font-weight-black, 900);
  letter-spacing: -0.03em;
  line-height: 1.05;
  background: linear-gradient(110deg, var(--accent), var(--color-text-primary) 45%, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ── Genre filter chips ── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.filter-chip {
  padding: 4px 14px;
  border-radius: var(--border-radius-full, 999px);
  border: 1px solid var(--color-border-primary);
  background: transparent;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: border-color 0.18s, color 0.18s, background 0.18s;
}

.filter-chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

/* ── List ── */
.releases-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.releases-list li {
  border-bottom: 1px solid var(--color-border-primary);
}

.releases-list li:first-child {
  border-top: 1px solid var(--color-border-primary);
}

/* ── Row ── */
.release-row {
  display: grid;
  grid-template-columns: 160px 1fr auto;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-md) 0;
  text-decoration: none;
  color: inherit;
  border-radius: var(--border-radius-sm);
  transition: background 0.15s;
}

.release-row:hover {
  background: color-mix(in srgb, var(--accent) 4%, transparent);
}

.release-row:hover .row-cta {
  color: var(--accent);
  opacity: 1;
}

.release-row:hover .row-title {
  color: var(--accent);
}

.release-row:hover .row-play {
  opacity: 1;
}

/* ── Thumbnail ── */
.row-thumb {
  position: relative;
  width: 160px;
  aspect-ratio: 16 / 9;
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface-secondary);
  background-size: cover;
  background-position: center;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, #000 30%, transparent);
  opacity: 0;
  transition: opacity 0.2s;
}

.row-play svg {
  width: 28px;
  height: 28px;
  color: #fff;
  filter: drop-shadow(0 1px 4px rgba(0,0,0,0.5));
}

/* ── Row content ── */
.row-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
}

.row-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.row-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.row-genre,
.row-bpm {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  padding: 1px 7px;
  border-radius: var(--border-radius-sm);
}

.row-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
  transition: color 0.18s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-excerpt {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── CTA arrow ── */
.row-cta {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  white-space: nowrap;
  opacity: 0.5;
  transition: color 0.18s, opacity 0.18s;
  flex-shrink: 0;
}

.empty-msg {
  text-align: center;
  color: var(--color-text-tertiary);
  padding: var(--space-3xl) 0;
  font-size: var(--font-size-base);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .release-row {
    grid-template-columns: 100px 1fr;
  }

  .row-cta {
    display: none;
  }

  .row-thumb {
    width: 100px;
  }
}
</style>

<template>
  <div class="page-home">
    <div class="home-container">

      <!-- ── Primary content column ───────────────────────── -->
      <main v-if="latest" class="primary-column">
        <header class="release-header">
          <p class="release-eyebrow">
            <time :datetime="today">{{ formattedDate }}</time>
            <span v-if="latest.genre" class="genre-badge">{{ latest.genre }}</span>
            <span v-if="latest.bpm" class="bpm-badge">{{ latest.bpm }} BPM</span>
          </p>
          <h1 class="release-title">{{ latest.title }}</h1>
          <p class="release-subtitle">{{ latest.excerpt }}</p>
        </header>

        <YoutubeEmbed
          class="release-video"
          :video-id="latest.videoId"
          :title="latest.title"
        />

        <!-- Markdown body -->
        <section v-if="latest.body" class="notes-block" aria-label="Production notes">
          <h2 class="notes-title">Production Notes</h2>
          <ContentRenderer class="notes-body" :value="latest" />
        </section>
      </main>

      <!-- fallback when no releases are published yet -->
      <main v-else class="primary-column">
        <header class="release-header">
          <p class="release-eyebrow">
            <time :datetime="today">{{ formattedDate }}</time>
          </p>
          <h1 class="release-title">New music dropping soon.</h1>
          <p class="release-subtitle">Ezabad is cooking. Sign up for the newsletter to hear it first.</p>
        </header>
        <div class="empty-stage" aria-label="No releases yet">
          <span class="empty-icon" aria-hidden="true">♬</span>
          <NuxtLink to="/subscribe" class="empty-cta">Get early access →</NuxtLink>
        </div>
      </main>

      <!-- ── Sidebar column ───────────────────────────────── -->
      <aside class="sidebar-column">
        <BeatCallout />
        <Suspense>
          <RecentReleases />
        </Suspense>
      </aside>

    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Ezabad — Music Production' })

const { data: latest } = await useAsyncData('home-latest', () =>
  queryCollection('releases').order('date', 'DESC').first()
)

const now = new Date()
const today = now.toISOString().slice(0, 10)
const formattedDate = now.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
})
</script>

<style scoped>
.page-home {
  padding: var(--space-2xl) var(--space-lg);
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-2xl);
  align-items: start;
}

/* ── Primary column ─────────────────────────────────────── */
.primary-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  min-width: 0;
}

.release-eyebrow {
  margin: 0 0 var(--space-xs) 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.genre-badge,
.bpm-badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
  text-transform: none;
  letter-spacing: 0.02em;
}

.release-header {
  display: flex;
  flex-direction: column;
}

.release-title {
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  background: linear-gradient(135deg, var(--color-text-primary) 20%, var(--accent) 60%, var(--color-text-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.release-subtitle {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.release-video {
  width: 100%;
}

/* ── Production notes block ──────────────────────────────── */
.notes-block {
  background: color-mix(in srgb, var(--accent) 5%, var(--color-surface-secondary));
  border-left: 3px solid var(--accent);
  border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
  padding: var(--space-lg);
}

.notes-title {
  margin: 0 0 var(--space-md) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.notes-body {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.notes-body :deep(p) {
  margin: 0 0 var(--space-md) 0;
}
.notes-body :deep(p:last-child) {
  margin-bottom: 0;
}
.notes-body :deep(h2),
.notes-body :deep(h3) {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: var(--space-lg) 0 var(--space-sm) 0;
}
.notes-body :deep(ul), .notes-body :deep(ol) {
  padding-left: var(--space-lg);
  margin: 0 0 var(--space-md) 0;
}

/* ── Empty state ── */
.empty-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-3xl) 0;
  border: 2px dashed var(--color-border-primary);
  border-radius: var(--border-radius-xl);
}

.empty-icon {
  font-size: 4rem;
  color: var(--color-text-tertiary);
  line-height: 1;
}

.empty-cta {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  text-decoration: none;
  cursor: pointer;
  transition: opacity var(--duration-200) var(--ease-out);
}

.empty-cta:hover {
  opacity: 0.75;
}

/* ── Sidebar ─────────────────────────────────────────────── */
.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  position: sticky;
  top: calc(var(--space-2xl) + var(--space-lg));
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 860px) {
  .home-container {
    grid-template-columns: 1fr;
  }

  .sidebar-column {
    position: static;
  }
}
</style>

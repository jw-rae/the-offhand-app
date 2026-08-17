<template>
  <div v-if="release" class="page-release">

    <!-- Back nav -->
    <NuxtLink to="/catalog" class="back-link">
      <svg class="back-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Full Catalog
    </NuxtLink>

    <!-- Hero -->
    <header class="release-hero">
      <div class="release-meta">
        <time class="release-date">{{ formatDate(release.date) }}</time>
        <span v-if="release.genre" class="meta-badge">{{ release.genre }}</span>
        <span v-if="release.bpm" class="meta-badge">{{ release.bpm }} BPM</span>
      </div>
      <h1 class="release-title">{{ release.title }}</h1>
      <p class="release-lead">{{ release.excerpt }}</p>
    </header>

    <!-- Video -->
    <div class="release-video">
      <YoutubeEmbed :video-id="release.videoId" :title="release.title" />
    </div>

    <!-- Production notes (Markdown body) -->
    <div v-if="release.body" class="release-body">
      <h2 class="body-label">Production Notes</h2>
      <ContentRenderer class="body-content" :value="release" />
    </div>

    <!-- Tags -->
    <div v-if="release.tags?.length" class="release-tags">
      <span v-for="tag in release.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <!-- More releases -->
    <div v-if="suggestions.length" class="suggestions">
      <div class="sug-divider" aria-hidden="true"></div>
      <h2 class="sug-heading">More releases</h2>
      <div class="sug-grid">
        <NuxtLink
          v-for="s in suggestions"
          :key="s.slug"
          :to="releasePath(s)"
          class="sug-card"
        >
          <div
            class="sug-thumb"
            :style="s.videoId ? { backgroundImage: `url(${thumbUrl(s.videoId, 'mq')})` } : {}"
            role="img"
            :aria-label="s.title"
          >
            <div class="sug-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8,6 20,12 8,18"/></svg>
            </div>
          </div>
          <div class="sug-body">
            <time class="sug-date">{{ formatDate(s.date) }}</time>
            <p class="sug-title">{{ s.title }}</p>
            <span v-if="s.genre" class="sug-genre">{{ s.genre }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>

  </div>

  <!-- Not found fallback -->
  <div v-else class="page-release page-release--404">
    <NuxtLink to="/catalog" class="back-link">
      <svg class="back-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Full Catalog
    </NuxtLink>
    <p class="not-found-msg">Release not found.</p>
  </div>
</template>

<script setup>
const route = useRoute()
const { formatDate, thumbUrl, releasePath } = useReleases()

const { data: release } = await useAsyncData(`release-${route.params.slug}`, () =>
  queryCollection('releases').where('slug', '=', route.params.slug).first()
)

const { data: allReleases } = await useAsyncData('releases-suggestions', () =>
  queryCollection('releases').order('date', 'DESC').all()
)

const suggestions = computed(() => {
  if (!release.value || !allReleases.value) return []
  return allReleases.value
    .filter(r => r.slug !== release.value.slug)
    .slice(0, 3)
})

useHead(() => ({
  title: release.value ? `${release.value.title} — Ezabad` : 'Release — Ezabad'
}))
</script>

<style scoped>
.page-release {
  max-width: 760px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg) var(--space-3xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* ── Back link ── */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  align-self: flex-start;
  cursor: pointer;
}

.back-link:hover {
  color: var(--accent);
}

.back-chevron {
  width: 16px;
  height: 16px;
}

/* ── Hero ── */
.release-hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.release-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.release-date {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.meta-badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  padding: 2px 8px;
  border-radius: var(--border-radius-sm);
}

.release-title {
  margin: 0;
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
  line-height: var(--line-height-tight);
  background: linear-gradient(135deg, var(--color-text-primary) 20%, var(--accent) 60%, var(--color-text-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.release-lead {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

/* ── Video ── */
.release-video {
  width: 100%;
}

/* ── Body / production notes ── */
.release-body {
  background: color-mix(in srgb, var(--accent) 5%, var(--color-surface-secondary));
  border-left: 3px solid var(--accent);
  border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.body-label {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.body-content {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.body-content :deep(p) { margin: 0 0 var(--space-md) 0; }
.body-content :deep(p:last-child) { margin-bottom: 0; }
.body-content :deep(h2),
.body-content :deep(h3) {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: var(--space-lg) 0 var(--space-xs) 0;
}
.body-content :deep(ul),
.body-content :deep(ol) {
  padding-left: var(--space-lg);
  margin: 0 0 var(--space-md) 0;
}
.body-content :deep(strong) {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

/* ── Tags ── */
.release-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tag {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  padding: 3px 10px;
  border-radius: var(--border-radius-full, 999px);
}

/* ── Suggestions ── */
.sug-divider {
  height: 1px;
  background: var(--color-border-primary);
}

.sug-heading {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.sug-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.sug-thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface-secondary);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.sug-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, #000 30%, transparent);
  opacity: 0;
  transition: opacity 0.2s;
}

.sug-card:hover .sug-play {
  opacity: 1;
}

.sug-play svg {
  width: 22px;
  height: 22px;
  color: #fff;
}

.sug-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sug-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.sug-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
  transition: color 0.18s;
}

.sug-card:hover .sug-title {
  color: var(--accent);
}

.sug-genre {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--accent);
}

/* ── 404 ── */
.page-release--404 {
  justify-content: flex-start;
}

.not-found-msg {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
  text-align: center;
  padding: var(--space-3xl) 0;
}
</style>

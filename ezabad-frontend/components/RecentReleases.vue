<template>
  <aside class="recent-releases">
    <h2 class="sidebar-title">Recent Releases</h2>
    <ul class="releases-list">
      <li v-for="release in releases" :key="release.date" class="release-item">
        <NuxtLink :to="releasePath(release)" class="release-link">
          <span class="release-title">{{ release.title }}</span>
          <div class="release-meta">
            <time class="release-date" :datetime="release.date">{{ formatDate(release.date) }}</time>
            <span v-if="release.genre" class="release-genre">{{ release.genre }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>
    <NuxtLink to="/catalog" class="view-all-link">View full catalog →</NuxtLink>
  </aside>
</template>

<script setup>
const { formatDate, releasePath } = useReleases()

const { data: releases } = await useAsyncData('releases-recent', () =>
  queryCollection('releases').order('date', 'DESC').limit(5).all()
)
</script>

<style scoped>
.recent-releases {
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
}

.sidebar-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 var(--space-md) 0;
}

.releases-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.release-item {
  border-bottom: 1px solid var(--color-border-primary);
  padding-bottom: var(--space-xs);
}

.release-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.release-link {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-decoration: none;
  padding: var(--space-xs) 0;
  border-radius: var(--border-radius-sm);
  transition: color var(--duration-200) var(--ease-out);
}

.release-link:hover .release-title {
  color: var(--accent);
}

.release-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
  transition: color var(--duration-200) var(--ease-out);
}

.release-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.release-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.release-genre {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  padding: 1px 6px;
  border-radius: var(--border-radius-sm);
}

.view-all-link {
  display: inline-block;
  margin-top: var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--accent);
  text-decoration: none;
  transition: opacity var(--duration-200) var(--ease-out);
  cursor: pointer;
}

.view-all-link:hover {
  opacity: 0.75;
}
</style>

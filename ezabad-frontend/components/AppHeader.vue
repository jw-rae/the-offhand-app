<template>
  <header class="header">
    <div class="header-container">
      <div class="header-left">
        <NuxtLink to="/" class="brand-primary">EZABAD</NuxtLink>
      </div>
      <nav class="header-nav">
        <NuxtLink to="/catalog" class="nav-link">Catalog</NuxtLink>
        <NuxtLink to="/subscribe" class="nav-link">Newsletter</NuxtLink>
        <div class="controls-group">
          <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle dark/light mode">
            <Icon v-if="!isDarkMode" icon="lucide:moon" width="20" height="20" />
            <Icon v-else icon="lucide:sun" width="20" height="20" />
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const isDarkMode = ref(false)

const toggleTheme = () => {
  const isDark = document.documentElement.getAttribute('data-color-scheme') === 'dark'
  if (isDark) {
    document.documentElement.setAttribute('data-color-scheme', 'light')
    localStorage.setItem('theme-mode', 'light')
    isDarkMode.value = false
  } else {
    document.documentElement.setAttribute('data-color-scheme', 'dark')
    localStorage.setItem('theme-mode', 'dark')
    isDarkMode.value = true
  }
}

onMounted(() => {
  isDarkMode.value = document.documentElement.getAttribute('data-color-scheme') === 'dark'
})
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  flex-shrink: 0;
  height: var(--space-2xl);
  background: color-mix(in srgb, var(--color-surface-primary) 82%, transparent);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  z-index: var(--z-index-50);
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-border-primary) 15%,
    var(--accent) 50%,
    var(--color-border-primary) 85%,
    transparent 100%
  );
}

.header-container {
  height: 100%;
  padding: 0 var(--space-2xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.brand-primary {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.12em;
  text-decoration: none;
  background: linear-gradient(110deg, var(--accent), var(--color-text-primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: opacity var(--duration-200) var(--ease-out);
}

.brand-primary:hover {
  opacity: 0.75;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.nav-link {
  position: relative;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--duration-200) var(--ease-out);
  cursor: pointer;
  padding-bottom: 3px;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 0;
  height: 1px;
  background: var(--accent);
  transition: width 0.28s var(--ease-out);
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: var(--accent);
}

.controls-group {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-md);
  transition: color var(--duration-200) var(--ease-out), background var(--duration-200) var(--ease-out);
}

.theme-toggle:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-secondary);
}

/* ── Mobile nav ── */
@media (max-width: 600px) {
  .header-container {
    padding: 0 var(--space-lg);
  }

  .header-nav {
    gap: var(--space-md);
  }
}
</style>

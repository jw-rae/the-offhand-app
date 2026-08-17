<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Prevent theme flash by applying saved preferences before first paint
useHead({
  script: [
    {
      innerHTML: `
        (function() {
          const savedMode = localStorage.getItem('theme-mode');
          // Always use the warm theme; only toggle dark/light color scheme
          document.documentElement.setAttribute('data-theme', 'warm');
          if (savedMode === 'dark') {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
          } else {
            document.documentElement.setAttribute('data-color-scheme', 'light');
          }
        })();
      `,
      type: 'text/javascript',
      tagPosition: 'head'
    }
  ]
})
</script>

<style>
@import '@jwrae/design-tokens/foundations';
@import '@jwrae/design-tokens/themes';
@import '@jwrae/design-tokens/utilities';

/* ── Accent — teal/turquoise, overrides the warm theme accent ─────── */
:root,
[data-theme="warm"] {
  --accent: #0d9e89;
  --accent-glow: rgba(13, 158, 137, 0.16);
  /* Callout band tokens — light */
  --beat-bg-from: var(--color-brand-primary-300);
  --beat-bg-to:   var(--color-brand-primary-100);
  --beat-overlay: color-mix(in srgb, var(--accent) 10%, transparent);
  --beat-waveform-opacity: 0.5;
  --beat-vinyl-opacity: 0.18;
  --beat-heading-color: var(--color-text-primary);
}

[data-theme="warm"][data-color-scheme="dark"] {
  --accent: #2dd4bf;
  --accent-glow: rgba(45, 212, 191, 0.20);
  --beat-bg-from: var(--color-brand-primary-950);
  --beat-bg-to:   var(--color-brand-primary-800);
  --beat-overlay: color-mix(in srgb, var(--accent) 14%, transparent);
  --beat-waveform-opacity: 0.7;
  --beat-vinyl-opacity: 0.22;
  --beat-heading-color: transparent;
}

/* ── Reset ──────────────────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  cursor: default;
  caret-color: transparent;
}

body {
  margin: 0;
  background-color: var(--color-surface-primary);
  background-image: radial-gradient(
    ellipse 55% 35% at 78% -2%,
    var(--accent-glow) 0%,
    transparent 100%
  );
  color: var(--color-text-primary);
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

input, textarea, select {
  caret-color: auto;
  cursor: text;
}

a {
  cursor: pointer;
}

button {
  cursor: pointer;
}
</style>

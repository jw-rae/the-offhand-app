<template>
  <NuxtLink to="/catalog" class="beat-callout" aria-label="Browse the catalog">
    <div class="callout-stage">
      <!-- Waveform decoration -->
      <div class="waveform" aria-hidden="true">
        <span class="bar b1"></span>
        <span class="bar b2"></span>
        <span class="bar b3"></span>
        <span class="bar b4"></span>
        <span class="bar b5"></span>
        <span class="bar b6"></span>
        <span class="bar b7"></span>
        <span class="bar b8"></span>
      </div>
      <div class="callout-vinyl" aria-hidden="true">◎</div>
      <div class="callout-text">
        <p class="callout-eyebrow">Latest Work</p>
        <p class="callout-heading">Catalog</p>
      </div>
    </div>
    <div class="callout-foot">
      <p class="callout-subtext">Original production. Film, sync, artists, and more.</p>
      <span class="callout-cta">Browse →</span>
    </div>
  </NuxtLink>
</template>

<style scoped>
/* ── Card shell ── */
.beat-callout {
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--color-border-primary));
  box-shadow: 0 2px 16px color-mix(in srgb, var(--color-brand-primary-900) 15%, transparent);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.beat-callout:hover {
  transform: translateY(-3px);
  box-shadow:
    0 10px 36px color-mix(in srgb, var(--color-brand-primary-900) 25%, transparent),
    0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent),
    0 0 50px var(--accent-glow);
}

/* ── Stage band ── */
.callout-stage {
  position: relative;
  background:
    radial-gradient(ellipse 80% 70% at 5% 110%, var(--beat-overlay) 0%, transparent 60%),
    linear-gradient(155deg, var(--beat-bg-from) 0%, var(--beat-bg-to) 100%);
  padding: var(--space-xl) var(--space-lg) var(--space-lg);
  min-height: 130px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

/* ── Animated waveform bars ── */
.waveform {
  position: absolute;
  top: 50%;
  right: var(--space-lg);
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 3px;
  opacity: var(--beat-waveform-opacity, 0.5);
}

.bar {
  display: block;
  width: 3px;
  border-radius: 2px;
  background: var(--accent);
  animation: pulse-bar 1.4s ease-in-out infinite;
}

.bar.b1 { height: 12px; animation-delay: 0s; }
.bar.b2 { height: 22px; animation-delay: 0.1s; }
.bar.b3 { height: 16px; animation-delay: 0.2s; }
.bar.b4 { height: 28px; animation-delay: 0.15s; }
.bar.b5 { height: 18px; animation-delay: 0.3s; }
.bar.b6 { height: 24px; animation-delay: 0.05s; }
.bar.b7 { height: 14px; animation-delay: 0.25s; }
.bar.b8 { height: 20px; animation-delay: 0.35s; }

@keyframes pulse-bar {
  0%, 100% { transform: scaleY(0.5); opacity: 0.6; }
  50%       { transform: scaleY(1);   opacity: 1; }
}

/* ── Vinyl glyph ── */
.callout-vinyl {
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
  font-size: 3.5rem;
  line-height: 1;
  color: var(--accent);
  opacity: var(--beat-vinyl-opacity, 0.18);
  user-select: none;
  pointer-events: none;
}

/* ── Text ── */
.callout-text {
  position: relative;
  z-index: 1;
}

.callout-eyebrow {
  margin: 0 0 2px 0;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.callout-heading {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--beat-heading-color, var(--color-text-primary));
  background: var(--beat-heading-color, none) linear-gradient(110deg, var(--accent), var(--color-text-primary) 60%, var(--accent));
  -webkit-background-clip: var(--beat-heading-color, none);
  background-clip: var(--beat-heading-color, none);
}

[data-color-scheme="dark"] .callout-heading,
@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme="light"]) .callout-heading {
    background: linear-gradient(110deg, var(--accent), var(--color-text-primary) 60%, var(--accent));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

/* ── Foot ── */
.callout-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-surface-secondary);
  padding: var(--space-md) var(--space-lg);
  gap: var(--space-sm);
}

.callout-subtext {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.callout-cta {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  white-space: nowrap;
  flex-shrink: 0;
}
</style>

<template>
  <div class="video-wrapper">
    <iframe
      v-if="videoId"
      :src="`https://www.youtube-nocookie.com/embed/${videoId}`"
      :title="title"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
    <div v-else class="video-placeholder" aria-label="Video not available">
      <span class="placeholder-icon" aria-hidden="true">▶</span>
      <span class="placeholder-text">Track coming soon</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  videoId: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: 'Track video'
  }
})
</script>

<style scoped>
.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background: var(--color-surface-secondary);
}

.video-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius-lg);
}

.video-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  border: 2px dashed var(--color-border-primary);
  border-radius: var(--border-radius-lg);
}

.placeholder-icon {
  font-size: 2rem;
  color: var(--color-text-tertiary);
}

.placeholder-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}
</style>

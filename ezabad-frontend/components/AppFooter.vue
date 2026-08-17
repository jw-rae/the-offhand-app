<template>
  <footer class="footer">
    <div class="footer-container">
      <p class="footer-copy">&copy; {{ year }} Ezabad. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border-primary);
  background: var(--color-surface-primary);
  padding: var(--space-lg) 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.footer-copy {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}
</style>

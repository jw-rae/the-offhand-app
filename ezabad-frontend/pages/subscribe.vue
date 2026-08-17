<template>
  <div class="page-subscribe">
    <div class="subscribe-container">

      <!-- Header -->
      <div class="sub-header">
        <p class="sub-eyebrow">Stay in the loop</p>
        <h1 class="sub-title">Join the Ezabad List</h1>
        <p class="sub-subtitle">Be the first to hear new releases, get behind-the-scenes notes on the work, and get early access before anything drops publicly.</p>
      </div>

      <!-- Form -->
      <form class="sub-form" @submit.prevent="handleSubmit" novalidate>

        <div class="field-group">
          <label class="field-label" for="email">Email Address <span class="required" aria-hidden="true">*</span></label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="field-input"
            :class="{ 'field-input--error': emailError }"
            placeholder="you@example.com"
            required
            autocomplete="email"
          />
          <p v-if="emailError" class="field-error" role="alert">{{ emailError }}</p>
        </div>

        <div class="field-group">
          <label class="field-label" for="name">First Name <span class="required" aria-hidden="true">*</span></label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="field-input"
            :class="{ 'field-input--error': nameError }"
            placeholder="Your first name"
            required
            autocomplete="given-name"
          />
          <p v-if="nameError" class="field-error" role="alert">{{ nameError }}</p>
        </div>

        <!-- Submit -->
        <button type="submit" class="sub-btn" :disabled="submitted">
          <span v-if="!submitted">Sign Me Up — It's Free</span>
          <span v-else class="sub-btn__success">
            <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
              <polyline points="4,10 8,14 16,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            You're on the list!
          </span>
        </button>

        <p v-if="submitted" class="field-success" role="status">
          Welcome to the Ezabad fam. You'll hear from us when something new drops.
        </p>

      </form>

    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Newsletter — Ezabad' })

const email    = ref('')
const name     = ref('')
const submitted   = ref(false)
const emailError  = ref('')
const nameError   = ref('')

const handleSubmit = () => {
  emailError.value = ''
  nameError.value  = ''

  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }
  if (!name.value.trim()) {
    nameError.value = 'Please enter your first name.'
    return
  }

  fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, name: name.value })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        submitted.value = true
      } else {
        emailError.value = data.error || 'Subscription failed. Please try again.'
      }
    })
    .catch(() => {
      emailError.value = 'Something went wrong. Please try again.'
    })
}
</script>

<style scoped>
.page-subscribe {
  min-height: 80vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--space-3xl) var(--space-lg);
}

.subscribe-container {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

/* ── Header ── */
.sub-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.sub-eyebrow {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.sub-title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
  background: linear-gradient(110deg, var(--accent), var(--color-text-primary) 50%, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sub-subtitle {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* ── Form ── */
.sub-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.field-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.required {
  color: var(--accent);
  margin-left: 2px;
}

.field-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
  box-sizing: border-box;
  caret-color: auto;
  cursor: text;
}

.field-input::placeholder {
  color: var(--color-text-tertiary);
}

.field-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
}

.field-input--error {
  border-color: #d95f5f;
}

.field-error {
  margin: 0;
  font-size: var(--font-size-xs);
  color: #d95f5f;
}

/* ── Button ── */
.sub-btn {
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.01em;
  transition: opacity 0.18s, transform 0.18s;
  cursor: pointer;
}

.sub-btn:hover:not(:disabled) {
  opacity: 0.88;
  transform: translateY(-1px);
}

.sub-btn:disabled {
  opacity: 0.7;
  cursor: default;
  background: color-mix(in srgb, var(--accent) 60%, var(--color-surface-secondary));
}

.sub-btn__success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
}

.field-success {
  margin: 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding: var(--space-md);
  background: color-mix(in srgb, var(--accent) 8%, var(--color-surface-secondary));
  border-radius: var(--border-radius-md);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, var(--color-border-primary));
}
</style>

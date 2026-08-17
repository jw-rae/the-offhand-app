import type { GlobalConfig } from 'payload'

export const FONT_OPTIONS = [
  { label: 'System Sans', value: 'system-sans' },
  { label: 'Inter', value: 'inter' },
  { label: 'DM Sans', value: 'dm-sans' },
  { label: 'Outfit', value: 'outfit' },
  { label: 'Lora', value: 'lora' },
  { label: 'Playfair Display', value: 'playfair' },
  { label: 'Source Serif 4', value: 'source-serif' },
  { label: 'JetBrains Mono', value: 'jetbrains-mono' },
] as const

export const FONT_MAP: Record<string, { family: string; url?: string }> = {
  'system-sans': { family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  'inter': { family: "'Inter', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  'dm-sans': { family: "'DM Sans', sans-serif", url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap' },
  'outfit': { family: "'Outfit', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap' },
  'lora': { family: "'Lora', serif", url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap' },
  'playfair': { family: "'Playfair Display', serif", url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap' },
  'source-serif': { family: "'Source Serif 4', serif", url: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600;700&display=swap' },
  'jetbrains-mono': { family: "'JetBrains Mono', monospace", url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap' },
}

export const THEME_OPTIONS = [
  { label: 'Charcoal', value: 'charcoal' },
  { label: 'Pink', value: 'pink' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Vintage', value: 'vintage' },
  { label: 'Slate', value: 'slate' },
  { label: 'Ember', value: 'ember' },
  { label: 'Purple', value: 'purple' },
  { label: 'Khaki', value: 'khaki' },
] as const

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'The Offhand',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'theme',
      type: 'select',
      required: true,
      defaultValue: 'vintage',
      options: THEME_OPTIONS.map((t) => ({ label: t.label, value: t.value })),
    },
    {
      name: 'fontFamily',
      type: 'select',
      required: true,
      defaultValue: 'playfair',
      admin: {
        description: 'Choose the font used across the site',
      },
      options: FONT_OPTIONS.map((f) => ({ label: f.label, value: f.value })),
    },
  ],
}

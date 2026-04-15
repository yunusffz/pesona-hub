# Pesona Hub — Claude Code Rules

## Naming Conventions

Use **English** for all code identifiers. This applies to:

- Component names: `PartnerForm`, `ImageUploader`, `DataTable`
- Variables and constants: `isLoading`, `showToast`, `MAX_ITEMS`
- Functions and methods: `handleSave`, `removeItem`, `parsePartners`
- Props and emits: `modelValue`, `isSubmitting`, `uploaded`
- Types and interfaces: `PartnerItem`, `TentangKamiData`, `MisiItem`
- Composables: `usePartners`, `useTentangKami`, `useImageUpload`
- File names: `PartnerForm.vue`, `useTentangKami.ts`, `DataTable.vue`
- CSS classes (custom): use English descriptors
- Query keys: `["settings", "partners"]`

**Exception:** User-facing UI text (labels, placeholders, error messages, page titles) stays in **Indonesian** as it is displayed to end users.

## Code Quality Rules

- **Never remove existing imports** from a file without first verifying they are truly unused. Always read the full file before deciding to remove an import.
- **Always use ASCII straight quotes** (`"` and `'`) in all code. Never use Unicode smart/curly quotes (`"`, `"`, `'`, `'`) — they break Vite's parser.
- **Explicit imports in Vue components**: always import components and composables explicitly (do not rely solely on Nuxt auto-imports). Follow the pattern of existing components in the project.
- **Only add imports that are actually used** — verify each import is referenced in the file before adding it.
- **Single Responsibility for functions**: each function should do one thing. Extract helpers rather than writing functions that mix concerns (e.g., fetching + transforming + side effects in one body).

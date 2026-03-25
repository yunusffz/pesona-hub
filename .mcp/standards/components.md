# Component Standards

## File Location
- Base/reusable UI: `app/components/base/`
- Shadcn primitives: `app/components/ui/` (managed by shadcn-nuxt, don't edit manually)
- Feature-specific: `app/components/features/<domain>/<ComponentName>.vue`
- Shared types for a domain: `app/components/features/<domain>/types.ts`

## Naming
- PascalCase filenames: `MitraAccountForm.vue`
- Domain prefix for cms mitra: `Mitra*` — e.g. `MitraAccountForm`, `MitraIdentityForm`, `MitraInterestsForm`, `MitraCollaborationForm`

## Props & Models
- Use `defineModel` for two-way binding instead of manual `props + emit`
- Share types via `types.ts` in the domain folder — always `import type`
- Use `withDefaults` for prop defaults
- CVA + `cn()` for components with multiple style variants (see `BaseButton`, `BaseBadge`)

## Available Base Components
- `BaseButton` — CVA variants: primary, secondary, solid; sizes: sm, default, lg
- `BaseInput` — rounded input with optional password toggle
- `BaseBadge` — CVA variants: default, secondary, destructive, outline, info, white, grey, etc.
- `BaseSelect` — reka-ui dropdown with Lucide icons
- `ImageUploader` — drag & drop + click upload, props: `width`, `height`, `label`, `accept`, `maxSizeMb`, `borderClass`
- `BaseSvgIcon` — SVG renderer via `name` prop
- `SearchInput`, `ComboboxSelect`, `BaseQuantityCounter`, `Tabs`, `Loader`

## Step Forms Pattern
- Each step is its own component (one responsibility per file)
- Orchestrator (e.g. `AddMitra.vue`) owns: `steps[]`, `currentStep`, `canProceed`, navigation, submit logic
- Step components handle their own fields and local validation only
- `passwordMismatch` or similar local validation lives in the step component — orchestrator only inlines the check for `canProceed`
- Step validation in `canProceed` is inlined in the orchestrator (not duplicated as computed from step components)

## cms/mitra Step Structure (reference)
```
MitraAccountForm.vue      ← Step 1: username, email, password
MitraIdentityForm.vue     ← Step 2: logo, company name, level, contact
MitraInterestsForm.vue    ← Step 3: commodities (MultiSelectComboboxVirtual)
MitraCollaborationForm.vue ← Step 4: collaboration type + notes
AddMitra.vue              ← orchestrator (steps, nav, submit to POST /users)
types.ts                  ← ProfileFormData, AccountFormData
```

## Multi-Select Components
- Virtual (large lists): `~/components/common/multi-select-combobox/MultiSelectComboBoxVirtual.vue`
- Standard: `~/components/common/multi-select-combobox/MultiSelectComboBox.vue`

## Composables to Use
- `useApi()` — returns `$apiClient`
- `useAuth()` — user, tokens, login/logout, isAuthenticated, isAdmin
- `useImageUpload()` — preview, isDragging, loading, onFileSelect, handleDrop
- `useCmsToast()` — toast helpers for CMS actions
- `useFormValidation()` — form validation utilities
- `@vueuse/core` utilities freely available

## Icon Usage
- Lucide: `import { X, ChevronLeft } from 'lucide-vue-next'`
- Iconify via `<Icon name="uil:..." />` (collections: uil, mdi)

# Tooling Standards

## Package Manager
- Always use `bun` — never `npm` or `yarn`
- Install: `bun add <pkg>`, dev: `bun add -d <pkg>`

## Stack
- **Nuxt 4.4.2** + Vue 3.5 (Composition API with `<script setup>`)
- **srcDir**: `app/` — all source lives under `app/`
- TypeScript — always use `import type` for type-only imports
- Tailwind CSS via `@nuxtjs/tailwindcss 6.14.0`
- TanStack Query `@tanstack/vue-query ^5.90.5` for data fetching
- Pinia `^3.0.3` for global state (`app/stores/`)
- `lucide-vue-next ^0.545.0` for icons
- `reka-ui ^2.9.2` for headless UI primitives
- `shadcn-nuxt 2.3.1` — shadcn components live in `app/components/ui/`
- `@vueuse/core ^13.9.0` for composable utilities
- `zod ^4.1.12` for schema validation (schemas in `app/schemas/`)
- `class-variance-authority` + `clsx` + `tailwind-merge` — use `cn()` from `~/lib/utils`

## Path Aliases
- `~` and `@` both resolve to `app/`

## API Client
- Typed via openapi-fetch + generated types at `~/types/pesona-hub-api`
- Access via `const { $apiClient } = useNuxtApp()` or `useApi()` composable
- NuxtApp augmentation in `~/types/nuxt-app.d.ts`: `$apiClient`, `$setAuthToken`, `$clearAuthToken`, `$getAuthToken`
- Always destructure `{ data, error }` and throw on error
- Auth token stored in cookies (`access-token`, `refresh-token`)

## Data Fetching Pattern (Queries)
- Query hooks live in `~/queries/use<Resource>.ts`
- Use `useQuery` with reactive `queryKey`, `staleTime: 5 * 60 * 1000`, `gcTime: 10 * 60 * 1000`
- Mutations (`useCreateX`, `useUpdateX`, `useDeleteX`) invalidate their queryKey on success
- Default Vue Query config: `staleTime: 5000`, `refetchOnWindowFocus: false`, retry: 1

## App Directory Structure
```
app/
├── assets/        styles (global.css)
├── components/    base/, features/, ui/ (shadcn)
├── composables/   useAuth, useApi, useImageUpload, etc.
├── consts/        constants
├── layouts/       Nuxt layouts
├── lib/           utils.ts (cn helper)
├── middleware/    Nuxt middleware
├── pages/         routes (index, login, register, katalog, profil, cms/, dashboard/)
├── plugins/       api-client, vue-query, lucide, ssr-width
├── queries/       TanStack Query hooks
├── schemas/       Zod schemas
├── stores/        Pinia stores
├── types/         TS types (pesona-hub-api.d.ts, nuxt-app.d.ts, strapi.ts, etc.)
└── utils/         create-api-client, error-mapper, format-date, format-number, etc.
```

## Nuxt Modules
`@nuxtjs/tailwindcss`, `@nuxt/image` (ipx), `@nuxt/icon` (uil, mdi), `@nuxt/fonts` (Instrument Sans, Inter), `nuxt-swiper`, `shadcn-nuxt`, `@pinia/nuxt`

## Toast Notifications
- Use `vue-sonner ^2.0.9`
- CMS-specific helper: `useCmsToast()` composable

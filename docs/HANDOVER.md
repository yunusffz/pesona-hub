# Pesona Hub — Developer Handover Guide

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [App Directory Structure](#4-app-directory-structure)
5. [Code Conventions](#5-code-conventions)
6. [Component Standards](#6-component-standards)
7. [Styling Standards](#7-styling-standards)
8. [Data Fetching & API](#8-data-fetching--api)
9. [Feature Guides](#9-feature-guides)
   - [Statistics System](#91-statistics-system)
   - [Activity Logging](#92-activity-logging)
   - [Date Formatting](#93-date-formatting)
10. [Deployment](#10-deployment)

---

## 1. Project Overview

Pesona Hub is a Nuxt 4 + Vue 3 frontend application for a social forestry marketplace. It serves both a public-facing catalog and a CMS for managing partners (Mitra), products, and content.

---

## 2. Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Nuxt | 4.4.2 | Framework (SSR/SPA) |
| Vue | 3.5 | UI library (Composition API + `<script setup>`) |
| TypeScript | — | Type safety (`import type` for type-only imports) |
| Tailwind CSS | via `@nuxtjs/tailwindcss 6.14.0` | Utility-first styling |
| TanStack Query | `^5.90.5` | Server state & data fetching |
| Pinia | `^3.0.3` | Global client state (`app/stores/`) |
| Zod | `^4.1.12` | Schema validation (`app/schemas/`) |
| reka-ui | `^2.9.2` | Headless UI primitives |
| shadcn-nuxt | `2.3.1` | Pre-built UI components (`app/components/ui/`) |
| lucide-vue-next | `^0.545.0` | Icons |
| @vueuse/core | `^13.9.0` | Composable utilities |
| vue-sonner | `^2.0.9` | Toast notifications |
| openapi-fetch | — | Typed API client |

**Package manager: always use `bun`** — never npm or yarn.

```bash
bun add <pkg>         # runtime dependency
bun add -d <pkg>      # dev dependency
```

---

## 3. Getting Started

### Install dependencies

```bash
bun install
```

### Development server (http://localhost:3000)

```bash
bun run dev
```

### Production build

```bash
bun run build
bun run preview   # preview production build locally
```

---

## 4. App Directory Structure

All source lives under `app/` (Nuxt `srcDir`). Path aliases `~` and `@` both resolve to `app/`.

```
app/
├── assets/        # global.css
├── components/
│   ├── base/      # reusable base UI components
│   ├── features/  # feature-specific components (grouped by domain)
│   └── ui/        # shadcn-nuxt components (do not edit manually)
├── composables/   # useAuth, useApi, useImageUpload, useCmsToast, etc.
├── consts/        # app-wide constants
├── layouts/       # Nuxt layouts
├── lib/           # utils.ts (cn helper)
├── middleware/    # Nuxt middleware
├── pages/         # routes: index, login, register, katalog, profil, cms/, dashboard/
├── plugins/       # api-client, vue-query, lucide, ssr-width
├── queries/       # TanStack Query hooks (use<Resource>.ts)
├── schemas/       # Zod validation schemas
├── stores/        # Pinia stores
├── types/         # TS types: pesona-hub-api.d.ts, nuxt-app.d.ts, strapi.ts, etc.
└── utils/         # helpers: create-api-client, error-mapper, format-date, format-number, etc.
```

---

## 5. Code Conventions

### Naming

Use **English** for all code identifiers:

| Category | Examples |
|----------|---------|
| Components | `PartnerForm`, `ImageUploader`, `DataTable` |
| Variables | `isLoading`, `showToast`, `MAX_ITEMS` |
| Functions | `handleSave`, `removeItem`, `parsePartners` |
| Props/emits | `modelValue`, `isSubmitting`, `uploaded` |
| Types | `PartnerItem`, `TentangKamiData`, `MisiItem` |
| Composables | `usePartners`, `useTentangKami`, `useImageUpload` |
| Files | `PartnerForm.vue`, `useTentangKami.ts` |
| Query keys | `["settings", "partners"]` |

**Exception:** User-facing UI text (labels, placeholders, error messages, titles) stays in **Indonesian**.

### Code Quality Rules

- **Never remove existing imports** without verifying they are unused — always read the full file first.
- **Always use ASCII straight quotes** (`"` and `'`). Never use Unicode curly quotes — they break Vite's parser.
- **Explicit imports** in Vue components — always import components and composables explicitly, do not rely solely on Nuxt auto-imports.
- **Only add imports that are actually used** — verify each import is referenced before adding.
- **Single Responsibility** — each function does one thing. Extract helpers rather than mixing concerns.

---

## 6. Component Standards

### File Location

| Type | Path |
|------|------|
| Base / reusable UI | `app/components/base/` |
| shadcn primitives | `app/components/ui/` (managed by shadcn-nuxt, don't edit manually) |
| Feature-specific | `app/components/features/<domain>/<ComponentName>.vue` |
| Shared domain types | `app/components/features/<domain>/types.ts` |

### Props & Models

- Use `defineModel` for two-way binding instead of manual `props + emit`.
- Share types via `types.ts` in the domain folder — always `import type`.
- Use `withDefaults` for prop defaults.
- Use CVA + `cn()` for components with multiple style variants.

### Available Base Components

| Component | Description |
|-----------|-------------|
| `BaseButton` | CVA variants: `primary`, `secondary`, `solid`; sizes: `sm`, `default`, `lg` |
| `BaseInput` | Rounded input with optional password toggle |
| `BaseBadge` | CVA variants: `default`, `secondary`, `destructive`, `outline`, `info`, `white`, `grey` |
| `BaseSelect` | reka-ui dropdown with Lucide icons |
| `ImageUploader` | Drag & drop + click upload; props: `width`, `height`, `label`, `accept`, `maxSizeMb`, `borderClass` |
| `BaseSvgIcon` | SVG renderer via `name` prop |
| `SearchInput`, `ComboboxSelect`, `BaseQuantityCounter`, `Tabs`, `Loader` | Utility components |

### Step Forms Pattern

- Each step is its own component (one responsibility per file).
- Orchestrator (e.g. `AddMitra.vue`) owns: `steps[]`, `currentStep`, `canProceed`, navigation, submit logic.
- Step components handle their own fields and local validation only.

**CMS Mitra step structure (reference):**

```
app/components/features/cms/mitra/
├── MitraAccountForm.vue       ← Step 1: username, email, password
├── MitraIdentityForm.vue      ← Step 2: logo, company name, level, contact
├── MitraInterestsForm.vue     ← Step 3: commodities (MultiSelectComboboxVirtual)
├── MitraCollaborationForm.vue ← Step 4: collaboration type + notes
├── AddMitra.vue               ← orchestrator (steps, nav, submit)
└── types.ts                   ← ProfileFormData, AccountFormData
```

### Multi-Select Components

- Virtual (large lists): `~/components/common/multi-select-combobox/MultiSelectComboBoxVirtual.vue`
- Standard: `~/components/common/multi-select-combobox/MultiSelectComboBox.vue`

### Composables to Use

| Composable | Purpose |
|------------|---------|
| `useApi()` | Returns `$apiClient` |
| `useAuth()` | User, tokens, login/logout, isAuthenticated, isAdmin |
| `useImageUpload()` | Preview, isDragging, loading, onFileSelect, handleDrop |
| `useCmsToast()` | Toast helpers for CMS actions |
| `useFormValidation()` | Form validation utilities |
| `@vueuse/core` | Various composable utilities |

### Icon Usage

```typescript
// Lucide icons
import { X, ChevronLeft } from "lucide-vue-next";

// Iconify via Nuxt Icon module
<Icon name="uil:..." />   // collections: uil, mdi
```

---

## 7. Styling Standards

### Utility Framework

- Tailwind CSS — utility classes only.
- Use `cn()` from `~/lib/utils` (clsx + tailwind-merge) for conditional/merged classes.
- CVA (`class-variance-authority`) for components with multiple variants.

### Design Tokens

| Token | Value | Use |
|-------|-------|-----|
| `primary` | `#035925` | Main brand green |
| `primary-light` | `#047a32` | Hover state |
| Primary hover CTA | `#B0C834` | Lime, some CTAs |
| `secondary` | `#0D0D0E` | Near-black |
| `sage-light` | `#E7EFEA` | Borders, backgrounds |
| `charcoal` | `#1E1E1E` | Body text |
| `neutral-100` | `#F5F5F5` | Backgrounds |
| `neutral-1000` | `#333333` | Dark text |
| `green-400` | `#2A9B4C` | Green accent |
| `text.secondary` | `#9EA2AD` | Muted text |
| Border radius | `0.625rem` (10px) | `--radius` |

### Input Fields (standard pattern)

```
h-9 px-3 rounded-2xl border border-transparent bg-[#f8faf8] text-sm
focus:outline-none focus:ring-1 focus:ring-[#035925]/30
placeholder:text-[#717182] w-full
```

- Error state: add `border-red-400`
- Required asterisk: `<span class="text-red-500">*</span>`

### Buttons (BaseButton)

CVA-based with `rounded-full px-5 py-[18px]`:

| Variant | Classes |
|---------|---------|
| Primary | `bg-primary text-white hover:bg-primary-light` |
| Secondary | `border border-[#e7efea] text-[#1e1e1e]` |
| CMS Primary | `bg-[#035925] hover:bg-[#024c20] text-white rounded-2xl h-9 px-4 text-sm` |
| CMS Secondary | `border border-[#e7efea] text-[#1e1e1e] rounded-2xl h-9 px-4 text-sm` |

### Cards / Modals

```
rounded-2xl border border-[#e7efea] shadow-lg
```
- Header: `bg-gray-50 border-b border-[#e7efea] px-6 py-4`
- Dividers: `border-[#e5e7eb]`

### Fonts

- **Instrument Sans** — primary UI font (weights 400–700)
- **Inter** — secondary (weights 400–700)

### ImageUploader Border States

| State | Class |
|-------|-------|
| Default | `border-[#D1D5DC]` |
| Dragging | `border-[#035925] border-dashed` |
| Error | `border-red-400` |

---

## 8. Data Fetching & API

### API Client

- Typed via openapi-fetch + generated types at `~/types/pesona-hub-api`.
- Access: `const { $apiClient } = useNuxtApp()` or `useApi()` composable.
- Always destructure `{ data, error }` and throw on error.
- Auth token stored in cookies (`access-token`, `refresh-token`).

```typescript
const { $apiClient } = useNuxtApp();
const { data, error } = await $apiClient.GET("/endpoint");
if (error) throw error;
```

### Query Hooks Pattern

- Query hooks live in `~/queries/use<Resource>.ts`.
- Use `useQuery` with reactive `queryKey`, `staleTime: 5 * 60 * 1000`, `gcTime: 10 * 60 * 1000`.
- Mutations (`useCreateX`, `useUpdateX`, `useDeleteX`) invalidate their queryKey on success.
- Default Vue Query config: `staleTime: 5000`, `refetchOnWindowFocus: false`, retry: 1.

```typescript
// ~/queries/useProducts.ts
export function useProducts(params: Ref<ProductParams>) {
  const { $apiClient } = useNuxtApp();
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const { data, error } = await $apiClient.GET("/products", { params: { query: params.value } });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
```

### Toast Notifications

```typescript
import { useCmsToast } from "~/composables/useCmsToast";
const { toastSuccess, toastError } = useCmsToast();
```

---

## 9. Feature Guides

### 9.1 Statistics System

**Files:**
- `app/composables/useStatistics.ts` — composables + formatting functions
- `app/components/features/dashboard/big-number/BigNumber.vue` — stat card component
- `app/components/features/dashboard/dashboard-supply/StatisticSection.vue` — container

#### Composables

```typescript
import { useStatistics, useEconomicStatistics, formatStatNumber, formatCurrency } from "~/composables/useStatistics";

const stats = useStatistics();
stats.kupsCount;       // Computed<number>
stats.productsCount;   // Computed<number>
stats.provincesCount;  // Computed<number>
stats.isLoading;       // Computed<boolean>

const econStats = useEconomicStatistics();
econStats.data.value?.totalProduction;
econStats.data.value?.totalEconomicValue;
```

#### Formatting Functions

```typescript
formatStatNumber(1284);            // "1,284"
formatStatNumber(null);            // "0"

formatCurrency(3138025000);        // "Rp 3.138.025.000"
formatCurrency(3138025000, true);  // "Rp 3,1 M" (compact)
formatCurrency(5500000, true);     // "Rp 5,5 Jt"
```

#### BigNumber Component

```vue
<BigNumber
  :number="formatStatNumber(stats.kupsCount.value)"
  title="Jumlah Kelompok Tani/KUPS"
  :loading="stats.isLoadingKups.value"
  icon="uil:users-alt"
/>
```

Props: `number` (string), `title`, `unit?`, `description?`, `growth?`, `icon?`, `loading?`

#### Caching

Statistics are cached: `staleTime: 10min`, `gcTime: 15min`. Counts extracted from `meta.pagination.total` in API responses.

---

### 9.2 Activity Logging

**Files:**
- `app/types/activity-log.ts` — type definitions
- `app/composables/useProductActivityLogger.ts` — main logging composable
- `app/queries/useActivityLogs.ts` — API mutation hook

#### Basic Usage

```vue
<script setup lang="ts">
import { useProductActivityLogger } from "~/composables/useProductActivityLogger";

const { logProductView, logProductCollaboration, logProductClick, logProductShare, logCustomEvent } = useProductActivityLogger();

onMounted(() => logProductView(product.value, { accessType: "public" }));

const handleCollaboration = () => {
  logProductCollaboration(product.value, quantity.value, { accessType: "public" });
};

const handleShare = () => {
  logProductShare(product.value, { shareMethod: "whatsapp" });
};
</script>
```

#### Available Methods

| Method | When to Use |
|--------|-------------|
| `logProductView(product, options?)` | User views product detail page |
| `logProductCollaboration(product, qty, options?)` | User requests collaboration (WhatsApp, etc.) |
| `logProductClick(product, options?)` | Specific button/element click |
| `logProductShare(product, options?)` | User shares a product |
| `logCustomEvent(event, product, options?)` | Any other event |

#### Auto-collected Data

Product: `product_name`, `product_id`, `product_price`, `product_category`, `commodity_name`, `commodity_id`
KUPS: `kups_name`, `kups_class`, `kups_contact`, `kups_id`
User (if authenticated): `user_id`, `user_name`, `user_email`, `user_phone`

#### Event Types

`view`, `click`, `create`, `update`, `delete`, `share`, `export`, `download`, `upload`, `api_access`, `authenticate`

#### Access Types

`public`, `internal`, `private`

---

### 9.3 Date Formatting

**File:** `app/utils/format-date.ts`

All formatters follow Indonesian conventions and safely return `"-"` for null/undefined/invalid inputs.

#### Available Functions

| Function | Output Format | Use Case |
|----------|---------------|---------|
| `formatDateTimeIndonesian(date)` | `14 Okt 2025 • 09:23` | Activity logs, notifications, timestamps |
| `formatDateIndonesian(date)` | `14 Okt 2025` | Birthdays, registration dates |
| `formatDateFullMonth(date)` | `14 Oktober 2025` | Formal documents, certificates |
| `formatTime(date)` | `09:23` | Time-only displays |
| `formatRelativeTime(date)` | `2 jam yang lalu` | Social feeds, comments, chat |
| `formatDateRange(start, end)` | `14 - 20 Okt 2025` | Date range filters, booking periods |

#### Usage

```typescript
import { formatDateTimeIndonesian, formatDateIndonesian, formatRelativeTime } from "~/utils/format-date";

formatDateTimeIndonesian("2025-10-14T09:23:00");  // "14 Okt 2025 • 09:23"
formatDateIndonesian("2025-10-14");               // "14 Okt 2025"
formatRelativeTime("2025-10-13T09:23:00");        // "1 hari yang lalu"
formatDateRange("2025-10-14", "2025-10-20");      // "14 - 20 Okt 2025"
```

#### Relative Time Units

| Duration | Output |
|----------|--------|
| < 60s | "Baru saja" |
| < 60min | "X menit yang lalu" |
| < 24h | "X jam yang lalu" |
| < 7 days | "X hari yang lalu" |
| < 30 days | "X minggu yang lalu" |
| < 365 days | "X bulan yang lalu" |
| 365+ days | "X tahun yang lalu" |

#### Indonesian Month Names

Abbreviations: Jan, Feb, Mar, Apr, Mei, Jun, Jul, Agt, Sep, Okt, Nov, Des
Full: Januari, Februari, Maret, April, Mei, Juni, Juli, Agustus, September, Oktober, November, Desember

---

## 10. Deployment

### Docker Setup

```
docker/
├── docker-compose.dev.yml    # Development
├── docker-compose.prod.yml   # Production
├── .env.dev.example
└── .env.prod.example
```

#### Development

```bash
cp docker/.env.dev.example docker/.env
# Edit .env with your values
docker compose -f docker/docker-compose.dev.yml up -d
```

- Frontend available at: `http://localhost:3000`
- Network: `pesona-hub-digi-network-dev`

#### Production

```bash
cp docker/.env.prod.example docker/.env
# Edit .env with strong passwords
docker compose -f docker/docker-compose.prod.yml up -d
```

- Frontend available at: `http://localhost:80`
- Network: `pesona-hub-digi-network-prod`
- Resource limits: 1 CPU / 512MB RAM (max), 0.5 CPU / 256MB RAM (reserved)

### CI/CD (GitHub Actions)

| Branch | Trigger | Workflow |
|--------|---------|---------|
| `dev` | push | `.github/workflows/deploy-dev.yml` |
| `main` | push | `.github/workflows/deploy-prod.yml` (with DB backup + health checks) |

### Required GitHub Secrets

**Development:**
`DEV_SERVER_HOST`, `DEV_SERVER_USER`, `DEV_SERVER_SSH_KEY` or `DEV_SERVER_PASSWORD`, `DEV_SERVER_PORT`, `DEV_PESONA_API_URL`, `DEV_PESONA_APP_NAME`

**Production:**
`PROD_SERVER_HOST`, `PROD_SERVER_USER`, `PROD_SERVER_SSH_KEY` or `PROD_SERVER_PASSWORD`, `PROD_SERVER_PORT`, `PROD_PESONA_API_URL`, `PROD_PESONA_APP_NAME`

### Common Docker Commands

```bash
# View logs
docker compose -f docker/docker-compose.[env].yml logs -f [service]

# Restart a service
docker compose -f docker/docker-compose.[env].yml restart [service]

# Stop all services
docker compose -f docker/docker-compose.[env].yml down

# Update images
docker compose -f docker/docker-compose.[env].yml pull
docker compose -f docker/docker-compose.[env].yml up -d
```

### Security Best Practices

- Never commit `.env` files to version control.
- Use HTTPS in production with a reverse proxy (nginx/traefik/cloudflare).
- Keep all secrets in GitHub Secrets, not in code.
- Regularly update Docker images.
- Validate environment variables before deployment.

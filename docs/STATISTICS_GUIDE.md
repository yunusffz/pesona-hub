# Statistics Guide

## Overview

This guide covers the statistics system in Pesona Hub, including dashboard statistics, data aggregation, and number formatting.

## Architecture

### Files Structure

```
app/
├── composables/
│   └── useStatistics.ts           # Statistics composables
├── components/
│   └── features/
│       └── dashboard/
│           ├── big-number/
│           │   └── BigNumber.vue  # Stat card component
│           └── dashboard-supply/
│               └── StatisticSection.vue  # Stats container
└── queries/
    ├── useSocialForestryBusinessGroups.ts
    ├── useProducts.ts
    └── useLocations.ts
```

## Available Composables

### 1. `useStatistics()`

Main composable for fetching core statistics.

```typescript
import { useStatistics } from "~/composables/useStatistics";

const statistics = useStatistics();

// Access statistics
const kupsCount = statistics.kupsCount;           // Computed<number>
const productsCount = statistics.productsCount;   // Computed<number>
const provincesCount = statistics.provincesCount; // Computed<number>

// Loading states
const isLoading = statistics.isLoading;           // Overall loading
const isLoadingKups = statistics.isLoadingKups;   // KUPS loading
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `kupsCount` | `Computed<number>` | Count of Social Forestry Business Groups |
| `productsCount` | `Computed<number>` | Count of products |
| `provincesCount` | `Computed<number>` | Count of unique provinces |
| `isLoading` | `Computed<boolean>` | Overall loading state |
| `isLoadingKups` | `Computed<boolean>` | KUPS loading state |
| `isLoadingProducts` | `Computed<boolean>` | Products loading state |
| `isLoadingLocations` | `Computed<boolean>` | Locations loading state |
| `kupsError` | `Ref<Error \| null>` | KUPS fetch error |
| `productsError` | `Ref<Error \| null>` | Products fetch error |
| `locationsError` | `Ref<Error \| null>` | Locations fetch error |

---

### 2. `useEconomicStatistics()`

Composable for economic data aggregation.

```typescript
import { useEconomicStatistics } from "~/composables/useStatistics";

const economicStats = useEconomicStatistics();

// Access aggregated data
const totalProduction = economicStats.data.value?.totalProduction;
const totalEconomicValue = economicStats.data.value?.totalEconomicValue;
const recordsCount = economicStats.data.value?.recordsCount;
```

**Returns:**

Query result with:

```typescript
{
  data: {
    totalProduction: number;      // Sum of all production
    totalEconomicValue: number;   // Sum of all economic values
    recordsCount: number;          // Number of records
  };
  isLoading: boolean;
  error: Error | null;
}
```

---

## Formatting Functions

### 1. `formatStatNumber()`

Format numbers with Indonesian thousand separators.

```typescript
import { formatStatNumber } from "~/composables/useStatistics";

formatStatNumber(1284);
// Output: "1,284"

formatStatNumber(3138025000);
// Output: "3,138,025,000"

formatStatNumber(null);
// Output: "0"
```

**Parameters:**
- `value: number | undefined | null` - Number to format

**Returns:** `string` - Formatted number with thousand separators

---

### 2. `formatCurrency()`

Format currency in Indonesian Rupiah.

```typescript
import { formatCurrency } from "~/composables/useStatistics";

// Full format
formatCurrency(3138025000);
// Output: "Rp 3.138.025.000"

// Compact format
formatCurrency(3138025000, true);
// Output: "Rp 3,1 M"

formatCurrency(5500000, true);
// Output: "Rp 5,5 Jt"
```

**Parameters:**
- `value: number | undefined | null` - Number to format
- `compact: boolean` - Use compact notation (default: false)

**Returns:** `string` - Formatted currency string

**Compact Notation:**
- Billions (≥ 1,000,000,000): `Rp X,X M`
- Millions (≥ 1,000,000): `Rp X,X Jt`
- Below millions: Full format

---

## Usage Examples

### Basic Statistics Display

```vue
<template>
  <div class="grid grid-cols-4 gap-4">
    <BigNumber
      :number="formatStatNumber(statistics.kupsCount.value)"
      title="Jumlah Kelompok Tani/KUPS"
      :loading="statistics.isLoadingKups.value"
    />
    <BigNumber
      :number="formatStatNumber(statistics.provincesCount.value)"
      title="Jumlah Provinsi"
      :loading="statistics.isLoadingLocations.value"
    />
  </div>
</template>

<script setup lang="ts">
import { useStatistics, formatStatNumber } from "~/composables/useStatistics";
import BigNumber from "~/components/features/dashboard/big-number/BigNumber.vue";

const statistics = useStatistics();
</script>
```

---

### Economic Statistics Display

```vue
<template>
  <div class="grid grid-cols-2 gap-4">
    <BigNumber
      :number="formatStatNumber(economicStats.data?.value?.totalProduction)"
      title="Kapasitas Penyediaan"
      :loading="economicStats.isLoading.value"
    />
    <BigNumber
      :number="formatCurrency(economicStats.data?.value?.totalEconomicValue, true)"
      title="Nilai Transaksi Ekonomi"
      :loading="economicStats.isLoading.value"
    />
  </div>
</template>

<script setup lang="ts">
import { useEconomicStatistics, formatStatNumber, formatCurrency } from "~/composables/useStatistics";

const economicStats = useEconomicStatistics();
</script>
```

---

### Custom Statistics

```typescript
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

// Create custom statistics composable
export function useCustomStatistics() {
  const { $apiClient } = useNuxtApp();

  const { data, isLoading } = useQuery({
    queryKey: ["custom-stats"],
    queryFn: async () => {
      const { data } = await $apiClient.GET("/your-endpoint");
      return data;
    },
  });

  const customCount = computed(() => {
    return (data.value as any)?.meta?.pagination?.total || 0;
  });

  return {
    customCount,
    isLoading,
  };
}
```

---

## BigNumber Component

The `BigNumber` component displays formatted statistics with loading states.

### Props

```typescript
interface Props {
  number: string;           // Formatted number to display
  title: string;            // Stat title
  unit?: string;            // Optional unit (e.g., "kg", "ton")
  description?: string;     // Optional description
  growth?: number;          // Optional growth percentage
  icon?: string;            // Optional icon name
  loading?: boolean;        // Show loading skeleton
}
```

### Usage

```vue
<BigNumber
  number="1,284"
  title="Jumlah Kelompok Tani/KUPS"
  icon="uil:users-alt"
  description="Total kelompok tani aktif"
  :growth="12.5"
  :loading="false"
/>
```

### Loading State

When `loading={true}`, displays an animated skeleton:

```vue
<BigNumber
  number="0"
  title="Loading..."
  :loading="true"
/>
```

---

## How Statistics Work

### 1. Data Fetching

Statistics are fetched from API endpoints with minimal data:

```typescript
// Only fetch metadata, not actual data
useSocialForestryBusinessGroups({
  pagination: {
    page: 1,
    page_size: 1,  // Minimal data
  },
});
```

### 2. Count Extraction

Counts are extracted from pagination metadata:

```typescript
const kupsCount = computed(() => {
  const meta = (kupsData.value as any)?.meta;
  if (meta?.pagination?.total !== undefined) {
    return meta.pagination.total;
  }
  return 0;
});
```

### 3. Caching

Statistics are cached using React Query:

- **Stale Time**: 10 minutes (data considered fresh)
- **GC Time**: 15 minutes (cache retention)

---

## Best Practices

### 1. Use Computed Properties

Always use computed for reactive statistics:

```typescript
// Good ✅
const kupsCount = computed(() => statistics.kupsCount.value);

// Avoid ❌
const kupsCount = statistics.kupsCount.value;
```

### 2. Handle Loading States

Always show loading states for better UX:

```vue
<BigNumber
  :number="formatStatNumber(count)"
  :loading="isLoading"
/>
```

### 3. Format Numbers Consistently

Use formatting functions for consistency:

```typescript
// Good ✅
formatStatNumber(1284) // "1,284"

// Avoid ❌
`${1284}` // "1284"
```

### 4. Error Handling

Handle errors gracefully:

```typescript
const statistics = useStatistics();

watchEffect(() => {
  if (statistics.kupsError.value) {
    console.error("Failed to load KUPS stats:", statistics.kupsError.value);
    // Show toast or error message
  }
});
```

---

## API Response Format

### Pagination Metadata

Statistics rely on pagination metadata from API responses:

```json
{
  "message_code": "OPERATION_SUCCESSFUL",
  "data": [...],
  "meta": {
    "pagination": {
      "total": 1284,
      "page": 1,
      "page_size": 10,
      "page_count": 129
    }
  }
}
```

### Economic Data Format

```json
{
  "message_code": "OPERATION_SUCCESSFUL",
  "data": [
    {
      "id": 1,
      "production": 5000,
      "economic_value": 150000000
    },
    ...
  ]
}
```

---

## Performance Considerations

### 1. Minimal Data Fetching

Statistics fetch only metadata, not full data:

```typescript
// Only 1 item fetched, rest is metadata
pagination: {
  page_size: 1
}
```

### 2. Query Caching

Statistics are cached to reduce API calls:

```typescript
staleTime: 10 * 60 * 1000,  // 10 minutes
gcTime: 15 * 60 * 1000,      // 15 minutes
```

### 3. Parallel Fetching

Multiple statistics are fetched in parallel:

```typescript
const statistics = useStatistics();
// Fetches KUPS, Products, and Locations simultaneously
```

---

## Troubleshooting

### Statistics Show Zero

**Problem:** Statistics display "0" instead of actual counts.

**Solutions:**

1. Check API response:
```typescript
console.log("KUPS Data:", kupsData.value);
console.log("Metadata:", (kupsData.value as any)?.meta);
```

2. Verify API returns pagination metadata
3. Check network tab for API calls

### Loading Never Completes

**Problem:** Loading state stuck at true.

**Solutions:**

1. Check for API errors:
```typescript
console.log("Error:", statistics.kupsError.value);
```

2. Verify API endpoint is accessible
3. Check network connectivity

### Incorrect Formatting

**Problem:** Numbers not formatted correctly.

**Solutions:**

1. Ensure you're using `formatStatNumber()`:
```typescript
// Correct
formatStatNumber(count)

// Wrong
count.toString()
```

2. Check locale settings

---

## Future Enhancements

Potential additions:

- [ ] Historical trend data
- [ ] Comparison with previous period
- [ ] Export statistics to CSV/Excel
- [ ] Real-time statistics updates
- [ ] Custom date range filtering
- [ ] Statistics visualization (charts)

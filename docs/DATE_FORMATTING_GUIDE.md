# Date Formatting Guide

## Overview

This guide covers the date formatting utilities available in the Pesona Hub application. All date formatting follows Indonesian conventions with proper month names and formatting.

## Available Formatters

### 1. `formatDateTimeIndonesian()`

**Format**: `14 Okt 2025 • 09:23`

The primary date-time formatter with bullet separator.

```typescript
import { formatDateTimeIndonesian } from "~/utils/format-date";

// With ISO string
formatDateTimeIndonesian("2025-10-14T09:23:00");
// Output: "14 Okt 2025 • 09:23"

// With Date object
formatDateTimeIndonesian(new Date());
// Output: "14 Okt 2025 • 09:23"

// With null/undefined
formatDateTimeIndonesian(null);
// Output: "-"
```

**Use Cases:**
- Activity logs timestamps
- Transaction history
- Notification timestamps
- Any event with date and time

---

### 2. `formatDateIndonesian()`

**Format**: `14 Okt 2025`

Date only, without time.

```typescript
import { formatDateIndonesian } from "~/utils/format-date";

formatDateIndonesian("2025-10-14");
// Output: "14 Okt 2025"
```

**Use Cases:**
- Birthdays
- Registration dates
- Event dates without specific time
- Date range displays

---

### 3. `formatDateFullMonth()`

**Format**: `14 Oktober 2025`

Date with full month name instead of abbreviation.

```typescript
import { formatDateFullMonth } from "~/utils/format-date";

formatDateFullMonth("2025-10-14");
// Output: "14 Oktober 2025"
```

**Use Cases:**
- Formal documents
- Certificates
- Reports
- Official communications

---

### 4. `formatTime()`

**Format**: `09:23`

Time only, 24-hour format.

```typescript
import { formatTime } from "~/utils/format-date";

formatTime("2025-10-14T09:23:00");
// Output: "09:23"
```

**Use Cases:**
- Clock displays
- Time-only information
- Event schedules

---

### 5. `formatRelativeTime()`

**Format**: `2 jam yang lalu`, `3 hari yang lalu`, etc.

Human-readable relative time in Indonesian.

```typescript
import { formatRelativeTime } from "~/utils/format-date";

// If current time is 09:23
formatRelativeTime("2025-10-14T07:23:00");
// Output: "2 jam yang lalu"

formatRelativeTime("2025-10-13T09:23:00");
// Output: "1 hari yang lalu"
```

**Time Units:**
- Less than 60 seconds: "Baru saja"
- Less than 60 minutes: "X menit yang lalu"
- Less than 24 hours: "X jam yang lalu"
- Less than 7 days: "X hari yang lalu"
- Less than 30 days: "X minggu yang lalu"
- Less than 365 days: "X bulan yang lalu"
- 365+ days: "X tahun yang lalu"

**Use Cases:**
- Social media posts
- Comments
- Chat messages
- Recent activity feeds

---

### 6. `formatDateRange()`

**Format**: `14 - 20 Okt 2025` or `14 Okt - 14 Nov 2025`

Smart date range formatting.

```typescript
import { formatDateRange } from "~/utils/format-date";

// Same month
formatDateRange("2025-10-14", "2025-10-20");
// Output: "14 - 20 Okt 2025"

// Different months, same year
formatDateRange("2025-10-14", "2025-11-14");
// Output: "14 Okt - 14 Nov 2025"

// Different years
formatDateRange("2025-10-14", "2026-01-14");
// Output: "14 Okt 2025 - 14 Jan 2026"
```

**Use Cases:**
- Event duration
- Date range filters
- Booking periods
- Reporting periods

---

## Indonesian Month Names

### Abbreviations (3 letters)
- Jan, Feb, Mar, Apr, Mei, Jun
- Jul, Agt, Sep, Okt, Nov, Des

### Full Names
- Januari, Februari, Maret, April, Mei, Juni
- Juli, Agustus, September, Oktober, November, Desember

---

## Usage Examples

### In Vue Components

```vue
<template>
  <div>
    <!-- Display formatted date-time -->
    <p>{{ formatDateTimeIndonesian(log.created_at) }}</p>

    <!-- Display date only -->
    <p>{{ formatDateIndonesian(user.birthdate) }}</p>

    <!-- Display relative time -->
    <p>{{ formatRelativeTime(comment.created_at) }}</p>
  </div>
</template>

<script setup lang="ts">
import {
  formatDateTimeIndonesian,
  formatDateIndonesian,
  formatRelativeTime,
} from "~/utils/format-date";

const log = ref({ created_at: "2025-10-14T09:23:00" });
const user = ref({ birthdate: "1990-05-15" });
const comment = ref({ created_at: "2025-10-14T07:00:00" });
</script>
```

### In Composables

```typescript
import { formatDateTimeIndonesian } from "~/utils/format-date";

export function useActivityLogger() {
  const logActivity = (activity: Activity) => {
    console.log(`Activity at ${formatDateTimeIndonesian(activity.timestamp)}`);
  };

  return { logActivity };
}
```

### In Computed Properties

```typescript
const formattedDate = computed(() => {
  return formatDateTimeIndonesian(props.timestamp);
});
```

---

## Error Handling

All formatters include error handling:

```typescript
// Invalid dates return "-"
formatDateTimeIndonesian("invalid-date");
// Output: "-"

formatDateTimeIndonesian(null);
// Output: "-"

formatDateTimeIndonesian(undefined);
// Output: "-"
```

Errors are logged to console but don't break the UI.

---

## Best Practices

### 1. Choose the Right Formatter

- **Activity logs, notifications**: Use `formatDateTimeIndonesian()`
- **Birth dates, registration**: Use `formatDateIndonesian()`
- **Social features**: Use `formatRelativeTime()`
- **Official docs**: Use `formatDateFullMonth()`

### 2. Handle Null/Undefined

All formatters safely handle null/undefined values:

```typescript
// Safe - returns "-"
formatDateTimeIndonesian(user.lastLogin);
```

### 3. Consistent Formatting

Use the same formatter throughout a feature for consistency:

```typescript
// Good - consistent
const dates = logs.map(log => formatDateTimeIndonesian(log.created_at));

// Avoid - mixing formats without reason
const dates = logs.map((log, i) =>
  i % 2
    ? formatDateTimeIndonesian(log.created_at)
    : formatDateIndonesian(log.created_at)
);
```

### 4. Timezone Awareness

JavaScript Date objects use the local timezone. Ensure your API returns ISO 8601 formatted dates with timezone information:

```typescript
// Good - includes timezone
"2025-10-14T09:23:00+07:00"
"2025-10-14T09:23:00Z"

// Problematic - ambiguous timezone
"2025-10-14T09:23:00"
```

---

## Migration Guide

### Old Code

```typescript
const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return "-";
  }
};
```

### New Code

```typescript
import { formatDateTimeIndonesian } from "~/utils/format-date";

// That's it! Just use the imported function
formatDateTimeIndonesian(dateString);
```

**Benefits:**
- ✅ Consistent formatting across the app
- ✅ Indonesian month names (Okt instead of 10)
- ✅ Better readability (14 Okt 2025 • 09:23)
- ✅ Less code duplication
- ✅ Centralized maintenance

---

## Testing

```typescript
import { formatDateTimeIndonesian } from "~/utils/format-date";

// Test valid date
expect(formatDateTimeIndonesian("2025-10-14T09:23:00"))
  .toBe("14 Okt 2025 • 09:23");

// Test null
expect(formatDateTimeIndonesian(null)).toBe("-");

// Test Date object
expect(formatDateTimeIndonesian(new Date("2025-10-14T09:23:00")))
  .toBe("14 Okt 2025 • 09:23");
```

---

## Common Issues

### Issue: Wrong timezone

**Problem:** Date shows incorrect time.

**Solution:** Ensure your API sends dates with timezone information.

### Issue: Showing "-" instead of date

**Problem:** Date value is invalid.

**Solution:** Check the date value in console:
```typescript
console.log("Date value:", dateString);
console.log("Formatted:", formatDateTimeIndonesian(dateString));
```

### Issue: Month shows as number

**Problem:** Using old formatter or wrong locale.

**Solution:** Import and use `formatDateTimeIndonesian` from `~/utils/format-date`.

---

## Future Enhancements

Potential additions to consider:

- [ ] Week day names (Senin, Selasa, etc.)
- [ ] Fiscal year formatting
- [ ] Custom format patterns
- [ ] Locale switching (ID/EN)
- [ ] Quarter formatting (Q1 2025, etc.)

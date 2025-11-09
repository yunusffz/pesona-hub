# Activity Logging Guide

## Overview

This guide explains how to use the product activity logging system in the Pesona Hub application. The logging system provides type-safe methods for tracking user interactions with products.

## Architecture

### Files Structure

```
app/
├── types/
│   └── activity-log.ts          # Type definitions for logging
├── composables/
│   └── useProductActivityLogger.ts  # Main logging composable
└── queries/
    └── useActivityLogs.ts       # API mutation hook
```

## Usage

### Basic Setup

Import the composable in your component:

```vue
<script setup lang="ts">
import { useProductActivityLogger } from "~/composables/useProductActivityLogger";
import type { ProductWithRelations } from "~/types/product";

const product = ref<ProductWithRelations>();
const { logProductView, logProductCollaboration, logProductClick } = useProductActivityLogger();
</script>
```

### Common Logging Scenarios

#### 1. Log Product View

Track when users view a product detail page:

```typescript
const { logProductView } = useProductActivityLogger();

// Simple view log
logProductView(product.value);

// With additional options
logProductView(product.value, {
  accessType: "public",
  viewDuration: 5000, // milliseconds
  referrer: "search_page"
});
```

#### 2. Log Product Collaboration Request

Track when users request collaboration (e.g., WhatsApp contact):

```typescript
const { logProductCollaboration } = useProductActivityLogger();

const handleCollaborationRequest = () => {
  // Logs product info, price, quantity, KUPS data, and user data
  logProductCollaboration(product.value, quantity.value, {
    accessType: "public",
    message: "WhatsApp collaboration request"
  });

  // Open WhatsApp or perform other actions
  // ...
};
```

#### 3. Log Product Click

Track specific interactions like button clicks:

```typescript
const { logProductClick } = useProductActivityLogger();

const handleAddToCart = () => {
  logProductClick(product.value, {
    clickTarget: "add_to_cart_button",
    extraData: {
      quantity: quantity.value,
      variant: selectedVariant.value
    }
  });
};
```

#### 4. Log Product Share

Track when users share products:

```typescript
const { logProductShare } = useProductActivityLogger();

const handleShare = (method: 'whatsapp' | 'email' | 'link') => {
  logProductShare(product.value, {
    shareMethod: method,
    extraData: {
      share_text: "Check out this product!"
    }
  });
};
```

#### 5. Custom Event Logging

For custom events not covered by the standard methods:

```typescript
const { logCustomEvent } = useProductActivityLogger();

logCustomEvent("export", product.value, {
  accessType: "internal",
  extraData: {
    export_format: "pdf",
    timestamp: Date.now()
  }
});
```

## What Data is Logged?

### Automatic Data Collection

The composable automatically collects and includes:

#### Product Data
- product_name
- product_id
- product_price
- product_quantity (if provided)
- product_unit
- total_price (calculated)
- product_usage
- product_description
- product_category
- commodity_name
- commodity_id

#### KUPS (Business Group) Data
- kups_name
- kups_class
- kups_contact
- kups_id

#### User Data (if authenticated)
- user_id
- user_name
- user_email
- user_phone

### Custom Extra Data

You can add custom data via the `extraData` option:

```typescript
logProductClick(product.value, {
  clickTarget: "buy_now",
  extraData: {
    payment_method: "credit_card",
    coupon_code: "SAVE10",
    is_first_purchase: true
  }
});
```

## Event Types

Available event types (from API schema):

- `view` - Viewing a resource
- `click` - Clicking on an element
- `create` - Creating a resource (used for collaboration requests)
- `update` - Updating a resource
- `delete` - Deleting a resource
- `share` - Sharing a resource
- `export` - Exporting data
- `download` - Downloading files
- `upload` - Uploading files
- `api_access` - API access tracking
- `authenticate` - Authentication events

## Entity Types

Available entity types:

- `product` - Product-related activities
- `location` - Location-related activities
- `social_forestry_group` - Group-related activities
- `user` - User-related activities
- `page` - Page view tracking
- And more...

## Access Types

- `public` - Publicly accessible data
- `internal` - Internal company data
- `private` - Private/sensitive data

## Helper Functions

If you need more control, use the helper functions directly:

```typescript
const {
  getProductLogData,
  getKUPSLogData,
  getUserLogData
} = useProductActivityLogger();

// Get structured data
const productData = getProductLogData(product.value, quantity.value);
const kupsData = getKUPSLogData(product.value);
const userData = getUserLogData();

// Use for custom purposes
console.log("Product Data:", productData);
```

## Best Practices

### 1. Log Important Actions
Focus on logging business-critical actions:
- Product views
- Collaboration requests
- Purchase attempts
- Downloads/exports
- Share actions

### 2. Don't Over-Log
Avoid logging every minor interaction. Focus on meaningful events.

### 3. Use Appropriate Event Types
Choose the event type that best matches the action:
- Use `view` for page views
- Use `click` for button clicks
- Use `create` for new collaboration requests
- Use `share` for sharing actions

### 4. Add Context with Extra Data
Include relevant context in `extraData`:
```typescript
logProductClick(product.value, {
  clickTarget: "quick_view",
  extraData: {
    source_page: "catalog_list",
    filter_applied: "coffee",
    sort_order: "price_asc"
  }
});
```

### 5. Respect User Privacy
Only log necessary data and follow privacy regulations.

## Example: Complete Product Detail Page

```vue
<template>
  <div>
    <h1>{{ product?.name }}</h1>
    <button @click="handleCollaboration">Request Collaboration</button>
    <button @click="handleShare">Share</button>
  </div>
</template>

<script setup lang="ts">
import { useProductActivityLogger } from "~/composables/useProductActivityLogger";
import type { ProductWithRelations } from "~/types/product";

const props = defineProps<{
  product?: ProductWithRelations;
}>();

const quantity = ref(1);
const {
  logProductView,
  logProductCollaboration,
  logProductShare
} = useProductActivityLogger();

// Log view when component mounts
onMounted(() => {
  if (props.product) {
    logProductView(props.product, {
      accessType: "public"
    });
  }
});

const handleCollaboration = () => {
  if (!props.product) return;

  logProductCollaboration(props.product, quantity.value, {
    accessType: "public",
    message: "Collaboration request via WhatsApp"
  });

  // Open WhatsApp or other action
  // ...
};

const handleShare = () => {
  if (!props.product) return;

  logProductShare(props.product, {
    shareMethod: "whatsapp"
  });

  // Share logic
  // ...
};
</script>
```

## Troubleshooting

### Logs Not Appearing
1. Check network tab for API calls to `/analytics/log`
2. Verify the product object has required fields (id, name, etc.)
3. Check console for errors

### Type Errors
1. Ensure you're passing the correct product type (`ProductWithRelations`)
2. Check that event types match the API schema
3. Verify extra data structure

### Missing Data in Logs
1. The logging is fire-and-forget (async)
2. Check if user is authenticated for user data
3. Verify product has related data (commodity, KUPS, etc.)

## API Reference

See the full API schema in `app/types/pesona-hub-api.d.ts` under:
- `LogActivityRequest`
- `EventType`
- `EntityType`
- `AccessType`

For custom type definitions, see `app/types/activity-log.ts`.

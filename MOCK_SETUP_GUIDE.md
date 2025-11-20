# 🧪 Mock API Setup Guide - Pesona Hub

Complete guide to setting up and using the offline mock API for testing all modules of the Pesona Hub application.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Setup](#quick-setup)
- [What's Mocked](#whats-mocked)
- [Using Mock Mode](#using-mock-mode)
- [Testing Credentials](#testing-credentials)
- [Available Mock Data](#available-mock-data)
- [Configuration Options](#configuration-options)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project now includes a **complete offline mock API system** powered by [Mock Service Worker (MSW)](https://mswjs.io/). This allows you to:

- ✅ Develop and test **without internet connection**
- ✅ Test all features **without relying on external API**
- ✅ Work with **predictable, consistent data**
- ✅ Simulate **different scenarios and edge cases**
- ✅ **Fast development** with instant responses

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
pnpm install
# or
npm install
```

This installs MSW along with other dependencies.

### Step 2: Initialize MSW Service Worker

Run this command to generate the service worker file:

```bash
npx msw init public/ --save
```

This creates `public/mockServiceWorker.js` which intercepts HTTP requests in the browser.

### Step 3: Enable Mock Mode

**Option A: Use the mock environment file (Recommended)**

```bash
# Windows (Command Prompt)
copy .env.mock .env

# Windows (PowerShell)
Copy-Item .env.mock .env

# Linux/Mac
cp .env.mock .env
```

**Option B: Manually edit .env**

```env
NUXT_PUBLIC_USE_MOCKS=true
NUXT_PUBLIC_MOCK_DELAY=500
```

### Step 4: Start Development Server

```bash
pnpm dev
# or
npm run dev
```

**Success!** You should see this message in the browser console:

```
[MSW] Mock API is enabled. All API requests will be intercepted.
```

## 📦 What's Mocked

### ✅ Complete Feature Coverage

All major application modules are fully mocked:

| Module | Endpoints Mocked | Mock Data Records |
|--------|-----------------|-------------------|
| **Authentication** | Login, Register, Logout, Refresh Token, Current User | 5 users |
| **Products** | List, Detail, Search, Filter, Pagination | 20 products |
| **Commodities** | List, Detail, Priorities | 15 commodities |
| **Locations** | List, Detail, Filter by Province/District | 42 locations |
| **KUPS (Business Groups)** | List, Detail, Search | 10 groups |
| **Users** | List, Detail, Update, Delete | 5 users |
| **Collaborations** | List, Detail, Impacts | 4 collaborations |
| **Analytics** | Activity Logs, Statistics, Trending | 14+ logs |
| **File Upload** | Upload, Get, Delete | Dynamic |

### 🎭 Realistic Mock Data

- **Users**: Admin and partner accounts with complete profiles
- **Products**: Diverse forest products (Kopi, Madu, Kayu, Bambu, etc.)
- **Locations**: 10+ provinces across Indonesia
- **Relationships**: Fully linked data (Products → Commodities → KUPS → Locations)

## 🎮 Using Mock Mode

### Toggle Mock Mode On/Off

**Enable Mocks:**
```env
NUXT_PUBLIC_USE_MOCKS=true
```

**Disable Mocks (use real API):**
```env
NUXT_PUBLIC_USE_MOCKS=false
```

**Restart the dev server** after changing this setting.

### Adjust Network Simulation Speed

Simulate different network conditions:

```env
# Instant responses (good for rapid development)
NUXT_PUBLIC_MOCK_DELAY=0

# Normal network
NUXT_PUBLIC_MOCK_DELAY=500

# Slow network
NUXT_PUBLIC_MOCK_DELAY=2000
```

## 🔑 Testing Credentials

### Default Login

Use any of these users:

| Username | Role | Password | Features |
|----------|------|----------|----------|
| `partner1` | PARTNER | `password123` | Full partner features, collaboration commodities |
| `partner2` | PARTNER | `password123` | Different province and commodities |
| `partner3` | PARTNER | `password123` | Different province and commodities |
| `partner4` | PARTNER | `password123` | Different province and commodities |
| `admin` | ADMINISTRATOR | `password123` | Full admin access |

**All mock users use the same password: `password123`**

### Registration Testing

You can register new users! The mock API will:
- Validate username/email uniqueness
- Add the new user to mock data
- Return authentication tokens
- The new user persists until you restart the server

## 📊 Available Mock Data

### Products (20 items)

Sample products across different categories:
- Kopi Arabika Premium (Rp 150,000/kg)
- Madu Hutan Multiflora (Rp 200,000/liter)
- Kayu Jati Grade A (Rp 5,000,000/m³)
- Bambu Petung (Rp 25,000/batang)
- Gaharu Super (Rp 8,000,000/kg)
- And 15 more...

**Test filtering by:**
- Commodity type
- Province location
- Price range
- Search by name

### Commodities (15 types)

Forest products including:
- Kopi (Coffee)
- Kakao (Cocoa)
- Madu (Honey)
- Kayu Jati (Teak Wood)
- Bambu (Bamboo)
- Rotan (Rattan)
- Gaharu, Cendana, Pala, Aren, Karet, etc.

**Priority classifications:**
- PRIORITAS (Priority commodities)
- NON_PRIORITAS (Non-priority)

### Locations (42+ entries)

Coverage across provinces:
- Jawa Barat, Jawa Tengah, Jawa Timur
- Kalimantan Barat, Tengah, Timur
- Sulawesi Selatan
- Sumatera Utara, Barat
- Lampung
- Nusa Tenggara Barat

### KUPS - Business Groups (10 groups)

Classifications:
- PEMULA (Beginner)
- MADYA (Intermediate)
- UTAMA (Advanced)

Each with complete contact info, location, and business details.

## ⚙️ Configuration Options

### Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NUXT_PUBLIC_USE_MOCKS` | boolean | `false` | Enable/disable mock mode |
| `NUXT_PUBLIC_MOCK_DELAY` | number | `500` | Network delay in milliseconds |
| `NUXT_PUBLIC_BASE_API_URL` | string | - | Real API URL (used when mocks disabled) |

### Files

| File | Purpose |
|------|---------|
| `.env` | Active environment config |
| `.env.mock` | Pre-configured for mock mode |
| `public/mockServiceWorker.js` | MSW service worker (generated) |
| `app/mocks/` | All mock data and handlers |

## 🔄 Common Workflows

### 1. Test User Registration Flow

```typescript
// Register new user
POST /auth/register
{
  "name": "Test User",
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "PARTNER"
}

// Login with new user
POST /auth/login
username=testuser&password=password123

// Get current user profile
GET /me
```

### 2. Test Product Catalog

```typescript
// List all products
GET /products

// Search for coffee products
GET /products?filters[name][$contains]=kopi

// Filter by location (Jawa Barat)
GET /products?filters[social_forestry_business_group][location][province][$eq]=Jawa Barat

// Filter by commodity (Kopi = ID 1)
GET /products?filters[commodity_id][$eq]=1

// Price range filter (100k - 500k)
GET /products?filters[price][$gte]=100000&filters[price][$lte]=500000

// Paginate (page 2, 10 items)
GET /products?pagination[page]=2&pagination[pageSize]=10

// Sort by price ascending
GET /products?sort[0]=price:asc
```

### 3. Test Profile Management

```typescript
// Get current user
GET /me

// Update user profile
PATCH /users/partner1
{
  "name": "Updated Name",
  "phone": "081234567890",
  "details": {
    "province": "Jawa Barat",
    "address": "New address",
    "collaboration_commodities": {
      "1": 2000,
      "3": 1000
    }
  }
}

// Upload profile picture
POST /files
FormData: file=<image file>
```

### 4. Test Analytics

```typescript
// Log product view
POST /analytics/log
{
  "event_type": "view",
  "entity_type": "product",
  "entity_id": 1,
  "entity_slug": "kopi-arabika-premium",
  "access_type": "public"
}

// Get product statistics
GET /analytics/product/1/stats

// Get trending products
GET /analytics/trending/product

// Get activity logs
GET /analytics?filters[entity_type][$eq]=product&filters[event_type][$eq]=view
```

### 5. Test Collaborations

```typescript
// List all collaborations
GET /collaborations

// Filter by status
GET /collaborations?filters[status][$eq]=ACTIVE

// Filter by partner
GET /collaborations?filters[partner_id][$eq]=2

// Get collaboration detail
GET /collaborations/1

// Get collaboration impacts
GET /collaboration-impacts?filters[collaboration_id][$eq]=1
```

## 🐛 Troubleshooting

### Mocks Not Working

**Problem:** API calls go to real server instead of being mocked.

**Solutions:**

1. **Check environment variable:**
   ```env
   NUXT_PUBLIC_USE_MOCKS=true
   ```

2. **Verify service worker exists:**
   ```bash
   # Should exist: public/mockServiceWorker.js
   npx msw init public/ --save
   ```

3. **Check browser console** for MSW initialization message:
   ```
   [MSW] Mock API is enabled. All API requests will be intercepted.
   ```

4. **Hard refresh** the browser:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

5. **Restart dev server** after changing `.env`

### Service Worker Registration Failed

**Problem:** Console shows service worker errors.

**Solutions:**

1. **Regenerate service worker:**
   ```bash
   npx msw init public/ --save
   ```

2. **Check browser DevTools:**
   - Open DevTools → Application → Service Workers
   - Unregister old workers
   - Refresh page

3. **Clear browser cache:**
   - Hard refresh or clear site data

### Mock Data Not Updating

**Problem:** Changes to mock data files don't appear in the app.

**Solutions:**

1. **Restart dev server** (mock data loads once on start)
2. **Hard refresh browser**
3. **Check file syntax** for TypeScript errors

### Network Delays Too Slow/Fast

**Problem:** Responses too slow or too fast for testing.

**Solution:**

Adjust delay in `.env`:
```env
# Faster
NUXT_PUBLIC_MOCK_DELAY=100

# Slower
NUXT_PUBLIC_MOCK_DELAY=2000
```

### CORS Errors

**Problem:** CORS errors in console.

**Solutions:**

1. **Ensure mocks are enabled** (MSW handles CORS automatically)
2. **Check base URL matches** in handlers (`http://103.235.75.47:5500`)
3. **Verify service worker is active**

### Login Returns 401

**Problem:** Mock login always fails.

**Solutions:**

1. **Use correct credentials:**
   - Username: any from mockUsers (e.g., `partner1`)
   - Password: `password123`

2. **Check handler in `app/mocks/handlers/auth.ts`**

3. **Verify mock user data** in `app/mocks/data/users.ts`

## 📚 Next Steps

### Customize Mock Data

Edit files in `app/mocks/data/` to add/modify mock data:

- `users.ts` - Add more users
- `products.ts` - Add more products
- `commodities.ts` - Add commodity types
- `locations.ts` - Add locations

See `app/mocks/README.md` for detailed customization guide.

### Add New Endpoints

1. Create handler in `app/mocks/handlers/`
2. Export from `app/mocks/handlers/index.ts`
3. Test with mock mode enabled

See `app/mocks/README.md` for examples.

### Integration Testing

Use mocks for predictable integration tests:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
})
```

```typescript
// tests/setup.ts
import { worker } from '~/mocks/browser'

beforeAll(() => worker.start())
afterEach(() => worker.resetHandlers())
afterAll(() => worker.stop())
```

## 🎉 Summary

You now have a **complete offline testing environment** for Pesona Hub!

**Key Benefits:**
- ✅ Test all features without internet
- ✅ Consistent, predictable data
- ✅ Fast iteration (instant responses)
- ✅ Easy scenario testing
- ✅ Demo-ready at any time

For more details, see:
- `app/mocks/README.md` - Technical documentation
- `app/mocks/data/` - Mock data files
- `app/mocks/handlers/` - API endpoint handlers

Happy testing! 🚀

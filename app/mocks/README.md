# Mock API for Offline Testing

This directory contains a complete mock API implementation for testing the Pesona Hub application offline using [Mock Service Worker (MSW)](https://mswjs.io/).

## 📁 Directory Structure

```
app/mocks/
├── data/                    # Mock data fixtures
│   ├── users.ts            # User data & authentication tokens
│   ├── products.ts         # Product catalog data
│   ├── commodities.ts      # Commodity types & priorities
│   ├── locations.ts        # Geographic location data
│   ├── kups.ts             # Social Forestry Business Groups
│   ├── collaborations.ts   # Collaboration & impact data
│   ├── analytics.ts        # Activity logs & statistics
│   └── index.ts            # Data export & utility functions
├── handlers/                # MSW request handlers
│   ├── auth.ts             # Authentication endpoints
│   ├── products.ts         # Product endpoints
│   ├── commodities.ts      # Commodity endpoints
│   ├── locations.ts        # Location endpoints
│   ├── kups.ts             # KUPS endpoints
│   ├── users.ts            # User management endpoints
│   ├── collaborations.ts   # Collaboration endpoints
│   ├── analytics.ts        # Analytics endpoints
│   ├── files.ts            # File upload endpoints
│   └── index.ts            # Handler export
├── browser.ts              # MSW browser worker setup
├── statistics.ts           # Statistics calculation utilities
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

This will install MSW (`msw@^2.7.0`) as a dev dependency.

### 2. Initialize MSW

Generate the MSW service worker file in the `public` directory:

```bash
npx msw init public/ --save
```

This creates `public/mockServiceWorker.js` which MSW uses to intercept network requests.

### 3. Enable Mock Mode

#### Option A: Using Environment Variables

Set `NUXT_PUBLIC_USE_MOCKS=true` in your `.env` file:

```env
NUXT_PUBLIC_USE_MOCKS=true
NUXT_PUBLIC_MOCK_DELAY=500
```

#### Option B: Using the Mock Environment File

Copy the pre-configured mock environment file:

```bash
# Windows
copy .env.mock .env

# Linux/Mac
cp .env.mock .env
```

### 4. Start the Development Server

```bash
npm run dev
```

You should see a console message:
```
[MSW] Mock API is enabled. All API requests will be intercepted.
```

## 📊 Mock Data Overview

### Users
- **5 mock users** (1 admin, 4 partners)
- Default credentials:
  - Username: `partner1` (or any username in mockUsers)
  - Password: `password123` (works for all mock users)
- Includes profile data, collaboration preferences, contact info

### Products
- **20 diverse products** across different commodities
- Realistic pricing, stock quantities, descriptions
- Associated with KUPS and locations
- Images paths included (placeholders)

### Commodities
- **15 forest product types** (Kopi, Kakao, Madu, Kayu, etc.)
- Priority classifications (PRIORITAS / NON_PRIORITAS)

### Locations
- **42+ locations** across 10+ provinces
- Complete address hierarchy (province, district, sub-district, village)

### KUPS (Social Forestry Business Groups)
- **10 business groups** with different classifications
- Contact information, group sizes, establishment years
- Linked to locations and products

### Collaborations
- **4 collaboration records** with different statuses
- Supply agreements, purchase orders
- Impact tracking (economic, social, environmental)

### Activity Logs
- **14+ activity logs** for analytics
- Events: view, click, share, create, update
- Used for trending products and statistics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NUXT_PUBLIC_USE_MOCKS` | Enable/disable mock mode | `false` |
| `NUXT_PUBLIC_MOCK_DELAY` | Simulated network delay (ms) | `500` |

### Customizing Mock Delay

Adjust network simulation speed by changing the delay in `.env`:

```env
# Instant responses
NUXT_PUBLIC_MOCK_DELAY=0

# Slow network simulation
NUXT_PUBLIC_MOCK_DELAY=2000
```

## 📝 Using Mock Data

### Authentication

**Login:**
- Any username from `mockUsers` (e.g., `partner1`, `admin`)
- Password: `password123`
- Returns mock access and refresh tokens

**Current User:**
- Returns the first PARTNER user by default
- Modify `app/mocks/handlers/auth.ts` to change default user

### Filtering & Pagination

All list endpoints support Strapi-style filtering:

**Products with filters:**
```typescript
// Search by name
GET /products?filters[name][$contains]=kopi

// Filter by commodity
GET /products?filters[commodity_id][$eq]=1

// Filter by province
GET /products?filters[social_forestry_business_group][location][province][$eq]=Jawa Barat

// Price range
GET /products?filters[price][$gte]=100000&filters[price][$lte]=500000

// Pagination
GET /products?pagination[page]=1&pagination[pageSize]=25

// Sorting
GET /products?sort[0]=price:asc
```

### File Uploads

File uploads return mock URLs:

```typescript
const formData = new FormData()
formData.append('file', file)

// Returns mock file object with URL
// { id: 1, object_name: "mock-upload-1-timestamp.jpg", url: "/uploads/..." }
```

## 🧪 Testing Scenarios

### Test User Roles

```typescript
// Partner user (has collaboration_commodities)
Username: partner1
Role: PARTNER
Features: Can collaborate, view catalog, manage profile

// Admin user
Username: admin
Role: ADMINISTRATOR
Features: Full access to all features
```

### Test Product Catalog

- **Filter by priority commodities** (Kopi, Kakao, Kayu Jati)
- **Search functionality** (try "madu", "bambu", "karet")
- **Location-based filtering** (Jawa Barat, Kalimantan Barat)
- **Price range filtering**
- **Pagination** (25 items per page by default)

### Test Analytics

- **Product views** are logged automatically
- **Collaboration requests** create activity logs
- **Trending products** based on view/click/share counts
- **Dashboard statistics** calculated from mock data

### Test Collaborations

- View active, pending, and completed collaborations
- Filter by partner or status
- View collaboration impacts (economic, social, environmental)

## 🛠️ Extending Mock Data

### Adding New Products

Edit `app/mocks/data/products.ts`:

```typescript
export const mockProducts: Product[] = [
  // ... existing products
  {
    id: 21,
    name: 'Your New Product',
    description: 'Description here',
    price: 100000,
    unit: 'kg',
    commodity_id: 1,
    commodity: mockCommodities[0],
    social_forestry_business_group_id: 1,
    social_forestry_business_group: mockKUPS[0],
    stock_quantity: 500,
    minimum_order: 10,
    images: ['/images/products/your-product.jpg'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
```

### Adding New API Endpoints

1. Create handler in `app/mocks/handlers/`:

```typescript
// app/mocks/handlers/your-feature.ts
import { http, HttpResponse, delay } from 'msw'
import { createSuccessResponse } from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

export const yourFeatureHandlers = [
  http.get(`${BASE_URL}/your-endpoint`, async ({ request }) => {
    await delay(500)

    return HttpResponse.json(
      createSuccessResponse({ /* your data */ })
    )
  }),
]
```

2. Export from `app/mocks/handlers/index.ts`:

```typescript
import { yourFeatureHandlers } from './your-feature'

export const handlers = [
  // ... existing handlers
  ...yourFeatureHandlers,
]
```

### Modifying Response Delays

Per-handler delay customization:

```typescript
// Fast response
await delay(100)

// Slow response (simulating large data transfer)
await delay(2000)

// Use config delay
const config = useRuntimeConfig()
await delay(config.public.mockDelay)
```

## 🔍 Debugging

### Check if Mocks are Active

Open browser console, you should see:
```
[MSW] Mock API is enabled. All API requests will be intercepted.
```

### View Intercepted Requests

MSW logs all intercepted requests in the console with format:
```
[MSW] GET /products (200)
```

### Inspect Mock Data

In browser console:
```javascript
// Access mock data
import { mockProducts } from '~/mocks/data'
console.log(mockProducts)
```

### Disable Mocks Temporarily

Set environment variable:
```env
NUXT_PUBLIC_USE_MOCKS=false
```

Or comment out the plugin in `nuxt.config.ts` (not recommended).

## 📚 API Coverage

### ✅ Fully Mocked Endpoints

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `GET /me` - Get current user
- `GET /users` - List users (with filters)
- `GET /users/:username` - Get user by username
- `PATCH /users/:username` - Update user
- `DELETE /users/:username` - Delete user
- `GET /products` - List products (with filters, search, pagination, sorting)
- `GET /products/:id` - Get product detail
- `GET /commodities` - List commodities
- `GET /commodities/:id` - Get commodity detail
- `GET /commodities/priorities` - List priorities
- `GET /locations` - List locations (with filters)
- `GET /locations/:id` - Get location detail
- `GET /social-forestry-business-groups` - List KUPS (with filters)
- `GET /social-forestry-business-groups/:id` - Get KUPS detail
- `GET /collaborations` - List collaborations (with filters)
- `GET /collaborations/:id` - Get collaboration detail
- `GET /collaboration-impacts` - List collaboration impacts
- `GET /collaboration-impacts/:id` - Get impact detail
- `POST /analytics/log` - Log activity
- `GET /analytics` - Get activity logs (with filters)
- `GET /analytics/:type/:id/stats` - Get entity statistics
- `GET /analytics/trending/:type` - Get trending entities
- `POST /files` - Upload file
- `GET /files/:id` - Get file
- `DELETE /files/:id` - Delete file

### ⚠️ Stub Endpoints (Not Implemented)

The following admin-only endpoints return stub responses and are not needed for main features:
- Data harvesting endpoints (`/harvesting/*`)
- Settings endpoints (`/settings/*`)
- Economics endpoints (`/economics/*`)
- Certifications endpoints (`/certifications/*`)

Add handlers for these in `app/mocks/handlers/` if needed.

## 🎯 Use Cases

### 1. Offline Development
Work on the frontend without internet or API access.

### 2. Demo/Presentation
Showcase features without relying on external API availability.

### 3. Fast Iteration
Instant responses (delay=0) for rapid UI development.

### 4. Edge Case Testing
Easily modify mock data to test:
- Empty states (no products)
- Large datasets (1000+ products)
- Error scenarios (modify handlers to return errors)
- Different user roles and permissions

### 5. Integration Testing
Test component behavior with predictable data.

## 🐛 Troubleshooting

### Mocks Not Working

1. **Check service worker registration:**
   ```bash
   npx msw init public/ --save
   ```

2. **Verify environment variable:**
   ```env
   NUXT_PUBLIC_USE_MOCKS=true
   ```

3. **Check console for errors**

4. **Hard refresh browser** (Ctrl+Shift+R / Cmd+Shift+R)

### Service Worker Errors

If you see service worker registration errors:

1. Ensure `public/mockServiceWorker.js` exists
2. Check browser DevTools > Application > Service Workers
3. Unregister old service workers if needed
4. Clear browser cache

### CORS Errors

MSW handles CORS automatically. If you see CORS errors:
- Ensure mocks are enabled (`NUXT_PUBLIC_USE_MOCKS=true`)
- Check that the handler base URL matches your API URL

### Mock Data Not Updating

Mock data is loaded once when the app starts. To reset:
1. Restart the dev server
2. Or hard refresh the browser

## 📖 Additional Resources

- [MSW Documentation](https://mswjs.io/docs/)
- [MSW Browser Integration](https://mswjs.io/docs/integrations/browser)
- [Nuxt 3 Plugins](https://nuxt.com/docs/guide/directory-structure/plugins)
- [Strapi Filters](https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication)

## 🤝 Contributing

To add new mock data or handlers:

1. Add mock data to `app/mocks/data/`
2. Create handler in `app/mocks/handlers/`
3. Export handler from `app/mocks/handlers/index.ts`
4. Test with `NUXT_PUBLIC_USE_MOCKS=true`
5. Update this README with new endpoints

## 📄 License

This mock implementation follows the same license as the main project.

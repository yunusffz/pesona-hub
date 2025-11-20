# 🚀 Quick Start - Mock API is Ready!

## ✅ Setup Complete!

The mock API has been successfully configured and is ready to use.

## 🎯 How to Use It

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Check Mock Mode is Active

Open your browser to `http://localhost:3000` and check the console. You should see:

```
[MSW] Mock API is enabled. All API requests will be intercepted.
```

### 3. Test Login

Use these credentials to log in:

| Username | Password | Role |
|----------|----------|------|
| `partner1` | `password123` | PARTNER |
| `partner2` | `password123` | PARTNER |
| `admin` | `password123` | ADMINISTRATOR |

**All mock users use the same password: `password123`**

### 4. What You Can Test

#### ✅ Authentication
- Login with any mock user
- Register new users
- View current user profile
- Logout

#### ✅ Product Catalog
- Browse 20 mock products
- Search for products (try "kopi", "madu", "bambu")
- Filter by:
  - Commodity type (Kopi, Kakao, Madu, etc.)
  - Province (Jawa Barat, Kalimantan, etc.)
  - Price range
- Paginate through results
- Sort by price

#### ✅ User Profile
- View profile information
- Update profile details
- Upload profile picture (mock)
- Manage collaboration commodities

#### ✅ Dashboard/Analytics
- View statistics (KUPS count, products count, provinces)
- Activity logs
- Trending products

#### ✅ Collaborations
- View collaborations
- Filter by status (ACTIVE, PENDING, COMPLETED)
- View collaboration impacts

## 🔄 Toggle Mock Mode

### Enable Mock Mode (Offline Testing)

Edit `.env`:
```env
NUXT_PUBLIC_USE_MOCKS=true
```

### Disable Mock Mode (Use Real API)

Edit `.env`:
```env
NUXT_PUBLIC_USE_MOCKS=false
```

**Restart the dev server after changing this setting.**

## ⚡ Adjust Response Speed

Edit `.env`:

```env
# Instant responses (for fast development)
NUXT_PUBLIC_MOCK_DELAY=0

# Normal speed
NUXT_PUBLIC_MOCK_DELAY=500

# Slow network simulation
NUXT_PUBLIC_MOCK_DELAY=2000
```

## 📊 Mock Data Overview

**What's Available:**
- 5 Users (1 admin, 4 partners)
- 20 Products (across 15 commodities)
- 15 Commodities (Kopi, Kakao, Madu, Kayu Jati, Bambu, etc.)
- 42 Locations (10+ provinces)
- 10 KUPS (Social Forestry Business Groups)
- 4 Collaborations
- 14+ Activity Logs

## 🎨 Example Workflows

### Test Product Search
1. Go to `/katalog`
2. Search for "kopi"
3. Filter by province "Jawa Barat"
4. Sort by price
5. View product details

### Test User Registration
1. Go to `/register`
2. Register with:
   - Name: "Test User"
   - Username: "testuser123"
   - Email: "test@example.com"
   - Password: "password123"
3. Login with new credentials
4. Complete profile

### Test Analytics
1. Login as partner
2. View products (activity logged automatically)
3. Check dashboard for statistics
4. View trending products

## 🐛 Troubleshooting

### Mock not working?

1. **Check console** - Should see `[MSW] Mock API is enabled...`
2. **Verify .env** - `NUXT_PUBLIC_USE_MOCKS=true`
3. **Restart server** - Stop and run `npm run dev` again
4. **Hard refresh browser** - `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Service worker errors?

```bash
# Regenerate service worker
npx msw init public/ --save
```

### Need help?

See detailed documentation:
- `MOCK_SETUP_GUIDE.md` - Complete setup guide
- `app/mocks/README.md` - Technical documentation
- `MOCK_IMPLEMENTATION_SUMMARY.md` - Full overview

## 🎉 You're Ready!

**Mock mode is active!** All API requests will be intercepted and return mock data.

You can now:
- ✅ Develop offline
- ✅ Test all features
- ✅ Demo the application
- ✅ Test edge cases
- ✅ Iterate quickly

Start the dev server and enjoy fast, predictable testing! 🚀

---

**Current Status:**
- ✅ MSW installed
- ✅ Service worker initialized
- ✅ Mock mode enabled
- ✅ Ready to use!

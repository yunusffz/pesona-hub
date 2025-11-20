# 🧪 Test Login - Step by Step Guide

## ✅ Pre-requisites

Make sure mock mode is enabled:

```bash
# Check .env file has this:
NUXT_PUBLIC_USE_MOCKS=true
```

## 🚀 Start Testing

### Step 1: Start the Server

```bash
npm run dev
```

Wait for the server to start, then open: `http://localhost:3000`

### Step 2: Open Browser Console

Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

**Expected console message:**
```
[MSW] Mock API is enabled. All API requests will be intercepted.
```

✅ If you see this, mocks are working!

## 🔐 Test Login Flow

### Test A: Login as Partner 1

1. **Go to:** `/login`

2. **Enter credentials:**
   - Username: `partner1`
   - Password: `password123`

3. **Click:** "Login" button

4. **Expected result:**
   - ✅ Redirected to dashboard or home
   - ✅ User menu shows "PT Mitra Sejahtera"
   - ✅ No errors in console

5. **Go to:** `/profil`

6. **Verify profile data:**
   - ✅ Name: PT Mitra Sejahtera
   - ✅ Username: partner1
   - ✅ Email: partner1@example.com
   - ✅ Province: Jawa Barat
   - ✅ Commodities: Kopi (1000 kg), Madu (500 kg), Kayu Jati (2000 unit)

### Test B: Logout and Login as Different User

7. **Click:** Logout button

8. **Expected result:**
   - ✅ Redirected to `/login`
   - ✅ User menu is gone/hidden

9. **Login again as different user:**
   - Username: `partner2`
   - Password: `password123`

10. **Go to:** `/profil`

11. **Verify DIFFERENT profile data:**
    - ✅ Name: CV Berkah Alam (NOT PT Mitra Sejahtera!)
    - ✅ Username: partner2 (NOT partner1!)
    - ✅ Email: partner2@example.com
    - ✅ Province: Jawa Tengah (NOT Jawa Barat!)
    - ✅ Commodities: Kakao (800 kg), Kemiri (1200 kg)

🎉 **If each user shows their own data, login state is working!**

### Test C: Session Persistence

12. **While logged in** (as any user)

13. **Navigate to different pages:**
    - `/katalog` - Product catalog
    - `/dashboard` - Dashboard
    - `/profil` - Profile

14. **Refresh browser** (`F5` or `Ctrl+R`)

15. **Expected result:**
    - ✅ Still logged in
    - ✅ User data still showing
    - ✅ Can access all pages

### Test D: Admin Login

16. **Logout** (if logged in)

17. **Login as admin:**
    - Username: `admin`
    - Password: `password123`

18. **Go to:** `/profil`

19. **Verify admin profile:**
    - ✅ Name: Administrator
    - ✅ Role: ADMINISTRATOR
    - ✅ Province: DKI Jakarta

## 📋 Quick Test Checklist

Use this checklist to verify everything works:

- [ ] Mock mode enabled (`[MSW] Mock API is enabled...` in console)
- [ ] Can login with `partner1` / `password123`
- [ ] Profile shows partner1's data (Jawa Barat)
- [ ] Can logout successfully
- [ ] Can login with `partner2` / `password123`
- [ ] Profile shows partner2's data (Jawa Tengah) - NOT partner1's!
- [ ] Session persists across page navigation
- [ ] Session persists after browser refresh
- [ ] Can login as `admin` / `password123`
- [ ] Admin shows different data than partners

## 🧪 Advanced Tests

### Test E: New User Registration

1. **Go to:** `/register`

2. **Fill in form:**
   - Name: "My Test Company"
   - Username: "testuser123"
   - Email: "testuser@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
   - Role: PARTNER

3. **Submit registration**

4. **Expected result:**
   - ✅ Auto-logged in after registration
   - ✅ Profile shows "My Test Company"
   - ✅ Username shows "testuser123"

5. **Logout and login again:**
   - Username: `testuser123`
   - Password: `password123`

6. **Expected result:**
   - ✅ Can login with newly registered account
   - ✅ Shows same profile data

### Test F: Invalid Credentials

1. **Go to:** `/login`

2. **Try wrong password:**
   - Username: `partner1`
   - Password: `wrongpassword`

3. **Expected result:**
   - ✅ Login fails
   - ✅ Error message shown
   - ✅ Still on login page

4. **Try non-existent user:**
   - Username: `doesnotexist`
   - Password: `password123`

5. **Expected result:**
   - ✅ Login fails
   - ✅ Error message shown

### Test G: Protected Routes

1. **Make sure logged out**

2. **Try to access:** `/profil` (or other protected page)

3. **Expected result:**
   - ✅ Redirected to `/login`
   - ✅ Cannot access protected page

4. **Login** with any user

5. **Try to access:** `/profil` again

6. **Expected result:**
   - ✅ Can access profile page
   - ✅ Shows user data

## 🐛 Troubleshooting

### Issue: "Mock API is enabled" not showing

**Solution:**
1. Check `.env` has `NUXT_PUBLIC_USE_MOCKS=true`
2. Restart dev server (`Ctrl+C`, then `npm run dev`)
3. Hard refresh browser (`Ctrl+Shift+R`)

### Issue: Login succeeds but wrong user data shows

**Solution:**
This was the bug we just fixed! Make sure you have the latest version of `app/mocks/handlers/auth.ts`

1. Restart dev server
2. Clear browser cache
3. Try login again

### Issue: Login fails with network error

**Solution:**
1. Check console for MSW message
2. Verify `public/mockServiceWorker.js` exists
3. Run: `npx msw init public/ --save`
4. Restart dev server

### Issue: Session doesn't persist after refresh

**Solution:**
1. Check browser cookies are enabled
2. Check cookies `access-token` and `refresh-token` are set
3. Open DevTools > Application > Cookies
4. Should see tokens there

### Issue: All users show same data

**Solution:**
The old bug! Update `app/mocks/handlers/auth.ts` with the fixed version that tracks `currentLoggedInUser`

## ✅ Success Criteria

**Login state is working correctly if:**

1. ✅ Can login with different users
2. ✅ Each user sees their OWN data (not someone else's)
3. ✅ Session persists across navigation
4. ✅ Session persists after refresh
5. ✅ Logout clears session
6. ✅ Can register new users
7. ✅ Invalid credentials are rejected
8. ✅ Protected routes require login

If all of these work, **you're good to go!** 🎉

## 📚 Next Steps

After confirming login works:

1. Test product catalog features
2. Test profile management
3. Test collaborations
4. Test analytics/dashboard
5. Test file upload

All features should work with the logged-in user's context!

---

**Need help?** See:
- `LOGIN_FIX_APPLIED.md` - Details about the fix
- `MOCK_SETUP_GUIDE.md` - Complete mock setup
- `app/mocks/README.md` - Technical docs

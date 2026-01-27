# 🔐 How to Login in Mock Mode

## ✅ Mock Mode is Now Fixed!

The registration issue has been resolved. You can now use **both Login and Sign Up** tabs.

---

## 🏥 **Hospital Login**

### Option 1: Use the Login Tab (Recommended)
1. Click the **"Login"** tab
2. Enter ANY credentials:
   ```
   Hospital ID: anything
   Password: anything
   ```
3. Click "Login to Dashboard"

### Option 2: Use the Sign Up Tab
1. Click the **"Sign Up"** tab
2. Fill in the form with ANY data:
   ```
   Hospital Name: Test Hospital
   Location: Salem, TN
   Hospital ID: ABC123
   Contact Email: test@test.com
   Contact Phone: 1234567890
   Password: password
   ```
3. Click "Register Hospital"

**Both options now work!** ✅

---

## 🩸 **Donor Login**

### Option 1: Use the Login Tab
1. Click the **"Login"** tab
2. Enter a demo email:
   ```
   Email: alex.turner@email.com
   OTP: anything
   ```
3. Click "Login to Dashboard"

### Option 2: Use the Sign Up Tab
1. Click the **"Sign Up"** tab
2. Fill in the form:
   ```
   Full Name: Your Name
   Blood Group: A+
   City: Your City
   Email: your@email.com
   Phone: 1234567890
   ```
3. Click "Register as Donor"

---

## 🏦 **Blood Bank Login**

### Option 1: Use the Login Tab
1. Click the **"Login"** tab
2. Enter demo credentials:
   ```
   Blood Bank ID: CBB001
   Password: anything
   ```
3. Click "Login to Dashboard"

### Option 2: Use the Sign Up Tab
1. Click the **"Sign Up"** tab
2. Fill in the form:
   ```
   Blood Bank Name: Test Blood Bank
   Owner Name: Dr. Test
   Location: Your City
   Bank ID: TEST001
   Password: password
   ```
3. Upload any file as certificate
4. Click "Register Blood Bank"

---

## 🎯 Quick Access URLs

After starting the dev server (`npm run dev`):

| Portal | URL |
|--------|-----|
| 🏥 Hospital | `http://localhost:5173/hospital/auth` |
| 🩸 Donor | `http://localhost:5173/donor/auth` |
| 🏦 Blood Bank | `http://localhost:5173/bloodbank/auth` |
| 🏠 Home | `http://localhost:5173/` |

---

## ✅ What Was Fixed

**Problem:** Hospital Sign Up was trying to connect to real backend

**Solution:** Fixed the mock API to return the correct data structure:
- Changed `user` to `hospital` in response
- Added all required fields (city, stats, etc.)
- Now matches what the component expects

---

## 🎭 Mock Mode Behavior

### In Mock Mode:
- ✅ **Any credentials work** for login
- ✅ **Any data works** for registration
- ✅ **No validation** (except required fields)
- ✅ **Instant response** (300-500ms delay)
- ✅ **No backend needed**

### Console Confirmation:
When you start the app, you'll see:
```
🎭 Mock Mode Enabled - Using mock data without backend
```

---

## 🐛 Troubleshooting

### Still seeing errors?
1. **Restart the dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete`
   - Clear cached files
   - Refresh page

3. **Check .env file:**
   ```
   VITE_MOCK_MODE=true
   ```

### Login not working?
- Make sure you're on the **Login** tab, not Sign Up
- Try using the demo credentials shown on the page
- Check browser console for errors

---

## 💡 Pro Tips

### 1. **Fastest Way to Test**
Use the **Login** tab with demo credentials:
- Hospital: `CGH001` / `anything`
- Donor: `alex.turner@email.com` / `anything`
- Blood Bank: `CBB001` / `anything`

### 2. **Testing Registration**
Use the **Sign Up** tab to test the registration flow:
- Fill in any data
- All fields are required
- Click register

### 3. **Switch Between Portals**
Navigate to different portals from the home page:
- Click "Hospital Portal"
- Click "Donor Portal"
- Click "Blood Bank Portal"

---

## 🎉 You're All Set!

**The mock mode is now fully functional!**

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:5173`
3. Choose a portal (Hospital, Donor, or Blood Bank)
4. Login or Sign Up with any credentials
5. Explore the dashboard!

---

**Need more help?** Check these files:
- `QUICK_START.md` - Quick reference
- `MOCK_MODE_GUIDE.md` - Detailed guide
- `README_MOCK_MODE.md` - Overview

**Happy Testing! 🚀**
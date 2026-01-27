# 🚀 QUICK START GUIDE - Vital Drop

## ✅ YOUR SERVERS ARE NOW RUNNING!

Both servers have been started successfully:
- **Backend**: http://localhost:5000 ✅
- **Frontend**: http://localhost:5173 ✅

---

## 📋 NEXT STEPS (Follow in order)

### Step 1: Seed the Database (FIRST TIME ONLY)

Open your browser and go to:
```
http://localhost:5000/api/seed
```

You should see:
```json
{
  "message": "Database seeded successfully",
  "data": { ... }
}
```

**This creates test accounts for you to login with.**

---

### Step 2: Open the Application

Open your browser and go to:
```
http://localhost:5173
```

You should see the **Vital Drop landing page** with:
- Navigation menu (Home, About, Contact, Login)
- Hero section with "Save Lives, Donate Blood"
- Login buttons for Hospital, Donor, and Blood Bank

---

### Step 3: Test Login

Click on **"Hospital Login"** button

Enter these credentials:
```
Hospital ID: CGH001
Password: password123
```

Click **"Sign In"**

You should be redirected to the **Hospital Dashboard** ✅

---

## 🎯 SUCCESS CHECKLIST

Check these to verify everything is working:

- [ ] Backend server window is open and shows "Server running on port 5000"
- [ ] Frontend server window is open and shows "Local: http://localhost:5173/"
- [ ] Visited http://localhost:5000/api/seed and saw success message
- [ ] Visited http://localhost:5173 and saw the landing page
- [ ] Logged in with CGH001 / password123 successfully
- [ ] Can see the Hospital Dashboard

**If all checked ✅, you're done!** 🎉

---

## 🔧 IF YOU SEE "UNABLE TO CONNECT" ERROR

### Quick Fix:

1. **Check if servers are running:**
   - Look for two command windows titled:
     - "Vital Drop Backend"
     - "Vital Drop Frontend"
   - If they're closed, run `fix-connection.bat` again

2. **Check browser console (F12):**
   - Press F12 in your browser
   - Click "Console" tab
   - Look for error messages
   - Common errors:
     - "Failed to fetch" = Backend not running
     - "ERR_CONNECTION_REFUSED" = Frontend not running
     - "CORS error" = Port mismatch (already fixed)

3. **Restart servers:**
   - Close both server windows
   - Double-click `fix-connection.bat` again
   - Wait 15-20 seconds
   - Try accessing http://localhost:5173 again

---

## 📱 TEST ACCOUNTS (After Seeding)

### Hospitals:
```
ID: CGH001, Password: password123
ID: MMC002, Password: password123
```

### Blood Banks:
```
ID: CBB001, Password: password123
ID: WCBS002, Password: password123
```

### Donors:
```
Email: john.smith@email.com
Email: sarah.j@email.com
Email: mbrown@email.com
```
*Note: Donors login with OTP (shown in backend console)*

---

## 🆘 TROUBLESHOOTING

### Problem: "Cannot GET /" error
**Solution**: You're accessing the backend URL. Use http://localhost:5173 (frontend)

### Problem: "This site can't be reached"
**Solution**: 
1. Check if frontend server is running
2. Look for the "Vital Drop Frontend" window
3. If closed, run `fix-connection.bat`

### Problem: Login doesn't work
**Solution**:
1. Make sure you seeded the database first
2. Check backend console for errors
3. Use correct credentials: CGH001 / password123

### Problem: Blank page after login
**Solution**:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Make sure backend is responding: http://localhost:5000/api/health

---

## 📚 MORE HELP

- **Detailed Troubleshooting**: See `TROUBLESHOOTING.md`
- **Visual Guide**: See `VISUAL_GUIDE.md`
- **Complete Setup**: See `HOW_TO_START.md`
- **API Documentation**: See `backend/README.md`

---

## 🎉 YOU'RE ALL SET!

Your Vital Drop application is now running and ready to use!

**Quick Access:**
- Application: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

**Happy Testing! 💉🩸**
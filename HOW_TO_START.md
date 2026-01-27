# 🚀 How to Start Vital Drop - Simple Guide

## ⚡ Quick Start (3 Steps)

### Step 1: Run the Fix Script
```bash
fix-connection.bat
```
This will:
- ✅ Check if MongoDB is running
- ✅ Clear ports 5000 and 5173
- ✅ Install any missing dependencies
- ✅ Start both backend and frontend servers

**Two new windows will open:**
- **Window 1:** Backend server (port 5000)
- **Window 2:** Frontend server (port 5173)

---

### Step 2: Seed the Database
After both servers start (wait ~10 seconds), open your browser and visit:
```
http://localhost:5000/api/seed
```

You should see:
```json
{
  "message": "Database seeded successfully",
  "data": {
    "hospitals": [...],
    "donors": [...],
    "bloodBanks": [...]
  }
}
```

---

### Step 3: Open the Application
Open your browser and visit:
```
http://localhost:5173
```

You should see the **Vital Drop** landing page!

---

## 🔐 Test Login

### Hospital Login
1. Click **"Hospital Login"**
2. Enter credentials:
   - **Hospital ID:** `CGH001`
   - **Password:** `password123`
3. Click **"Login"**
4. You should see the Hospital Dashboard

### Donor Login
1. Click **"Donor Login"**
2. Enter email: `john.doe@example.com`
3. Click **"Send OTP"**
4. **Check the backend terminal window** for the OTP code
5. Look for: `📧 OTP for john.doe@example.com: 123456`
6. Enter the OTP and click **"Verify"**
7. You should see the Donor Dashboard

### Blood Bank Login
1. Click **"Blood Bank Login"**
2. Enter email: `central.bb@example.com`
3. Click **"Send OTP"**
4. **Check the backend terminal window** for the OTP code
5. Enter the OTP and click **"Verify"**
6. You should see the Blood Bank Dashboard

---

## ❌ If Something Goes Wrong

### Problem: "Unable to connect" error

**Solution 1:** Check if servers are running
- Look at the two terminal windows that opened
- Backend should show: `✅ Server running on port 5000`
- Frontend should show: `Local: http://localhost:5173/`

**Solution 2:** Restart everything
1. Close both terminal windows
2. Run `fix-connection.bat` again

**Solution 3:** Check MongoDB
```bash
# Check if MongoDB is running
net start | findstr MongoDB

# If not running, start it
net start MongoDB
```

---

### Problem: Port already in use

**Solution:** The fix script automatically clears ports, but if it doesn't work:
```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Find and kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

---

### Problem: Login fails

**Solution:** Make sure you seeded the database first
```
http://localhost:5000/api/seed
```

---

### Problem: OTP not showing

**Solution:** Check the **backend terminal window** (not frontend)
- OTP is printed in the backend console
- Look for lines starting with `📧 OTP for`

---

## 🔍 Verify Everything is Working

### 1. Check Backend Health
Open browser: `http://localhost:5000/api/health`

Should return:
```json
{"status":"ok","message":"Server is running"}
```

### 2. Check Frontend
Open browser: `http://localhost:5173`

Should show the Vital Drop landing page

### 3. Check Browser Console
Press `F12` to open DevTools, then check Console tab:
- Should NOT see any red errors
- Should see: `Socket connected: <some_id>` (after login)

---

## 📝 Manual Start (Alternative Method)

If the batch script doesn't work, start manually:

### Terminal 1 - Backend:
```bash
cd c:\drop-save-network\backend
npm run dev
```
Wait for: `✅ Server running on port 5000`

### Terminal 2 - Frontend:
```bash
cd c:\drop-save-network
npm run dev
```
Wait for: `Local: http://localhost:5173/`

### Browser - Seed Database:
```
http://localhost:5000/api/seed
```

### Browser - Open App:
```
http://localhost:5173
```

---

## 🎯 What You Should See

### Backend Terminal:
```
✅ MongoDB Connected
✅ Server running on port 5000
Socket.io server initialized
```

### Frontend Terminal:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Browser (http://localhost:5173):
- Hero section with "Save Lives, Donate Blood"
- Three role buttons: Hospital, Donor, Blood Bank
- Navigation menu
- Footer

---

## 🆘 Still Having Issues?

1. **Run diagnostic:**
   ```bash
   diagnose.bat
   ```

2. **Read troubleshooting guide:**
   ```bash
   # Open in text editor:
   TROUBLESHOOTING.md
   ```

3. **Check these requirements:**
   - ✅ Node.js installed (v18 or higher)
   - ✅ MongoDB installed and running
   - ✅ Ports 5000 and 5173 available
   - ✅ Dependencies installed (node_modules folders exist)

---

## 📚 Next Steps After Starting

Once everything is running:

1. **Test all login flows** (Hospital, Donor, Blood Bank)
2. **Explore dashboards** (currently using mock data)
3. **Check real-time notifications** (Socket.io connection)
4. **Read integration guide** to connect components to real API:
   ```
   FRONTEND_BACKEND_INTEGRATION.md
   ```

---

## 🎉 Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Database seeded successfully
- [ ] Can access http://localhost:5173
- [ ] Can login as Hospital (CGH001 / password123)
- [ ] Can login as Donor (with OTP from backend console)
- [ ] No errors in browser console
- [ ] Socket.io connected (check console after login)

---

**Need more help?** Check `TROUBLESHOOTING.md` for detailed solutions!
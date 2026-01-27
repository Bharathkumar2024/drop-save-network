# 🔧 Troubleshooting Guide - Vital Drop

## Quick Fix

If you're seeing "Unable to connect" errors, run this:

```bash
# Run diagnostic to see what's wrong
diagnose.bat

# Run fix script to resolve issues and start servers
fix-connection.bat
```

---

## Common Issues and Solutions

### ❌ Issue 1: "Unable to connect" or "Network Error"

**Symptoms:**
- Website shows "Unable to connect"
- API calls fail
- Console shows network errors

**Solutions:**

1. **Check if servers are running:**
   ```bash
   # Check if backend is running on port 5000
   # Open browser: http://localhost:5000/api/health
   # Should return: {"status":"ok","message":"Server is running"}
   ```

2. **Check if frontend is running:**
   ```bash
   # Open browser: http://localhost:5173
   # Should show the Vital Drop landing page
   ```

3. **Restart both servers:**
   ```bash
   fix-connection.bat
   ```

---

### ❌ Issue 2: Port Already in Use

**Symptoms:**
- Error: "Port 5000 is already in use"
- Error: "Port 5173 is already in use"

**Solutions:**

1. **Kill processes on ports:**
   ```bash
   # Find process on port 5000
   netstat -ano | findstr :5000
   
   # Kill the process (replace PID with actual number)
   taskkill /PID <PID> /F
   
   # Same for port 5173
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

2. **Or use the fix script (automatic):**
   ```bash
   fix-connection.bat
   ```

---

### ❌ Issue 3: MongoDB Connection Failed

**Symptoms:**
- Error: "MongoServerError: connect ECONNREFUSED"
- Backend crashes on startup
- Console shows MongoDB connection errors

**Solutions:**

1. **Check if MongoDB is installed:**
   ```bash
   mongod --version
   ```
   If not installed, download from: https://www.mongodb.com/try/download/community

2. **Start MongoDB service:**
   ```bash
   net start MongoDB
   ```

3. **Check MongoDB is running:**
   ```bash
   net start | findstr MongoDB
   ```

4. **If MongoDB service doesn't exist, start manually:**
   ```bash
   # In a new terminal
   mongod --dbpath C:\data\db
   ```

---

### ❌ Issue 4: Dependencies Not Installed

**Symptoms:**
- Error: "Cannot find module"
- Import errors in console
- Server won't start

**Solutions:**

1. **Install all dependencies:**
   ```bash
   setup-all.bat
   ```

2. **Or install manually:**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   npm install
   cd ..
   ```

3. **Clear cache and reinstall:**
   ```bash
   # Frontend
   rm -r node_modules
   npm cache clean --force
   npm install
   
   # Backend
   cd backend
   rm -r node_modules
   npm cache clean --force
   npm install
   cd ..
   ```

---

### ❌ Issue 5: CORS Errors

**Symptoms:**
- Console error: "CORS policy: No 'Access-Control-Allow-Origin' header"
- API calls blocked by browser
- Network tab shows CORS errors

**Solutions:**

1. **Check .env files match:**
   - Frontend `.env` should have: `VITE_API_URL=http://localhost:5000/api`
   - Backend `.env` should have: `CLIENT_URL=http://localhost:5173,http://localhost:8080`

2. **Restart backend server** after changing .env

3. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete`
   - Clear cached images and files
   - Reload page with `Ctrl+F5`

---

### ❌ Issue 6: Environment Variables Not Loading

**Symptoms:**
- API calls go to wrong URL
- Socket.io connection fails
- Console shows "undefined" for API URL

**Solutions:**

1. **Check .env file exists:**
   ```bash
   # Should exist in project root
   dir .env
   ```

2. **Create .env if missing:**
   ```bash
   # Copy from example
   copy .env.example .env
   ```

3. **Verify .env content:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Restart Vite dev server** (environment variables are loaded on startup)

---

### ❌ Issue 7: Database Not Seeded

**Symptoms:**
- Login fails with "Invalid credentials"
- No data in dashboards
- Empty database

**Solutions:**

1. **Seed the database:**
   ```bash
   # Open in browser:
   http://localhost:5000/api/seed
   ```

2. **Check seed was successful:**
   - Should see: "Database seeded successfully"
   - Should list created hospitals, donors, blood banks

3. **Use test credentials:**
   - Hospital: `CGH001` / `password123`
   - Donor: `john.doe@example.com` (OTP in backend console)
   - Blood Bank: `central.bb@example.com` (OTP in backend console)

---

### ❌ Issue 8: OTP Not Received

**Symptoms:**
- OTP input screen appears but no OTP received
- Email not sent
- Can't login as donor/blood bank

**Solutions:**

1. **Check backend console:**
   - OTP is logged to console in development mode
   - Look for: `📧 OTP for email@example.com: 123456`

2. **Email not configured (expected in development):**
   - Email sending is optional for prototype
   - OTP is always logged to backend console
   - Copy OTP from console and paste in frontend

3. **Configure email (optional):**
   - Edit `backend/.env`
   - Add Gmail credentials:
     ```env
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     ```
   - Generate app password: https://myaccount.google.com/apppasswords

---

### ❌ Issue 9: Socket.io Not Connecting

**Symptoms:**
- Console shows "Socket connection failed"
- No real-time notifications
- Socket status shows disconnected

**Solutions:**

1. **Check backend is running:**
   ```bash
   # Should see in backend console:
   # ✅ Server running on port 5000
   ```

2. **Check CORS configuration:**
   - Backend `.env` should include frontend URL
   - Restart backend after changing .env

3. **Check browser console:**
   - Look for Socket.io connection errors
   - Check Network tab for WebSocket connections

4. **Try manual connection test:**
   ```javascript
   // In browser console
   import { io } from 'socket.io-client';
   const socket = io('http://localhost:5000');
   socket.on('connect', () => console.log('Connected!'));
   ```

---

### ❌ Issue 10: Vite Build Errors

**Symptoms:**
- Error: "Failed to resolve import"
- TypeScript errors
- Build fails

**Solutions:**

1. **Check TypeScript configuration:**
   ```bash
   # Verify tsconfig.json exists
   dir tsconfig.json
   ```

2. **Clear Vite cache:**
   ```bash
   rm -r node_modules/.vite
   npm run dev
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -r node_modules
   npm install
   ```

---

## Step-by-Step Debugging Process

### 1. Run Diagnostic
```bash
diagnose.bat
```
This will check:
- Node.js and npm installation
- MongoDB status
- Port availability
- Project structure
- Configuration files

### 2. Fix Issues
```bash
fix-connection.bat
```
This will:
- Clear ports
- Install dependencies
- Create missing .env files
- Start both servers

### 3. Verify Backend
```bash
# Open in browser:
http://localhost:5000/api/health

# Should return:
{"status":"ok","message":"Server is running"}
```

### 4. Seed Database
```bash
# Open in browser:
http://localhost:5000/api/seed

# Should return:
{"message":"Database seeded successfully", ...}
```

### 5. Test Frontend
```bash
# Open in browser:
http://localhost:5173

# Should show Vital Drop landing page
```

### 6. Test Login
- Click "Hospital Login"
- Enter: `CGH001` / `password123`
- Should redirect to dashboard

---

## Browser Console Debugging

### Check API Connection
```javascript
// Open browser console (F12)
// Check for errors in Console tab

// Check Network tab
// Filter by "Fetch/XHR"
// Look for failed requests (red)
```

### Check Socket.io Connection
```javascript
// In browser console, look for:
"Socket connected: <socket_id>"

// If you see:
"Socket connection failed"
// Then backend is not running or CORS is misconfigured
```

### Check Environment Variables
```javascript
// In browser console:
console.log(import.meta.env.VITE_API_URL)
// Should show: http://localhost:5000/api

console.log(import.meta.env.VITE_SOCKET_URL)
// Should show: http://localhost:5000
```

---

## Still Having Issues?

### Collect Debug Information

1. **Backend logs:**
   - Copy all output from backend terminal
   - Look for error messages

2. **Frontend logs:**
   - Open browser console (F12)
   - Copy all errors from Console tab
   - Check Network tab for failed requests

3. **System information:**
   ```bash
   node --version
   npm --version
   mongod --version
   ```

4. **Configuration files:**
   - Share contents of `.env`
   - Share contents of `backend/.env`

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | Backend not running | Start backend: `cd backend && npm run dev` |
| `EADDRINUSE` | Port already in use | Kill process or use different port |
| `MongoServerError` | MongoDB not running | Start MongoDB: `net start MongoDB` |
| `Cannot find module` | Dependencies not installed | Run: `npm install` |
| `CORS error` | CORS misconfigured | Check `.env` files match |
| `401 Unauthorized` | Not logged in or token expired | Login again |
| `404 Not Found` | Wrong API URL | Check `VITE_API_URL` in `.env` |

---

## Prevention Tips

1. **Always start backend before frontend**
2. **Keep both terminal windows open** to see logs
3. **Don't close MongoDB** while servers are running
4. **Clear browser cache** after changing .env files
5. **Restart servers** after changing configuration
6. **Check backend console** for OTP codes
7. **Use Chrome DevTools** for debugging

---

## Quick Commands Reference

```bash
# Diagnose issues
diagnose.bat

# Fix and start
fix-connection.bat

# Manual start
cd backend && npm run dev          # Terminal 1
npm run dev                        # Terminal 2

# Kill ports
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Check MongoDB
net start | findstr MongoDB

# Seed database
# Visit: http://localhost:5000/api/seed

# Clear cache
npm cache clean --force
rm -r node_modules
npm install
```

---

## Need More Help?

Check these files:
- `START_HERE.md` - Getting started guide
- `QUICK_REFERENCE.md` - Command reference
- `FRONTEND_BACKEND_INTEGRATION.md` - Integration details
- `README_COMPLETE.md` - Full documentation

---

**Last Updated:** 2024
**Version:** 1.0
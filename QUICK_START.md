# 🚀 Quick Start Guide

## Preview Frontend WITHOUT Backend

### Option 1: Double-Click to Start (Easiest)
```
📁 Double-click: start-frontend-mock.bat
```
This automatically enables mock mode and starts the dev server.

### Option 2: Manual Start
```bash
# 1. Make sure .env has mock mode enabled
VITE_MOCK_MODE=true

# 2. Start the dev server
npm run dev
```

### Option 3: Command Line
```bash
npm run dev
```
(Mock mode is already enabled in your .env file)

---

## 🎭 What is Mock Mode?

Mock Mode lets you preview and test the entire frontend application **without running the backend server**. All API calls are intercepted and return realistic mock data.

### ✅ Benefits
- **No Backend Required** - Preview UI instantly
- **Fast Development** - No server startup time
- **Offline Work** - Develop anywhere
- **Safe Testing** - No real data affected
- **Demo Ready** - Perfect for presentations

---

## 🔐 Login in Mock Mode

**Any credentials work!** The authentication is simulated.

### Example Logins:
```
Hospital Login:
  Email: any@email.com
  Password: anything

Donor Login:
  Email: test@test.com
  Password: 123456

Blood Bank Login:
  Email: demo@demo.com
  Password: password
```

---

## 🎯 What You Can Do

✅ **All Dashboards Work**
- Hospital Dashboard with patient management
- Donor Dashboard with nearby emergencies
- Blood Bank Dashboard with inventory

✅ **All Features Available**
- Create emergency requests
- View donation history
- Manage blood inventory
- Real-time notifications (simulated)
- Search and filter data

✅ **Realistic Data**
- 10+ mock hospitals
- 15+ mock donors
- 5+ mock blood banks
- Sample emergency requests
- Complete blood inventory

---

## 🔄 Switch to Real Backend

When you're ready to connect to the actual backend:

### Method 1: Edit .env
```bash
# Change this line in .env:
VITE_MOCK_MODE=false
```

### Method 2: Use Full Stack Script
```bash
# Run both frontend and backend:
START_SERVERS.bat
```

---

## 🐛 Troubleshooting

### Issue: Changes not reflecting?
**Solution:** Restart the dev server (Ctrl+C, then `npm run dev`)

### Issue: Still seeing connection errors?
**Solution:** Check `.env` file has `VITE_MOCK_MODE=true`

### Issue: Login not working?
**Solution:** In mock mode, ANY credentials work. Just type anything and click login.

### Issue: Console shows "Mock Mode Enabled"?
**Solution:** This is normal! It confirms mock mode is working correctly.

---

## 📚 More Information

For detailed documentation, see: **MOCK_MODE_GUIDE.md**

---

## 🎨 Current Status

✅ Mock Mode is **ENABLED** in your .env  
✅ Ready to preview frontend immediately  
✅ No backend setup required  

**Just run:** `npm run dev` or double-click `start-frontend-mock.bat`

---

## 💡 Pro Tips

1. **Development Workflow:**
   - Use mock mode for UI/UX work
   - Switch to real backend for API integration testing

2. **Demo Presentations:**
   - Mock mode is perfect for demos
   - No network dependencies
   - Consistent, predictable data

3. **Team Collaboration:**
   - Frontend devs can work independently
   - No need to wait for backend deployment
   - Faster iteration cycles

---

**Happy Coding! 🎉**
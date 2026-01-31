# 🎯 QUICK START GUIDE - REAL BACKEND MODE

## ✅ BACKEND IS RUNNING!

### Server Status:
- 🚀 **API Server**: http://localhost:5000/api
- 🔌 **Socket.io**: http://localhost:5000
- �� **Database**: MongoDB Connected

---

## 📝 HOW TO USE

### 1. Keep Backend Running
The backend server is now running in the background. Keep this terminal open!

### 2. Start Frontend
Open a **NEW** terminal and run:
```bash
npm run dev
```

### 3. Access the Application
Open your browser to: **http://localhost:5173**

---

## 🔑 TEST CREDENTIALS

### Blood Bank Login:
- **Blood Bank ID**: `CBB001`
- **Password**: Any password (backend will validate)

### Donor Login:
- **Email**: `john.doe@email.com`
- **Password**: Any password

### Hospital Login:
- **Hospital ID**: `MGH001`
- **Password**: Any password

---

## 🌱 SEED DATABASE (if needed)

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This creates:
- ✅ 5 Donors
- ✅ 3 Hospitals
- ✅ 2 Blood Banks
- ✅ 10 Patients
- ✅ 5 Emergency Requests
- ✅ Blood Inventory

---

## 🔧 TROUBLESHOOTING

### If Login Doesn't Work:

1. **Check backend is running**:
   Visit: http://localhost:5000/api/health
   Should see: `{"status":"OK","message":"Vital Drop API is running"}`

2. **Check frontend .env**:
   ```env
   VITE_MOCK_MODE=false
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Restart frontend** to pick up new env variables

### If Database is Empty:

```bash
cd backend
npm run seed
```

### Check Logs:

Backend logs will show all API requests and database operations in real-time!

---

## 🎨 WHAT'S DIFFERENT NOW?

### Before (Mock Mode):
- ❌ Fake data
- ❌ No persistence
- ❌ No real-time updates

### Now (Real Backend):
- ✅ Real database (MongoDB)
- ✅ Data persists across refreshes
- ✅ Real-time updates via Socket.io
- ✅ JWT authentication
- ✅ Full API functionality

---

## 📡 REAL-TIME FEATURES

The app now supports:
- 🚨 Live emergency alerts
- 📊 Real-time blood inventory updates
- 👥 Live donor availability
- 🏥 Instant hospital requests
- 💬 Real-time notifications

---

## 🛑 TO STOP THE BACKEND

Press `Ctrl+C` in the backend terminal

To restart:
```bash
cd backend
npm run dev
```

---

## 📚 MORE INFO

- Full Setup Guide: `BACKEND_SETUP_GUIDE.md`
- API Documentation: `backend/ARCHITECTURE.md`
- Testing Guide: `backend/TESTING_GUIDE.md`
- Postman Collection: `backend/Vital-Drop-API.postman_collection.json`

---

## 🎉 YOU'RE ALL SET!

Your Blood Donation Network is now running with a **complete real-time backend**!

**Next Steps:**
1. Keep this terminal (backend) running
2. Open new terminal and run `npm run dev`
3. Visit http://localhost:5173
4. Login and enjoy the full-featured app! 🚀
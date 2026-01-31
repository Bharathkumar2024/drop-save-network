# 🚀 VITAL DROP - COMPLETE BACKEND SETUP GUIDE

## 📋 Prerequisites

### Required Software:
1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v5.0 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - Verify: `mongod --version`

3. **Git** (for version control)
   - Download: https://git-scm.com/

---

## 🛠️ Installation Steps

### 1. Install MongoDB

**Windows:**
```bash
# Download MongoDB Community Server
# https://www.mongodb.com/try/download/community

# After installation, start MongoDB as a service
net start MongoDB

# Or run manually:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

The `.env` file is already configured with default values:
- **MongoDB URI**: `mongodb://localhost:27017/vital-drop`
- **Port**: `5000`
- **JWT Secret**: (Change in production!)

### 4. Seed Database with Initial Data

```bash
# Windows
cd backend
node seed-db.bat

# Or manually:
npm run seed
```

This will create:
- ✅ Sample hospitals
- ✅ Sample donors
- ✅ Sample blood banks
- ✅ Sample patients
- ✅ Emergency requests
- ✅ Blood inventory

---

## 🚀 Starting the Backend Server

### Quick Start (Recommended)

**Windows:**
```bash
cd backend
start-backend.bat
```

**macOS/Linux:**
```bash
cd backend
npm run dev
```

### Manual Start

```bash
cd backend

# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on:
- 🌐 **API Server**: http://localhost:5000/api
- 🔌 **Socket.io**: http://localhost:5000
- ✅ **Health Check**: http://localhost:5000/api/health

---

## 🧪 Testing the Backend

### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Vital Drop API is running"
}
```

### 2. Test Authentication

**Donor Login:**
```bash
curl -X POST http://localhost:5000/api/auth/donor/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@email.com","password":"password123"}'
```

**Hospital Login:**
```bash
curl -X POST http://localhost:5000/api/auth/hospital/login \
  -H "Content-Type: application/json" \
  -d '{"hospitalId":"MGH001","password":"password123"}'
```

**Blood Bank Login:**
```bash
curl -X POST http://localhost:5000/api/auth/bloodbank/login \
  -H "Content-Type: application/json" \
  -d '{"bloodBankId":"CBB001","password":"password123"}'
```

### 3. Use Postman Collection

Import the Postman collection for complete API testing:
```
backend/Vital-Drop-API.postman_collection.json
```

---

## 📁 Backend Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Global error handling
│   └── roleCheck.js         # Role-based access control
├── models/
│   ├── User.js              # Base user schema
│   ├── Donor.js             # Donor model
│   ├── Hospital.js          # Hospital model
│   ├── BloodBank.js         # Blood bank model
│   ├── Patient.js           # Patient model
│   ├── Emergency.js         # Emergency request model
│   ├── BloodUnit.js         # Blood inventory model
│   └── Camp.js              # Blood donation camp model
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── donors.js            # Donor management
│   ├── hospitals.js         # Hospital management
│   ├── bloodbanks.js        # Blood bank management
│   ├── patients.js          # Patient management
│   ├── emergencies.js       # Emergency requests
│   ├── stats.js             # Statistics & analytics
│   └── seed.js              # Database seeding
├── utils/
│   ├── jwtUtils.js          # JWT token utilities
│   ├── otpUtils.js          # OTP generation & validation
│   └── emailService.js      # Email notifications
├── .env                      # Environment variables
├── server.js                # Main server file
└── package.json             # Dependencies
```

---

## 🔌 Real-Time Features (Socket.io)

The backend supports real-time updates for:

1. **Emergency Requests**
   - Instant notifications when new emergencies are created
   - Real-time status updates

2. **Blood Inventory**
   - Live updates when blood units are added/removed
   - Low stock alerts

3. **Donor Availability**
   - Real-time donor status changes
   - Location-based notifications

4. **Camp Registrations**
   - Live registration counts
   - Capacity updates

### Socket Event Examples:

```javascript
// Connect to Socket.io
const socket = io('http://localhost:5000');

// Join room for city
socket.emit('join', { city: 'Metro City', role: 'donor' });

// Listen for emergency alerts
socket.on('emergency:new', (data) => {
  console.log('New emergency:', data);
});

// Listen for inventory updates
socket.on('inventory:update', (data) => {
  console.log('Inventory changed:', data);
});
```

---

## 🔐 API Authentication

All protected routes require JWT authentication:

```bash
# Include token in Authorization header
curl http://localhost:5000/api/donors/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Token Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Database Schema

### Collections:

1. **users** - Base user authentication
2. **donors** - Donor profiles & history
3. **hospitals** - Hospital information
4. **bloodbanks** - Blood bank details
5. **patients** - Patient records
6. **emergencies** - Emergency blood requests
7. **bloodunits** - Blood inventory
8. **camps** - Blood donation camps
9. **donations** - Donation history

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** `MongoNetworkError: failed to connect to server`

**Solution:**
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Or manually start MongoDB:
mongod --dbpath="C:\data\db"

# Create data directory if it doesn't exist
mkdir C:\data\db
```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Linux/macOS:
lsof -i :5000
kill -9 <process_id>
```

### JWT Token Issues

**Problem:** `JsonWebTokenError: invalid signature`

**Solution:**
- Ensure JWT_SECRET in `.env` matches across restarts
- Clear browser localStorage and login again

---

## 🔄 Switching Between Mock and Real Backend

### Use Real Backend (Current Setup)
```env
# .env file
VITE_MOCK_MODE=false
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Use Mock Data (No Backend Required)
```env
# .env file
VITE_MOCK_MODE=true
```

---

## 📝 Default Test Credentials

### Donors:
- **Email:** john.doe@email.com
- **Password:** password123

### Hospitals:
- **Hospital ID:** MGH001
- **Password:** password123

### Blood Banks:
- **Blood Bank ID:** CBB001
- **Password:** password123

---

## 🚀 Production Deployment

### Environment Variables to Update:

```env
NODE_ENV=production
JWT_SECRET=<strong_random_secret>
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vital-drop
CLIENT_URL=https://yourdomain.com
```

### Security Checklist:
- ✅ Change JWT_SECRET to strong random string
- ✅ Use MongoDB Atlas or managed MongoDB
- ✅ Enable HTTPS
- ✅ Configure CORS properly
- ✅ Set up email service for OTP
- ✅ Enable rate limiting
- ✅ Add input validation
- ✅ Configure file upload limits

---

## 📚 API Documentation

Full API documentation available at:
- **Postman Collection**: `backend/Vital-Drop-API.postman_collection.json`
- **Architecture Guide**: `backend/ARCHITECTURE.md`
- **Testing Guide**: `backend/TESTING_GUIDE.md`

---

## 💡 Next Steps

1. ✅ **Backend is configured and ready!**
2. Start MongoDB: `net start MongoDB`
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `npm run dev` (in root directory)
5. Open browser: http://localhost:5173

**You're now using a full real-time backend!** 🎉

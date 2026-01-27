# 🩸 Vital Drop - Blood Donation Management System

## Backend API - Complete Implementation

A comprehensive Node.js/Express backend for managing blood donations, emergencies, and hospital-donor-blood bank coordination with real-time notifications.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Project Structure](#project-structure)
6. [API Documentation](#api-documentation)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Contributing](#contributing)

---

## 🎯 Overview

Vital Drop is a blood donation management system that connects:
- **Hospitals** - Manage patients and create emergency blood requests
- **Donors** - Discover nearby emergencies and pledge donations
- **Blood Banks** - Manage inventory and dispatch blood units

### Key Capabilities
- Real-time emergency notifications via Socket.io
- JWT-based authentication with role-based access
- OTP verification for donors and blood banks
- Blood inventory management with expiry tracking
- Dispatch tracking and analytics
- Comprehensive statistics and reporting

---

## ✨ Features

### 🏥 Hospital Management
- Secure signup/login with password hashing
- Patient record management (CRUD)
- Emergency blood request creation
- Real-time emergency status tracking
- Dashboard with statistics and analytics
- Blood type distribution charts

### 🩸 Donor Management
- OTP-based signup and login
- Profile management
- Nearby emergency discovery (city-based)
- Blood compatibility checking
- Emergency response/pledge system
- Donation history tracking
- Reputation system

### 🏦 Blood Bank Management
- Secure authentication with certificate upload
- Blood inventory/preservation management
- Batch tracking with expiry dates
- Near-expiry warnings
- Dispatch/send record system
- Tracking number generation
- Success rate analytics
- Stock management by blood type

### 🔔 Real-time Features
- Socket.io integration
- Emergency creation notifications
- Response notifications
- City-based room filtering
- Role-based event routing

### 📊 Analytics & Statistics
- Overall system statistics
- City-specific stats
- Blood type distribution
- Stock levels by type
- Delivery success rates
- Recent emergency tracking

---

## 🛠️ Tech Stack

### Core
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

### Authentication & Security
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **express-validator** - Input validation

### Real-time & Communication
- **Socket.io** - WebSocket communication
- **nodemailer** - Email service (OTP)

### File Handling
- **multer** - File uploads

### Development
- **nodemon** - Auto-reload
- **dotenv** - Environment variables
- **cors** - Cross-origin requests

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB v6+
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or double-click install.bat on Windows
   ```

3. **Configure environment:**
   - `.env` file is already created
   - Update `MONGODB_URI` if using MongoDB Atlas
   - Update `JWT_SECRET` for production

4. **Start MongoDB:**
   ```bash
   # Windows (usually auto-starts)
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

5. **Start the server:**
   ```bash
   npm run dev
   # or double-click start-dev.bat on Windows
   ```

6. **Seed the database:**
   ```bash
   curl -X POST http://localhost:5000/api/seed
   # or double-click seed-db.bat on Windows
   ```

### Verify Installation
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"OK","message":"Vital Drop API is running"}
```

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── middleware/
│   ├── auth.js                  # JWT auth & authorization
│   ├── errorHandler.js          # Global error handling
│   └── upload.js                # File upload config
├── models/
│   ├── Hospital.js              # Hospital schema
│   ├── Donor.js                 # Donor schema
│   ├── BloodBank.js             # Blood bank schema
│   ├── Patient.js               # Patient records
│   ├── Emergency.js             # Emergency requests
│   ├── Preservation.js          # Blood inventory
│   └── SendRecord.js            # Dispatch tracking
├── routes/
│   ├── auth.js                  # Authentication
│   ├── hospitals.js             # Hospital operations
│   ├── donors.js                # Donor operations
│   ├── bloodbanks.js            # Blood bank operations
│   ├── emergencies.js           # Emergency handling
│   ├── stats.js                 # Statistics
│   └── seed.js                  # Database seeding
├── utils/
│   ├── generateToken.js         # JWT generation
│   ├── generateOTP.js           # OTP generation
│   └── sendEmail.js             # Email service
├── uploads/                     # File storage
├── .env                         # Environment config
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore
├── package.json                 # Dependencies
├── server.js                    # Main entry point
├── README.md                    # API documentation
├── SETUP.md                     # Setup guide
├── TESTING_GUIDE.md             # Testing guide
└── Vital-Drop-API.postman_collection.json
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Hospital
```
POST /auth/hospital/signup
POST /auth/hospital/login
```

#### Donor
```
POST /auth/donor/signup
POST /auth/donor/verify-otp
POST /auth/donor/login
```

#### Blood Bank
```
POST /auth/bloodbank/signup
POST /auth/bloodbank/verify-otp
POST /auth/bloodbank/login
```

### Hospital Endpoints
```
GET    /hospitals/:id/dashboard
POST   /hospitals/:id/patients
GET    /hospitals/:id/patients
PATCH  /hospitals/:id/patients/:pid
DELETE /hospitals/:id/patients/:pid
POST   /hospitals/:id/emergency
GET    /hospitals/:id/emergency-status
```

### Donor Endpoints
```
GET   /donors/:id/profile
PATCH /donors/:id/profile
GET   /donors/:id/nearby-emergencies
POST  /donors/:id/respond
GET   /donors/:id/history
```

### Blood Bank Endpoints
```
GET   /bloodbanks/:id/dashboard
POST  /bloodbanks/:id/preservation
GET   /bloodbanks/:id/preservation
PATCH /bloodbanks/:id/preservation/:pid
POST  /bloodbanks/:id/dispatch
GET   /bloodbanks/:id/send-records
PATCH /bloodbanks/:id/send-records/:sid
POST  /bloodbanks/:id/emergency
```

### Utility Endpoints
```
GET    /stats/overview
GET    /stats/city/:city
GET    /emergencies/latest
GET    /emergencies/:id
POST   /seed
DELETE /seed
GET    /health
```

### Authentication
Protected routes require JWT token:
```
Authorization: Bearer <token>
```

---

## 🧪 Testing

### Test Credentials (After Seeding)

**Hospitals:**
- ID: `CGH001`, Password: `password123`
- ID: `MMC002`, Password: `password123`

**Blood Banks:**
- ID: `CBB001`, Password: `password123`
- ID: `WCBS002`, Password: `password123`

**Donors:**
- Email: `john.smith@email.com`
- Email: `sarah.j@email.com`
- OTP shown in console during development

### Using Postman
1. Import `Vital-Drop-API.postman_collection.json`
2. Set `baseUrl` to `http://localhost:5000/api`
3. Test endpoints

### Using curl
```bash
# Login as hospital
curl -X POST http://localhost:5000/api/auth/hospital/login \
  -H "Content-Type: application/json" \
  -d '{"hospitalId":"CGH001","password":"password123"}'

# Get stats
curl http://localhost:5000/api/stats/overview
```

### Complete Testing Guide
See `TESTING_GUIDE.md` for comprehensive testing instructions.

---

## 🔌 WebSocket Integration

### Client Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join rooms
socket.emit('join', {
  city: 'New York',
  role: 'donor',
  userId: 'user_id'
});

// Listen for events
socket.on('emergency.created', (data) => {
  console.log('New emergency:', data.emergency);
});

socket.on('emergency.response', (data) => {
  console.log('New response:', data);
});
```

### Events

**Client → Server:**
- `join` - Join city/role/user rooms

**Server → Client:**
- `emergency.created` - New emergency notification
- `emergency.response` - Emergency response notification

---

## 🚢 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
CLIENT_URL=https://your-frontend-url.com
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure real email service
- [ ] Remove/protect `/api/seed` endpoint
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Use cloud storage for uploads
- [ ] Add request logging

### Deployment Platforms
- **Heroku** - Easy deployment
- **Railway** - Modern platform
- **Render** - Simple process
- **DigitalOcean** - More control
- **AWS/Azure/GCP** - Enterprise

### Example: Heroku Deployment
```bash
heroku create vital-drop-api
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

---

## 📚 Documentation Files

- **README.md** - This file
- **SETUP.md** - Detailed setup instructions
- **TESTING_GUIDE.md** - Complete testing guide
- **BACKEND_COMPLETE.md** - Implementation summary
- **Vital-Drop-API.postman_collection.json** - Postman collection

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication
- ✅ Role-based authorization
- ✅ OTP verification for donors/blood banks
- ✅ File upload validation
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Input validation
- ✅ Error handling

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist IP address

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process: `netstat -ano | findstr :5000`

### npm install fails
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

See `SETUP.md` for more troubleshooting tips.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Support

For issues or questions:
- Check documentation files
- Review error logs
- Verify MongoDB connection
- Check environment variables

---

## 🎉 What's Next?

1. **Frontend Integration**
   - Connect React frontend to API
   - Implement Socket.io client
   - Add JWT token management

2. **Enhanced Features**
   - SMS notifications
   - Email templates
   - Advanced analytics
   - Mobile app API

3. **Production Ready**
   - Add rate limiting
   - Implement caching
   - Set up monitoring
   - Add logging service

---

**Built with ❤️ for saving lives through technology**

🚀 **Server:** http://localhost:5000  
📡 **API:** http://localhost:5000/api  
🔌 **Socket.io:** ws://localhost:5000

---

*Last Updated: 2024*
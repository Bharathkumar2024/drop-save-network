# Vital Drop - Backend API

Blood Donation Management System Backend

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vital-drop
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

5. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

6. Seed the database with mock data:
```bash
# Using curl
curl -X POST http://localhost:5000/api/seed

# Or using the endpoint directly in browser/Postman
POST http://localhost:5000/api/seed
```

## 📡 API Endpoints

### Authentication

#### Hospital
- `POST /api/auth/hospital/signup` - Register hospital
- `POST /api/auth/hospital/login` - Login hospital

#### Donor
- `POST /api/auth/donor/signup` - Register donor (sends OTP)
- `POST /api/auth/donor/verify-otp` - Verify OTP and complete registration
- `POST /api/auth/donor/login` - Login donor (sends OTP)

#### Blood Bank
- `POST /api/auth/bloodbank/signup` - Register blood bank (with certificate upload)
- `POST /api/auth/bloodbank/verify-otp` - Verify OTP
- `POST /api/auth/bloodbank/login` - Login blood bank

### Hospitals
- `GET /api/hospitals/:id/dashboard` - Get dashboard data
- `POST /api/hospitals/:id/patients` - Add patient
- `GET /api/hospitals/:id/patients` - Get all patients
- `PATCH /api/hospitals/:id/patients/:pid` - Update patient
- `DELETE /api/hospitals/:id/patients/:pid` - Delete patient
- `POST /api/hospitals/:id/emergency` - Create emergency
- `GET /api/hospitals/:id/emergency-status` - Get emergency status

### Donors
- `GET /api/donors/:id/profile` - Get donor profile
- `PATCH /api/donors/:id/profile` - Update profile
- `GET /api/donors/:id/nearby-emergencies` - Get nearby emergencies
- `POST /api/donors/:id/respond` - Respond to emergency
- `GET /api/donors/:id/history` - Get response history

### Blood Banks
- `GET /api/bloodbanks/:id/dashboard` - Get dashboard data
- `POST /api/bloodbanks/:id/preservation` - Add preservation batch
- `GET /api/bloodbanks/:id/preservation` - Get all batches
- `PATCH /api/bloodbanks/:id/preservation/:pid` - Update batch
- `POST /api/bloodbanks/:id/dispatch` - Create dispatch record
- `GET /api/bloodbanks/:id/send-records` - Get send records
- `PATCH /api/bloodbanks/:id/send-records/:sid` - Update send record
- `POST /api/bloodbanks/:id/emergency` - Create emergency

### Emergencies
- `GET /api/emergencies/latest` - Get latest emergencies (polling)
- `GET /api/emergencies/:id` - Get emergency by ID
- `PATCH /api/emergencies/:id` - Update emergency

### Stats
- `GET /api/stats/overview` - Get aggregated stats
- `GET /api/stats/city/:city` - Get city-specific stats

### Utilities
- `POST /api/seed` - Seed database with mock data
- `DELETE /api/seed` - Clear all data
- `GET /api/health` - Health check

## 🔐 Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## 🔌 WebSocket Events

### Client → Server
- `join` - Join rooms based on city/role/userId
  ```javascript
  socket.emit('join', { city: 'New York', role: 'donor', userId: '...' });
  ```

### Server → Client
- `emergency.created` - New emergency created
  ```javascript
  socket.on('emergency.created', (data) => {
    console.log('New emergency:', data.emergency);
  });
  ```

- `emergency.response` - Someone responded to emergency
  ```javascript
  socket.on('emergency.response', (data) => {
    console.log('New response:', data);
  });
  ```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── errorHandler.js    # Error handling
│   └── upload.js          # File upload configuration
├── models/
│   ├── Hospital.js
│   ├── Donor.js
│   ├── BloodBank.js
│   ├── Patient.js
│   ├── Emergency.js
│   ├── Preservation.js
│   └── SendRecord.js
├── routes/
│   ├── auth.js
│   ├── hospitals.js
│   ├── donors.js
│   ├── bloodbanks.js
│   ├── emergencies.js
│   ├── stats.js
│   └── seed.js
├── utils/
│   ├── generateToken.js
│   ├── generateOTP.js
│   └── sendEmail.js
├── uploads/               # Uploaded files
├── .env.example
├── .gitignore
├── package.json
├── server.js             # Main entry point
└── README.md
```

## 🧪 Testing

### Test Credentials

**Hospital:**
- Hospital ID: `CGH001`
- Password: `password123`

**Blood Bank:**
- Bank ID: `CBB001`
- Password: `password123`

**Donor:**
- Email: `john.smith@email.com`
- OTP: Check console logs in development mode

## 🔧 Development Notes

### OTP System
In development mode, OTPs are:
1. Logged to console
2. Returned in API response (for testing)

In production, remove OTP from response and configure real email service.

### File Uploads
Certificates are stored in `/uploads` directory. For production, consider using cloud storage (AWS S3, Cloudinary, etc.).

### Socket.io
Real-time notifications are sent via Socket.io. Clients should connect to the same port as the API server.

## 🚨 Security Notes

**Before deploying to production:**
1. Remove or protect `/api/seed` endpoint
2. Set strong `JWT_SECRET`
3. Configure real email service
4. Add rate limiting
5. Enable HTTPS
6. Add input validation
7. Implement proper error handling
8. Remove OTP from API responses
9. Add request logging
10. Configure CORS properly

## 📝 License

MIT
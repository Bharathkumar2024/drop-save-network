# Frontend-Backend Integration Guide

## Overview

This document explains how the Vital Drop frontend (React + TypeScript) integrates with the backend API (Node.js + Express + MongoDB).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VITAL DROP SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   FRONTEND       │         │    BACKEND       │         │
│  │   React + TS     │◄───────►│  Node.js + API   │         │
│  │   Port: 5173     │  HTTP   │  Port: 5000      │         │
│  └──────────────────┘         └──────────────────┘         │
│         │                              │                     │
│         │                              │                     │
│         │      ┌──────────────────┐   │                     │
│         └─────►│   Socket.io      │◄──┘                     │
│         WebSocket  Real-time      │                         │
│                └──────────────────┘                         │
│                         │                                    │
│                         ▼                                    │
│                ┌──────────────────┐                         │
│                │    MongoDB       │                         │
│                │    Database      │                         │
│                └──────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. API Service Layer (`src/lib/api.ts`)

The API service provides a centralized way to communicate with the backend:

```typescript
import { authAPI, hospitalAPI, donorAPI, bloodBankAPI } from '@/lib/api';

// Example: Hospital login
const response = await authAPI.hospitalLogin({
  hospitalId: 'CGH001',
  password: 'password123'
});

// Store token and user data
login(response.hospital, response.token);
```

**Features:**
- Axios-based HTTP client with interceptors
- Automatic JWT token injection in requests
- Automatic token refresh/logout on 401 errors
- Organized API methods by domain (auth, hospital, donor, bloodbank, stats)

### 2. Socket.io Service (`src/lib/socket.ts`)

Real-time communication service for live notifications:

```typescript
import { socketService } from '@/lib/socket';

// Connect when user logs in
socketService.connect(userId, role, city);

// Subscribe to events
const unsubscribe = socketService.on('emergency.created', (data) => {
  console.log('New emergency:', data);
});

// Cleanup
unsubscribe();
socketService.disconnect();
```

**Features:**
- Singleton pattern for single connection
- Automatic reconnection on disconnect
- Event subscription/unsubscription
- Room-based filtering (by city and role)

### 3. Auth Context (`src/contexts/AuthContext.tsx`)

Manages user authentication state:

```typescript
const { user, token, login, logout, isAuthenticated } = useAuth();

// Login example
login(userData, jwtToken);

// Check authentication
if (isAuthenticated) {
  // User is logged in
}
```

**Features:**
- JWT token storage in localStorage
- User data persistence across page reloads
- Automatic logout on token expiry
- Type-safe user interface

### 4. Notification Context (`src/contexts/NotificationContext.tsx`)

Manages real-time notifications with Socket.io integration:

```typescript
const { notifications, unreadCount, addNotification, markAsRead } = useNotifications();

// Notifications are automatically received via Socket.io
// Manual notification
addNotification({
  type: 'success',
  title: 'Success',
  message: 'Operation completed'
});
```

**Features:**
- Automatic Socket.io connection when user logs in
- Real-time emergency alerts
- Browser notifications (with permission)
- Unread count tracking
- Event-based notification system

## Authentication Flow

### Hospital Authentication

```typescript
// 1. Signup
const signupData = {
  name: 'City General Hospital',
  location: 'New York',
  hospitalId: 'CGH001',
  password: 'password123',
  contactEmail: 'contact@cgh.com',
  contactPhone: '+1234567890'
};

const response = await authAPI.hospitalSignup(signupData);
login(response.hospital, response.token);

// 2. Login
const loginData = {
  hospitalId: 'CGH001',
  password: 'password123'
};

const response = await authAPI.hospitalLogin(loginData);
login(response.hospital, response.token);
```

### Donor Authentication (OTP-based)

```typescript
// 1. Signup (sends OTP)
const signupData = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  bloodGroup: 'O+',
  city: 'New York'
};

const response = await authAPI.donorSignup(signupData);
// OTP is sent to email (logged in console in dev mode)
// response.otp contains the OTP in development

// 2. Verify OTP
const verifyData = {
  email: 'john@example.com',
  otp: '123456'
};

const response = await authAPI.donorVerifyOTP(verifyData);
login(response.donor, response.token);

// 3. Login (sends new OTP)
const loginData = {
  email: 'john@example.com'
};

const response = await authAPI.donorLogin(loginData);
// Then verify OTP as above
```

### Blood Bank Authentication (OTP + Certificate)

```typescript
// 1. Signup with certificate upload
const formData = new FormData();
formData.append('name', 'Central Blood Bank');
formData.append('location', 'New York');
formData.append('bankId', 'CBB001');
formData.append('password', 'password123');
formData.append('contactEmail', 'contact@cbb.com');
formData.append('contactPhone', '+1234567890');
formData.append('certificate', certificateFile); // File object

const response = await authAPI.bloodBankSignup(formData);
// OTP is sent

// 2. Verify OTP
const verifyData = {
  bankId: 'CBB001',
  otp: '123456'
};

const response = await authAPI.bloodBankVerifyOTP(verifyData);
login(response.bloodBank, response.token);

// 3. Login
const loginData = {
  bankId: 'CBB001',
  password: 'password123'
};

const response = await authAPI.bloodBankLogin(loginData);
login(response.bloodBank, response.token);
```

## Real-time Notifications

### Socket.io Events

The system emits the following events:

#### 1. `emergency.created`
Triggered when a new emergency is created.

```typescript
{
  emergency: {
    _id: string,
    bloodType: string,
    unitsNeeded: number,
    urgencyLevel: string,
    createdBy: string,
    createdByModel: 'Hospital' | 'BloodBank',
    city: string,
    status: string
  }
}
```

#### 2. `emergency.response`
Triggered when a donor responds to an emergency.

```typescript
{
  emergency: Emergency,
  donor: Donor,
  response: {
    donorId: string,
    unitsPledged: number,
    status: string
  }
}
```

#### 3. `emergency.fulfilled`
Triggered when an emergency is fulfilled.

```typescript
{
  emergency: Emergency
}
```

#### 4. `dispatch.update`
Triggered when blood dispatch status changes.

```typescript
{
  sendRecord: SendRecord,
  status: 'Pending' | 'In Transit' | 'Delivered'
}
```

#### 5. `patient.update`
Triggered when patient status changes.

```typescript
{
  patient: Patient,
  hospital: Hospital
}
```

### Notification Context Integration

The NotificationContext automatically subscribes to these events and displays notifications:

```typescript
// In NotificationContext.tsx
useEffect(() => {
  if (user) {
    socketService.connect(user.id, user.role, user.city);

    const unsubEmergencyCreated = socketService.on('emergency.created', (data) => {
      addNotification({
        type: 'emergency',
        title: '🚨 New Emergency Alert',
        message: `${data.emergency.bloodType} blood needed - ${data.emergency.unitsNeeded} units`,
        emergencyData: data.emergency,
      });
    });

    // ... other subscriptions

    return () => {
      unsubEmergencyCreated();
      socketService.disconnect();
    };
  }
}, [user]);
```

## API Usage Examples

### Hospital Operations

```typescript
// Get dashboard data
const dashboard = await hospitalAPI.getDashboard(hospitalId);

// Add patient
const patient = await hospitalAPI.addPatient(hospitalId, {
  name: 'Jane Doe',
  age: 35,
  roomNumber: '101',
  caseDescription: 'Surgery',
  bloodType: 'A+',
  unitsRequired: 2
});

// Update patient
await hospitalAPI.updatePatient(hospitalId, patientId, {
  unitsReceived: 2,
  status: 'Received'
});

// Create emergency
const emergency = await hospitalAPI.createEmergency(hospitalId, {
  bloodType: 'O-',
  unitsNeeded: 5,
  urgencyLevel: 'Critical'
});

// Get emergency status
const status = await hospitalAPI.getEmergencyStatus(hospitalId);
```

### Donor Operations

```typescript
// Get profile
const profile = await donorAPI.getProfile(donorId);

// Update profile
await donorAPI.updateProfile(donorId, {
  city: 'Los Angeles',
  isAvailable: true
});

// Get nearby emergencies
const emergencies = await donorAPI.getNearbyEmergencies(donorId, 'New York');

// Respond to emergency
await donorAPI.respondToEmergency(donorId, {
  emergencyId: 'emergency123',
  unitsPledged: 1
});

// Get donation history
const history = await donorAPI.getHistory(donorId);
```

### Blood Bank Operations

```typescript
// Get dashboard
const dashboard = await bloodBankAPI.getDashboard(bloodBankId);

// Add preservation batch
const batch = await bloodBankAPI.addPreservation(bloodBankId, {
  bloodType: 'B+',
  units: 10,
  collectionDate: '2024-01-15',
  expiryDate: '2024-02-15',
  storageLocation: 'Freezer A1'
});

// Get preservation list
const preservation = await bloodBankAPI.getPreservation(bloodBankId);

// Create dispatch
const dispatch = await bloodBankAPI.createDispatch(bloodBankId, {
  preservationId: 'batch123',
  hospitalId: 'CGH001',
  unitsDispatched: 3,
  emergencyId: 'emergency123' // optional
});

// Get send records
const records = await bloodBankAPI.getSendRecords(bloodBankId);

// Update send record status
await bloodBankAPI.updateSendRecord(bloodBankId, recordId, {
  status: 'Delivered'
});
```

### Statistics

```typescript
// Get overall statistics
const stats = await statsAPI.getOverview();

// Get city-specific statistics
const cityStats = await statsAPI.getCityStats('New York');
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Socket.io Server URL
VITE_SOCKET_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://api.vitaldrop.com/api
VITE_SOCKET_URL=https://api.vitaldrop.com
```

## Error Handling

### API Errors

```typescript
try {
  const response = await hospitalAPI.getDashboard(hospitalId);
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Error:', error.response.data.message);
    
    if (error.response.status === 401) {
      // Unauthorized - token expired
      logout();
    } else if (error.response.status === 404) {
      // Not found
      console.error('Resource not found');
    }
  } else if (error.request) {
    // Request made but no response
    console.error('Network error');
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

### Socket.io Errors

```typescript
socketService.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
  // Show user-friendly message
  addNotification({
    type: 'warning',
    title: 'Connection Issue',
    message: 'Real-time notifications temporarily unavailable'
  });
});
```

## Testing the Integration

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Seed Database

```bash
# Using curl
curl -X POST http://localhost:5000/api/seed

# Or visit in browser
http://localhost:5000/api/seed
```

### 3. Start Frontend

```bash
# In project root
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Test Authentication

1. Go to `http://localhost:5173`
2. Click on "Hospitals" card
3. Login with:
   - Hospital ID: `CGH001`
   - Password: `password123`
4. You should be redirected to the hospital dashboard

### 5. Test Real-time Notifications

1. Open two browser windows
2. Login as Hospital in one window
3. Login as Donor in another window
4. Create an emergency in Hospital dashboard
5. Donor should receive real-time notification

## Common Issues and Solutions

### Issue: CORS Errors

**Solution:** Backend already has CORS configured. Ensure backend is running on port 5000.

### Issue: Socket.io Not Connecting

**Solution:** 
1. Check if backend is running
2. Verify VITE_SOCKET_URL in .env
3. Check browser console for connection errors
4. Ensure firewall allows WebSocket connections

### Issue: 401 Unauthorized Errors

**Solution:**
1. Check if token is stored in localStorage
2. Verify token hasn't expired
3. Re-login to get new token

### Issue: OTP Not Working

**Solution:**
1. In development, OTP is logged to backend console
2. Check backend terminal for OTP
3. OTP expires after 10 minutes

## Production Deployment

### Frontend

1. Build the frontend:
```bash
npm run build
```

2. Deploy `dist` folder to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. Update environment variables:
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
```

### Backend

See `backend/SETUP.md` for production deployment instructions.

### Important Production Considerations

1. **CORS:** Update CORS origin in backend to match frontend domain
2. **HTTPS:** Use HTTPS for both frontend and backend
3. **Environment Variables:** Never commit .env files
4. **Socket.io:** Configure Socket.io for production (Redis adapter for scaling)
5. **Rate Limiting:** Enable rate limiting in backend
6. **Monitoring:** Set up error tracking (Sentry, LogRocket)

## API Reference

For complete API documentation, see:
- `backend/README.md` - Complete API documentation
- `backend/TESTING_GUIDE.md` - API testing guide
- `backend/Vital-Drop-API.postman_collection.json` - Postman collection

## Support

For issues or questions:
1. Check backend logs: `backend/logs/`
2. Check browser console for frontend errors
3. Verify MongoDB connection
4. Review this integration guide

## Next Steps

1. ✅ Backend API is complete
2. ✅ Frontend integration layer is complete
3. ⏳ Update frontend components to use API instead of mock data
4. ⏳ Test all authentication flows
5. ⏳ Test real-time notifications
6. ⏳ Deploy to production

---

**Built with ❤️ for saving lives**
# Vital Drop API - Testing Guide

Complete guide for testing all API endpoints and features.

## Prerequisites

1. Server is running: `npm run dev`
2. Database is seeded: `POST http://localhost:5000/api/seed`
3. MongoDB is connected

## Testing Tools

- **Postman** (Recommended) - Import `Vital-Drop-API.postman_collection.json`
- **curl** - Command line testing
- **Browser** - For GET requests
- **Thunder Client** (VS Code extension)

---

## 1. Health Check & Stats

### Health Check
```bash
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"OK","message":"Vital Drop API is running"}`

### Get Overview Stats
```bash
curl http://localhost:5000/api/stats/overview
```
**Expected:** JSON with totals, blood type distribution, stock info

---

## 2. Hospital Authentication & Operations

### A. Hospital Signup
```bash
curl -X POST http://localhost:5000/api/auth/hospital/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hospital",
    "hospitalId": "TEST001",
    "location": "123 Test St, New York",
    "password": "password123",
    "contactEmail": "test@hospital.com",
    "contactPhone": "+1-555-0000"
  }'
```
**Expected:** `{token, hospital}` object
**Save the token for next requests!**

### B. Hospital Login
```bash
curl -X POST http://localhost:5000/api/auth/hospital/login \
  -H "Content-Type: application/json" \
  -d '{
    "hospitalId": "CGH001",
    "password": "password123"
  }'
```
**Expected:** `{token, hospital}` object
**Copy the token value**

### C. Get Hospital Dashboard
```bash
# Replace YOUR_TOKEN and HOSPITAL_ID
curl http://localhost:5000/api/hospitals/HOSPITAL_ID/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Dashboard data with patients, emergencies, stats

### D. Add Patient
```bash
curl -X POST http://localhost:5000/api/hospitals/HOSPITAL_ID/patients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 45,
    "room": "3A",
    "caseDescription": "Surgery",
    "bloodType": "O+",
    "unitsNeeded": 3,
    "priority": "High"
  }'
```
**Expected:** Created patient object

### E. Update Patient
```bash
curl -X PATCH http://localhost:5000/api/hospitals/HOSPITAL_ID/patients/PATIENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "unitsReceived": 3,
    "status": "Received"
  }'
```
**Expected:** Updated patient object

### F. Create Emergency
```bash
curl -X POST http://localhost:5000/api/hospitals/HOSPITAL_ID/emergency \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bloodType": "O+",
    "unitsNeeded": 5,
    "description": "Urgent: Multiple accident victims",
    "priority": "Critical"
  }'
```
**Expected:** Created emergency object
**Note:** This will trigger Socket.io notification!

### G. Get Emergency Status
```bash
curl http://localhost:5000/api/hospitals/HOSPITAL_ID/emergency-status \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of active emergencies with responses

---

## 3. Donor Authentication & Operations

### A. Donor Signup
```bash
curl -X POST http://localhost:5000/api/auth/donor/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Donor",
    "email": "testdonor@email.com",
    "phone": "+1-555-9999",
    "bloodGroup": "O+",
    "city": "New York",
    "lastDonationDate": null
  }'
```
**Expected:** `{message, email, otp}` (OTP shown in development)
**Copy the OTP from response or console**

### B. Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/donor/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testdonor@email.com",
    "otp": "123456"
  }'
```
**Expected:** `{token, donor}` object
**Save the token!**

### C. Donor Login
```bash
curl -X POST http://localhost:5000/api/auth/donor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.smith@email.com"
  }'
```
**Expected:** `{message, email, otp}` (OTP in console)

### D. Get Nearby Emergencies
```bash
curl http://localhost:5000/api/donors/DONOR_ID/nearby-emergencies?city=New%20York \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of compatible emergencies

### E. Respond to Emergency
```bash
curl -X POST http://localhost:5000/api/donors/DONOR_ID/respond \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emergencyId": "EMERGENCY_ID",
    "unitsPledged": 2
  }'
```
**Expected:** `{message, emergency, reputation}`
**Note:** This will trigger Socket.io notification to hospital!

### F. Get Donation History
```bash
curl http://localhost:5000/api/donors/DONOR_ID/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of past responses

---

## 4. Blood Bank Authentication & Operations

### A. Blood Bank Login
```bash
curl -X POST http://localhost:5000/api/auth/bloodbank/login \
  -H "Content-Type: application/json" \
  -d '{
    "bankId": "CBB001",
    "password": "password123"
  }'
```
**Expected:** `{token, bloodBank}` object

### B. Get Blood Bank Dashboard
```bash
curl http://localhost:5000/api/bloodbanks/BLOODBANK_ID/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Dashboard with stock, preservations, send records

### C. Add Preservation Batch
```bash
curl -X POST http://localhost:5000/api/bloodbanks/BLOODBANK_ID/preservation \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bloodType": "O+",
    "units": 10,
    "collectionDate": "2024-01-15",
    "expiryDate": "2024-03-15",
    "storageLocation": "Shelf 5"
  }'
```
**Expected:** Created preservation batch
**Save the batch ID for dispatch!**

### D. Get Preservation Batches
```bash
# All batches
curl http://localhost:5000/api/bloodbanks/BLOODBANK_ID/preservation \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by status
curl http://localhost:5000/api/bloodbanks/BLOODBANK_ID/preservation?status=Available \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by blood type
curl http://localhost:5000/api/bloodbanks/BLOODBANK_ID/preservation?bloodType=O+ \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of preservation batches

### E. Create Dispatch
```bash
curl -X POST http://localhost:5000/api/bloodbanks/BLOODBANK_ID/dispatch \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preservationId": "PRESERVATION_ID",
    "recipientId": "HOSPITAL_ID",
    "recipientModel": "Hospital",
    "units": 3,
    "expectedDelivery": "2024-01-20T10:00:00Z",
    "notes": "Standard delivery"
  }'
```
**Expected:** Created send record with tracking number

### F. Get Send Records
```bash
curl http://localhost:5000/api/bloodbanks/BLOODBANK_ID/send-records \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of send records

### G. Update Send Record Status
```bash
curl -X PATCH http://localhost:5000/api/bloodbanks/BLOODBANK_ID/send-records/RECORD_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Delivered",
    "actualDelivery": "2024-01-20T11:30:00Z"
  }'
```
**Expected:** Updated send record

---

## 5. Emergency Operations

### Get Latest Emergencies (Public)
```bash
# All cities
curl http://localhost:5000/api/emergencies/latest

# Specific city
curl http://localhost:5000/api/emergencies/latest?city=New%20York

# Limit results
curl http://localhost:5000/api/emergencies/latest?limit=5
```
**Expected:** Array of active emergencies

### Get Emergency by ID
```bash
curl http://localhost:5000/api/emergencies/EMERGENCY_ID
```
**Expected:** Emergency details with responses

---

## 6. Database Management

### Seed Database
```bash
curl -X POST http://localhost:5000/api/seed
```
**Expected:** Success message with counts

### Clear Database
```bash
curl -X DELETE http://localhost:5000/api/seed
```
**Expected:** Success message

---

## 7. Testing Socket.io

### Using JavaScript (Browser Console or Node.js)

```javascript
// Install socket.io-client first: npm install socket.io-client

const io = require('socket.io-client');
const socket = io('http://localhost:5000');

// Connection event
socket.on('connect', () => {
  console.log('Connected:', socket.id);
  
  // Join rooms
  socket.emit('join', {
    city: 'New York',
    role: 'donor',
    userId: 'your_user_id'
  });
});

// Listen for emergency creation
socket.on('emergency.created', (data) => {
  console.log('🚨 New Emergency:', data.emergency);
});

// Listen for emergency responses
socket.on('emergency.response', (data) => {
  console.log('👤 New Response:', data);
});

// Disconnect event
socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

### Testing Flow:
1. Connect as donor in New York
2. Create emergency from hospital in New York
3. Donor should receive `emergency.created` event
4. Respond to emergency as donor
5. Hospital should receive `emergency.response` event

---

## 8. Complete Testing Workflow

### Scenario: Hospital Emergency → Donor Response → Blood Bank Dispatch

#### Step 1: Login as Hospital
```bash
curl -X POST http://localhost:5000/api/auth/hospital/login \
  -H "Content-Type: application/json" \
  -d '{"hospitalId":"CGH001","password":"password123"}'
```
Save token as `HOSPITAL_TOKEN` and ID as `HOSPITAL_ID`

#### Step 2: Create Emergency
```bash
curl -X POST http://localhost:5000/api/hospitals/HOSPITAL_ID/emergency \
  -H "Authorization: Bearer HOSPITAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bloodType": "O+",
    "unitsNeeded": 5,
    "description": "Urgent need",
    "priority": "Critical"
  }'
```
Save emergency ID as `EMERGENCY_ID`

#### Step 3: Login as Donor
```bash
curl -X POST http://localhost:5000/api/auth/donor/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.smith@email.com"}'
```
Get OTP from console, then verify:
```bash
curl -X POST http://localhost:5000/api/auth/donor/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"john.smith@email.com","otp":"OTP_HERE"}'
```
Save token as `DONOR_TOKEN` and ID as `DONOR_ID`

#### Step 4: Donor Responds
```bash
curl -X POST http://localhost:5000/api/donors/DONOR_ID/respond \
  -H "Authorization: Bearer DONOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emergencyId": "EMERGENCY_ID",
    "unitsPledged": 2
  }'
```

#### Step 5: Login as Blood Bank
```bash
curl -X POST http://localhost:5000/api/auth/bloodbank/login \
  -H "Content-Type: application/json" \
  -d '{"bankId":"CBB001","password":"password123"}'
```
Save token as `BANK_TOKEN` and ID as `BANK_ID`

#### Step 6: Get Available Stock
```bash
curl http://localhost:5000/api/bloodbanks/BANK_ID/preservation?status=Available&bloodType=O+ \
  -H "Authorization: Bearer BANK_TOKEN"
```
Save a preservation ID as `PRESERVATION_ID`

#### Step 7: Dispatch to Hospital
```bash
curl -X POST http://localhost:5000/api/bloodbanks/BANK_ID/dispatch \
  -H "Authorization: Bearer BANK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preservationId": "PRESERVATION_ID",
    "recipientId": "HOSPITAL_ID",
    "recipientModel": "Hospital",
    "units": 3,
    "expectedDelivery": "2024-01-20T10:00:00Z",
    "emergencyId": "EMERGENCY_ID"
  }'
```

#### Step 8: Verify Emergency Updated
```bash
curl http://localhost:5000/api/emergencies/EMERGENCY_ID
```
Check that `unitsReceived` has increased

---

## 9. Common Test Cases

### Test Authentication
- ✅ Signup with valid data
- ✅ Signup with duplicate ID/email (should fail)
- ✅ Login with correct credentials
- ✅ Login with wrong credentials (should fail)
- ✅ Access protected route without token (should fail)
- ✅ Access protected route with invalid token (should fail)
- ✅ Access route with wrong role (should fail)

### Test Patient Management
- ✅ Add patient with all fields
- ✅ Add patient with missing fields (should fail)
- ✅ Update patient units received
- ✅ Status auto-updates when units received = units needed
- ✅ Delete patient

### Test Emergency System
- ✅ Create emergency
- ✅ Emergency appears in nearby-emergencies for compatible donors
- ✅ Donor can respond to emergency
- ✅ Donor cannot respond twice to same emergency
- ✅ Emergency status updates when fulfilled

### Test Blood Bank Operations
- ✅ Add preservation batch
- ✅ Batch gets unique batch ID
- ✅ Near-expiry detection works
- ✅ Dispatch reduces available units
- ✅ Cannot dispatch more units than available
- ✅ Send record gets tracking number

---

## 10. Troubleshooting

### 401 Unauthorized
- Check if token is included in Authorization header
- Verify token format: `Bearer <token>`
- Token might be expired (default: 7 days)

### 403 Forbidden
- User role doesn't have permission
- Check if using correct role token for endpoint

### 404 Not Found
- Verify IDs are correct
- Check if resource exists in database

### 500 Internal Server Error
- Check server console for error details
- Verify MongoDB is connected
- Check if all required fields are provided

---

## 11. Performance Testing

### Load Testing with Apache Bench
```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:5000/api/health

# Test stats endpoint
ab -n 100 -c 5 http://localhost:5000/api/stats/overview
```

### Concurrent Emergency Creation
Create multiple emergencies simultaneously to test Socket.io broadcasting

---

## ✅ Testing Checklist

- [ ] All authentication endpoints work
- [ ] JWT tokens are generated correctly
- [ ] Protected routes require authentication
- [ ] Role-based access control works
- [ ] Hospital can manage patients
- [ ] Hospital can create emergencies
- [ ] Donors receive emergency notifications
- [ ] Donors can respond to emergencies
- [ ] Blood banks can manage inventory
- [ ] Blood banks can dispatch blood
- [ ] Socket.io notifications work
- [ ] Statistics are calculated correctly
- [ ] Database seeding works
- [ ] File uploads work (blood bank certificates)
- [ ] OTP system works for donors
- [ ] Error handling works properly

---

**Happy Testing! 🧪**
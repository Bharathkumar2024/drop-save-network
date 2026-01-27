# Vital Drop - System Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Port 5173)                                      │
│  ├── Hospital Dashboard                                          │
│  ├── Donor Dashboard                                             │
│  ├── Blood Bank Dashboard                                        │
│  └── Socket.io Client (Real-time notifications)                 │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP/HTTPS + WebSocket
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server (Port 5000)                                   │
│  ├── CORS Middleware                                             │
│  ├── Body Parser                                                 │
│  ├── Static File Serving (/uploads)                             │
│  └── Socket.io Server                                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ├── Authentication (JWT Verification)                           │
│  ├── Authorization (Role-based Access)                           │
│  ├── File Upload (Multer)                                        │
│  └── Error Handler                                               │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ROUTE LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  ├── /api/auth          (Authentication)                         │
│  ├── /api/hospitals     (Hospital Operations)                    │
│  ├── /api/donors        (Donor Operations)                       │
│  ├── /api/bloodbanks    (Blood Bank Operations)                  │
│  ├── /api/emergencies   (Emergency Management)                   │
│  ├── /api/stats         (Statistics & Analytics)                 │
│  └── /api/seed          (Database Seeding)                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  ├── User Management                                             │
│  ├── Patient Management                                          │
│  ├── Emergency Handling                                          │
│  ├── Inventory Management                                        │
│  ├── Dispatch Management                                         │
│  └── Notification Service                                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Mongoose ODM                                                    │
│  ├── Hospital Model                                              │
│  ├── Donor Model                                                 │
│  ├── BloodBank Model                                             │
│  ├── Patient Model                                               │
│  ├── Emergency Model                                             │
│  ├── Preservation Model                                          │
│  └── SendRecord Model                                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB (Port 27017)                                            │
│  └── vital-drop database                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Hospital Creates Emergency

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ Hospital │      │   API    │      │ Database │      │  Donors  │
│  Client  │      │  Server  │      │ MongoDB  │      │ (Socket) │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                  │                  │
     │ POST /emergency │                  │                  │
     ├────────────────>│                  │                  │
     │                 │                  │                  │
     │                 │ Verify JWT       │                  │
     │                 ├─────────┐        │                  │
     │                 │         │        │                  │
     │                 │<────────┘        │                  │
     │                 │                  │                  │
     │                 │ Create Emergency │                  │
     │                 ├─────────────────>│                  │
     │                 │                  │                  │
     │                 │ Emergency Saved  │                  │
     │                 │<─────────────────┤                  │
     │                 │                  │                  │
     │ Emergency Data  │                  │                  │
     │<────────────────┤                  │                  │
     │                 │                  │                  │
     │                 │ Emit Socket Event│                  │
     │                 ├─────────────────────────────────────>│
     │                 │ emergency.created│                  │
     │                 │                  │                  │
```

### 2. Donor Responds to Emergency

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Donor   │      │   API    │      │ Database │      │ Hospital │
│  Client  │      │  Server  │      │ MongoDB  │      │ (Socket) │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                  │                  │
     │ POST /respond   │                  │                  │
     ├────────────────>│                  │                  │
     │                 │                  │                  │
     │                 │ Verify JWT       │                  │
     │                 ├─────────┐        │                  │
     │                 │         │        │                  │
     │                 │<────────┘        │                  │
     │                 │                  │                  │
     │                 │ Update Emergency │                  │
     │                 ├─────────────────>│                  │
     │                 │ Add Response     │                  │
     │                 │                  │                  │
     │                 │ Update Donor     │                  │
     │                 ├─────────────────>│                  │
     │                 │ Increment Stats  │                  │
     │                 │                  │                  │
     │                 │ Data Saved       │                  │
     │                 │<─────────────────┤                  │
     │                 │                  │                  │
     │ Response Data   │                  │                  │
     │<────────────────┤                  │                  │
     │                 │                  │                  │
     │                 │ Emit Socket Event│                  │
     │                 ├─────────────────────────────────────>│
     │                 │ emergency.response                  │
     │                 │                  │                  │
```

### 3. Blood Bank Dispatch Flow

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│BloodBank │      │   API    │      │ Database │
│  Client  │      │  Server  │      │ MongoDB  │
└────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                  │
     │ POST /dispatch  │                  │
     ├────────────────>│                  │
     │                 │                  │
     │                 │ Verify JWT       │
     │                 ├─────────┐        │
     │                 │         │        │
     │                 │<────────┘        │
     │                 │                  │
     │                 │ Get Preservation │
     │                 ├─────────────────>│
     │                 │                  │
     │                 │ Batch Data       │
     │                 │<─────────────────┤
     │                 │                  │
     │                 │ Validate Units   │
     │                 ├─────────┐        │
     │                 │         │        │
     │                 │<────────┘        │
     │                 │                  │
     │                 │ Create SendRecord│
     │                 ├─────────────────>│
     │                 │                  │
     │                 │ Update Batch     │
     │                 ├─────────────────>│
     │                 │ Reduce Units     │
     │                 │                  │
     │                 │ Update Stats     │
     │                 ├─────────────────>│
     │                 │                  │
     │                 │ All Saved        │
     │                 │<─────────────────┤
     │                 │                  │
     │ Dispatch Data   │                  │
     │<────────────────┤                  │
     │ + Tracking #    │                  │
```

---

## 🗄️ Database Schema

### Collections Overview

```
vital-drop (Database)
├── hospitals
├── donors
├── bloodbanks
├── patients
├── emergencies
├── preservations
└── sendrecords
```

### Relationships

```
Hospital (1) ──────< (N) Patient
Hospital (1) ──────< (N) Emergency
BloodBank (1) ─────< (N) Emergency
BloodBank (1) ─────< (N) Preservation
BloodBank (1) ─────< (N) SendRecord
Donor (N) ─────────> (N) Emergency (via responses array)
Preservation (1) ──< (N) SendRecord
Emergency (1) ─────< (1) SendRecord (optional)
```

### Detailed Schemas

#### Hospital
```javascript
{
  _id: ObjectId,
  name: String,
  hospitalId: String (unique),
  location: String,
  city: String (indexed),
  password: String (hashed),
  contactEmail: String,
  contactPhone: String,
  verified: Boolean,
  stats: {
    totalPatients: Number,
    patientsReceived: Number,
    emergenciesCreated: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Donor
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  bloodGroup: Enum,
  city: String (indexed),
  lastDonationDate: Date,
  verified: Boolean,
  otp: String (hidden),
  otpExpiry: Date (hidden),
  reputation: Number,
  totalDonations: Number,
  totalPledges: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Emergency
```javascript
{
  _id: ObjectId,
  createdBy: ObjectId (ref: Hospital/BloodBank),
  creatorModel: String,
  creatorName: String,
  bloodType: Enum,
  unitsNeeded: Number,
  unitsPledged: Number,
  unitsReceived: Number,
  city: String (indexed),
  location: String,
  contactPhone: String,
  description: String,
  status: Enum,
  priority: Enum,
  expiresAt: Date,
  responses: [{
    donor: ObjectId (ref: Donor),
    unitsPledged: Number,
    respondedAt: Date,
    status: Enum
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. HOSPITAL/BLOOD BANK (Password-based)
   ┌──────────┐
   │  Signup  │
   └────┬─────┘
        │
        ├─> Hash Password (bcrypt)
        ├─> Save to Database
        ├─> Generate JWT Token
        └─> Return {token, user}

   ┌──────────┐
   │  Login   │
   └────┬─────┘
        │
        ├─> Find User by ID
        ├─> Compare Password (bcrypt)
        ├─> Generate JWT Token
        └─> Return {token, user}

2. DONOR (OTP-based)
   ┌──────────┐
   │  Signup  │
   └────┬─────┘
        │
        ├─> Generate OTP (6 digits)
        ├─> Save OTP + Expiry (10 min)
        ├─> Send OTP via Email
        └─> Return {message, email}

   ┌──────────┐
   │ Verify   │
   │   OTP    │
   └────┬─────┘
        │
        ├─> Check OTP Match
        ├─> Check Expiry
        ├─> Mark as Verified
        ├─> Generate JWT Token
        └─> Return {token, donor}

3. PROTECTED ROUTE ACCESS
   ┌──────────┐
   │ Request  │
   │ + Token  │
   └────┬─────┘
        │
        ├─> Extract Token from Header
        ├─> Verify JWT Signature
        ├─> Decode Payload {id, role}
        ├─> Fetch User from Database
        ├─> Check Role Authorization
        └─> Allow/Deny Access
```

---

## 🔔 Real-time Notification System

```
┌─────────────────────────────────────────────────────────────┐
│                  SOCKET.IO ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────┘

SERVER SIDE (server.js)
┌──────────────────────────────────────────────────────────────┐
│ Socket.io Server                                             │
│                                                              │
│ Rooms:                                                       │
│  ├── city:New York      (All users in New York)            │
│  ├── city:Los Angeles   (All users in LA)                  │
│  ├── role:hospital      (All hospitals)                     │
│  ├── role:donor         (All donors)                        │
│  ├── role:bloodbank     (All blood banks)                   │
│  └── user:userId        (Specific user)                     │
│                                                              │
│ Events Emitted:                                              │
│  ├── emergency.created  → city:${city}                      │
│  └── emergency.response → user:${creatorId}                 │
└──────────────────────────────────────────────────────────────┘

CLIENT SIDE (Frontend)
┌──────────────────────────────────────────────────────────────┐
│ Socket.io Client                                             │
│                                                              │
│ On Connect:                                                  │
│  └── emit('join', {city, role, userId})                     │
│                                                              │
│ Listeners:                                                   │
│  ├── on('emergency.created')  → Show notification           │
│  └── on('emergency.response') → Update emergency list       │
└──────────────────────────────────────────────────────────────┘

FLOW EXAMPLE:
1. Hospital in NYC creates emergency
2. Server emits to room "city:New York"
3. All donors in NYC receive notification
4. Donor responds to emergency
5. Server emits to room "user:hospitalId"
6. Hospital receives response notification
```

---

## 📊 Statistics Calculation

```
HOSPITAL STATS
├── totalPatients = COUNT(patients)
├── patientsReceived = COUNT(patients WHERE status='Received')
├── receivedPercentage = (patientsReceived / totalPatients) * 100
└── bloodTypeDistribution = GROUP BY bloodType

DONOR STATS
├── reputation = base + (pledges * 5) + (donations * 10)
├── totalPledges = COUNT(emergency responses)
└── totalDonations = COUNT(completed donations)

BLOOD BANK STATS
├── totalStock = SUM(preservation.units WHERE status='Available')
├── totalDispatched = SUM(sendRecord.units)
├── successfulSends = COUNT(sendRecords WHERE status='Delivered')
├── successRate = (successfulSends / totalSends) * 100
└── stockByType = GROUP BY bloodType, SUM(units)

SYSTEM STATS
├── activeEmergencies = COUNT(emergencies WHERE status='Active')
├── totalDonors = COUNT(donors WHERE verified=true)
├── totalHospitals = COUNT(hospitals)
└── totalBloodBanks = COUNT(bloodbanks WHERE verified=true)
```

---

## 🔄 State Management

```
PATIENT STATUS FLOW
Requesting → Partial → Received
    ↓          ↓          ↓
  (0 units) (some)   (all units)

EMERGENCY STATUS FLOW
Active → Fulfilled / Cancelled
  ↓           ↓
(created)  (completed)

PRESERVATION STATUS FLOW
Available → Reserved → Dispatched
    ↓          ↓          ↓
 (in stock) (allocated) (sent)
                ↓
            Expired
              ↓
         (past expiry)

SEND RECORD STATUS FLOW
Pending → In Transit → Delivered / Failed
   ↓          ↓            ↓
(created)  (shipped)   (completed)
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Network Layer                                             │
│    ├── CORS (Cross-Origin Resource Sharing)                 │
│    ├── HTTPS (Production)                                    │
│    └── Rate Limiting (TODO)                                  │
├─────────────────────────────────────────────────────────────┤
│ 2. Authentication Layer                                      │
│    ├── JWT Tokens (7-day expiry)                            │
│    ├── Password Hashing (bcrypt, 10 rounds)                 │
│    └── OTP Verification (10-minute expiry)                  │
├─────────────────────────────────────────────────────────────┤
│ 3. Authorization Layer                                       │
│    ├── Role-based Access Control                            │
│    ├── Resource Ownership Validation                        │
│    └── Protected Routes                                      │
├─────────────────────────────────────────────────────────────┤
│ 4. Data Layer                                                │
│    ├── Input Validation                                      │
│    ├── Schema Validation (Mongoose)                         │
│    ├── File Upload Restrictions                             │
│    └── SQL Injection Prevention (NoSQL)                     │
├─────────────────────────────────────────────────────────────┤
│ 5. Application Layer                                         │
│    ├── Error Handling                                        │
│    ├── Environment Variables                                │
│    └── Sensitive Data Exclusion                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Considerations

### Current Architecture (Single Server)
```
Client → Express Server → MongoDB
         └── Socket.io
```

### Scalable Architecture (Future)
```
                    ┌─── Express Server 1 ───┐
                    │                         │
Client → Load       ├─── Express Server 2 ───┤ → MongoDB Cluster
         Balancer   │                         │   (Replica Set)
                    └─── Express Server 3 ───┘
                              │
                              ↓
                         Redis Adapter
                         (Socket.io)
```

### Optimization Strategies
1. **Database**
   - Indexing on frequently queried fields (city, status)
   - MongoDB replica sets for read scaling
   - Caching with Redis

2. **API**
   - Rate limiting per user/IP
   - Response caching
   - Pagination for large datasets

3. **Real-time**
   - Redis adapter for Socket.io
   - Horizontal scaling with sticky sessions
   - Message queue for notifications

4. **Storage**
   - Cloud storage (S3, Cloudinary) for files
   - CDN for static assets

---

## 🔍 Monitoring & Logging

```
LOGGING STRATEGY
├── Application Logs
│   ├── Request/Response logs
│   ├── Error logs
│   └── Authentication logs
├── Database Logs
│   ├── Query performance
│   └── Connection status
└── System Logs
    ├── Server health
    └── Resource usage

MONITORING METRICS
├── API Performance
│   ├── Response times
│   ├── Error rates
│   └── Request volume
├── Database Performance
│   ├── Query times
│   ├── Connection pool
│   └── Storage usage
└── Business Metrics
    ├── Active emergencies
    ├── Response times
    └── Success rates
```

---

**This architecture is designed for:**
- ✅ Scalability
- ✅ Security
- ✅ Real-time performance
- ✅ Maintainability
- ✅ Extensibility

---

*For implementation details, see the code in respective directories.*
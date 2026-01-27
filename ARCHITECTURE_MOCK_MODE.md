# 🏗️ Mock Mode Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND APPLICATION                     │
│                  (React + Vite + TypeScript)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    ENVIRONMENT CONFIG                        │
│                                                              │
│  .env file:                                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │ VITE_MOCK_MODE=true  ← Controls mock/real mode    │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (api.ts)                      │
│                                                              │
│  Conditional Export Logic:                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │ if (VITE_MOCK_MODE === 'true') {                  │    │
│  │   export mockAPI                                   │    │
│  │ } else {                                           │    │
│  │   export realAPI                                   │    │
│  │ }                                                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
    ┌───────────────────────┐   ┌──────────────────────┐
    │   MOCK MODE (mockApi) │   │  REAL MODE (axios)   │
    │                       │   │                      │
    │  • No backend needed  │   │  • Connects to API   │
    │  • Instant responses  │   │  • Real database     │
    │  • Simulated delays   │   │  • Network calls     │
    │  • Local mock data    │   │  • Authentication    │
    └───────────────────────┘   └──────────────────────┘
                ↓                           ↓
    ┌───────────────────────┐   ┌──────────────────────┐
    │  mockData.ts          │   │  Backend Server      │
    │  • Hospitals          │   │  • Express API       │
    │  • Donors             │   │  • MongoDB           │
    │  • Blood Banks        │   │  • Socket.io         │
    │  • Patients           │   │  • Authentication    │
    │  • Emergencies        │   │  • Real-time events  │
    └───────────────────────┘   └──────────────────────┘
```

---

## 🔄 Request Flow Comparison

### Mock Mode Flow
```
User Action (e.g., Login)
    ↓
Component calls authAPI.login()
    ↓
api.ts checks VITE_MOCK_MODE
    ↓
Routes to mockAuthAPI.login()
    ↓
mockApi.ts simulates delay (300-500ms)
    ↓
Returns mock data from mockData.ts
    ↓
Component receives response
    ↓
UI updates with mock data
```

### Real Mode Flow
```
User Action (e.g., Login)
    ↓
Component calls authAPI.login()
    ↓
api.ts checks VITE_MOCK_MODE
    ↓
Routes to real axios API call
    ↓
HTTP request to backend server
    ↓
Backend processes request
    ↓
Database query executed
    ↓
Backend returns response
    ↓
Component receives response
    ↓
UI updates with real data
```

---

## 📁 File Structure

```
c:\drop-save-network\
│
├── .env                          ← Mock mode configuration
│   └── VITE_MOCK_MODE=true
│
├── src\
│   ├── lib\
│   │   ├── api.ts               ← API layer (conditional routing)
│   │   ├── mockApi.ts           ← Mock API implementations
│   │   └── socket.ts            ← Socket.io (mock mode aware)
│   │
│   ├── data\
│   │   └── mockData.ts          ← Mock data source
│   │
│   └── components\
│       ├── HospitalDashboard.tsx
│       ├── DonorDashboard.tsx
│       └── BloodBankDashboard.tsx
│
├── QUICK_START.md               ← Quick reference
├── MOCK_MODE_GUIDE.md           ← Detailed guide
├── IMPLEMENTATION_SUMMARY.md    ← Technical summary
├── README_MOCK_MODE.md          ← User-friendly readme
├── ARCHITECTURE_MOCK_MODE.md    ← This file
└── start-frontend-mock.bat      ← One-click launcher
```

---

## 🎯 API Layer Architecture

### api.ts Structure
```typescript
// 1. Import mock implementations
import { mockAuthAPI, mockHospitalAPI, ... } from './mockApi';

// 2. Check environment variable
const IS_MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

// 3. Conditional export
export const authAPI = IS_MOCK_MODE ? mockAuthAPI : {
  // Real API implementation
  login: async (data) => {
    const response = await axios.post('/auth/login', data);
    return response.data;
  },
  // ... other methods
};

// 4. Same pattern for all API modules
export const hospitalAPI = IS_MOCK_MODE ? mockHospitalAPI : { ... };
export const donorAPI = IS_MOCK_MODE ? mockDonorAPI : { ... };
export const bloodBankAPI = IS_MOCK_MODE ? mockBloodBankAPI : { ... };
```

---

## 🔌 Socket.io Mock Handling

### socket.ts Logic
```typescript
const IS_MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

class SocketService {
  connect() {
    if (IS_MOCK_MODE) {
      console.log('🎭 Mock Mode: Socket connection simulated');
      return; // Don't create real connection
    }
    // Real socket.io connection
    this.socket = io(SOCKET_URL);
  }

  isConnected() {
    if (IS_MOCK_MODE) {
      return true; // Always "connected" in mock mode
    }
    return this.socket?.connected || false;
  }

  send(event, data) {
    if (IS_MOCK_MODE) {
      console.log('🎭 Mock Mode: Socket event simulated:', event);
      return; // Don't send real event
    }
    this.socket.emit(event, data);
  }
}
```

---

## 📊 Data Flow Diagram

### Mock Mode Data Flow
```
┌──────────────┐
│  Component   │
└──────┬───────┘
       │ API Call
       ↓
┌──────────────┐
│   api.ts     │ ← Checks VITE_MOCK_MODE
└──────┬───────┘
       │ Routes to Mock
       ↓
┌──────────────┐
│  mockApi.ts  │ ← Simulates network delay
└──────┬───────┘
       │ Fetches data
       ↓
┌──────────────┐
│ mockData.ts  │ ← Returns mock objects
└──────┬───────┘
       │ Returns data
       ↓
┌──────────────┐
│  Component   │ ← Updates UI
└──────────────┘
```

### Real Mode Data Flow
```
┌──────────────┐
│  Component   │
└──────┬───────┘
       │ API Call
       ↓
┌──────────────┐
│   api.ts     │ ← Checks VITE_MOCK_MODE
└──────┬───────┘
       │ Routes to Real API
       ↓
┌──────────────┐
│ Axios HTTP   │ ← Makes network request
└──────┬───────┘
       │ HTTP Request
       ↓
┌──────────────┐
│ Backend API  │ ← Processes request
└──────┬───────┘
       │ Database query
       ↓
┌──────────────┐
│  MongoDB     │ ← Returns data
└──────┬───────┘
       │ Returns response
       ↓
┌──────────────┐
│  Component   │ ← Updates UI
└──────────────┘
```

---

## 🎭 Mock API Implementation Pattern

### Standard Mock Function Structure
```typescript
export const mockFunction = async (params: ParamsType) => {
  // 1. Simulate network delay
  await delay(300, 500);

  // 2. Optional: Validate params (for realism)
  if (!params.requiredField) {
    throw new Error('Validation error');
  }

  // 3. Fetch/generate mock data
  const mockData = mockDataSource.find(item => item.id === params.id);

  // 4. Return response matching real API structure
  return {
    success: true,
    data: mockData,
    message: 'Operation successful'
  };
};
```

### Example: Mock Login
```typescript
export const mockAuthAPI = {
  hospitalLogin: async (data: { hospitalId: string; password: string }) => {
    await delay(300, 500); // Simulate network

    // In mock mode, any credentials work
    const hospital = mockHospitals[0]; // Return first hospital

    return {
      success: true,
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: hospital,
        userType: 'hospital'
      },
      message: 'Login successful'
    };
  }
};
```

---

## 🔧 Configuration System

### Environment Variable Flow
```
1. Developer sets .env:
   VITE_MOCK_MODE=true

2. Vite loads environment:
   import.meta.env.VITE_MOCK_MODE

3. api.ts reads value:
   const IS_MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true'

4. Conditional export:
   export const authAPI = IS_MOCK_MODE ? mockAuthAPI : realAuthAPI

5. Components use API:
   import { authAPI } from '@/lib/api'
   authAPI.login(credentials) // Automatically uses correct implementation
```

---

## 🚀 Startup Sequence

### Mock Mode Startup
```
1. npm run dev
   ↓
2. Vite reads .env
   ↓
3. VITE_MOCK_MODE=true detected
   ↓
4. api.ts exports mock implementations
   ↓
5. Console logs: "🎭 Mock Mode Enabled"
   ↓
6. socket.ts skips connection
   ↓
7. App ready with mock data
   ↓
8. User can login with any credentials
```

### Real Mode Startup
```
1. npm run dev
   ↓
2. Vite reads .env
   ↓
3. VITE_MOCK_MODE=false detected
   ↓
4. api.ts exports real axios implementations
   ↓
5. socket.ts connects to backend
   ↓
6. App ready, waiting for backend
   ↓
7. User must use real credentials
```

---

## 📈 Performance Comparison

| Aspect | Mock Mode | Real Mode |
|--------|-----------|-----------|
| Startup Time | ⚡ Instant | ⏱️ Depends on backend |
| Response Time | ⚡ 300-500ms | ⏱️ Network dependent |
| Data Consistency | ✅ Always same | ⚠️ Can change |
| Network Required | ❌ No | ✅ Yes |
| Backend Required | ❌ No | ✅ Yes |
| Database Required | ❌ No | ✅ Yes |
| Offline Work | ✅ Yes | ❌ No |

---

## 🔐 Security Considerations

### Mock Mode
```
✅ Safe for development
✅ No real data exposed
✅ No authentication required
⚠️ NEVER use in production
⚠️ No real security checks
```

### Real Mode
```
✅ Full authentication
✅ Real security checks
✅ Production-ready
✅ Data validation
✅ Authorization checks
```

---

## 🎯 Decision Tree

```
Need to preview frontend?
    ↓
    ├─ Yes → Use Mock Mode
    │         • Set VITE_MOCK_MODE=true
    │         • npm run dev
    │         • Login with any credentials
    │
    └─ Need real data?
          ↓
          ├─ No → Stay in Mock Mode
          │        • Fast iteration
          │        • No backend setup
          │
          └─ Yes → Switch to Real Mode
                   • Set VITE_MOCK_MODE=false
                   • Start backend server
                   • Use real credentials
```

---

## ✅ Implementation Checklist

- [x] Environment variable configuration
- [x] Mock API implementations
- [x] API layer conditional routing
- [x] Socket.io mock handling
- [x] Mock data integration
- [x] Console logging
- [x] Documentation
- [x] Batch file launcher
- [x] Error handling
- [x] Response structure matching

---

## 🎉 Result

**Complete frontend preview system without backend dependency!**

```
┌─────────────────────────────────────┐
│  Frontend Application               │
│  ✅ Fully Functional                │
│  ✅ No Backend Required             │
│  ✅ Realistic Mock Data             │
│  ✅ Easy Mode Switching             │
│  ✅ Production-Ready Architecture   │
└─────────────────────────────────────┘
```

---

*Architecture designed for maximum flexibility and developer productivity*
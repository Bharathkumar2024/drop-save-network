# Emergency Notification System - Fix Documentation

## Problem Summary
Emergency messages sent from hospitals were not appearing in Donor page notifications and Blood Bank notifications.

## Root Causes Identified

### 1. **Frontend Issue - Hospital Emergency Page**
- **File**: `src/pages/hospital/HospitalEmergency.tsx`
- **Problem**: The hospital emergency page was only using `socketService.send()` without calling the backend API
- **Impact**: Emergency requests were not being saved to the database and not properly broadcast to all users

### 2. **Backend Issue - Limited Socket Broadcasting**
- **Files**: 
  - `backend/routes/hospitals.js`
  - `backend/routes/bloodbanks.js`
- **Problem**: Socket events were only broadcast to `city:${city}` room, missing users who weren't in that specific city room
- **Impact**: Donors and blood banks in different cities or not properly joined to city rooms didn't receive notifications

### 3. **Notification Context - No Role Filtering**
- **File**: `src/contexts/NotificationContext.tsx`
- **Problem**: Emergency notifications were being shown to all users including hospitals
- **Impact**: Unnecessary notifications for hospital users

## Solutions Implemented

### 1. ✅ Fixed Hospital Emergency Creation
**File**: `src/pages/hospital/HospitalEmergency.tsx`

**Changes**:
- Added import for `hospitalAPI` from `@/lib/api`
- Modified `handleEmergencyRequest()` to call `hospitalAPI.createEmergency()` API endpoint
- Added proper error handling with try-catch block
- Maintained socket broadcast for mock mode compatibility
- Added detailed console logging for debugging

**Code Changes**:
```typescript
// Now calls the backend API
const emergency = await hospitalAPI.createEmergency(hospitalId, {
  bloodType: bloodGroup,
  unitsNeeded: parseInt(unitsNeeded),
  urgencyLevel: 'High'
});

// Still broadcasts via socket for mock mode
socketService.send('emergency.created', emergencyData);
```

### 2. ✅ Enhanced Backend Socket Broadcasting
**Files**: 
- `backend/routes/hospitals.js` (lines 200-226)
- `backend/routes/bloodbanks.js` (lines 333-359)

**Changes**:
- Added broadcasting to role-based rooms: `role:donor` and `role:bloodbank`
- Maintained city-based broadcasting for location-specific notifications
- Standardized emergency payload structure with all required fields
- Added console logging for debugging

**Broadcasting Strategy**:
```javascript
// Broadcast to multiple rooms for maximum reach
io.to(`city:${hospital.city}`).emit('emergency.created', emergencyPayload);
io.to('role:donor').emit('emergency.created', emergencyPayload);
io.to('role:bloodbank').emit('emergency.created', emergencyPayload);
```

**Emergency Payload Structure**:
```javascript
{
  emergency: {
    id: emergency._id,
    bloodType: emergency.bloodType,
    unitsNeeded: emergency.unitsNeeded,
    unitsRequired: emergency.unitsNeeded,  // Alias for compatibility
    city: emergency.city,
    location: emergency.location,
    creatorName: emergency.creatorName,
    requesterName: emergency.creatorName,  // Alias for compatibility
    hospitalName: emergency.creatorName,   // Alias for compatibility
    priority: emergency.priority,
    status: emergency.status,
    createdAt: emergency.createdAt
  }
}
```

### 3. ✅ Improved Notification Context
**File**: `src/contexts/NotificationContext.tsx`

**Changes**:
- Added role-based filtering for emergency notifications
- Only donors and blood banks receive emergency alerts
- Added console logging for debugging
- Improved message formatting with fallback values

**Code Changes**:
```typescript
if (user.role === 'donor' || user.role === 'bloodbank') {
  const unitsNeeded = data.emergency.unitsNeeded || data.emergency.unitsRequired || 0;
  const requesterName = data.emergency.requesterName || 
                        data.emergency.hospitalName || 
                        data.emergency.creatorName || 'Unknown';
  
  addNotification({
    type: 'emergency',
    title: '🚨 New Emergency Alert',
    message: `${data.emergency.bloodType} blood needed - ${unitsNeeded} units from ${requesterName}`,
    emergencyData: data.emergency,
  });
}
```

### 4. ✅ Enhanced Socket Service Logging
**File**: `src/lib/socket.ts`

**Changes**:
- Added detailed console logging for all socket operations
- Improved mock mode simulation
- Added warnings when socket is not connected
- Better debugging information

## How It Works Now

### Emergency Creation Flow:

1. **Hospital Creates Emergency**:
   ```
   Hospital Dashboard → Emergency Page → Fill Form → Click "Send Emergency Alert"
   ```

2. **Frontend Processing**:
   ```
   HospitalEmergency.tsx → hospitalAPI.createEmergency() → Backend API Call
   ```

3. **Backend Processing**:
   ```
   POST /api/hospitals/:id/emergency
   → Create Emergency in Database
   → Broadcast via Socket.io to:
      - city:${city} room
      - role:donor room
      - role:bloodbank room
   ```

4. **Notification Delivery**:
   ```
   Socket Event → NotificationContext → Filter by Role → Add Notification
   → Display in Donor/BloodBank Notification Pages
   ```

### Socket Room Structure:

Users automatically join these rooms when they connect:
- `city:${userCity}` - Location-based room
- `role:${userRole}` - Role-based room (donor, bloodbank, hospital)
- `user:${userId}` - Individual user room

## Testing the Fix

### Prerequisites:
1. Backend server must be running: `cd backend && npm run dev`
2. Frontend must be running: `npm run dev`
3. Users must be logged in (Hospital, Donor, Blood Bank)

### Test Steps:

#### Test 1: Hospital Creates Emergency
1. Login as Hospital
2. Navigate to "Emergency Request" page
3. Select blood type (e.g., "O+")
4. Enter units needed (e.g., "5")
5. Click "Send Emergency Alert"
6. **Expected**: Success toast message appears

#### Test 2: Donor Receives Notification
1. Login as Donor (in different browser/tab)
2. Navigate to "Notifications" page
3. **Expected**: Emergency notification appears with:
   - Red border and pulse animation
   - Blood type badge
   - Units needed
   - Hospital name
   - "Respond" button

#### Test 3: Blood Bank Receives Notification
1. Login as Blood Bank (in different browser/tab)
2. Navigate to "Notifications" page
3. **Expected**: Emergency notification appears with same details as donor

#### Test 4: Mock Mode (Without Backend)
1. Set `VITE_MOCK_MODE=true` in `.env`
2. Restart frontend
3. Create emergency as hospital
4. **Expected**: Notifications appear in all open donor/blood bank tabs

## Debugging

### Check Console Logs:

**Hospital (Creating Emergency)**:
```
Emergency created: {emergency object}
🎭 Mock Mode: Socket event simulated: emergency.created
```

**Donor/Blood Bank (Receiving)**:
```
🚨 Emergency notification received: {data}
```

**Backend Server**:
```
Emergency broadcast to city:Mumbai, role:donor, and role:bloodbank
```

### Common Issues:

1. **No notifications appearing**:
   - Check if backend is running
   - Check browser console for errors
   - Verify socket connection: Look for "Socket connected" message
   - Check if user is logged in with correct role

2. **Notifications only in mock mode**:
   - Backend server not running
   - CORS issues - check backend CORS configuration
   - Socket connection failed - check SOCKET_URL in environment

3. **Partial notifications**:
   - Users not joined to correct rooms
   - Check socket room joining in browser console
   - Verify user role is set correctly

## Environment Variables

### Frontend (.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_MOCK_MODE=false  # Set to true for testing without backend
```

### Backend (.env):
```env
PORT=5000
CLIENT_URL=http://localhost:5173,http://localhost:8080
```

## Files Modified

### Frontend:
1. ✅ `src/pages/hospital/HospitalEmergency.tsx` - Added API call
2. ✅ `src/contexts/NotificationContext.tsx` - Added role filtering
3. ✅ `src/lib/socket.ts` - Enhanced logging

### Backend:
1. ✅ `backend/routes/hospitals.js` - Enhanced broadcasting
2. ✅ `backend/routes/bloodbanks.js` - Enhanced broadcasting

## API Endpoints Used

### Create Emergency (Hospital):
```
POST /api/hospitals/:hospitalId/emergency
Headers: Authorization: Bearer {token}
Body: {
  bloodType: string,
  unitsNeeded: number,
  urgencyLevel?: string,
  description?: string
}
```

### Create Emergency (Blood Bank):
```
POST /api/bloodbanks/:bloodBankId/emergency
Headers: Authorization: Bearer {token}
Body: {
  bloodType: string,
  unitsNeeded: number,
  urgencyLevel?: string,
  description?: string
}
```

## Socket Events

### emergency.created
**Emitted by**: Backend (hospitals.js, bloodbanks.js)
**Received by**: All donors and blood banks
**Payload**:
```javascript
{
  emergency: {
    id: string,
    bloodType: string,
    unitsNeeded: number,
    unitsRequired: number,
    city: string,
    location: string,
    creatorName: string,
    requesterName: string,
    hospitalName: string,
    priority: string,
    status: string,
    createdAt: Date
  }
}
```

## Success Criteria

✅ Hospital can create emergency requests
✅ Emergency is saved to database
✅ Donors receive real-time notifications
✅ Blood banks receive real-time notifications
✅ Notifications display correct information
✅ Works in both mock mode and with backend
✅ Proper error handling and user feedback
✅ Console logging for debugging

## Future Enhancements

1. **Location-based filtering**: Show only emergencies within X km radius
2. **Blood type matching**: Only notify donors with matching blood type
3. **Push notifications**: Browser push notifications for urgent requests
4. **SMS/Email alerts**: Multi-channel notification delivery
5. **Notification preferences**: Allow users to customize notification settings
6. **Read receipts**: Track who has seen the emergency
7. **Response tracking**: Show real-time response count

## Support

If you encounter any issues:
1. Check the console logs in browser and backend
2. Verify all environment variables are set correctly
3. Ensure backend and frontend are both running
4. Check that users are logged in with correct roles
5. Review the socket connection status in browser console

## Conclusion

The emergency notification system is now fully functional with:
- ✅ Proper API integration
- ✅ Multi-room socket broadcasting
- ✅ Role-based notification filtering
- ✅ Comprehensive error handling
- ✅ Detailed logging for debugging
- ✅ Mock mode support for testing

Emergency messages from hospitals will now properly appear in both Donor and Blood Bank notification pages in real-time.
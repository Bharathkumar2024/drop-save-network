# Patient Feature - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
1. Backend server running on `http://localhost:5000`
2. MongoDB database connected
3. Frontend development server running

### Starting the Application

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd c:\drop-save-network
npm install
npm run dev
```

---

## 📋 Testing the Patient Feature

### Step 1: Access Patient Portal
1. Open browser and navigate to `http://localhost:5173` (or your dev server URL)
2. On the landing page, you'll see 4 access cards:
   - Hospitals
   - Donors
   - Blood Banks
   - **Patients** (NEW!)
3. Click on the **Patients** card

### Step 2: Patient Registration
1. Click on "Sign Up" tab
2. Fill in the registration form:
   ```
   Name: John Doe
   Email: john.doe@example.com
   Phone: +1234567890
   Age: 30
   Blood Group: A+
   City: New York
   Location: 123 Main Street
   Password: ********
   Emergency Contact: +0987654321 (optional)
   ```
3. Click "Sign Up"
4. Check your email for OTP code
5. Enter the OTP code
6. Click "Verify OTP"
7. You'll be redirected to the Patient Dashboard

### Step 3: Explore Patient Dashboard
1. **Welcome Message**: See personalized greeting with your name
2. **Advertisement Slider**: Watch 3 slides rotate every 5 seconds
3. **Quick Stats**: View your Blood Group, Age, and City
4. **Quick Actions**: Two main action cards
   - Request Blood
   - Find Blood Banks

### Step 4: Create Blood Request
1. Click "Blood Needed" in sidebar OR "Request Blood" card
2. Fill in the blood request form:
   ```
   Name: John Doe (pre-filled)
   Age: 30 (pre-filled)
   Blood Group: A+ (pre-filled)
   Units Needed: 2
   Phone: +1234567890 (pre-filled)
   Urgency Level: High
   Hospital Preference: City Hospital (optional)
   Additional Notes: Urgent surgery needed (optional)
   ```
3. Click "Submit Blood Request"
4. **Result**: 
   - Success message appears
   - All blood banks in your city receive notification
   - Nearby blood banks list appears below the form
5. Click "Call Blood Bank" button to contact any blood bank

### Step 5: View Nearby Blood Banks
1. Click "Nearby Blood Banks" in sidebar
2. See all blood banks in your city
3. Each card shows:
   - Blood bank name
   - Location and city
   - Contact phone and email
   - Operating hours
   - Bank ID
4. Click "Call Blood Bank" to contact them directly

### Step 6: Manage Profile
1. Click "Profile" in sidebar
2. View your profile information
3. Click "Edit Profile" button
4. Update any field (except email)
5. Click "Save Changes"
6. Profile updated successfully!

### Step 7: Test Blood Bank Side
1. Open a new browser window/tab
2. Navigate to landing page
3. Click "Blood Banks" card
4. Login as a blood bank
5. **Check Notifications**: You should see the patient's blood request
6. Click on the notification to view details
7. Click "Accept Request" button
8. **Result**: Patient receives acceptance notification

### Step 8: Verify Patient Notification
1. Go back to patient dashboard
2. Check notifications (bell icon)
3. You should see: "✅ Blood Request Accepted"
4. Blood bank can now call you directly

---

## 🧪 Test Scenarios

### Scenario 1: Emergency Blood Request
```
Patient: Needs O- blood urgently
1. Login as patient
2. Create blood request with "Critical" urgency
3. Multiple blood banks receive notification
4. First blood bank to accept gets priority
5. Patient receives acceptance notification
6. Blood bank calls patient
7. Blood delivered/collected
```

### Scenario 2: Multiple Blood Banks
```
Setup: Register 3 blood banks in same city
1. Patient creates blood request
2. All 3 blood banks receive notification
3. Patient can see all 3 in nearby blood banks list
4. Patient can call any of them
5. Any blood bank can accept the request
```

### Scenario 3: No Blood Banks Available
```
Setup: Patient in city with no blood banks
1. Patient creates blood request
2. Request submitted successfully
3. "No Blood Banks Found" message appears
4. Patient can try contacting hospitals instead
```

### Scenario 4: Profile Update
```
Patient: Moves to new city
1. Login as patient
2. Go to Profile
3. Click Edit Profile
4. Update City and Location
5. Save changes
6. Future blood requests will notify blood banks in new city
```

---

## 🔍 What to Check

### Frontend Checks
- [ ] Patient card appears on landing page
- [ ] Patient auth page loads correctly
- [ ] Signup form validation works
- [ ] OTP verification works
- [ ] Dashboard loads with correct data
- [ ] Advertisement slider rotates every 5 seconds
- [ ] Sidebar navigation works
- [ ] Mobile responsive (hamburger menu)
- [ ] Blood request form submits successfully
- [ ] Nearby blood banks display correctly
- [ ] Call buttons work (tel: links)
- [ ] Profile edit/save works
- [ ] Logout works

### Backend Checks
- [ ] Patient signup endpoint works
- [ ] OTP email sent successfully
- [ ] OTP verification endpoint works
- [ ] Patient login endpoint works
- [ ] JWT token generated and stored
- [ ] Blood request creation works
- [ ] Socket.IO broadcasts to blood banks
- [ ] Nearby blood banks query works (city-based)
- [ ] Profile update endpoint works
- [ ] Blood bank acceptance endpoint works
- [ ] Socket.IO notifies patient on acceptance

### Real-time Checks
- [ ] Socket connection established
- [ ] Blood request notification appears in blood bank dashboard
- [ ] Acceptance notification appears in patient dashboard
- [ ] Browser notifications work (if permission granted)
- [ ] Notification sound plays (if enabled)

---

## 🐛 Troubleshooting

### Issue: OTP Email Not Received
**Solution**: 
- Check backend email configuration
- Verify email service credentials
- Check spam folder
- Check backend console for email errors

### Issue: Socket Not Connecting
**Solution**:
- Verify backend server is running
- Check Socket.IO server configuration
- Check browser console for connection errors
- Verify CORS settings

### Issue: No Blood Banks Found
**Solution**:
- Verify blood banks are registered in the same city
- Check city name spelling (case-sensitive)
- Register test blood banks in patient's city

### Issue: Notifications Not Showing
**Solution**:
- Check browser notification permissions
- Verify Socket.IO connection
- Check NotificationContext implementation
- Check browser console for errors

### Issue: Call Button Not Working
**Solution**:
- Verify phone number format
- Test on mobile device (tel: links work best on mobile)
- Check if phone number is stored correctly

---

## 📊 Test Data

### Sample Patient Data
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "age": 30,
  "bloodGroup": "A+",
  "city": "New York",
  "location": "123 Main Street",
  "password": "Test@123",
  "emergencyContact": "+0987654321"
}
```

### Sample Blood Request
```json
{
  "bloodGroup": "A+",
  "unitsNeeded": 2,
  "urgencyLevel": "High",
  "hospitalPreference": "City Hospital",
  "additionalNotes": "Urgent surgery needed"
}
```

### Sample Blood Bank (for testing)
```json
{
  "name": "City Blood Bank",
  "bankId": "BB001",
  "city": "New York",
  "location": "456 Hospital Road",
  "contactPhone": "+1122334455",
  "contactEmail": "contact@citybloodbank.com",
  "operatingHours": "24/7"
}
```

---

## 🎯 Success Criteria

The Patient feature is working correctly if:

1. ✅ Patient can register and login successfully
2. ✅ Patient dashboard displays correctly with all features
3. ✅ Advertisement slider rotates automatically
4. ✅ Blood request form submits and notifies blood banks
5. ✅ Nearby blood banks display correctly
6. ✅ Call functionality works (tel: links)
7. ✅ Profile can be viewed and edited
8. ✅ Real-time notifications work both ways
9. ✅ Blood bank can accept requests and notify patient
10. ✅ Mobile responsive design works correctly

---

## 📱 Mobile Testing

### Test on Mobile Device
1. Open browser on mobile device
2. Navigate to the application
3. Test all features:
   - Hamburger menu
   - Touch interactions
   - Call buttons (should open phone dialer)
   - Form inputs (mobile keyboard)
   - Responsive layouts

---

## 🔐 Security Testing

### Test Security Features
1. **Authentication**:
   - Try accessing dashboard without login (should redirect)
   - Try invalid OTP (should fail)
   - Try expired token (should redirect to login)

2. **Authorization**:
   - Try accessing other patient's data (should fail)
   - Try modifying other patient's profile (should fail)

3. **Input Validation**:
   - Try invalid email format
   - Try negative age
   - Try invalid phone number
   - Try SQL injection in inputs

---

## 📈 Performance Testing

### Check Performance
1. **Load Time**: Dashboard should load in < 2 seconds
2. **Socket Connection**: Should connect in < 1 second
3. **Form Submission**: Should respond in < 1 second
4. **Notification Delivery**: Should appear in < 500ms
5. **API Calls**: Should complete in < 1 second

---

## 🎓 Demo Script

### For Presentation/Demo
```
"Let me show you our new Patient feature..."

1. [Landing Page] "We've added a fourth user type - Patients"
2. [Click Patient Card] "Patients can now directly request blood"
3. [Signup] "Registration is simple with OTP verification"
4. [Dashboard] "The dashboard welcomes patients with their name"
5. [Slider] "We have an advertisement slider with helpful information"
6. [Blood Request] "Patients can fill a simple form to request blood"
7. [Submit] "When submitted, all nearby blood banks are notified instantly"
8. [Blood Banks List] "Patients can see and call blood banks directly"
9. [Blood Bank Side] "Blood banks receive the request in real-time"
10. [Accept] "When a blood bank accepts, the patient is notified"
11. [Profile] "Patients can manage their profile information"
12. [Mobile] "Everything is mobile-responsive for on-the-go access"

"This creates a complete ecosystem connecting patients, blood banks, hospitals, and donors - ultimately saving more lives through better coordination!"
```

---

## ✅ Final Checklist

Before marking as complete:
- [ ] All files created and saved
- [ ] All routes registered in App.tsx
- [ ] API functions added to api.ts
- [ ] Socket events added to NotificationContext
- [ ] Backend routes tested
- [ ] Frontend pages tested
- [ ] Real-time notifications tested
- [ ] Mobile responsive tested
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Ready for deployment

---

**Happy Testing! 🎉**

If you encounter any issues, refer to the troubleshooting section or check the comprehensive documentation in `PATIENT_FEATURE_IMPLEMENTATION.md`.
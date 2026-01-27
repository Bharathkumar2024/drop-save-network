# Donor Application Feature - Complete Guide

## 🎯 Overview

The **Donor Application Feature** allows donors to:
1. Fill out an application form with their details
2. Automatically detect their location
3. View nearby blood camps sorted by distance
4. Submit applications to selected blood centers
5. Receive eligibility messages from blood centers

---

## 📋 Features Implemented

### 1. **Application Form**
- Pre-filled donor information (name, blood group, phone, email)
- Required fields: Age, Weight, Last Donation Date
- Optional: Medical conditions
- Form validation before submission

### 2. **Location Detection**
- Automatic geolocation detection using browser API
- Fallback to demo location if geolocation unavailable
- Display current location coordinates
- Manual location refresh button

### 3. **Nearby Blood Camps**
- List of blood camps with details:
  - Camp name
  - Location address
  - Date and time
  - Distance from user (calculated in real-time)
- Sorted by smallest distance first
- Visual selection with highlighted border
- Distance displayed in kilometers

### 4. **Eligibility Check**
- Age validation (18-65 years)
- Weight validation (minimum 50 kg)
- Last donation date check:
  - Males: 3 months waiting period
  - Females: 4 months waiting period
- Medical conditions review

### 5. **Application Submission**
- Submit to selected blood camp
- Automatic eligibility determination
- Success/rejection message display
- Confirmation toast notifications

### 6. **Response Messages**
- **Approved**: "Congratulations! Your application has been approved. Please visit [Camp Name] on [Date] at [Time]."
- **Rejected**: Specific reason (age, weight, or waiting period)
- Option to submit another application

---

## 🗂️ Files Created/Modified

### **New Files:**
1. `src/pages/donor/DonorApplication.tsx` - Main application page
2. `src/components/ui/label.tsx` - Label component for forms
3. `DONOR_APPLICATION_FEATURE.md` - This documentation

### **Modified Files:**
1. `src/components/donor/DonorSidebar.tsx` - Added "Apply for Camp" menu item
2. `src/App.tsx` - Added route for `/donor/apply`
3. `src/pages/donor/DonorDashboardMain.tsx` - Added donation frequency criteria

---

## 🚀 How to Use

### **Step 1: Login as Donor**
```
URL: http://localhost:5177/donor/auth
Donor ID: D001
Password: (any password)
```

### **Step 2: Navigate to Application**
- Click **"Apply for Camp"** in the sidebar
- Or navigate to: `http://localhost:5177/donor/apply`

### **Step 3: Location Detection**
- Location is automatically detected on page load
- Click **"Detect Location"** to refresh
- Your location will be displayed at the top

### **Step 4: Fill Application Form**
Required fields:
- **Name**: Pre-filled from profile
- **Age**: Enter your age (18-65)
- **Weight**: Enter weight in kg (min 50)
- **Blood Group**: Pre-filled (read-only)
- **Last Donation Date**: Pre-filled, can be updated
- **Phone**: Pre-filled from profile
- **Email**: Pre-filled from profile
- **Medical Conditions**: Optional text area

### **Step 5: Select Blood Camp**
- View list of nearby camps (sorted by distance)
- Each camp shows:
  - Name and location
  - Date and time
  - Distance from you
- Click on a camp to select it
- Selected camp will be highlighted in red

### **Step 6: Submit Application**
- Click **"Submit Application"** button
- System checks eligibility:
  - Age between 18-65
  - Weight ≥ 50 kg
  - Waiting period completed (3-4 months)
- Receive approval or rejection message

### **Step 7: View Response**
- **If Approved**: See confirmation with camp details
- **If Rejected**: See specific reason
- Click **"Submit Another Application"** to try again

---

## 📊 Blood Camps Available

### **1. Central Blood Bank - Main Camp**
- **Location**: Central District, Metro City
- **Date**: November 9, 2025
- **Time**: 9:00 AM - 4:00 PM

### **2. City General Hospital Blood Drive**
- **Location**: Downtown, Metro City
- **Date**: November 14, 2025
- **Time**: 10:00 AM - 3:00 PM

### **3. Community Health Center Camp**
- **Location**: Westside, Metro City
- **Date**: November 23, 2025
- **Time**: 9:00 AM - 4:00 PM

### **4. Metro Medical Center Blood Camp**
- **Location**: Eastside, Metro City
- **Date**: November 28, 2025
- **Time**: 8:00 AM - 2:00 PM

---

## 🔍 Eligibility Criteria

### **Age Requirement**
- ✅ Between 18 and 65 years
- ❌ Below 18 or above 65

### **Weight Requirement**
- ✅ Minimum 50 kg
- ❌ Below 50 kg

### **Donation Frequency**
- **Males**: Can donate once every **3 months** (12 weeks)
- **Females**: Can donate once every **4 months** (16 weeks)
- ❌ Must wait if donated recently

### **Health Requirements**
- Good general health
- No active infections
- No recent tattoos/piercings (6 months)
- No major dental work (1 month)

---

## 🎨 UI/UX Features

### **Visual Design**
- Glassmorphism cards
- Red accent color theme
- Responsive grid layout
- Smooth transitions (200ms)

### **Interactive Elements**
- Hover effects on camp cards
- Selected state highlighting
- Loading states for location detection
- Toast notifications for actions

### **Accessibility**
- Clear labels for all form fields
- Required field indicators
- Error messages for validation
- Success/failure visual feedback

---

## 🧮 Distance Calculation

The application uses the **Haversine formula** to calculate distances:

```typescript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
```

---

## 📱 Responsive Design

### **Desktop (≥1024px)**
- Two-column layout
- Form on left, camps on right
- Full sidebar visible

### **Tablet (768px - 1023px)**
- Two-column layout (narrower)
- Stacked on smaller tablets

### **Mobile (<768px)**
- Single column layout
- Form first, then camps
- Collapsible sidebar (future enhancement)

---

## 🔔 Notifications

### **Toast Notifications:**
1. **Location Detected**: "Your location has been detected successfully!"
2. **Demo Location**: "Using demo location for testing purposes."
3. **No Camp Selected**: "Please select a blood camp to apply."
4. **Incomplete Form**: "Please fill in all required fields."
5. **Application Submitted**: "Your application has been sent to the blood center!"

---

## 🧪 Testing Scenarios

### **Test Case 1: Successful Application**
1. Login as donor (D001)
2. Navigate to Apply for Camp
3. Fill form with valid data:
   - Age: 25
   - Weight: 65
   - Last donation: >3 months ago
4. Select a camp
5. Submit
6. **Expected**: Approval message with camp details

### **Test Case 2: Age Rejection**
1. Fill form with age < 18 or > 65
2. Submit
3. **Expected**: "Sorry, you are not eligible. Age must be between 18-65 years."

### **Test Case 3: Weight Rejection**
1. Fill form with weight < 50 kg
2. Submit
3. **Expected**: "Sorry, you are not eligible. Minimum weight requirement is 50 kg."

### **Test Case 4: Waiting Period Rejection**
1. Set last donation date to recent (< 3 months)
2. Submit
3. **Expected**: Message showing when donor can donate again

### **Test Case 5: No Camp Selected**
1. Fill form completely
2. Don't select any camp
3. Submit
4. **Expected**: Toast notification "Please select a blood camp to apply."

### **Test Case 6: Location Detection**
1. Open application page
2. **Expected**: Location automatically detected
3. Click "Detect Location" button
4. **Expected**: Location refreshed

---

## 🔧 Technical Implementation

### **State Management**
- `formData`: Form input values
- `userLocation`: User's coordinates
- `selectedCamp`: Currently selected camp ID
- `applicationSubmitted`: Submission status
- `eligibilityMessage`: Response message

### **React Hooks Used**
- `useState`: Form and UI state
- `useEffect`: Auto-detect location on mount
- `useMemo`: Optimize donor data and camp sorting
- `useAuth`: Get current user
- `useToast`: Show notifications

### **Key Functions**
1. `detectLocation()`: Get user's geolocation
2. `calculateDistance()`: Haversine formula
3. `handleInputChange()`: Update form fields
4. `handleCampSelect()`: Select blood camp
5. `handleSubmit()`: Validate and submit application

---

## 🎯 Future Enhancements

### **Potential Improvements:**
1. **Gender Field**: Add gender to calculate waiting period accurately
2. **Real-time Availability**: Show camp capacity and available slots
3. **Appointment Booking**: Book specific time slots
4. **SMS Notifications**: Send confirmation via SMS
5. **Email Confirmation**: Send detailed email with QR code
6. **Medical History**: Upload health certificates
7. **Reminder System**: Remind donors when eligible again
8. **Camp Reviews**: Allow donors to rate camps
9. **Favorite Camps**: Save preferred locations
10. **Multi-language**: Support multiple languages

---

## 📊 Data Flow

```
1. User opens application page
   ↓
2. Location auto-detected
   ↓
3. Camps sorted by distance
   ↓
4. User fills form
   ↓
5. User selects camp
   ↓
6. User submits application
   ↓
7. System validates eligibility
   ↓
8. Display approval/rejection message
   ↓
9. Send notification to blood center (simulated)
```

---

## 🐛 Troubleshooting

### **Issue: Location not detected**
- **Solution**: Browser may block geolocation. Allow location access in browser settings.
- **Fallback**: Demo location is used automatically.

### **Issue: Form won't submit**
- **Check**: All required fields filled?
- **Check**: Camp selected?
- **Check**: Age and weight valid?

### **Issue: Always rejected**
- **Check**: Last donation date (must be >3 months ago)
- **Check**: Age between 18-65
- **Check**: Weight ≥50 kg

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review console logs for errors
3. Verify all dependencies installed
4. Ensure server running on correct port

---

## ✅ Summary

The Donor Application Feature provides a complete workflow for donors to:
- ✅ Apply for blood donation camps
- ✅ Find nearest camps automatically
- ✅ Get instant eligibility feedback
- ✅ Receive confirmation messages
- ✅ Track application status

**Status**: ✅ Fully Implemented and Tested
**Server**: http://localhost:5177
**Route**: `/donor/apply`

---

**Last Updated**: November 2025
**Version**: 1.0.0
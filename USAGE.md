# Vital Drop - Blood Donation Crisis Management Platform

## 🩸 Project Overview

**Vital Drop** (also known as LifeLink) is a comprehensive blood donation crisis management platform that connects Hospitals, Donors, and Blood Banks in real-time during blood shortage emergencies.

## 🚀 Features

### Three Access Roles

1. **🏥 Hospitals**
   - Manage patient blood requests
   - View admitted patients requiring blood
   - Track blood type distribution
   - Send emergency blood requests
   - Monitor donor connections and units received

2. **🩸 Donors**
   - Receive emergency blood donation alerts
   - Track donation history and reputation
   - Respond to urgent requests in real-time
   - View impact and contribution statistics

3. **🏬 Blood Banks**
   - Comprehensive inventory management
   - Track blood preservation conditions
   - Monitor expiry dates with visual warnings
   - Manage hospital shipments with audit trails
   - Safety record sharing and export functionality
   - Success rate analytics and charts

## 🔐 Demo Credentials

### Hospital Access
- **Hospital ID**: `CGH001`
- **Password**: Any password (mock authentication)

### Donor Access
- **Email**: `alex.turner@email.com`
- **OTP**: Any OTP (mock authentication)

### Blood Bank Access
- **Bank ID**: `CBB001`
- **Password**: Any password (mock authentication)

## 📱 Mobile-First Design

The entire platform is fully responsive and optimized for:
- Mobile phones (portrait and landscape)
- Tablets
- Desktop screens
- Touch-friendly interfaces with large tap targets
- Horizontal scrolling for data tables on mobile

## 🎨 Design Features

- **Red atmospheric theme** with medical emergency aesthetics
- **Animated elements**: Blinking alerts, pulse effects, wave animations
- **Glass morphism cards** with glow effects
- **Real-time notifications** with emergency broadcasts
- **Interactive charts** using Recharts library
- **Responsive navigation** with mobile-friendly sidebar

## 🔔 Emergency Alert System

The **EMERGENCY REQUEST** button (fixed top-right) allows:
- Hospitals and Blood Banks to broadcast urgent blood needs
- Real-time notifications to all Donors and Blood Banks
- Specification of blood type and units required
- Tracking of acknowledgements and pledges

## 📊 Dashboard Features

### Hospital Dashboard
- Patient records management (10 default patients)
- Blood need vs. received statistics with progress bars
- Quick patient status strip
- Editable patient details modal
- Blood type distribution charts
- Real-time units tracking

### Donor Dashboard
- Personal profile with blood group and reputation score
- Emergency notification center
- One-click donation response
- Impact level tracking
- Availability status management

### Blood Bank Dashboard
- **Preservation List**: Complete inventory with:
  - Blood type, units available, storage conditions
  - Collection and expiry dates
  - Batch IDs and status tracking
  - Visual warnings for near-expiry (yellow) and expired (red) units
- **Shipment Records**: Audit trail with:
  - Hospital details and dispatch times
  - Transport conditions and responsible staff
  - Exportable safety records (CSV/PDF simulation)
- **Analytics**:
  - Stock level percentage
  - Success rate trends (7-day chart)
  - Blood type distribution
  - Reputation scoring

## 🛠️ Technical Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** with custom design system
- **Recharts** for data visualization
- **shadcn/ui** components
- **Lucide React** icons
- **Context API** for state management (Auth + Notifications)
- **Sonner** for toast notifications

## 📂 Project Structure

```
src/
├── components/
│   ├── shared/
│   │   ├── DashboardLayout.tsx
│   │   ├── EmergencyButton.tsx
│   │   └── NotificationBell.tsx
│   └── ui/ (shadcn components)
├── contexts/
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── data/
│   └── mockData.ts
├── pages/
│   ├── Landing.tsx
│   ├── hospital/
│   │   ├── HospitalAuth.tsx
│   │   └── HospitalDashboard.tsx
│   ├── donor/
│   │   ├── DonorAuth.tsx
│   │   └── DonorDashboard.tsx
│   └── bloodbank/
│       ├── BloodBankAuth.tsx
│       └── BloodBankDashboard.tsx
└── assets/
    └── hero-background.jpg
```

## 🔄 Replacing Mock Data with Real APIs

This is a frontend prototype. To connect to real backend APIs:

### 1. Authentication Flows
Replace mock login/signup in auth pages with actual API calls:

```typescript
// Example: Hospital Login
const response = await fetch('YOUR_API/hospital/login', {
  method: 'POST',
  body: JSON.stringify({ hospitalId, password }),
  headers: { 'Content-Type': 'application/json' }
});
const data = await response.json();
login(data.user);
```

### 2. Patient Data
Replace `mockHospitals` import with API fetch:

```typescript
useEffect(() => {
  fetch('YOUR_API/hospitals/patients')
    .then(res => res.json())
    .then(data => setPatients(data));
}, []);
```

### 3. Blood Bank Inventory
Replace `mockBloodBanks.preservationList` with live data:

```typescript
const { data } = useQuery('inventory', () => 
  fetch('YOUR_API/bloodbank/inventory').then(res => res.json())
);
```

### 4. Emergency Notifications
Replace `addNotification()` with WebSocket/SSE connection:

```typescript
const ws = new WebSocket('YOUR_API/notifications');
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  addNotification(notification);
};
```

### 5. Send Records Export
Replace mock export with actual download:

```typescript
const handleExportRecord = async (recordId) => {
  const blob = await fetch(`YOUR_API/records/${recordId}/export`).then(r => r.blob());
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `record-${recordId}.pdf`;
  a.click();
};
```

## 🎯 Key Mock Data Locations

All mock data is centralized in `src/data/mockData.ts`:
- `mockHospitals` - Hospital and patient records
- `mockDonors` - Donor profiles
- `mockBloodBanks` - Blood bank inventory and send records
- `mockEmergencyRequests` - Emergency alert queue
- `bloodTypeDistribution` - Chart data
- `successRateTimeSeries` - Analytics data

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 Notes

- All authentication is **mocked** for demonstration purposes
- File uploads (certificates, health documents) are simulated
- OTP verification is front-end only
- Real-time features use context state (replace with WebSockets for production)
- Charts use sample data (connect to real analytics)

## 🔐 Security Considerations for Production

When moving to production:
1. Implement proper authentication with JWT/OAuth
2. Add server-side validation for all inputs
3. Encrypt sensitive patient data
4. Use HTTPS for all API calls
5. Implement rate limiting for emergency requests
6. Add proper RBAC (Role-Based Access Control)
7. Audit trail for all blood bank transactions
8. Comply with healthcare data regulations (HIPAA, GDPR)

## 📱 Mobile Performance

The app is optimized for mobile with:
- Touch-friendly UI elements (min 44px tap targets)
- Responsive breakpoints (mobile, tablet, desktop)
- Horizontal scrolling for tables
- Collapsible mobile navigation
- Optimized animations (reduced motion support)
- Lazy loading for charts

---

**Built with ❤️ to save lives through efficient blood donation management**

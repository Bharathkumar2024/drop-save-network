# 🩸 Blood Stock Management System - Complete Guide

## 📋 Overview

This guide covers the comprehensive blood stock management system with advanced features including:
- ✅ **Number of units available** tracking
- ✅ **Date of collection** recording
- ✅ **Expiration date** for each unit
- ✅ **Color-coded expiry warnings** (Yellow for expiring soon, Red for expired)
- ✅ **Real-time updates** using Supabase subscriptions
- ✅ **Automatic expiry detection** and alerts
- ✅ **Transaction history** tracking
- ✅ **Stock alerts** system

---

## 🎯 Key Features

### 1. **Comprehensive Blood Unit Tracking**

Each blood unit includes:
- **Blood Type**: A+, A-, B+, B-, AB+, AB-, O+, O-
- **Component Type**: Whole Blood, Red Blood Cells, Platelets, Plasma, Cryoprecipitate
- **Units Available**: Current quantity in stock
- **Collection Date**: When the blood was collected
- **Expiry Date**: When the blood expires (typically 42 days from collection)
- **Batch ID**: Unique identifier for tracking
- **Storage Location**: Physical location (e.g., "Refrigerator FR-12")
- **Storage Temperature**: Temperature in Celsius (typically 4°C)
- **Storage Conditions**: Additional notes
- **Status**: available, reserved, dispatched, expired, discarded
- **Quality Check**: Pass/fail status with notes

### 2. **Expiry Management with Color Coding**

#### 🟢 **Green (Safe)**
- More than 7 days until expiry
- Status: Available for use
- Action: None required

#### 🟡 **Yellow (Expiring Soon)**
- 1-7 days until expiry
- Status: Use urgently
- Action: Prioritize for dispatch
- Visual: Yellow border and background highlight

#### 🔴 **Red (Expired)**
- Past expiry date
- Status: Must be removed
- Action: Discard immediately
- Visual: Red border, background, and warning message

### 3. **Real-Time Updates**

The system uses Supabase real-time subscriptions to automatically update:
- **Blood units** when added, updated, or removed
- **Alerts** when new warnings are generated
- **Transactions** when stock changes occur

**Benefits:**
- Multiple users see changes instantly
- No need to refresh the page
- Automatic notifications for critical events

### 4. **Automated Alert System**

The system automatically generates alerts for:
- **Expiring Soon**: Units expiring within 7 days
- **Expired**: Units past their expiry date
- **Low Stock**: When blood type quantity is low
- **Critical Stock**: When blood type is critically low
- **Quality Issues**: When quality checks fail

**Alert Severity Levels:**
- 🔴 **Critical**: Immediate action required
- 🟠 **High**: Action needed soon
- 🟡 **Medium**: Monitor closely
- 🔵 **Low**: Informational

### 5. **Stock Statistics Dashboard**

Real-time statistics showing:
- **Total Stock**: All units across all blood types
- **Available Units**: Ready for dispatch
- **Expiring Soon**: Units needing urgent use
- **Expired Units**: Units requiring removal

### 6. **Transaction History**

Every stock change is logged:
- **Collection**: New blood added to inventory
- **Dispatch**: Blood sent to hospital
- **Reserve**: Blood held for specific request
- **Unreserve**: Reserved blood released
- **Expire**: Blood marked as expired
- **Discard**: Blood removed from inventory
- **Return**: Blood returned from hospital

---

## 🗄️ Database Schema

### **blood_units** Table

```sql
CREATE TABLE blood_units (
  id UUID PRIMARY KEY,
  blood_bank_id UUID REFERENCES blood_banks(id),
  blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  component_type VARCHAR(50) DEFAULT 'Whole Blood',
  units_available INTEGER NOT NULL,
  initial_units INTEGER NOT NULL,
  collection_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  batch_id VARCHAR(100) NOT NULL,
  donor_id UUID REFERENCES donors(id),
  storage_location VARCHAR(100) NOT NULL,
  storage_temperature NUMERIC(4,2) DEFAULT 4.0,
  storage_conditions TEXT,
  status VARCHAR(20) DEFAULT 'available',
  quality_check_passed BOOLEAN DEFAULT true,
  quality_check_date DATE,
  quality_check_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **blood_stock_transactions** Table

```sql
CREATE TABLE blood_stock_transactions (
  id UUID PRIMARY KEY,
  blood_unit_id UUID REFERENCES blood_units(id),
  blood_bank_id UUID REFERENCES blood_banks(id),
  transaction_type VARCHAR(20) CHECK (transaction_type IN 
    ('collection', 'dispatch', 'reserve', 'unreserve', 'expire', 'discard', 'return')),
  units_affected INTEGER NOT NULL,
  hospital_id UUID,
  patient_id UUID,
  transaction_date TIMESTAMP DEFAULT NOW(),
  performed_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **blood_stock_alerts** Table

```sql
CREATE TABLE blood_stock_alerts (
  id UUID PRIMARY KEY,
  blood_bank_id UUID REFERENCES blood_banks(id),
  blood_unit_id UUID REFERENCES blood_units(id),
  alert_type VARCHAR(30) CHECK (alert_type IN 
    ('expiring_soon', 'expired', 'low_stock', 'critical_stock', 'quality_issue')),
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  blood_type VARCHAR(5),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(255),
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Setup Instructions

### **Step 1: Run Database Schema**

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-blood-stock-schema.sql`
4. Click **Run** to execute the schema

### **Step 2: Enable Real-time**

1. Go to **Database** → **Replication**
2. Enable real-time for these tables:
   - ✅ `blood_units`
   - ✅ `blood_stock_transactions`
   - ✅ `blood_stock_alerts`

### **Step 3: Set Up Scheduled Jobs (Optional)**

For automatic expiry detection, set up a daily cron job:

**Option A: Supabase Edge Function**
```typescript
// Create an Edge Function that runs daily
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Auto-expire units
  await supabase.rpc('auto_expire_blood_units')
  
  // Check for expiring units and create alerts
  await supabase.rpc('check_expiring_units')

  return new Response('OK', { status: 200 })
})
```

**Option B: External Cron Job**
Set up a cron job to call these SQL functions daily:
```sql
SELECT auto_expire_blood_units();
SELECT check_expiring_units();
```

### **Step 4: Update Frontend Routes**

Replace the old BloodStock component with the new enhanced version:

**In your router file (e.g., `App.tsx`):**
```typescript
import BloodStockEnhanced from '@/pages/bloodbank/BloodStockEnhanced';

// Replace the old route
<Route path="/bloodbank/stock" element={<BloodStockEnhanced />} />
```

---

## 💻 Usage Guide

### **Adding a New Blood Unit**

1. Click **"Add Blood Unit"** button
2. Fill in the form:
   - Select **Blood Type** (e.g., O+)
   - Select **Component Type** (e.g., Whole Blood)
   - Enter **Number of Units**
   - Enter **Batch ID** (e.g., BATCH-O-POS-012025)
   - Select **Collection Date**
   - Select **Expiry Date** (typically 42 days from collection)
   - Enter **Storage Location** (e.g., Refrigerator FR-12)
   - Enter **Storage Temperature** (typically 4.0°C)
   - Add **Storage Conditions** (optional notes)
3. Click **"Add Blood Unit"**

### **Editing a Blood Unit**

1. Find the blood unit card
2. Click **"Edit"** button
3. Update the fields as needed
4. Click **"Update Blood Unit"**

### **Deleting a Blood Unit**

1. Find the blood unit card
2. Click the **trash icon** button
3. Confirm deletion

### **Filtering Blood Units**

Use the filter dropdowns to view:
- **By Status**: All, Available, Reserved, Dispatched, Expired
- **By Blood Type**: All, A+, A-, B+, B-, AB+, AB-, O+, O-

### **Managing Alerts**

1. View active alerts at the top of the page
2. Click **"Resolve"** to mark an alert as handled
3. Alerts automatically appear for:
   - Units expiring within 7 days
   - Expired units
   - Low stock situations

---

## 🎨 Visual Indicators

### **Blood Unit Cards**

Each card displays:
- **Blood Type Badge**: Red badge with blood type
- **Status Badge**: Color-coded status indicator
- **Ring Chart**: Visual representation of units available
- **Collection Date**: When blood was collected
- **Expiry Date**: Color-coded based on days remaining
- **Storage Info**: Location and temperature
- **Action Buttons**: Edit and Delete

### **Color Coding System**

| Status | Border | Background | Text | Meaning |
|--------|--------|------------|------|---------|
| Safe | Default | Default | Green | >7 days until expiry |
| Expiring Soon | Yellow | Yellow/5% | Yellow | 1-7 days until expiry |
| Expired | Red | Red/5% | Red | Past expiry date |

---

## 📊 API Functions

### **Blood Unit Management**

```typescript
// Get all blood units for a blood bank
const { data, error } = await getBloodUnits(bloodBankId);

// Get blood units by status
const { data, error } = await getBloodUnitsByStatus(bloodBankId, 'available');

// Create a new blood unit
const { data, error } = await createBloodUnit({
  blood_bank_id: bloodBankId,
  blood_type: 'O+',
  units_available: 10,
  collection_date: '2025-01-15',
  expiry_date: '2025-02-26',
  batch_id: 'BATCH-O-POS-012025',
  storage_location: 'Refrigerator FR-12',
  storage_temperature: 4.0,
  status: 'available'
});

// Update blood unit
const { data, error } = await updateBloodUnit(unitId, {
  units_available: 8,
  status: 'reserved'
});

// Delete blood unit
const { error } = await deleteBloodUnit(unitId);
```

### **Alert Management**

```typescript
// Get active alerts
const { data, error } = await getBloodStockAlerts(bloodBankId, false);

// Get all alerts (including resolved)
const { data, error } = await getBloodStockAlerts(bloodBankId, true);

// Resolve an alert
const { data, error } = await resolveBloodStockAlert(
  alertId,
  'Staff Name',
  'Alert resolved - blood dispatched'
);
```

### **Transaction History**

```typescript
// Get recent transactions
const { data, error } = await getBloodStockTransactions(bloodBankId, 50);

// Create a transaction
const { data, error } = await createBloodStockTransaction({
  blood_unit_id: unitId,
  blood_bank_id: bloodBankId,
  transaction_type: 'dispatch',
  units_affected: 5,
  hospital_id: hospitalId,
  performed_by: 'Dr. Smith',
  notes: 'Emergency dispatch'
});
```

### **Real-time Subscriptions**

```typescript
// Subscribe to blood units changes
const channel = subscribeToBloodUnits(bloodBankId, (payload) => {
  console.log('Blood unit changed:', payload);
  // Reload data or update state
});

// Subscribe to alerts
const alertChannel = subscribeToBloodStockAlerts(bloodBankId, (payload) => {
  console.log('New alert:', payload);
  // Show notification
});

// Unsubscribe when component unmounts
useEffect(() => {
  return () => {
    channel.unsubscribe();
    alertChannel.unsubscribe();
  };
}, []);
```

### **Helper Functions**

```typescript
// Calculate days until expiry
const daysLeft = calculateDaysUntilExpiry('2025-02-26'); // Returns number

// Check if expiring soon
const expiringSoon = isExpiringSoon('2025-02-26'); // Returns boolean

// Check if expired
const expired = isExpired('2025-01-15'); // Returns boolean

// Get color for expiry status
const color = getExpiryStatusColor('2025-02-26'); // Returns 'green' | 'yellow' | 'red'
```

---

## 🔔 Notification System

### **Automatic Notifications**

The system automatically shows toast notifications for:
- ✅ New blood unit added
- ✅ Blood unit updated
- ✅ Blood unit deleted
- ✅ New alert created
- ✅ Alert resolved
- ⚠️ Errors during operations

### **Real-time Alert Notifications**

When a new alert is created (e.g., blood expiring soon), users see:
- 🚨 Toast notification with alert message
- 🔴 Alert appears in the alerts section
- 📊 Statistics update automatically

---

## 📈 Best Practices

### **Blood Collection**

1. **Record immediately** after collection
2. **Calculate expiry date** (typically collection date + 42 days)
3. **Generate unique batch ID** (e.g., BATCH-[TYPE]-[MMYYYY])
4. **Verify storage conditions** before saving

### **Expiry Management**

1. **Check daily** for expiring units
2. **Prioritize dispatch** of units expiring within 7 days
3. **Remove expired units** immediately
4. **Document disposal** in transaction history

### **Stock Monitoring**

1. **Review alerts** at start of each shift
2. **Maintain minimum stock** levels for each blood type
3. **Track usage patterns** via transaction history
4. **Plan collections** based on expiry dates

### **Quality Control**

1. **Perform quality checks** on all units
2. **Document any issues** in quality_check_notes
3. **Quarantine failed units** (set quality_check_passed = false)
4. **Review storage temperatures** regularly

---

## 🐛 Troubleshooting

### **Real-time Updates Not Working**

1. Check Supabase Realtime is enabled for tables
2. Verify RLS policies allow subscriptions
3. Check browser console for errors
4. Ensure blood_bank_id matches authenticated user

### **Alerts Not Generating**

1. Run manual check: `SELECT check_expiring_units();`
2. Verify cron job is running
3. Check alert table for existing unresolved alerts
4. Ensure expiry dates are set correctly

### **Performance Issues**

1. Add indexes on frequently queried columns
2. Limit transaction history queries (use pagination)
3. Archive old expired units
4. Optimize real-time subscriptions (use filters)

---

## 🎯 Future Enhancements

### **Planned Features**

- [ ] **Barcode scanning** for batch IDs
- [ ] **QR code generation** for blood units
- [ ] **Mobile app** for stock management
- [ ] **Predictive analytics** for stock planning
- [ ] **Integration with hospital systems**
- [ ] **Automated dispatch recommendations**
- [ ] **Blood type compatibility checker**
- [ ] **Donor tracking** integration
- [ ] **Temperature monitoring** integration
- [ ] **Compliance reporting** tools

### **Advanced Analytics**

- [ ] **Usage trends** by blood type
- [ ] **Wastage analysis** (expired units)
- [ ] **Demand forecasting**
- [ ] **Optimal stock levels** calculation
- [ ] **Seasonal pattern** detection

---

## 📞 Support

### **Common Questions**

**Q: How long is blood valid?**
A: Whole blood is typically valid for 42 days from collection. Other components have different validity periods:
- Red Blood Cells: 42 days
- Platelets: 5-7 days
- Plasma: 1 year (frozen)
- Cryoprecipitate: 1 year (frozen)

**Q: What temperature should blood be stored at?**
A: 
- Whole Blood & RBCs: 1-6°C (typically 4°C)
- Platelets: 20-24°C (room temperature with agitation)
- Plasma & Cryo: -18°C or colder (frozen)

**Q: Can I edit an expired unit?**
A: Yes, but it's recommended to mark it as 'discarded' and document the disposal in transaction history.

**Q: How do I handle returned blood?**
A: Update the status to 'available' if still valid, or 'expired' if past expiry. Create a 'return' transaction to log the event.

---

## ✅ Checklist for Implementation

### **Database Setup**
- [ ] Run `supabase-blood-stock-schema.sql`
- [ ] Enable Realtime for all three tables
- [ ] Set up RLS policies
- [ ] Test database functions
- [ ] Set up cron job for auto-expiry

### **Frontend Integration**
- [ ] Update Supabase types in `supabase.ts`
- [ ] Replace old BloodStock component
- [ ] Update router configuration
- [ ] Test all CRUD operations
- [ ] Test real-time subscriptions
- [ ] Test alert system
- [ ] Test filtering and search

### **Testing**
- [ ] Add test blood units
- [ ] Verify expiry color coding
- [ ] Test real-time updates (multiple tabs)
- [ ] Test alert generation
- [ ] Test alert resolution
- [ ] Test transaction logging
- [ ] Test error handling

### **Documentation**
- [ ] Update user manual
- [ ] Create training materials
- [ ] Document API endpoints
- [ ] Create troubleshooting guide

---

## 🎉 Summary

You now have a **comprehensive blood stock management system** with:

✅ **Complete unit tracking** (units, collection date, expiry date)
✅ **Color-coded expiry warnings** (yellow for expiring soon, red for expired)
✅ **Real-time updates** using Supabase subscriptions
✅ **Automatic alert generation** for expiring/expired units
✅ **Transaction history** for audit trails
✅ **Advanced filtering** and search capabilities
✅ **Professional UI** with visual indicators
✅ **Mobile-responsive** design

**The system automatically:**
- 🔄 Updates all connected clients in real-time
- 🚨 Generates alerts for expiring blood
- 📊 Tracks all stock changes
- 🎨 Color-codes units based on expiry status
- 📱 Works seamlessly on all devices

**Start using it now to manage your blood bank inventory efficiently!** 🩸✨
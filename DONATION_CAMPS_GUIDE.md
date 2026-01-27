# 🏕️ Donation Camps Management - Complete Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Database Schema](#database-schema)
4. [Setup Instructions](#setup-instructions)
5. [User Guide](#user-guide)
6. [API Reference](#api-reference)
7. [Real-time Updates](#real-time-updates)
8. [Export & Reporting](#export--reporting)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The **Donation Camps Management System** is a comprehensive solution for blood banks to organize, track, and manage blood donation camps efficiently. It provides end-to-end functionality from camp creation to donor registration, blood collection tracking, and detailed reporting.

### Key Capabilities
- ✅ **Camp Management**: Create, edit, and track donation camps
- ✅ **Donor Registration**: Register donors with complete health screening
- ✅ **Blood Collection Tracking**: Track units collected, expiry dates, and batch IDs
- ✅ **Real-time Updates**: Automatic synchronization across all devices
- ✅ **Advanced Filtering**: Filter by date, blood group, and donation status
- ✅ **Export Reports**: Generate CSV reports for compliance and analytics
- ✅ **Statistics Dashboard**: Real-time camp performance metrics
- ✅ **Automatic Blood Unit Creation**: Donated blood automatically added to inventory

---

## 🚀 Features

### 1. Camp Management
- **Create Camps**: Set up new donation camps with all details
  - Camp name, theme, and description
  - Date, time, and location
  - Capacity and organizer information
  - Status tracking (upcoming, ongoing, completed, cancelled)

- **View Camps**: See all camps in a organized list
  - Color-coded status badges
  - Quick statistics (donors, units collected)
  - One-click access to donor details

- **Delete Camps**: Remove camps with confirmation

### 2. Donor Registration & Tracking
- **Complete Donor Information**:
  - Personal details (name, age, gender, blood group)
  - Contact information (phone, email)
  - Health metrics (weight, hemoglobin, BP, pulse, temperature)
  - Medical history (previous donations, conditions, medications)

- **Screening Process**:
  - Pending → Approved/Rejected workflow
  - Screening notes and staff tracking
  - Automatic eligibility checks

- **Donation Status Tracking**:
  - Registered → Screened → Donated → Deferred/Cancelled
  - One-click "Mark as Donated" button
  - Automatic blood unit creation on donation

### 3. Blood Collection Details
- **Per Donor Tracking**:
  - Units donated (1-2 units)
  - Volume collected (default 450ml per unit)
  - Collection date
  - Expiry date (auto-calculated: collection + 42 days)
  - Batch ID (auto-generated)

- **Automatic Inventory Integration**:
  - Blood units automatically added to blood_units table
  - Transaction records created
  - Real-time stock updates

### 4. Statistics & Analytics
- **Camp-Level Statistics**:
  - Total registered donors
  - Total donated vs rejected
  - Total volume collected (in liters)
  - Average donor age
  - First-time vs repeat donors
  - Blood type distribution

- **Blood Bank Overview**:
  - Total camps conducted
  - Completed vs upcoming camps
  - Total units collected across all camps
  - Performance trends

### 5. Advanced Filtering
- **Search**: Find donors by name, blood group, or phone
- **Blood Group Filter**: Show only specific blood types
- **Status Filter**: Filter by donation status
- **Date Range Filter**: View collections within date range
- **Real-time Results**: Filters update instantly

### 6. Export & Reporting
- **CSV Export**: Download complete camp reports
  - Donor details
  - Blood collection data
  - Health metrics
  - Status information
- **File Naming**: Auto-generated with camp name and date
- **Compliance Ready**: Formatted for regulatory requirements

---

## 🗄️ Database Schema

### Tables Created

#### 1. `donation_camps`
Stores information about blood donation camps.

**Key Fields**:
- `id`: UUID primary key
- `blood_bank_id`: Reference to blood bank
- `camp_name`, `camp_theme`: Camp identification
- `camp_date`, `camp_time_start`, `camp_time_end`: Scheduling
- `location_name`, `location_address`, `city`, `state`: Location details
- `capacity`, `registered_donors`, `actual_donors`: Capacity tracking
- `status`: upcoming | ongoing | completed | cancelled
- `total_units_collected`, `total_blood_volume_ml`: Collection stats

#### 2. `camp_donors`
Stores donor information and donation details.

**Key Fields**:
- `id`: UUID primary key
- `camp_id`: Reference to donation camp
- `donor_id`: Optional reference to existing donor
- `blood_bank_id`: Reference to blood bank
- `donor_name`, `donor_age`, `donor_gender`, `blood_group`: Personal info
- `weight_kg`, `hemoglobin_level`, `blood_pressure`, `pulse_rate`: Health metrics
- `screening_status`: pending | approved | rejected
- `donation_status`: registered | screened | donated | deferred | cancelled
- `units_donated`, `volume_donated_ml`: Donation amounts
- `collection_date`, `expiry_date`, `collection_batch_id`: Blood tracking
- `adverse_reaction`, `follow_up_required`: Post-donation tracking

#### 3. `camp_statistics`
Aggregated statistics for each camp (auto-updated by triggers).

**Key Fields**:
- `camp_id`: Reference to donation camp
- `total_registered`, `total_donated`, `total_rejected`: Donor counts
- `a_positive_units`, `a_negative_units`, etc.: Blood type breakdown
- `total_volume_collected_ml`, `average_volume_per_donor_ml`: Volume stats
- `male_donors`, `female_donors`, `average_donor_age`: Demographics
- `first_time_donors`, `repeat_donors`: Donor experience
- `average_hemoglobin`, `adverse_reactions_count`: Health metrics

### Database Views

#### 1. `camp_summary_report`
Combines camp and statistics data for easy reporting.

#### 2. `camp_donor_details_report`
Detailed donor information with camp context.

### Triggers & Functions

#### 1. `update_camp_statistics()`
Automatically recalculates camp statistics when donors are added/updated.

#### 2. `create_blood_unit_from_donation()`
Automatically creates blood unit entries when donation status changes to "donated".
- Generates batch ID
- Calculates expiry date
- Creates blood_units record
- Creates transaction record

---

## 🛠️ Setup Instructions

### Step 1: Database Setup

1. **Open Supabase Dashboard**
   - Navigate to your project
   - Go to SQL Editor

2. **Run Schema Script**
   ```sql
   -- Copy and paste contents from:
   -- supabase-donation-camps-schema.sql
   -- Click "Run"
   ```

3. **Verify Tables Created**
   - Check Database → Tables
   - Should see: donation_camps, camp_donors, camp_statistics

### Step 2: Enable Real-time

1. **Go to Database → Replication**
2. **Enable for these tables**:
   - ✅ donation_camps
   - ✅ camp_donors
   - ✅ camp_statistics

3. **Configure Filters** (optional):
   - Filter by blood_bank_id for security
   - Reduce bandwidth usage

### Step 3: Row Level Security (RLS)

The schema includes RLS policies that:
- Allow blood banks to see only their own camps
- Prevent unauthorized access
- Work with Supabase Auth

**Verify RLS is enabled**:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('donation_camps', 'camp_donors', 'camp_statistics');
```

### Step 4: Test with Sample Data

The schema includes sample data for testing:
- 3 donation camps (2 completed, 1 upcoming)
- 8 sample donors with complete details
- Automatic statistics generation

**View sample data**:
```sql
SELECT * FROM donation_camps;
SELECT * FROM camp_donors;
SELECT * FROM camp_statistics;
```

### Step 5: Frontend Integration

The enhanced component is already integrated:
- Route: `/bloodbank/camp-details`
- Component: `CampDetailsEnhanced.tsx`
- API functions: Available in `supabase.ts`

---

## 📖 User Guide

### Creating a New Camp

1. **Navigate to Camp Details**
   - Click "Camp Details" in sidebar
   - Or go to `/bloodbank/camp-details`

2. **Click "Add New Camp"**
   - Fill in required fields (marked with *)
   - Camp Name: e.g., "January Blood Drive"
   - Camp Date: Select date
   - Location Name: e.g., "Community Center"

3. **Optional Details**:
   - Camp Theme: Custom message
   - Time: Default 9 AM - 4 PM
   - Capacity: Default 100 donors
   - Organizer information
   - Description

4. **Click "Create Camp"**
   - Camp appears in list immediately
   - Status: "upcoming"

### Registering Donors

1. **Select a Camp**
   - Click on camp card in list
   - Camp details appear below

2. **Click "Add Donor"**
   - Fill in donor information:
     - **Required**: Name, Age, Blood Group
     - **Health Metrics**: Weight, Hemoglobin, BP, Pulse
     - **Contact**: Phone, Email (optional)
     - **History**: Has donated before?

3. **Click "Add Donor"**
   - Donor appears in list
   - Status: "registered"
   - Screening: "pending"

### Processing Donations

1. **Screen Donor**
   - Click "Edit" on donor
   - Update screening status: Approved/Rejected
   - Add screening notes
   - Click "Update Donor"

2. **Mark as Donated**
   - Click "Donated" button (green checkmark)
   - Confirms donation
   - Sets collection date to today
   - Calculates expiry date (today + 42 days)
   - **Automatically creates blood unit in inventory**
   - Status changes to "donated"

3. **Verify Blood Unit Created**
   - Go to Blood Stock page
   - New unit should appear with:
     - Batch ID: CAMP-YYYYMMDD-xxxxxxxx
     - Collection date: Today
     - Expiry date: Today + 42 days
     - Status: Available

### Filtering & Searching

1. **Search Bar**
   - Type donor name, blood group, or phone
   - Results update instantly

2. **Blood Group Filter**
   - Select specific blood type
   - Shows only matching donors

3. **Status Filter**
   - Filter by: registered, screened, donated, deferred, cancelled
   - Useful for workflow management

4. **Date Range Filter**
   - Set "From Date" and "To Date"
   - Shows collections within range
   - Great for monthly reports

### Exporting Reports

1. **Select a Camp**
   - Click on camp to view donors

2. **Apply Filters** (optional)
   - Filter data before export
   - Only filtered data will be exported

3. **Click "Export Report"**
   - CSV file downloads automatically
   - Filename: `camp_report_[CampName]_[Date].csv`
   - Opens in Excel/Google Sheets

4. **Report Contents**:
   - Donor Name, Age, Gender
   - Blood Group
   - Units Donated
   - Collection & Expiry Dates
   - Donation Status
   - Health Metrics (Hb, BP)

---

## 🔌 API Reference

### Donation Camps

#### Get All Camps
```typescript
import { getDonationCamps } from '@/lib/supabase';

const { data, error } = await getDonationCamps(bloodBankId);
// Returns: DonationCamp[]
```

#### Get Single Camp
```typescript
import { getDonationCampById } from '@/lib/supabase';

const { data, error } = await getDonationCampById(campId);
// Returns: DonationCamp
```

#### Create Camp
```typescript
import { createDonationCamp } from '@/lib/supabase';

const { data, error } = await createDonationCamp({
  blood_bank_id: 'bb1',
  camp_name: 'January Blood Drive',
  camp_date: '2025-02-15',
  location_name: 'Community Center',
  capacity: 100,
  status: 'upcoming',
});
```

#### Update Camp
```typescript
import { updateDonationCamp } from '@/lib/supabase';

const { data, error } = await updateDonationCamp(campId, {
  status: 'completed',
  actual_donors: 45,
});
```

#### Delete Camp
```typescript
import { deleteDonationCamp } from '@/lib/supabase';

const { error } = await deleteDonationCamp(campId);
```

### Camp Donors

#### Get Camp Donors
```typescript
import { getCampDonors } from '@/lib/supabase';

const { data, error } = await getCampDonors(campId);
// Returns: CampDonor[]
```

#### Create Donor
```typescript
import { createCampDonor } from '@/lib/supabase';

const { data, error } = await createCampDonor({
  camp_id: 'dc1',
  blood_bank_id: 'bb1',
  donor_name: 'John Smith',
  donor_age: 32,
  donor_gender: 'Male',
  blood_group: 'O+',
  weight_kg: 75.5,
  hemoglobin_level: 14.2,
  blood_pressure: '120/80',
  units_donated: 1,
  volume_donated_ml: 450,
});
```

#### Update Donor
```typescript
import { updateCampDonor } from '@/lib/supabase';

const { data, error } = await updateCampDonor(donorId, {
  donation_status: 'donated',
  screening_status: 'approved',
  collection_date: '2025-01-28',
  expiry_date: '2025-03-11',
});
```

#### Delete Donor
```typescript
import { deleteCampDonor } from '@/lib/supabase';

const { error } = await deleteCampDonor(donorId);
```

### Statistics

#### Get Camp Statistics
```typescript
import { getCampStatistics } from '@/lib/supabase';

const { data, error } = await getCampStatistics(campId);
// Returns: CampStatistics
```

### Filtering

#### Filter by Date Range
```typescript
import { getCampDonorsByDateRange } from '@/lib/supabase';

const { data, error } = await getCampDonorsByDateRange(
  bloodBankId,
  '2025-01-01',
  '2025-01-31'
);
```

#### Filter by Blood Group
```typescript
import { getCampDonorsByBloodGroup } from '@/lib/supabase';

const { data, error } = await getCampDonorsByBloodGroup(bloodBankId, 'O+');
```

#### Filter by Status
```typescript
import { getCampDonorsByStatus } from '@/lib/supabase';

const { data, error } = await getCampDonorsByStatus(bloodBankId, 'donated');
```

---

## ⚡ Real-time Updates

### How It Works

The system uses Supabase's real-time capabilities to automatically sync data across all connected clients.

### Subscriptions

#### 1. Donation Camps Subscription
```typescript
import { subscribeToDonationCamps } from '@/lib/supabase';

const subscription = subscribeToDonationCamps(bloodBankId, (payload) => {
  console.log('Camp change:', payload);
  // Reload camps
});

// Cleanup
subscription.unsubscribe();
```

#### 2. Camp Donors Subscription
```typescript
import { subscribeToCampDonors } from '@/lib/supabase';

const subscription = subscribeToCampDonors(campId, (payload) => {
  console.log('Donor change:', payload);
  // Reload donors
});
```

#### 3. Camp Statistics Subscription
```typescript
import { subscribeToCampStatistics } from '@/lib/supabase';

const subscription = subscribeToCampStatistics(campId, (payload) => {
  console.log('Statistics updated:', payload);
  // Reload statistics
});
```

### Real-time Scenarios

1. **Multi-User Camp Management**
   - Staff A adds a donor → Staff B sees it instantly
   - Staff A marks donor as donated → Statistics update for Staff B
   - No page refresh needed

2. **Live Camp Monitoring**
   - Dashboard shows real-time donor count
   - Statistics update as donations are processed
   - Alerts for capacity reached

3. **Automatic Blood Unit Creation**
   - Donor marked as donated
   - Blood unit created in inventory
   - Stock page updates automatically
   - Transaction logged

---

## 📊 Export & Reporting

### CSV Export Features

#### What's Included
- Donor personal information
- Blood group and units donated
- Collection and expiry dates
- Donation status
- Health metrics (Hb, BP)
- Contact information

#### Export Process
1. Select camp
2. Apply filters (optional)
3. Click "Export Report"
4. CSV downloads automatically

#### File Format
```csv
Donor Name,Age,Gender,Blood Group,Phone,Units Donated,Collection Date,Expiry Date,Status,Hemoglobin,Blood Pressure
John Smith,32,Male,O+,+1-555-1001,1,2025-01-11,2025-02-22,donated,14.2,120/80
Emma Wilson,28,Female,A+,+1-555-1002,1,2025-01-11,2025-02-22,donated,13.5,118/75
```

### Custom Reports

You can create custom reports using the database views:

#### Camp Summary Report
```sql
SELECT * FROM camp_summary_report
WHERE blood_bank_id = 'bb1'
ORDER BY camp_date DESC;
```

#### Donor Details Report
```sql
SELECT * FROM camp_donor_details_report
WHERE camp_id = 'dc1'
AND donation_status = 'donated'
ORDER BY donation_time DESC;
```

### Analytics Queries

#### Monthly Collection Trends
```sql
SELECT 
  DATE_TRUNC('month', camp_date) as month,
  COUNT(*) as camps_conducted,
  SUM(total_units_collected) as total_units,
  SUM(actual_donors) as total_donors
FROM donation_camps
WHERE blood_bank_id = 'bb1'
GROUP BY DATE_TRUNC('month', camp_date)
ORDER BY month DESC;
```

#### Blood Type Distribution
```sql
SELECT 
  blood_group,
  COUNT(*) as donor_count,
  SUM(units_donated) as total_units
FROM camp_donors
WHERE blood_bank_id = 'bb1'
AND donation_status = 'donated'
GROUP BY blood_group
ORDER BY total_units DESC;
```

---

## 💡 Best Practices

### Camp Planning

1. **Create Camps in Advance**
   - Set up camps 2-4 weeks ahead
   - Allows time for donor recruitment
   - Better resource planning

2. **Set Realistic Capacity**
   - Consider venue size
   - Staff availability
   - Equipment capacity

3. **Update Status Regularly**
   - Mark camps as "ongoing" on the day
   - Mark as "completed" after camp ends
   - Cancel if needed with notes

### Donor Management

1. **Complete Health Screening**
   - Always record vital signs
   - Document medical history
   - Note any concerns

2. **Timely Status Updates**
   - Screen donors promptly
   - Mark donations immediately
   - Update any status changes

3. **Follow-up Tracking**
   - Flag donors needing follow-up
   - Add detailed notes
   - Schedule callbacks

### Data Quality

1. **Accurate Information**
   - Verify donor details
   - Double-check blood groups
   - Confirm contact information

2. **Consistent Naming**
   - Use standard camp naming convention
   - Consistent location names
   - Clear organizer identification

3. **Regular Audits**
   - Review camp statistics
   - Verify blood unit creation
   - Check for data anomalies

### Performance Optimization

1. **Use Filters Effectively**
   - Filter before exporting
   - Reduce data load
   - Faster page performance

2. **Archive Old Camps**
   - Keep active camps visible
   - Archive completed camps after 90 days
   - Maintain historical data

3. **Monitor Real-time Connections**
   - Unsubscribe when leaving page
   - Avoid memory leaks
   - Optimize bandwidth

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Camps Not Loading

**Symptoms**: Empty camp list, loading spinner stuck

**Solutions**:
- Check blood bank ID is correct
- Verify database connection
- Check browser console for errors
- Ensure RLS policies allow access

**Debug**:
```typescript
const { data, error } = await getDonationCamps(bloodBankId);
console.log('Data:', data);
console.log('Error:', error);
```

#### 2. Donors Not Appearing

**Symptoms**: Donor added but not visible

**Solutions**:
- Verify camp is selected
- Check real-time subscription is active
- Refresh page
- Check donor was saved successfully

**Debug**:
```typescript
const { data, error } = await getCampDonors(campId);
console.log('Donors:', data);
console.log('Error:', error);
```

#### 3. Blood Unit Not Created

**Symptoms**: Donor marked as donated but no blood unit in inventory

**Solutions**:
- Check trigger is enabled
- Verify collection_date is set
- Ensure donation_status is 'donated'
- Check blood_units table permissions

**Debug**:
```sql
-- Check if trigger exists
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_create_blood_unit_from_donation';

-- Check recent blood units
SELECT * FROM blood_units 
WHERE batch_id LIKE 'CAMP-%' 
ORDER BY created_at DESC 
LIMIT 10;
```

#### 4. Statistics Not Updating

**Symptoms**: Camp statistics show zero or outdated numbers

**Solutions**:
- Check trigger is enabled
- Manually refresh statistics
- Verify camp_statistics table exists
- Check for trigger errors

**Manual Refresh**:
```sql
-- Manually trigger statistics update
UPDATE camp_donors 
SET updated_at = NOW() 
WHERE camp_id = 'your-camp-id' 
LIMIT 1;
```

#### 5. Export Not Working

**Symptoms**: Export button doesn't download file

**Solutions**:
- Check browser allows downloads
- Verify filtered data exists
- Check browser console for errors
- Try different browser

**Debug**:
```typescript
console.log('Filtered donors:', filteredDonors);
console.log('Filtered count:', filteredDonors.length);
```

### Error Messages

#### "Failed to load camps"
- **Cause**: Database connection issue or RLS policy blocking access
- **Fix**: Check Supabase connection, verify blood_bank_id

#### "Failed to create camp"
- **Cause**: Missing required fields or validation error
- **Fix**: Ensure all required fields are filled, check field formats

#### "Failed to add donor"
- **Cause**: Invalid data or constraint violation
- **Fix**: Verify age (18-65), weight (>45kg), blood group format

#### "No statistics yet for this camp"
- **Cause**: No donors have been added yet
- **Fix**: This is normal for new camps, statistics appear after first donor

### Performance Issues

#### Slow Loading
- **Cause**: Large number of camps or donors
- **Fix**: Implement pagination, archive old camps

#### Real-time Lag
- **Cause**: Network latency or too many subscriptions
- **Fix**: Optimize subscriptions, check network connection

#### Export Timeout
- **Cause**: Too much data to export
- **Fix**: Use date filters, export in smaller batches

---

## 📞 Support

### Getting Help

1. **Check Documentation**: Review this guide thoroughly
2. **Search Issues**: Look for similar problems in project issues
3. **Console Logs**: Check browser console for error messages
4. **Database Logs**: Check Supabase logs for database errors

### Reporting Bugs

When reporting issues, include:
- Steps to reproduce
- Expected vs actual behavior
- Browser console errors
- Supabase error messages
- Screenshots if applicable

---

## 🎉 Success Criteria

Your donation camps system is working correctly when:

✅ **Camps**:
- Can create, view, and delete camps
- Camps appear in list immediately
- Status badges show correctly

✅ **Donors**:
- Can add donors with complete information
- Donors appear in camp details
- Can edit and delete donors

✅ **Donations**:
- "Mark as Donated" button works
- Blood units created automatically
- Expiry dates calculated correctly

✅ **Statistics**:
- Camp statistics update automatically
- Blood type breakdown shows correctly
- Demographics calculated accurately

✅ **Real-time**:
- Changes appear instantly across devices
- No page refresh needed
- Subscriptions work correctly

✅ **Export**:
- CSV downloads successfully
- All data included
- Opens in spreadsheet software

✅ **Filtering**:
- Search finds donors
- Filters work correctly
- Results update instantly

---

## 🚀 Next Steps

1. **Set up database**: Run the schema script
2. **Enable real-time**: Configure replication
3. **Test with sample data**: Verify everything works
4. **Create your first camp**: Start using the system
5. **Train staff**: Share this guide with your team
6. **Monitor performance**: Track system usage
7. **Gather feedback**: Improve based on user experience

---

**Happy Camp Management! 🩸💪**

For questions or support, refer to the main project documentation or contact your system administrator.
# 🚀 Blood Stock Management - Quick Start Guide

## ⚡ Get Started in 5 Minutes!

### 📋 What You'll Get

✅ **Track blood units** with collection and expiry dates  
✅ **Color-coded warnings** (🟢 Safe, 🟡 Expiring Soon, 🔴 Expired)  
✅ **Real-time updates** across all devices  
✅ **Automatic alerts** for expiring blood  
✅ **Complete transaction history**  

---

## 🎯 Step 1: Set Up Database (2 minutes)

### **Option A: Using Supabase Dashboard**

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Run SQL Schema**
   - Click **SQL Editor** in sidebar
   - Click **New Query**
   - Copy contents from `supabase-blood-stock-schema.sql`
   - Click **Run** (bottom right)
   - Wait for "Success" message

3. **Enable Real-time**
   - Go to **Database** → **Replication**
   - Find these tables and enable replication:
     - ✅ `blood_units`
     - ✅ `blood_stock_transactions`
     - ✅ `blood_stock_alerts`
   - Click **Save**

### **Option B: Quick SQL Command**

Run this in Supabase SQL Editor:

```sql
-- Quick setup (copy from supabase-blood-stock-schema.sql)
-- This creates all tables, triggers, and functions
```

---

## 🎯 Step 2: Update Frontend (1 minute)

### **Replace the Blood Stock Component**

**In `src/App.tsx` or your router file:**

```typescript
// OLD:
import BloodStock from '@/pages/bloodbank/BloodStock';

// NEW:
import BloodStockEnhanced from '@/pages/bloodbank/BloodStockEnhanced';

// Update the route:
<Route path="/bloodbank/stock" element={<BloodStockEnhanced />} />
```

**Or rename the file:**

```bash
# In PowerShell
cd c:\drop-save-network\src\pages\bloodbank
mv BloodStock.tsx BloodStock.old.tsx
mv BloodStockEnhanced.tsx BloodStock.tsx
```

---

## 🎯 Step 3: Test It! (2 minutes)

### **Start the Development Server**

```bash
npm run dev
```

### **Login as Blood Bank**

1. Go to http://localhost:5173
2. Click **"Blood Bank Login"**
3. Use test credentials (or create account)

### **Navigate to Blood Stock**

1. Click **"Blood Stock"** in sidebar
2. You should see the new enhanced interface!

---

## 🧪 Quick Test Scenarios

### **Test 1: Add a Blood Unit**

1. Click **"Add Blood Unit"** button
2. Fill in the form:
   ```
   Blood Type: O+
   Component: Whole Blood
   Units: 10
   Batch ID: BATCH-O-POS-012025
   Collection Date: Today
   Expiry Date: Today + 42 days
   Storage: Refrigerator FR-12
   Temperature: 4.0
   ```
3. Click **"Add Blood Unit"**
4. ✅ Should see success toast
5. ✅ New card appears in grid

### **Test 2: Expiring Soon (Yellow Warning)**

1. Click **"Add Blood Unit"**
2. Set **Expiry Date** to 5 days from today
3. Click **"Add Blood Unit"**
4. ✅ Card should have **yellow border**
5. ✅ Shows "⚠️ Expiring Soon" warning
6. ✅ Alert appears at top of page

### **Test 3: Expired (Red Warning)**

1. Click **"Add Blood Unit"**
2. Set **Expiry Date** to yesterday
3. Click **"Add Blood Unit"**
4. ✅ Card should have **red border**
5. ✅ Shows "⚠️ EXPIRED - Remove from stock"
6. ✅ Critical alert appears

### **Test 4: Real-time Updates**

1. Open **two browser tabs** with blood stock page
2. In **Tab 1**: Add a new blood unit
3. In **Tab 2**: Watch it appear automatically! 🎉
4. ✅ No refresh needed
5. ✅ Both tabs stay in sync

### **Test 5: Edit Blood Unit**

1. Find any blood unit card
2. Click **"Edit"** button
3. Change **Units Available** to 5
4. Click **"Update Blood Unit"**
5. ✅ Card updates immediately
6. ✅ Statistics update automatically

### **Test 6: Filter Blood Units**

1. Use **Status** dropdown:
   - Select "Available"
   - ✅ Only available units show
2. Use **Blood Type** dropdown:
   - Select "O+"
   - ✅ Only O+ units show

### **Test 7: Resolve Alert**

1. Look for alerts at top of page
2. Click **"Resolve"** on any alert
3. ✅ Alert disappears
4. ✅ Success toast appears

---

## 📊 Visual Guide

### **What You'll See**

```
┌─────────────────────────────────────────────────────────────┐
│  Blood Stock Management                    [Add Blood Unit] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 Statistics Cards                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Total    │ │Available │ │Expiring  │ │ Expired  │      │
│  │   150    │ │   120    │ │    20    │ │    10    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│  🚨 Active Alerts (3)                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ⚠️ Blood unit BATCH-O-POS expires in 3 days [Resolve]│  │
│  │ ⚠️ Blood unit BATCH-A-POS expires in 5 days [Resolve]│  │
│  │ 🔴 Blood unit BATCH-B-NEG has EXPIRED    [Resolve]   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Filters: [Status: All ▼] [Blood Type: All ▼]              │
│                                                              │
│  Blood Units Grid                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │   O+    │ │   A+    │ │   B+    │ │  AB+    │          │
│  │ [Ring]  │ │ [Ring]  │ │ [Ring]  │ │ [Ring]  │          │
│  │   45    │ │   32    │ │   28    │ │   15    │          │
│  │  units  │ │  units  │ │  units  │ │  units  │          │
│  │         │ │         │ │         │ │         │          │
│  │ Batch:  │ │ Batch:  │ │ Batch:  │ │ Batch:  │          │
│  │ BATCH-O │ │ BATCH-A │ │ BATCH-B │ │ BATCH-AB│          │
│  │         │ │         │ │         │ │         │          │
│  │ 📅 Coll:│ │ 📅 Coll:│ │ 📅 Coll:│ │ 📅 Coll:│          │
│  │ 1/15/25 │ │ 1/18/25 │ │ 1/20/25 │ │ 1/22/25 │          │
│  │         │ │         │ │         │ │         │          │
│  │ 🟢 Exp: │ │ 🟡 Exp: │ │ 🔴 Exp: │ │ 🟢 Exp: │          │
│  │ 2/26/25 │ │ 1/28/25 │ │ 1/15/25 │ │ 3/05/25 │          │
│  │ 42 days │ │ 3 days  │ │ EXPIRED │ │ 50 days │          │
│  │         │ │         │ │         │ │         │          │
│  │[Edit][🗑]│ │[Edit][🗑]│ │[Edit][🗑]│ │[Edit][🗑]│          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Coding Reference

| Days Until Expiry | Border | Background | Status | Action |
|-------------------|--------|------------|--------|--------|
| **> 7 days** | Default | Default | 🟢 Safe | Normal use |
| **1-7 days** | 🟡 Yellow | Yellow/5% | 🟡 Expiring Soon | Use urgently |
| **< 0 days** | 🔴 Red | Red/5% | 🔴 Expired | Remove immediately |

---

## 🔧 Troubleshooting

### **Problem: Real-time not working**

**Solution:**
1. Check Supabase Realtime is enabled
2. Go to Database → Replication
3. Enable for `blood_units`, `blood_stock_transactions`, `blood_stock_alerts`

### **Problem: Can't add blood units**

**Solution:**
1. Check you're logged in as blood bank
2. Verify RLS policies are set up
3. Check browser console for errors

### **Problem: Alerts not showing**

**Solution:**
1. Add a blood unit with expiry date < 7 days
2. Run SQL: `SELECT check_expiring_units();`
3. Refresh page

### **Problem: Component not found**

**Solution:**
```bash
# Check file exists
ls c:\drop-save-network\src\pages\bloodbank\BloodStockEnhanced.tsx

# If not, it might be named differently
ls c:\drop-save-network\src\pages\bloodbank\BloodStock*.tsx
```

---

## 📱 Mobile Testing

The interface is fully responsive! Test on:
- 📱 **Mobile**: 320px - 767px
- 📱 **Tablet**: 768px - 1023px
- 💻 **Desktop**: 1024px+

**Quick mobile test:**
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Test all features

---

## 🎯 Next Steps

### **Customize for Your Needs**

1. **Adjust expiry thresholds**
   ```typescript
   // In BloodStockEnhanced.tsx
   const isExpiringSoon = (expiryDate: string): boolean => {
     const daysLeft = calculateDaysUntilExpiry(expiryDate);
     return daysLeft > 0 && daysLeft <= 7; // Change 7 to your preference
   };
   ```

2. **Add more blood types**
   ```typescript
   // Add rare blood types
   const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Bombay'];
   ```

3. **Customize alert messages**
   ```sql
   -- In supabase-blood-stock-schema.sql
   -- Modify the check_expiring_units() function
   ```

### **Set Up Automated Expiry Checks**

**Option 1: Supabase Edge Function (Recommended)**

Create a daily cron job:
```typescript
// functions/check-expiry/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  await supabase.rpc('auto_expire_blood_units')
  await supabase.rpc('check_expiring_units')

  return new Response('OK', { status: 200 })
})
```

**Option 2: External Cron Service**

Use a service like cron-job.org to call:
```bash
curl -X POST https://your-project.supabase.co/rest/v1/rpc/auto_expire_blood_units
curl -X POST https://your-project.supabase.co/rest/v1/rpc/check_expiring_units
```

---

## ✅ Success Checklist

After setup, you should have:

- [x] ✅ Database tables created
- [x] ✅ Real-time enabled
- [x] ✅ Frontend component working
- [x] ✅ Can add blood units
- [x] ✅ Can edit blood units
- [x] ✅ Can delete blood units
- [x] ✅ Color coding works (green/yellow/red)
- [x] ✅ Alerts appear for expiring blood
- [x] ✅ Real-time updates work
- [x] ✅ Filters work
- [x] ✅ Statistics update automatically
- [x] ✅ Mobile responsive

---

## 🎉 You're All Set!

Your blood stock management system is now ready with:

✅ **Complete tracking** of units, collection dates, and expiry dates  
✅ **Visual warnings** with color-coded expiry status  
✅ **Real-time updates** across all devices  
✅ **Automatic alerts** for expiring blood  
✅ **Professional UI** with modern design  

**Start managing your blood inventory efficiently!** 🩸✨

---

## 📚 Additional Resources

- **Full Documentation**: `BLOOD_STOCK_MANAGEMENT_GUIDE.md`
- **Database Schema**: `supabase-blood-stock-schema.sql`
- **Component Code**: `src/pages/bloodbank/BloodStockEnhanced.tsx`
- **API Functions**: `src/lib/supabase.ts`

---

## 💬 Need Help?

**Common Issues:**
- Real-time not working → Enable Realtime in Supabase
- Can't add units → Check RLS policies
- Alerts not showing → Run `check_expiring_units()` function

**For more help, check the full documentation!** 📖
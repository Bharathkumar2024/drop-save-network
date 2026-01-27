# 🏥 Hospital Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes!

### Step 1: Setup Database (2 minutes)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Open your project
   - Navigate to SQL Editor

2. **Run Schema Scripts**
   ```sql
   -- First, run the main schema (if not already done)
   -- Copy and paste contents of: supabase-schema.sql
   
   -- Then, run the hospital extension
   -- Copy and paste contents of: supabase-hospital-schema.sql
   ```

3. **Enable Realtime**
   - Go to Database → Replication
   - Enable these tables:
     - ✅ `notifications`
     - ✅ `blood_requests`
     - ✅ `emergency_alerts`
     - ✅ `blood_transactions`

### Step 2: Configure Environment (30 seconds)

Update your `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_USE_SUPABASE=true
```

### Step 3: Start Development Server (30 seconds)

```bash
npm run dev
```

### Step 4: Test Hospital Dashboard (2 minutes)

#### Register a Hospital:
1. Navigate to: `http://localhost:5173/hospital/auth-supabase`
2. Click **"Register Hospital"** tab
3. Fill in the form:
   - **Hospital Name**: City General Hospital
   - **Email**: hospital@test.com
   - **Phone**: +1-555-0100
   - **License Number**: LIC-2024-001
   - **Address**: 123 Healthcare Ave
   - **City**: Metro City
   - **State**: California
   - **Hospital Type**: General Hospital
   - **Bed Capacity**: 500
   - **Bio**: Leading healthcare provider
   - **Password**: test123
   - **Confirm Password**: test123
4. Click **"Register Hospital"**
5. You'll be redirected to the dashboard!

#### Explore the Dashboard:
- ✅ See the **welcome message** with your hospital name
- ✅ Watch the **advertisement carousel** auto-rotate
- ✅ View **real-time statistics**
- ✅ Check the **sidebar navigation**

---

## 🧪 Test All Features

### 1. Test Emergency Alert (1 minute)

1. Click **"Emergency"** in sidebar
2. Select blood group: **O+**
3. Enter units: **5**
4. Click **"Send Emergency Alert"**
5. ✅ You should see a success toast notification
6. ✅ Alert is sent to all blood banks and matching donors

### 2. Test Blood Request (2 minutes)

1. Click **"Patient Needed Blood"** in sidebar
2. Fill patient details:
   - **Name**: John Doe
   - **Age**: 35
   - **Blood Group**: A+
   - **Gender**: Male
   - **Units**: 2
   - **Blood Bank**: Select any from dropdown
   - **Notes**: Urgent surgery
3. Click **"Submit Blood Request"**
4. ✅ Request created successfully
5. ✅ Blood bank receives notification
6. ✅ Request appears in dashboard

### 3. Test Patient Records (30 seconds)

1. Click **"Patient Records"** in sidebar
2. ✅ View all blood transactions
3. ✅ See patient names, blood groups, units, and dates
4. ✅ Real-time updates when new transactions occur

### 4. Test Hospital Profile (30 seconds)

1. Click **"Hospital Profile"** in sidebar
2. ✅ View all hospital details
3. ✅ See connected blood banks
4. ✅ View newly registered blood banks

### 5. Test Notifications (1 minute)

1. Click the **bell icon** in header
2. ✅ See notification dropdown
3. ✅ View unread count badge
4. ✅ Click notification to mark as read
5. ✅ Notifications update in real-time

---

## 🎯 Quick Feature Checklist

| Feature | URL | Test Action |
|---------|-----|-------------|
| Registration | `/hospital/auth-supabase` | Register new hospital |
| Login | `/hospital/auth-supabase` | Login with credentials |
| Dashboard | `/hospital/dashboard-supabase` | View stats & carousel |
| Emergency | Dashboard → Emergency | Send alert |
| Blood Request | Dashboard → Patient Needed Blood | Submit request |
| Patient Records | Dashboard → Patient Records | View transactions |
| Profile | Dashboard → Hospital Profile | View details |
| Notifications | Bell icon | View & mark read |

---

## 🔥 Real-Time Features to Test

### Test Real-Time Notifications:

1. **Open two browser windows:**
   - Window 1: Hospital Dashboard
   - Window 2: Blood Bank Dashboard (if available)

2. **In Hospital Dashboard:**
   - Send an emergency alert
   - Submit a blood request

3. **In Blood Bank Dashboard:**
   - ✅ Notification appears instantly
   - ✅ Toast notification shows
   - ✅ Bell icon updates with count

### Test Real-Time Updates:

1. **Open Supabase Dashboard → Table Editor**
2. **Manually update a blood request status:**
   - Change `request_status` from "requesting" to "approved"
3. **In Hospital Dashboard:**
   - ✅ Request status updates automatically
   - ✅ Notification appears
   - ✅ No page refresh needed!

---

## 📊 Expected Results

### After Registration:
- ✅ Hospital profile created in database
- ✅ Redirected to dashboard
- ✅ Welcome message shows hospital name
- ✅ Stats show 0 for all metrics (new hospital)

### After Emergency Alert:
- ✅ Success toast appears
- ✅ Alert saved in `emergency_alerts` table
- ✅ Notifications created for all blood banks
- ✅ Notifications created for matching donors

### After Blood Request:
- ✅ Patient record created
- ✅ Blood request created with status "requesting"
- ✅ Notification sent to selected blood bank
- ✅ Request appears in dashboard
- ✅ Stats update automatically

### After Blood Received:
- ✅ Transaction record created
- ✅ Appears in "Patient Records"
- ✅ Hospital-blood bank connection auto-created
- ✅ Stats update (units received increases)

---

## 🐛 Troubleshooting

### Issue: "Failed to load dashboard data"
**Solution:**
- Check Supabase credentials in `.env`
- Verify database schema is created
- Check browser console for errors

### Issue: "Notifications not appearing"
**Solution:**
- Enable Realtime in Supabase Dashboard
- Check RLS policies are correct
- Verify notification table has data

### Issue: "Blood banks not showing in dropdown"
**Solution:**
- Create blood bank records in Supabase
- Or use the blood bank registration page
- Check `blood_banks` table has active records

### Issue: "Carousel not rotating"
**Solution:**
- Check browser console for errors
- Verify React is rendering correctly
- Try refreshing the page

---

## 🎨 UI Features to Notice

### Advertisement Carousel:
- ✅ Auto-rotates every 2 seconds
- ✅ Smooth fade transitions
- ✅ Interactive dots for manual navigation
- ✅ Shows real data from database

### Notification System:
- ✅ Bell icon with unread badge
- ✅ Dropdown panel with scrolling
- ✅ Priority-based colors
- ✅ Click to mark as read
- ✅ Real-time updates

### Stats Cards:
- ✅ Large, readable numbers
- ✅ Color-coded icons
- ✅ Real-time updates
- ✅ Hover effects

### Sidebar Navigation:
- ✅ Active state highlighting
- ✅ Icon + text labels
- ✅ Smooth transitions
- ✅ Responsive design

---

## 📱 Mobile Testing

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone, Android)
4. Test all features:
   - ✅ Responsive layout
   - ✅ Touch-friendly buttons
   - ✅ Readable text
   - ✅ Scrollable content

---

## 🎉 Success Criteria

You've successfully set up the Hospital Dashboard if:

- ✅ Can register and login as hospital
- ✅ Dashboard loads with welcome message
- ✅ Carousel auto-rotates with real data
- ✅ Can send emergency alerts
- ✅ Can submit blood requests
- ✅ Can view patient records
- ✅ Notifications work in real-time
- ✅ All stats display correctly
- ✅ Profile shows hospital details

---

## 🚀 Next Steps

### For Development:
1. Create blood bank accounts to test full workflow
2. Create donor accounts to test emergency alerts
3. Test complete blood request → approval → fulfillment flow
4. Test with multiple hospitals simultaneously

### For Production:
1. Update Supabase credentials with production values
2. Enable email verification for hospitals
3. Set up monitoring and error tracking
4. Deploy to production environment
5. Test with real users

---

## 💡 Pro Tips

1. **Use Browser DevTools**: Monitor network requests and console logs
2. **Check Supabase Logs**: View real-time database activity
3. **Test Edge Cases**: Try invalid inputs, empty forms, etc.
4. **Test Concurrency**: Open multiple tabs to test real-time sync
5. **Monitor Performance**: Check page load times and responsiveness

---

## 📞 Need Help?

### Common Questions:

**Q: How do I create a blood bank to test with?**
A: Use the blood bank registration page or insert directly in Supabase

**Q: Can I test without creating blood banks?**
A: Yes, but blood request dropdown will be empty

**Q: How do I reset the database?**
A: Delete all records from tables or re-run schema scripts

**Q: Where are notifications stored?**
A: In the `notifications` table in Supabase

**Q: How do I see real-time updates?**
A: Open two browser windows and perform actions in one

---

## 🎊 Congratulations!

You now have a fully functional Hospital Dashboard with:
- ✅ Real-time blood request management
- ✅ Emergency alert system
- ✅ Patient record tracking
- ✅ Live notifications
- ✅ Blood bank connections
- ✅ Comprehensive dashboard

**Ready to save lives! 🩸❤️**

---

## 📚 Additional Resources

- **Full Documentation**: `HOSPITAL_DASHBOARD_GUIDE.md`
- **Database Schema**: `supabase-hospital-schema.sql`
- **API Reference**: Check `src/lib/supabase.ts`
- **Supabase Docs**: https://supabase.com/docs

---

**Happy Testing! 🚀**
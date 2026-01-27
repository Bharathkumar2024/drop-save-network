# 🚀 Setup Supabase for Hospital Dashboard - Quick Guide

## ⚠️ Important: The New Hospital Dashboard Requires Supabase

The complete Hospital Dashboard with all features you requested is at:
```
http://localhost:5173/hospital/auth-supabase
```

But it **requires Supabase setup** to work. Follow these steps:

---

## 📋 Step-by-Step Setup (15 minutes)

### **Step 1: Create Supabase Account**

1. Open your browser and go to: **https://supabase.com**
2. Click **"Start your project"** (green button)
3. Sign up with:
   - GitHub account (recommended), OR
   - Email and password
4. Verify your email if needed

---

### **Step 2: Create New Project**

1. After login, click **"New Project"** (green button)
2. Fill in the form:
   - **Name:** `Blood Donation Platform`
   - **Database Password:** Create a strong password (save it somewhere!)
   - **Region:** Choose the closest region to you
   - **Pricing Plan:** Free (default)
3. Click **"Create new project"**
4. ⏳ **Wait 2-3 minutes** for the project to be created

---

### **Step 3: Get Your API Credentials**

1. Once the project is ready, you'll see the dashboard
2. Click **"Settings"** (gear icon) in the left sidebar
3. Click **"API"** in the settings menu
4. You'll see two important values:

   **Copy these:**
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

### **Step 4: Update Your .env File**

1. Open the file: `c:\drop-save-network\.env`
2. Find these lines:
   ```env
   VITE_SUPABASE_URL=https://placeholder.supabase.co
   VITE_SUPABASE_ANON_KEY=placeholder_key_for_development
   VITE_USE_SUPABASE=false
   ```

3. Replace with your actual values:
   ```env
   VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   VITE_USE_SUPABASE=true
   ```

4. **Save the file** (Ctrl+S)

---

### **Step 5: Run Database Schema**

1. In Supabase Dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button
3. Open the file: `c:\drop-save-network\supabase-hospital-schema.sql`
4. **Copy ALL the content** (Ctrl+A, then Ctrl+C)
5. **Paste** into the Supabase SQL Editor (Ctrl+V)
6. Click **"Run"** button (or press Ctrl+Enter)
7. Wait for **"Success. No rows returned"** message
8. ✅ Database tables are now created!

---

### **Step 6: Enable Real-Time Features**

1. In Supabase Dashboard, go to **"Database"** → **"Replication"**
2. Scroll down to find these tables and **enable** them:
   - ✅ `notifications`
   - ✅ `blood_requests`
   - ✅ `emergency_alerts`
   - ✅ `blood_transactions`
   - ✅ `hospitals`
   - ✅ `patients`
3. Click **"Save"** or toggle each one ON

---

### **Step 7: Restart Your Dev Server**

1. Go to your terminal/PowerShell
2. Press **Ctrl+C** to stop the current server
3. Run again:
   ```powershell
   npm run dev
   ```
4. Wait for: `Local: http://localhost:5173/`

---

### **Step 8: Test Your Hospital Dashboard!**

1. Open your browser
2. Go to: **http://localhost:5173/hospital/auth-supabase**
3. Click **"Sign Up"** tab
4. Fill in the registration form:
   - **Hospital Name:** "City General Hospital"
   - **License Number:** "LIC123456"
   - **Email:** "hospital@test.com"
   - **Password:** "Test123!"
   - **Phone:** "1234567890"
   - **Address:** "123 Main Street"
   - **City:** "New York"
   - **State:** "NY"
   - **Hospital Type:** "General"
   - **Bed Capacity:** "200"
   - **Bio:** "Leading healthcare provider in the city"
5. Click **"Sign Up"**
6. 🎉 **You'll be redirected to the complete Hospital Dashboard!**

---

## ✅ What You'll See After Setup

### **Dashboard Features:**
- ✅ **Welcome message** with hospital name and bio
- ✅ **Auto-rotating carousel** (3 slides, 2-second intervals)
  - Slide 1: Connected blood banks count (circular ring)
  - Slide 2: Hospital name and bio
  - Slide 3: Active blood requests count
- ✅ **Vertical sidebar** with navigation
- ✅ **Real-time statistics** cards
- ✅ **Notification bell** with unread count

### **Emergency Feature:**
- ✅ Form with blood group and units
- ✅ Emergency button
- ✅ **Sends notifications to ALL blood banks**
- ✅ **Sends notifications to ALL matching donors**
- ✅ Real-time toast notifications

### **Patient Needed Blood:**
- ✅ Patient details form (name, age, blood group, gender)
- ✅ Blood bank dropdown (auto-suggest nearby)
- ✅ Units needed input
- ✅ **Automatic notification to selected blood bank**
- ✅ Request status tracking

### **Patient Records:**
- ✅ Real-time transaction table
- ✅ Patient name, blood group, units, bank name, date
- ✅ Auto-updates without page refresh

### **Hospital Profile:**
- ✅ Complete hospital details
- ✅ Connected blood banks list
- ✅ Newly registered blood banks
- ✅ Real-time updates

---

## 🎯 Quick Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied Project URL and anon key
- [ ] Updated `.env` file with real credentials
- [ ] Set `VITE_USE_SUPABASE=true`
- [ ] Ran `supabase-hospital-schema.sql` in SQL Editor
- [ ] Enabled Realtime for required tables
- [ ] Restarted dev server
- [ ] Opened `http://localhost:5173/hospital/auth-supabase`
- [ ] Registered new hospital account
- [ ] Logged in and saw the dashboard

---

## 🆘 Troubleshooting

### **Issue: "Invalid API key" error**
- ✅ Make sure you copied the **anon public** key, not the service_role key
- ✅ Check for extra spaces in the `.env` file

### **Issue: "Failed to fetch" error**
- ✅ Make sure the Project URL is correct
- ✅ Check your internet connection
- ✅ Verify the Supabase project is active

### **Issue: Tables not found**
- ✅ Make sure you ran the SQL schema in Supabase SQL Editor
- ✅ Check for any errors in the SQL execution

### **Issue: Real-time not working**
- ✅ Enable Realtime for all required tables in Database → Replication
- ✅ Restart your dev server after enabling

---

## 📞 Need Help?

If you get stuck at any step, let me know which step and what error you're seeing!

---

**Let's get your Hospital Dashboard running! 🚀🏥**
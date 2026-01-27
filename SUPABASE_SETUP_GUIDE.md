# 🩸 Supabase Integration Guide for Blood Donation App

This guide will help you integrate Supabase as the backend for your blood donation application with real-time features.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema Setup](#database-schema-setup)
4. [Environment Configuration](#environment-configuration)
5. [Enable Supabase in Your App](#enable-supabase-in-your-app)
6. [Testing the Integration](#testing-the-integration)
7. [Features Included](#features-included)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

- Node.js installed (v16 or higher)
- A Supabase account (free tier works fine)
- Basic understanding of React and TypeScript

---

## 🚀 Supabase Project Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Fill in the project details:
   - **Name**: `blood-donation-app` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

### Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGc...`)

---

## 🗄️ Database Schema Setup

### Step 1: Open SQL Editor

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"**

### Step 2: Run the Schema Script

1. Open the file `supabase-schema.sql` in your project root
2. Copy the entire contents
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** or press `Ctrl+Enter`
5. Wait for the script to complete (should take 5-10 seconds)

### Step 3: Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ `donors`
   - ✅ `blood_banks`
   - ✅ `blood_camps`
   - ✅ `donation_applications`
   - ✅ `messages`

---

## ⚙️ Environment Configuration

### Step 1: Update .env File

1. Open the `.env` file in your project root
2. Replace the placeholder values with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Use Supabase - Set to 'true' to use Supabase
VITE_USE_SUPABASE=true
```

3. Save the file

### Step 2: Restart Development Server

```bash
npm run dev
```

---

## 🔌 Enable Supabase in Your App

### Option 1: Use Supabase Auth Context (Recommended)

Update `src/main.tsx` to use the Supabase Auth Provider:

```tsx
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';

// Wrap your app with SupabaseAuthProvider
<SupabaseAuthProvider>
  <App />
</SupabaseAuthProvider>
```

### Option 2: Hybrid Approach

You can keep both auth systems and switch based on environment variable:

```tsx
const useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true';

{useSupabase ? (
  <SupabaseAuthProvider>
    <App />
  </SupabaseAuthProvider>
) : (
  <AuthProvider>
    <App />
  </AuthProvider>
)}
```

---

## 🧪 Testing the Integration

### Test 1: User Signup

1. Go to your app's signup page
2. Create a new donor account:
   - **Email**: test@example.com
   - **Password**: Test123456!
   - **Name**: Test Donor
   - **Blood Group**: O+
3. Check Supabase:
   - Go to **Authentication** → **Users** (should see new user)
   - Go to **Table Editor** → **donors** (should see new donor record)

### Test 2: User Login

1. Log in with the credentials you just created
2. You should see:
   - ✅ "Login Successful! 🎉" toast message
   - ✅ Redirect to Donor Dashboard
   - ✅ `last_login` field updated in `donors` table

### Test 3: Submit Blood Donation Application

1. Navigate to **Apply for Blood Camp**
2. Fill out the form with all required fields:
   - Age: 25
   - Weight: 65
   - Gender: Male
   - Address: 123 Main St
   - City: Metro City
   - State: NY
   - Postal Code: 10001
3. Select a blood camp
4. Click **Submit Application**
5. Check Supabase:
   - Go to **Table Editor** → **donation_applications**
   - You should see your new application with status `pending`

### Test 4: Real-Time Updates (Blood Bank Dashboard)

1. Open two browser windows:
   - Window 1: Donor Dashboard
   - Window 2: Blood Bank Dashboard (you'll need to create a blood bank account)
2. In Blood Bank Dashboard:
   - View pending applications
   - Accept an application
3. In Donor Dashboard:
   - You should instantly see a new message notification
   - Check **Messages** to see the acceptance message

---

## ✨ Features Included

### 🔐 Authentication
- ✅ Secure signup with email/password
- ✅ Login with session management
- ✅ Auto-redirect after successful login
- ✅ Last login timestamp tracking
- ✅ Logout functionality

### 🩸 Donor Features
- ✅ Complete donor profile management
- ✅ Blood donation application form
- ✅ Application status tracking
- ✅ Donation history
- ✅ Reputation score system
- ✅ Real-time message notifications

### 🏥 Blood Bank Features
- ✅ View all pending applications
- ✅ Accept/reject applications
- ✅ Send messages to donors
- ✅ Real-time application updates
- ✅ Donor profile viewing

### 🔄 Real-Time Features
- ✅ Live application status updates
- ✅ Instant message delivery
- ✅ Real-time dashboard sync
- ✅ Login success notifications

### 🛡️ Security
- ✅ Row Level Security (RLS) policies
- ✅ Role-based access control
- ✅ Secure password hashing
- ✅ JWT token authentication

---

## 🐛 Troubleshooting

### Issue: "Invalid API key" error

**Solution:**
- Double-check your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env`

### Issue: "Row Level Security policy violation"

**Solution:**
- Make sure you ran the complete `supabase-schema.sql` script
- Check that RLS policies were created successfully
- Go to **Authentication** → **Policies** in Supabase dashboard

### Issue: Tables not created

**Solution:**
- Re-run the `supabase-schema.sql` script
- Check for any SQL errors in the Supabase SQL Editor
- Make sure you have the correct permissions

### Issue: Real-time not working

**Solution:**
1. Go to **Database** → **Replication** in Supabase dashboard
2. Enable replication for these tables:
   - `donation_applications`
   - `messages`
3. Make sure your subscription code is correct

### Issue: Login successful but no redirect

**Solution:**
- Check browser console for errors
- Verify the donor profile was created in the `donors` table
- Check that `auth_id` matches the user ID in `auth.users`

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Realtime Guide](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 Next Steps

1. **Enable Email Verification**
   - Go to **Authentication** → **Settings**
   - Configure email templates

2. **Add More Features**
   - Blood bank registration
   - Hospital integration
   - Emergency alerts
   - SMS notifications

3. **Deploy Your App**
   - Deploy frontend to Vercel/Netlify
   - Supabase backend is already hosted!

4. **Monitor Usage**
   - Check **Database** → **Usage** for metrics
   - Set up alerts for quota limits

---

## 💡 Pro Tips

1. **Use Supabase Studio**: The visual table editor is great for debugging
2. **Enable Realtime**: Don't forget to enable replication for real-time features
3. **Test RLS Policies**: Use the "View as" feature to test different user roles
4. **Backup Your Data**: Use Supabase's backup features regularly
5. **Monitor Logs**: Check **Logs** section for debugging issues

---

## 🤝 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Review this guide again
4. Check Supabase Discord community

---

**Happy Coding! 🚀**

Made with ❤️ for saving lives through blood donation
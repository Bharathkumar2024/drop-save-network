# Google OAuth Setup for Vital Drop

## 🎯 **Google Sign Up is Now Ready!**

Your app now supports continuous Google sign up with the Google logo! Here's how to set it up:

## 📋 **Setup Steps**

### 1. **Configure Google OAuth in Supabase**

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication > Providers**
4. Find **Google** and click **Enable**
5. You'll need to create OAuth credentials in Google Cloud Console

### 2. **Create Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the **Google+ API** (for OAuth)
4. Go to **Credentials** in the left sidebar
5. Click **Create Credentials > OAuth 2.0 Client ID**
6. Configure the OAuth consent screen if prompted
7. Set **Application type** to **Web application**
8. Add your **Authorized redirect URIs**:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
9. Copy the **Client ID** and **Client Secret**

### 3. **Configure Supabase with Google Credentials**

1. Back in Supabase Dashboard > Authentication > Providers > Google
2. Paste your **Client ID** and **Client Secret**
3. Set **Redirect URLs** to:
   ```
   http://localhost:5173/donor/dashboard
   https://yourdomain.com/donor/dashboard
   ```
4. Save the configuration

### 4. **Update Environment Variables**

Update your `.env` file with your actual Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Use Supabase
VITE_USE_SUPABASE=true
```

## 🔄 **How It Works**

### **For New Users (Google Sign Up):**
1. User clicks "Continue with Google" button
2. Redirected to Google OAuth
3. After authorization, redirected back to your app
4. **Automatically creates a donor profile** with:
   - Name from Google account
   - Email from Google account
   - Default blood type (O+)
   - Empty location/city (user can update later)
5. User is logged in and redirected to dashboard

### **For Existing Users (Google Sign In):**
1. User clicks "Continue with Google"
2. If they have an existing donor profile, they're logged in
3. If not, a new profile is created automatically

## 🎨 **UI Features**

- **Google Logo**: Official Google logo with proper colors
- **Continuous Design**: Seamless integration with existing auth UI
- **Loading States**: Shows "Signing in..." during OAuth flow
- **Error Handling**: Proper error messages for failed sign ins
- **Responsive**: Works on all screen sizes

## 🚀 **Testing**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:5173/donor/auth`

3. You should see:
   - Google sign in button at the top
   - "Or continue with email" divider
   - Regular email/password forms below

## ⚠️ **Important Notes**

- **First-time Google users** will have a default blood type of O+
- Users should update their profile after Google sign up
- Make sure your Supabase URL and keys are correct
- Google OAuth only works in production with HTTPS (localhost is fine for development)

## 🔧 **Troubleshooting**

### **"Invalid OAuth callback" error:**
- Check your redirect URLs in Google Cloud Console
- Make sure the Supabase callback URL is correct

### **"Google sign in failed" error:**
- Verify your Client ID and Client Secret in Supabase
- Check browser console for detailed errors

### **Profile not created:**
- Check Supabase database for any RLS policy issues
- Verify the donors table exists and has proper permissions

## 📱 **Mobile Support**

The Google sign in button is fully responsive and works perfectly on mobile devices with the same OAuth flow.

---

**Your Google sign up is now live! Users can sign up with just one click using their Google account! 🎉**
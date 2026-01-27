# API Integration & Project Status Notes

## Current API Integrations
This project uses a hybrid approach leveraging **Supabase** for Backend-as-a-Service (BaaS) and a custom Express backend.

### 1. Supabase (Core Backend)
- **Authentication**: Used for User Management (Blood Banks, Hospitals, Donors).
  - Supports Email/Password.
  - Google OAuth (Implementation in progress).
- **Database (PostgreSQL)**:
  - Tables: `blood_banks`, `hospitals`, `donors`, `blood_units`, `blood_requests`, `transactions`.
  - Row Level Security (RLS) is likely enabled (implied).
- **Real-time Subscriptions**:
  - `subscribeToApplications`: Watch for new donation applications.
  - `subscribeToMessages`: Chat/Notification updates.

### 2. Custom Express Backend (Legacy/Hybrid)
- **Role**: Likely used for complex business logic, cron jobs, or specific API endpoints not yet migrated to Supabase Edge Functions.
- **Middleware**: Custom `auth.js` middleware validates JWTs. 
  - *Optimization Point*: Ensure backend validates Supabase tokens correctly if standardizing on Supabase Auth.

## Integration Gaps & Efficiency Opportunities

### 1. Authentication (Priority)
- **Google OAuth**: Logic exists in `src/lib/supabase.ts` (`signInWithGoogle`), but is not fully exposed in frontend Contexts (`BloodBankAuthContext`, `HospitalAuthContext`) or UI components.
- **Action**: 
  - Expose `signInWithGoogle` in Auth Contexts.
  - Add "Sign in with Google" buttons to Login/Register pages.
  - Handle "First Time Google Login" flow (redirect to profile completion).

### 2. Real-World API Enhancements (Recommended)
To make the project "Real World" class, consider integrating:

- **Maps & Geolocation**:
  - **API**: Google Maps JavaScript API or Mapbox.
  - **Use Case**: Show nearby Blood Compass, Donor locations, and Hospital routes.
  - *Current Status**: Text-based location storage.

- **SMS & Notifications**:
  - **API**: Twilio or AWS SNS.
  - **Use Case**: Urgent blood requirement alerts to Donors.
  - *Current Status**: In-app notifications via Supabase Realtime.

- **Email Services**:
  - **API**: SendGrid or Resend (works well with Supabase).
  - **Use Case**: Welcome emails, Password resets, Official receipts.
  - *Current Status**: Nodemailer referenced in backend `package.json`.

## Performance & Efficiency
- **State Management**: React Query (`@tanstack/react-query`) is installed and should be used for all data fetching to ensure caching and minimize network requests.
- **Realtime**: Supabase Realtime is efficient for live updates (e.g., Blood Stock levels), replacing the need for polling.

## Implementation Plan for "Full Completion"
1. **Finalize Google Auth** (COMPLETED): Enabled one-click login for Donors, Hospitals, and Blood Banks.
2. **Standardize Data Fetching** (COMPLETED): Implemented React Query hooks (e.g., `useBloodBankStats`) for caching and efficiency.
3. **Real-World APIs** (COMPLETED): Integrated `GoogleMapWrapper` architecture. Ready for API Key injection.
   - **Maps**: Added Map View tab to Blood Banks page.
   - **Twilio** (COMPLETED): Created `NotificationService` handling SMS/Email. integrated into `DonorApplications.tsx` for real-time camp alerts.

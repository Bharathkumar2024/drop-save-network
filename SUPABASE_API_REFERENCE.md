# 🔌 Supabase API Reference

Quick reference for all Supabase functions available in your Blood Donation App.

---

## 📦 Import

```typescript
import {
  supabase,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  createDonor,
  updateDonor,
  getDonorById,
  createDonationApplication,
  getDonationApplications,
  updateDonationApplication,
  createMessage,
  getMessages,
  markMessageAsRead,
  getBloodCamps,
  subscribeToApplications,
  subscribeToMessages,
} from '@/lib/supabase';
```

---

## 🔐 Authentication Functions

### Sign Up

```typescript
const { data, error } = await signUp(
  'user@example.com',
  'password123',
  {
    full_name: 'John Doe',
    role: 'donor',
  }
);
```

### Sign In

```typescript
const { data, error } = await signIn(
  'user@example.com',
  'password123'
);

// Returns: { user, session }
```

### Sign Out

```typescript
const { error } = await signOut();
```

### Get Current User

```typescript
const { user, error } = await getCurrentUser();
```

---

## 👤 Donor Functions

### Create Donor Profile

```typescript
const { data, error } = await createDonor({
  auth_id: 'uuid-from-auth',
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  blood_type: 'O+',
  city: 'Metro City',
  state: 'NY',
  status: 'active',
  donation_count: 0,
  reputation_score: 0,
});
```

### Update Donor Profile

```typescript
const { data, error } = await updateDonor('donor-id', {
  phone: '+0987654321',
  city: 'New City',
  last_login: new Date().toISOString(),
});
```

### Get Donor by ID

```typescript
const { data, error } = await getDonorById('donor-id');
```

---

## 🩸 Donation Application Functions

### Create Application

```typescript
const { data, error } = await createDonationApplication({
  donor_id: 'donor-uuid',
  blood_type: 'O+',
  age: 25,
  weight: 65.5,
  gender: 'Male',
  phone: '+1234567890',
  email: 'donor@example.com',
  address: '123 Main St',
  city: 'Metro City',
  state: 'NY',
  postal_code: '10001',
  has_donated_before: true,
  last_donation_date: '2024-01-15',
  recent_procedures: {
    tattooing: false,
    earPiercing: false,
  },
  diseases: {
    heartDisease: false,
    diabetes: false,
  },
  medications: {
    antibiotics: false,
  },
  surgery_history: {
    majorSurgery: false,
  },
  camp_id: 'camp-uuid',
  status: 'pending',
});
```

### Get Applications (with filters)

```typescript
// Get all applications
const { data, error } = await getDonationApplications();

// Get pending applications only
const { data, error } = await getDonationApplications({
  status: 'pending'
});

// Get applications for specific donor
const { data, error } = await getDonationApplications({
  donor_id: 'donor-uuid'
});
```

### Update Application Status

```typescript
const { data, error } = await updateDonationApplication(
  'application-id',
  {
    status: 'accepted',
    reviewed_by: 'blood-bank-id',
    review_notes: 'Application approved',
  }
);
```

---

## 💬 Message Functions

### Create Message

```typescript
const { data, error } = await createMessage({
  donor_id: 'donor-uuid',
  bank_id: 'bank-uuid',
  message_text: 'Your application has been accepted!',
  message_type: 'acceptance',
  is_read: false,
});
```

### Get Messages for Donor

```typescript
const { data, error } = await getMessages('donor-id');
```

### Mark Message as Read

```typescript
const { data, error } = await markMessageAsRead('message-id');
```

---

## 🏕️ Blood Camp Functions

### Get Blood Camps

```typescript
const { data, error } = await getBloodCamps();

// Returns upcoming camps sorted by date
```

---

## 🔄 Real-Time Subscriptions

### Subscribe to Application Changes

```typescript
const channel = subscribeToApplications((payload) => {
  console.log('Application changed:', payload);
  
  // payload.eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  // payload.new: new record data
  // payload.old: old record data (for UPDATE/DELETE)
  
  if (payload.eventType === 'UPDATE') {
    // Refresh your applications list
    refreshApplications();
  }
});

// Unsubscribe when component unmounts
return () => {
  supabase.removeChannel(channel);
};
```

### Subscribe to Messages for Specific Donor

```typescript
const channel = subscribeToMessages('donor-id', (payload) => {
  console.log('New message received:', payload);
  
  if (payload.eventType === 'INSERT') {
    const newMessage = payload.new;
    // Show notification
    showNotification(newMessage.message_text);
  }
});

// Unsubscribe when component unmounts
return () => {
  supabase.removeChannel(channel);
};
```

---

## 🎣 React Hook Examples

### useAuth Hook with Supabase

```typescript
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

function MyComponent() {
  const {
    user,
    donorData,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated,
  } = useSupabaseAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password', 'donor');
      // Redirect or show success
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {user?.name}!</div>;
}
```

### useApplications Hook (Custom)

```typescript
import { useState, useEffect } from 'react';
import { getDonationApplications, subscribeToApplications } from '@/lib/supabase';

function useApplications(filters?: any) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial data
    const loadApplications = async () => {
      const { data, error } = await getDonationApplications(filters);
      if (data) setApplications(data);
      setLoading(false);
    };

    loadApplications();

    // Subscribe to real-time updates
    const channel = subscribeToApplications((payload) => {
      if (payload.eventType === 'INSERT') {
        setApplications(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setApplications(prev =>
          prev.map(app => app.id === payload.new.id ? payload.new : app)
        );
      } else if (payload.eventType === 'DELETE') {
        setApplications(prev =>
          prev.filter(app => app.id !== payload.old.id)
        );
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { applications, loading };
}

// Usage
function ApplicationsList() {
  const { applications, loading } = useApplications({ status: 'pending' });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {applications.map(app => (
        <div key={app.id}>{app.donor_id}</div>
      ))}
    </div>
  );
}
```

---

## 🗄️ Direct Supabase Client Usage

For advanced queries, use the Supabase client directly:

### Complex Query Example

```typescript
import { supabase } from '@/lib/supabase';

// Get applications with donor details
const { data, error } = await supabase
  .from('donation_applications')
  .select(`
    *,
    donors (
      full_name,
      email,
      phone,
      blood_type
    ),
    blood_camps (
      name,
      location,
      date
    )
  `)
  .eq('status', 'pending')
  .order('created_at', { ascending: false })
  .limit(10);
```

### Filtering and Sorting

```typescript
// Multiple filters
const { data } = await supabase
  .from('donors')
  .select('*')
  .eq('blood_type', 'O+')
  .eq('status', 'active')
  .gte('donation_count', 5)
  .order('reputation_score', { ascending: false });
```

### Count Records

```typescript
const { count, error } = await supabase
  .from('donation_applications')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending');

console.log(`${count} pending applications`);
```

### Update Multiple Records

```typescript
const { data, error } = await supabase
  .from('messages')
  .update({ is_read: true })
  .eq('donor_id', 'donor-id')
  .eq('is_read', false);
```

---

## 🔒 Row Level Security (RLS) Notes

### Current Policies

1. **Donors Table**
   - Donors can view/update their own profile
   - Blood banks can view all donors

2. **Applications Table**
   - Donors can create and view their own applications
   - Blood banks can view and update all applications

3. **Messages Table**
   - Donors can view and update their own messages
   - Blood banks can create messages

### Testing RLS

```typescript
// This will only return the current user's applications
const { data } = await supabase
  .from('donation_applications')
  .select('*');

// RLS automatically filters based on auth.uid()
```

---

## 🚨 Error Handling

### Best Practices

```typescript
async function safeOperation() {
  try {
    const { data, error } = await someSupabaseFunction();
    
    if (error) {
      // Supabase error
      console.error('Supabase error:', error.message);
      throw error;
    }
    
    if (!data) {
      // No data returned
      console.warn('No data returned');
      return null;
    }
    
    return data;
  } catch (error) {
    // Network or other errors
    console.error('Unexpected error:', error);
    throw error;
  }
}
```

---

## 📊 Database Types

All TypeScript types are defined in `src/lib/supabase.ts`:

- `Donor`
- `DonationApplication`
- `BloodBank`
- `Message`
- `BloodCamp`

Use these for type safety:

```typescript
import { Donor, DonationApplication } from '@/lib/supabase';

const donor: Donor = {
  id: 'uuid',
  full_name: 'John Doe',
  // ... other fields with autocomplete!
};
```

---

## 🎯 Quick Tips

1. **Always check for errors**: Supabase returns `{ data, error }`
2. **Use TypeScript types**: Import types from `@/lib/supabase`
3. **Unsubscribe from channels**: Prevent memory leaks
4. **Use RLS policies**: Don't bypass security
5. **Test with different users**: Verify RLS works correctly

---

**Happy Coding! 🚀**
# 🔑 HOW TO LOGIN - WORKING CREDENTIALS

## Blood Bank Portal

**Page:** http://localhost:5173/bloodbank/auth

### ✅ CORRECT Login:
```
Blood Bank ID: CBB001
Password: (any password - mock mode doesn't check)
```

### ❌ WRONG (What you tried):
```
Blood Bank ID: bharath77@gmail.com  ← This is EMAIL, not Bank ID!
Password: ********
```

---

## Why You Got "Invalid Credentials":

Looking at the code (BloodBankAuth.tsx, line 42):
```typescript
const bloodBank = mockBloodBanks.find(bb => bb.bankId === loginBankId);
```

The system searches for a blood bank with ID "CBB001" in the mock data.
When you enter "bharath77@gmail.com", it can't find any blood bank with that ID!

---

## All Available Mock Credentials:

### Blood Banks:
- **ID**: CBB001
- **Password**: anything

### How to Use:
1. Go to http://localhost:5173/bloodbank/auth
2. Enter "CBB001" in the Blood Bank ID field
3. Enter any password
4. Click "Login to Dashboard"

**IMPORTANT:** The field asks for "Blood Bank ID", NOT email!

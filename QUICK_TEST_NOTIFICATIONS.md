# 🚀 Quick Test Guide - Notification System

## ⚡ 2-Minute Test

### **What You Need:**
- 3 browser windows (or use incognito mode)
- App running on `http://localhost:5173`

---

## 📋 Test Steps

### **Step 1: Open Hospital** (Window 1)
```
URL: http://localhost:5173/hospital/auth
Login → Go to "Emergency" page
```

### **Step 2: Open Donor** (Window 2)
```
URL: http://localhost:5173/donor/auth
Login → Go to "Notifications" page
```

### **Step 3: Open Blood Bank** (Window 3)
```
URL: http://localhost:5173/bloodbank/auth
Login → Go to "Notifications" page
```

### **Step 4: Send Emergency** (Window 1 - Hospital)
```
1. Select Blood Group: A+
2. Enter Units: 5
3. Click "Send Emergency Alert"
```

### **Step 5: Check Notifications** (Windows 2 & 3)
```
✅ Donor window: Bell icon shows "1" badge
✅ Blood Bank window: Bell icon shows "1" badge
✅ Both show: "🚨 New Emergency Alert"
✅ Message: "A+ blood needed - 5 units"
```

---

## ✅ Expected Results

| Dashboard | What You Should See |
|-----------|-------------------|
| **Hospital** | ✅ Toast: "Emergency Alert Sent" |
| **Donor** | ✅ Bell badge: 🔔 (1)<br>✅ Notification: "🚨 New Emergency Alert"<br>✅ Details: "A+ blood needed - 5 units" |
| **Blood Bank** | ✅ Bell badge: 🔔 (1)<br>✅ Notification: "🚨 New Emergency Alert"<br>✅ Details: "A+ blood needed - 5 units" |

---

## 🔧 Troubleshooting

### **Not seeing notifications?**

1. **Check .env file:**
   ```
   VITE_MOCK_MODE=true
   ```

2. **Use different windows:**
   - Don't use tabs in the same window
   - Use incognito mode for separate sessions

3. **Refresh after login:**
   - Login to donor/blood bank
   - Refresh the page
   - Then send emergency from hospital

4. **Check browser console:**
   - Should see: "🎭 Mock Mode: Socket event simulated"

---

## 🎯 Quick Checklist

- [ ] App is running (`npm run dev`)
- [ ] Opened 3 browser windows
- [ ] Logged into all 3 dashboards
- [ ] Sent emergency from hospital
- [ ] Saw notifications in donor window
- [ ] Saw notifications in blood bank window
- [ ] Badge count shows correctly
- [ ] Can click "Respond" button

---

## 🎉 Success!

If you see notifications in both Donor and Blood Bank windows, the system is working perfectly! 🎊

**Next:** Read `NOTIFICATION_FIX_COMPLETE.md` for detailed documentation.
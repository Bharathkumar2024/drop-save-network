# 🎭 Mock Mode Guide - Preview Frontend Without Backend

This guide explains how to preview and develop the frontend without needing the backend server running.

## What is Mock Mode?

Mock Mode allows you to run the entire frontend application using **simulated data** instead of making real API calls to the backend. This is perfect for:

- 🎨 **Frontend Development** - Work on UI/UX without backend dependencies
- 🚀 **Quick Previews** - Show the application to stakeholders instantly
- 🧪 **Testing** - Test frontend logic with predictable data
- 📱 **Demos** - Present the application without full setup

## Quick Start

### Option 1: Using the Batch File (Easiest)

Simply double-click or run:
```bash
.\start-frontend-mock.bat
```

This will automatically:
1. Enable mock mode
2. Start the development server
3. Open your browser to the application

### Option 2: Manual Setup

1. **Enable Mock Mode** in `.env` file:
   ```env
   VITE_MOCK_MODE=true
   ```

2. **Start the frontend**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to:
   ```
   http://localhost:5173
   ```

## How to Use Mock Mode

### 1. Login with Any Credentials

When mock mode is enabled, you can login with **any credentials**:

#### Hospital Login
- **Hospital ID**: Any text (e.g., "CGH001")
- **Password**: Any text (e.g., "password")

#### Donor Login
- **Email**: Any email (e.g., "donor@example.com")
- **OTP**: Any 6-digit code (e.g., "123456")

#### Blood Bank Login
- **Bank ID**: Any text (e.g., "CBB001")
- **Password**: Any text (e.g., "password")

### 2. Explore All Features

All features work with mock data:
- ✅ View dashboards with realistic data
- ✅ Add/edit/delete records (changes are simulated)
- ✅ Create emergency requests
- ✅ View statistics and charts
- ✅ Browse patient/donor/blood bank lists

### 3. Mock Data Available

The application includes comprehensive mock data:
- **10 Patients** with various blood type needs
- **5 Donors** with different blood groups
- **1 Blood Bank** with 8 blood type inventories
- **Multiple Emergency Requests**
- **Send Records** and dispatch history

## Switching Between Mock and Real Backend

### Enable Mock Mode
```env
VITE_MOCK_MODE=true
```

### Disable Mock Mode (Use Real Backend)
```env
VITE_MOCK_MODE=false
```

After changing the `.env` file, restart the development server.

## Visual Indicator

When mock mode is enabled, you'll see in the browser console:
```
🎭 Mock Mode Enabled - Using mock data without backend
```

## Features in Mock Mode

### ✅ Fully Functional
- Authentication (all user types)
- Dashboard views
- Data visualization (charts, graphs)
- Forms and inputs
- Navigation and routing
- UI components
- Responsive design

### ⚠️ Simulated (Not Persistent)
- Data changes (adds, edits, deletes) - Changes reset on page refresh
- Real-time notifications - Simulated with delays
- File uploads - Accepted but not stored
- WebSocket connections - Mocked

### ❌ Not Available
- Actual database persistence
- Real email notifications
- Actual file storage
- Cross-session data sharing

## Development Workflow

### Recommended Workflow

1. **Start with Mock Mode** for UI development
   ```bash
   .\start-frontend-mock.bat
   ```

2. **Develop and test** frontend features

3. **Switch to Real Backend** when ready to integrate
   ```bash
   # In .env
   VITE_MOCK_MODE=false
   
   # Start both servers
   .\START_SERVERS.bat
   ```

## Troubleshooting

### Mock Mode Not Working?

1. **Check `.env` file**:
   ```env
   VITE_MOCK_MODE=true
   ```

2. **Restart the dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Clear browser cache**:
   - Press `Ctrl+Shift+R` (hard refresh)
   - Or clear cache in browser settings

### Console Shows Errors?

- Mock mode errors are usually harmless
- Check browser console for the mock mode indicator
- Ensure all dependencies are installed: `npm install`

## Mock Data Customization

To customize mock data, edit:
```
src/data/mockData.ts
```

To customize mock API responses, edit:
```
src/lib/mockApi.ts
```

## Benefits of Mock Mode

### For Developers
- 🚀 Faster development cycle
- 🔄 No backend dependencies
- 🎯 Focus on frontend logic
- 🧪 Predictable test data

### For Designers
- 🎨 Immediate visual feedback
- 📱 Test responsive designs
- 🖼️ Prototype interactions
- ✨ Experiment with UI changes

### For Stakeholders
- 👀 Quick demos
- 📊 See data visualizations
- 🔍 Review user flows
- ✅ Approve designs faster

## Production Deployment

**Important**: Always disable mock mode for production:

```env
VITE_MOCK_MODE=false
```

Mock mode is for development only and should never be used in production environments.

## Need Help?

- Check the main `README.md` for general setup
- See `HOW_TO_START.md` for backend setup
- Review `TROUBLESHOOTING.md` for common issues

---

**Happy Developing! 🎉**
# Vital Drop Backend - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (v6 or higher)
   - **Option A - Local Installation:**
     - Download from: https://www.mongodb.com/try/download/community
     - Install and start MongoDB service
   
   - **Option B - MongoDB Atlas (Cloud):**
     - Create free account at: https://www.mongodb.com/cloud/atlas
     - Create a cluster and get connection string
     - Update `MONGODB_URI` in `.env` file

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## Installation Steps

### Step 1: Install Dependencies

**Option A - Using Batch File (Recommended for Windows):**
```bash
# Double-click install.bat
# OR run from command prompt:
install.bat
```

**Option B - Using npm directly:**
```bash
npm install
```

### Step 2: Configure Environment

The `.env` file is already created. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vital-drop
JWT_SECRET=vital_drop_secret_key_2024_change_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**For MongoDB Atlas:**
Replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vital-drop?retryWrites=true&w=majority
```

### Step 3: Start MongoDB (if using local installation)

**Windows:**
```bash
# MongoDB should start automatically as a service
# If not, run:
net start MongoDB
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

### Step 4: Start the Server

**Option A - Development Mode (with auto-reload):**
```bash
# Double-click start-dev.bat
# OR run:
npm run dev
```

**Option B - Production Mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📡 Socket.io server ready
```

### Step 5: Seed the Database

**Option A - Using Batch File:**
```bash
# Make sure server is running first!
# Then double-click seed-db.bat
```

**Option B - Using curl:**
```bash
curl -X POST http://localhost:5000/api/seed
```

**Option C - Using Browser/Postman:**
- Open: http://localhost:5000/api/seed
- Method: POST

## Verification

### Test the API

1. **Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected: `{"status":"OK","message":"Vital Drop API is running"}`

2. **Get Stats:**
   ```bash
   curl http://localhost:5000/api/stats/overview
   ```

3. **Login as Hospital:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/hospital/login \
     -H "Content-Type: application/json" \
     -d "{\"hospitalId\":\"CGH001\",\"password\":\"password123\"}"
   ```

## Test Credentials (After Seeding)

### Hospitals
- **Hospital ID:** CGH001
- **Password:** password123

- **Hospital ID:** MMC002
- **Password:** password123

### Blood Banks
- **Bank ID:** CBB001
- **Password:** password123

- **Bank ID:** WCBS002
- **Password:** password123

### Donors
- **Email:** john.smith@email.com
- **Email:** sarah.j@email.com
- **Email:** mbrown@email.com
- **Email:** emily.d@email.com

*Note: For donors, OTP will be displayed in console logs during development*

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. Make sure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl status mongod
   ```

2. Check MongoDB URI in `.env` file

3. For MongoDB Atlas, ensure:
   - IP address is whitelisted (or use 0.0.0.0/0 for testing)
   - Username/password are correct
   - Database name is specified

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change port in `.env` file:
   ```env
   PORT=5001
   ```

2. Or kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill -9
   ```

### npm install fails

**Solutions:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Try using different registry:
   ```bash
   npm install --registry=https://registry.npmjs.org/
   ```

### Socket.io Connection Issues

**Solutions:**
1. Check CORS settings in `server.js`
2. Ensure `CLIENT_URL` in `.env` matches your frontend URL
3. Check firewall settings

## Development Workflow

### Making Changes

1. Edit files in the project
2. Server will auto-reload (if using `npm run dev`)
3. Test changes using Postman or frontend

### Adding New Routes

1. Create route file in `routes/` directory
2. Import and use in `server.js`:
   ```javascript
   import newRoutes from './routes/newroutes.js';
   app.use('/api/newroutes', newRoutes);
   ```

### Adding New Models

1. Create model file in `models/` directory
2. Import in relevant route files

### Resetting Database

To clear all data and start fresh:
```bash
curl -X DELETE http://localhost:5000/api/seed
curl -X POST http://localhost:5000/api/seed
```

## Production Deployment

### Before Deploying:

1. **Update Environment Variables:**
   ```env
   NODE_ENV=production
   JWT_SECRET=<strong-random-secret>
   MONGODB_URI=<production-database-url>
   ```

2. **Security Checklist:**
   - [ ] Remove or protect `/api/seed` endpoint
   - [ ] Set strong JWT_SECRET
   - [ ] Configure real email service
   - [ ] Add rate limiting
   - [ ] Enable HTTPS
   - [ ] Add input validation
   - [ ] Remove OTP from API responses
   - [ ] Configure CORS properly
   - [ ] Add request logging
   - [ ] Set up monitoring

3. **Deployment Platforms:**
   - **Heroku:** Easy deployment with MongoDB Atlas
   - **Railway:** Modern platform with good free tier
   - **Render:** Simple deployment process
   - **DigitalOcean:** More control, requires setup
   - **AWS/Azure/GCP:** Enterprise solutions

### Example: Deploy to Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create vital-drop-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main

# Seed database
curl -X POST https://vital-drop-api.herokuapp.com/api/seed
```

## API Documentation

Full API documentation is available in the main README.md file.

## Support

For issues or questions:
1. Check this guide
2. Review error logs
3. Check MongoDB connection
4. Verify environment variables

## Next Steps

After setting up the backend:
1. Test all endpoints using Postman
2. Set up the frontend application
3. Connect frontend to backend API
4. Test real-time notifications with Socket.io
5. Deploy to production

---

**Happy Coding! 🚀**
# Vital Drop - Blood Donation Management System

<div align="center">

![Vital Drop](https://img.shields.io/badge/Vital%20Drop-Blood%20Donation%20System-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A comprehensive blood donation management system connecting hospitals, donors, and blood banks in real-time.**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Tech Stack](#tech-stack)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Vital Drop** is a full-stack blood donation management system designed to streamline the process of connecting blood donors with hospitals and blood banks in emergency situations. The system provides real-time notifications, inventory management, and comprehensive tracking of blood donations and dispatches.

### Key Capabilities

- **Three User Types:** Hospitals, Donors, and Blood Banks with distinct authentication flows
- **Real-time Notifications:** Socket.io-powered instant alerts for emergencies
- **Emergency Management:** Create and respond to blood emergency requests
- **Inventory Tracking:** Comprehensive blood preservation and dispatch management
- **Patient Management:** Track patient blood requirements and fulfillment
- **Analytics Dashboard:** Real-time statistics and insights
- **Mobile-Responsive:** Works seamlessly on all devices

---

## ✨ Features

### 🏥 Hospital Features

- **Password-based Authentication**
- **Patient Management System**
  - Add, update, and track patients
  - Monitor blood requirements
  - Track units received vs. required
- **Emergency Request System**
  - Create urgent blood requests
  - Real-time status tracking
  - Automatic donor notifications
- **Dashboard Analytics**
  - Patient statistics
  - Blood type distribution
  - Fulfillment rates

### 🩸 Donor Features

- **OTP-based Authentication** (Email)
- **Profile Management**
  - Update availability status
  - Track donation history
  - Manage personal information
- **Emergency Discovery**
  - View nearby emergencies
  - Filter by blood type compatibility
  - Real-time emergency alerts
- **Pledge System**
  - Respond to emergencies
  - Track pledged units
  - Reputation scoring

### 🏦 Blood Bank Features

- **OTP-based Authentication** with Certificate Upload
- **Inventory Management**
  - Add preservation batches
  - Track expiry dates
  - Near-expiry warnings
  - Stock level monitoring
- **Dispatch System**
  - Create dispatch records
  - Track delivery status
  - Hospital coordination
- **Analytics**
  - Stock distribution
  - Dispatch success rates
  - Inventory trends

### 🔔 Real-time Notifications

- Emergency creation alerts
- Donor response notifications
- Dispatch status updates
- Patient status changes
- Browser push notifications

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Radix UI + Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Routing:** React Router v6

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.io
- **File Upload:** Multer
- **Validation:** Express Validator

### Development Tools

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Postman** for API testing

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Option 1: Automated Setup (Windows)

```bash
# 1. Install all dependencies
setup-all.bat

# 2. Start both servers
start-full-stack.bat

# 3. Seed database (visit in browser)
http://localhost:5000/api/seed
```

### Option 2: Manual Setup

#### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 2. Configure Environment

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Backend (backend/.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vital-drop
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

#### 3. Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in backend/.env)
```

#### 4. Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

#### 5. Start Frontend Server

```bash
# In project root
npm run dev
```

Frontend will run on `http://localhost:5173`

#### 6. Seed Database

Visit `http://localhost:5000/api/seed` or:

```bash
curl -X POST http://localhost:5000/api/seed
```

#### 7. Access Application

Open `http://localhost:5173` in your browser.

### Test Credentials

After seeding, use these credentials:

**Hospitals:**
- Hospital ID: `CGH001` | Password: `password123`
- Hospital ID: `MMC002` | Password: `password123`

**Blood Banks:**
- Bank ID: `CBB001` | Password: `password123`
- Bank ID: `WCBS002` | Password: `password123`

**Donors:**
- Email: `john.smith@email.com`
- Email: `sarah.j@email.com`
- Email: `mbrown@email.com`
- Email: `emily.d@email.com`

*Note: OTP will be displayed in backend console during development*

---

## 📁 Project Structure

```
vital-drop/
├── backend/                    # Backend API
│   ├── config/                # Database configuration
│   ├── middleware/            # Auth, error handling, upload
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── utils/                 # Helper functions
│   ├── server.js              # Express server + Socket.io
│   ├── package.json
│   └── .env
│
├── src/                       # Frontend source
│   ├── components/           # React components
│   │   ├── shared/          # Shared components
│   │   └── ui/              # UI components (Radix)
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   ├── lib/                 # Utilities
│   │   ├── api.ts          # API service layer
│   │   ├── socket.ts       # Socket.io service
│   │   └── utils.ts        # Helper functions
│   ├── pages/              # Page components
│   │   ├── hospital/       # Hospital pages
│   │   ├── donor/          # Donor pages
│   │   ├── bloodbank/      # Blood bank pages
│   │   └── Landing.tsx     # Landing page
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
│
├── public/                  # Static assets
├── .env                     # Frontend environment variables
├── package.json
├── vite.config.ts
├── tailwind.config.ts
│
├── setup-all.bat           # Setup script (Windows)
├── start-full-stack.bat    # Start script (Windows)
│
└── Documentation/
    ├── README_COMPLETE.md
    ├── FRONTEND_BACKEND_INTEGRATION.md
    ├── BACKEND_COMPLETE.md
    └── BACKEND_SETUP_COMPLETE.txt
```

---

## 📚 Documentation

### Main Documentation

- **[FRONTEND_BACKEND_INTEGRATION.md](./FRONTEND_BACKEND_INTEGRATION.md)** - Complete integration guide
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[backend/SETUP.md](./backend/SETUP.md)** - Backend setup guide
- **[backend/TESTING_GUIDE.md](./backend/TESTING_GUIDE.md)** - API testing guide
- **[backend/ARCHITECTURE.md](./backend/ARCHITECTURE.md)** - System architecture
- **[BACKEND_COMPLETE.md](./BACKEND_COMPLETE.md)** - Backend implementation summary

### Quick References

- **[API Endpoints](#api-endpoints)** - Quick API reference
- **[Test Credentials](#test-credentials)** - Login credentials for testing
- **[Postman Collection](./backend/Vital-Drop-API.postman_collection.json)** - Import for API testing

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/hospital/signup
POST   /api/auth/hospital/login
POST   /api/auth/donor/signup
POST   /api/auth/donor/verify-otp
POST   /api/auth/donor/login
POST   /api/auth/bloodbank/signup
POST   /api/auth/bloodbank/verify-otp
POST   /api/auth/bloodbank/login
```

### Hospitals

```
GET    /api/hospitals/:id/dashboard
POST   /api/hospitals/:id/patients
GET    /api/hospitals/:id/patients
PATCH  /api/hospitals/:id/patients/:pid
DELETE /api/hospitals/:id/patients/:pid
POST   /api/hospitals/:id/emergency
GET    /api/hospitals/:id/emergency-status
```

### Donors

```
GET    /api/donors/:id/profile
PATCH  /api/donors/:id/profile
GET    /api/donors/:id/nearby-emergencies
POST   /api/donors/:id/respond
GET    /api/donors/:id/history
```

### Blood Banks

```
GET    /api/bloodbanks/:id/dashboard
POST   /api/bloodbanks/:id/preservation
GET    /api/bloodbanks/:id/preservation
PATCH  /api/bloodbanks/:id/preservation/:pid
POST   /api/bloodbanks/:id/dispatch
GET    /api/bloodbanks/:id/send-records
PATCH  /api/bloodbanks/:id/send-records/:sid
POST   /api/bloodbanks/:id/emergency
```

### Utilities

```
GET    /api/stats/overview
GET    /api/stats/city/:city
GET    /api/emergencies/latest
GET    /api/health
POST   /api/seed
DELETE /api/seed
```

For detailed API documentation, see [backend/README.md](./backend/README.md)

---

## 🧪 Testing

### Backend Testing

```bash
# Using Postman
# Import: backend/Vital-Drop-API.postman_collection.json

# Using curl
curl http://localhost:5000/api/health

# Login as hospital
curl -X POST http://localhost:5000/api/auth/hospital/login \
  -H "Content-Type: application/json" \
  -d '{"hospitalId":"CGH001","password":"password123"}'
```

### Frontend Testing

1. Start both servers
2. Visit `http://localhost:5173`
3. Test authentication flows
4. Test real-time notifications (open multiple windows)
5. Test CRUD operations

### Integration Testing

1. Login as Hospital
2. Create emergency
3. Login as Donor (different window)
4. Verify donor receives notification
5. Donor responds to emergency
6. Verify hospital receives response notification

---

## 🚢 Deployment

### Frontend Deployment

**Vercel (Recommended):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
```

**Netlify:**

```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
# Set environment variables in Netlify dashboard
```

### Backend Deployment

**Heroku:**

```bash
cd backend
heroku create vital-drop-api
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-mongodb-uri
git push heroku main
```

**AWS / DigitalOcean:**

See [backend/SETUP.md](./backend/SETUP.md) for detailed deployment instructions.

### Production Checklist

- [ ] Update CORS origins in backend
- [ ] Use strong JWT_SECRET
- [ ] Configure real email service
- [ ] Remove/protect seed endpoint
- [ ] Enable HTTPS
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Follow existing code style

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with React, Node.js, and MongoDB
- UI components from Radix UI
- Icons from Lucide React
- Real-time communication via Socket.io

---

## 📞 Support

For issues, questions, or suggestions:

1. Check the [documentation](#documentation)
2. Review [common issues](./FRONTEND_BACKEND_INTEGRATION.md#common-issues-and-solutions)
3. Open an issue on GitHub
4. Contact the development team

---

## 🗺️ Roadmap

### Phase 1 (Complete) ✅
- [x] Backend API implementation
- [x] Frontend UI implementation
- [x] Authentication system
- [x] Real-time notifications
- [x] Database seeding
- [x] Documentation

### Phase 2 (In Progress) 🚧
- [ ] Frontend-Backend integration
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Mobile app (React Native)

### Phase 3 (Planned) 📋
- [ ] SMS notifications
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Reporting system

---

<div align="center">

**Built with ❤️ for saving lives**

[⬆ Back to Top](#vital-drop---blood-donation-management-system)

</div>
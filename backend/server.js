import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import hospitalRoutes from './routes/hospitals.js';
import donorRoutes from './routes/donors.js';
import bloodBankRoutes from './routes/bloodbanks.js';
import patientRoutes from './routes/patients.js';
import emergencyRoutes from './routes/emergencies.js';
import statsRoutes from './routes/stats.js';
import seedRoutes from './routes/seed.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Allow multiple origins for CORS
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'http://localhost:8080'];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/bloodbanks', bloodBankRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/seed', seedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vital Drop API is running' });
});

// Error handler
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join room based on city or role
  socket.on('join', (data) => {
    const { city, role, userId } = data;
    if (city) socket.join(`city:${city}`);
    if (role) socket.join(`role:${role}`);
    if (userId) socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} joined rooms:`, data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io for use in other modules
export { io };

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
});
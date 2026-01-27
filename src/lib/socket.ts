import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const IS_MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(userId: string, role: string, city: string) {
    // In mock mode, don't actually connect to socket server
    if (IS_MOCK_MODE) {
      console.log('🎭 Mock Mode: Socket connection simulated');
      return;
    }

    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      
      // Join rooms based on user role and city
      this.socket?.emit('join', {
        userId,
        role,
        city,
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Setup event listeners
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Emergency created event
    this.socket.on('emergency.created', (data) => {
      console.log('Emergency created:', data);
      this.emit('emergency.created', data);
    });

    // Emergency response event
    this.socket.on('emergency.response', (data) => {
      console.log('Emergency response:', data);
      this.emit('emergency.response', data);
    });

    // Emergency fulfilled event
    this.socket.on('emergency.fulfilled', (data) => {
      console.log('Emergency fulfilled:', data);
      this.emit('emergency.fulfilled', data);
    });

    // Dispatch status update event
    this.socket.on('dispatch.update', (data) => {
      console.log('Dispatch update:', data);
      this.emit('dispatch.update', data);
    });

    // Patient status update event
    this.socket.on('patient.update', (data) => {
      console.log('Patient update:', data);
      this.emit('patient.update', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // Emit to local listeners
  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Send event to server
  send(event: string, data: any) {
    if (IS_MOCK_MODE) {
      console.log('🎭 Mock Mode: Socket event simulated:', event, data);
      // In mock mode, emit the event locally to simulate broadcast
      // This allows testing notifications without a backend
      setTimeout(() => {
        console.log('🎭 Mock Mode: Broadcasting event locally:', event);
        this.emit(event, data);
      }, 100);
      return;
    }
    
    if (this.socket?.connected) {
      console.log('📡 Sending socket event:', event, data);
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected. Cannot send event:', event);
      console.warn('⚠️ Make sure the backend server is running on:', SOCKET_URL);
    }
  }

  isConnected() {
    // In mock mode, always return true to prevent connection errors
    if (IS_MOCK_MODE) {
      return true;
    }
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
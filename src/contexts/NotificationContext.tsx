import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EmergencyRequest } from '@/data/mockData';
import { socketService } from '@/lib/socket';

interface Notification {
  id: string;
  type: 'emergency' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  emergencyData?: EmergencyRequest | any;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  isSocketConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [user, setUser] = useState<any>(null);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Play notification sound (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, []);

  // Setup Socket.io connection when user logs in
  useEffect(() => {
    if (user) {
      // Connect to socket
      socketService.connect(user.id, user.role, user.city || user.location || 'Unknown');
      setIsSocketConnected(socketService.isConnected());

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Subscribe to emergency created events
      const unsubEmergencyCreated = socketService.on('emergency.created', (data: any) => {
        console.log('🚨 Emergency notification received:', data);
        
        // Only show emergency notifications to donors and blood banks
        if (user.role === 'donor' || user.role === 'bloodbank') {
          const unitsNeeded = data.emergency.unitsNeeded || data.emergency.unitsRequired || 0;
          const requesterName = data.emergency.requesterName || data.emergency.hospitalName || data.emergency.creatorName || 'Unknown';
          
          addNotification({
            type: 'emergency',
            title: '🚨 New Emergency Alert',
            message: `${data.emergency.bloodType} blood needed - ${unitsNeeded} units from ${requesterName}`,
            emergencyData: data.emergency,
          });
        }
      });

      // Subscribe to emergency response events
      const unsubEmergencyResponse = socketService.on('emergency.response', (data: any) => {
        if (user.role === 'hospital' || user.role === 'bloodbank') {
          addNotification({
            type: 'success',
            title: '✅ Donor Response',
            message: `${data.donor?.name || 'A donor'} pledged ${data.response.unitsPledged} units`,
            emergencyData: data,
          });
        }
      });

      // Subscribe to emergency fulfilled events
      const unsubEmergencyFulfilled = socketService.on('emergency.fulfilled', (data: any) => {
        addNotification({
          type: 'success',
          title: '✅ Emergency Fulfilled',
          message: `Emergency for ${data.emergency.bloodType} blood has been fulfilled!`,
          emergencyData: data.emergency,
        });
      });

      // Subscribe to dispatch update events
      const unsubDispatchUpdate = socketService.on('dispatch.update', (data: any) => {
        addNotification({
          type: 'info',
          title: '📦 Dispatch Update',
          message: `Blood dispatch status: ${data.status}`,
          emergencyData: data,
        });
      });

      // Subscribe to patient update events
      const unsubPatientUpdate = socketService.on('patient.update', (data: any) => {
        if (user.role === 'hospital') {
          addNotification({
            type: 'info',
            title: '🏥 Patient Update',
            message: `Patient ${data.patient?.name || 'record'} has been updated`,
            emergencyData: data,
          });
        }
      });

      // Subscribe to blood request created events (for blood banks)
      const unsubBloodRequestCreated = socketService.on('blood.request.created', (data: any) => {
        if (user.role === 'bloodbank') {
          addNotification({
            type: 'emergency',
            title: '🩸 New Blood Request',
            message: `${data.request.patient?.name || 'A patient'} needs ${data.request.bloodGroup} blood - ${data.request.unitsNeeded} units`,
            emergencyData: data.request,
          });
        }
      });

      // Subscribe to blood request accepted events (for patients)
      const unsubBloodRequestAccepted = socketService.on('blood.request.accepted', (data: any) => {
        if (user.role === 'patient') {
          addNotification({
            type: 'success',
            title: '✅ Blood Request Accepted',
            message: `${data.bloodBank?.name || 'A blood bank'} has accepted your blood request!`,
            emergencyData: data,
          });
        }
      });

      // Cleanup on unmount or user change
      return () => {
        unsubEmergencyCreated();
        unsubEmergencyResponse();
        unsubEmergencyFulfilled();
        unsubDispatchUpdate();
        unsubPatientUpdate();
        unsubBloodRequestCreated();
        unsubBloodRequestAccepted();
        socketService.disconnect();
        setIsSocketConnected(false);
      };
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, markAllAsRead, unreadCount, isSocketConnected }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

import { useState, useMemo, useCallback } from 'react';
import { Bell, Heart, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from 'sonner';

const BloodBankNotifications = () => {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  
  // Memoized emergency notifications
  const emergencyNotifications = useMemo(() => 
    notifications.filter(n => n.type === 'emergency' && !n.read),
    [notifications]
  );

  // Memoized all notifications
  const allNotifications = useMemo(() => 
    notifications.slice(0, 20), // Show last 20 notifications
    [notifications]
  );

  const handleRespond = useCallback((notifId: string) => {
    markAsRead(notifId);
    toast.success('Response sent! Hospital has been notified.', {
      description: 'Blood units are being prepared for dispatch.'
    });
  }, [markAsRead]);

  return (
    <BloodBankLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Notifications</h1>
        <p className="text-gray-400">Stay updated with emergency blood requests and alerts</p>
      </div>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-red-600" />
          <h3 className="text-2xl font-bold text-red-600">Notification Center</h3>
          {emergencyNotifications.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {emergencyNotifications.length} Emergency
            </Badge>
          )}
        </div>

        {/* Emergency Notifications */}
        {emergencyNotifications.length > 0 && (
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold text-red-500 flex items-center gap-2">
              🚨 Emergency Blood Requests
            </h4>
            {emergencyNotifications.map(notif => (
              <Card key={notif.id} className="glass-card-primary p-4 border-2 border-red-500/50 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">{notif.title}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                    {notif.emergencyData && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="destructive">{notif.emergencyData.bloodType}</Badge>
                        <Badge variant="secondary">{notif.emergencyData.unitsRequired || notif.emergencyData.unitsNeeded} units</Badge>
                        <Badge variant="outline">{notif.emergencyData.requesterName || notif.emergencyData.hospitalName}</Badge>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRespond(notif.id)}
                    className="bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* All Notifications */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">All Notifications</h4>
          
          {allNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h4 className="text-lg font-semibold mb-2">No Notifications</h4>
              <p className="text-sm text-muted-foreground">
                You'll be notified when hospitals send emergency requests.
              </p>
            </div>
          ) : (
            allNotifications.map(notif => (
              <Card 
                key={notif.id} 
                className={`glass-card-primary p-4 hover:border-red-500/50 transition-colors duration-200 ${
                  !notif.read ? 'border-red-500/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'emergency' ? 'bg-red-600/20' :
                    notif.type === 'success' ? 'bg-green-600/20' :
                    notif.type === 'info' ? 'bg-blue-600/20' :
                    'bg-yellow-600/20'
                  }`}>
                    {notif.type === 'emergency' && <AlertCircle className="h-5 w-5 text-red-500" />}
                    {notif.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {notif.type === 'info' && <Bell className="h-5 w-5 text-blue-500" />}
                    {notif.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="font-semibold text-white">{notif.title}</h5>
                      {!notif.read && (
                        <Badge variant="destructive" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                    {notif.emergencyData && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {notif.emergencyData.bloodType && (
                          <Badge variant="outline">{notif.emergencyData.bloodType}</Badge>
                        )}
                        {(notif.emergencyData.unitsRequired || notif.emergencyData.unitsNeeded) && (
                          <Badge variant="secondary">
                            {notif.emergencyData.unitsRequired || notif.emergencyData.unitsNeeded} units
                          </Badge>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notif.read && notif.type === 'emergency' && (
                    <Button
                      onClick={() => handleRespond(notif.id)}
                      variant="outline"
                      size="sm"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {emergencyNotifications.length === 0 && allNotifications.length > 0 && (
          <div className="text-center py-6 mt-6 border-t border-red-500/20">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <h4 className="text-lg font-semibold mb-2">No Emergency Alerts</h4>
            <p className="text-sm text-muted-foreground">
              All emergency requests have been addressed.
            </p>
          </div>
        )}
      </Card>
    </BloodBankLayout>
  );
};

export default BloodBankNotifications;
import { useState, useMemo, useCallback } from 'react';
import { Bell, Heart, Calendar, CheckCircle } from 'lucide-react';
import DonorLayout from '@/components/donor/DonorLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { mockDonors } from '@/data/mockData';
import { toast } from 'sonner';

const DonorNotifications = () => {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  
  // Find donor data or use first donor as fallback - memoized
  const donor = useMemo(() => 
    mockDonors.find(d => d.id === user?.id) || mockDonors[0],
    [user?.id]
  );

  // Reward tiers state
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  
  // Memoized emergency notifications
  const emergencyNotifications = useMemo(() => 
    notifications.filter(n => n.type === 'emergency' && !n.read),
    [notifications]
  );

  const handleRespond = useCallback((notifId: string) => {
    markAsRead(notifId);
    toast.success('Thank you for responding! Hospital has been notified.', {
      description: 'Your donation can save lives.'
    });
  }, [markAsRead]);

  return (
    <DonorLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Notifications</h1>
        <p className="text-gray-400">Stay updated with blood donation requests</p>
      </div>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-red-600" />
          <h3 className="text-2xl font-bold text-red-600">Notification Center</h3>
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
                    <Bell className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">{notif.title}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                    {notif.emergencyData && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="destructive">{notif.emergencyData.bloodType}</Badge>
                        <Badge variant="secondary">{notif.emergencyData.unitsRequired} units</Badge>
                        <Badge variant="outline">{notif.emergencyData.requesterName}</Badge>
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

        {/* Other Notifications */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Recent Updates</h4>
          
          {/* Donation Drive Announcement */}
          <Card className="glass-card-primary p-4 hover:border-red-500/50 transition-colors duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-white mb-1">New Donation Drive</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Community blood donation camp scheduled for next weekend at City Center.
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </Card>

          {/* Reward Claim Confirmation */}
          {claimedRewards.length > 0 && (
            <Card className="glass-card-primary p-4 hover:border-red-500/50 transition-colors duration-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-white mb-1">Reward Claimed!</h5>
                  <p className="text-sm text-muted-foreground mb-2">
                    You've successfully claimed your {claimedRewards[claimedRewards.length - 1]} badge.
                  </p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
            </Card>
          )}

          {/* System Update */}
          <Card className="glass-card-primary p-4 hover:border-red-500/50 transition-colors duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-white mb-1">System Update</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  New features added to track your donation impact in real-time.
                </p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </Card>

          {/* Welcome Message */}
          <Card className="glass-card-primary p-4 hover:border-red-500/50 transition-colors duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-white mb-1">Welcome to Vital Drop!</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Thank you for joining our life-saving community, {donor.name}. Your blood type {donor.bloodGroup} is valuable!
                </p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </Card>
        </div>

        {emergencyNotifications.length === 0 && (
          <div className="text-center py-8 mt-6 border-t border-red-500/20">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h4 className="text-lg font-semibold mb-2">No Emergency Alerts</h4>
            <p className="text-sm text-muted-foreground">
              You'll be notified immediately when a hospital needs your blood type.
            </p>
          </div>
        )}
      </Card>
    </DonorLayout>
  );
};

export default DonorNotifications;
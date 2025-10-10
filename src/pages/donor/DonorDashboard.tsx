import { Heart, MapPin, Calendar, Award, Bell } from 'lucide-react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { mockDonors } from '@/data/mockData';
import { toast } from 'sonner';

const DonorDashboard = () => {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  
  // Find donor data or use first donor as fallback
  const donor = mockDonors.find(d => d.id === user?.id) || mockDonors[0];
  
  const emergencyNotifications = notifications.filter(n => n.type === 'emergency' && !n.read);

  const handleRespond = (notifId: string) => {
    markAsRead(notifId);
    toast.success('Thank you for responding! Hospital has been notified.', {
      description: 'Your donation can save lives.'
    });
  };

  return (
    <DashboardLayout
      title="Donor Dashboard"
      subtitle="Your impact saves lives"
    >
      {/* Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="glass-card p-6 hover:box-glow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Blood Group</p>
              <p className="text-3xl font-bold mt-1 text-primary">{donor.bloodGroup}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 hover:box-glow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-semibold mt-1">{donor.city}</p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 hover:box-glow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last Donation</p>
              <p className="text-sm font-medium mt-1">{new Date(donor.lastDonationDate).toLocaleDateString()}</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 hover:box-glow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reputation Score</p>
              <p className="text-3xl font-bold mt-1 text-success">{donor.reputation}</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>
      </div>

      {/* Reputation Progress */}
      <Card className="glass-card p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Your Impact Level</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Reputation Score</span>
            <span className="font-bold text-success">{donor.reputation}/100</span>
          </div>
          <Progress value={donor.reputation} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            {donor.reputation >= 90 ? '⭐ Elite Donor Status' : 'Keep donating to increase your impact level'}
          </p>
        </div>
      </Card>

      {/* Emergency Notifications */}
      {emergencyNotifications.length > 0 && (
        <Card className="glass-card-primary p-6 mb-8 border-2 border-destructive/50 box-glow-strong animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-6 w-6 text-destructive animate-blink" />
            <h3 className="text-xl font-bold text-glow">🚨 Emergency Blood Requests</h3>
          </div>
          <div className="space-y-3">
            {emergencyNotifications.map(notif => (
              <div key={notif.id} className="glass-card p-4 border border-destructive/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{notif.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                    {notif.emergencyData && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="destructive">{notif.emergencyData.bloodType}</Badge>
                        <Badge variant="secondary">{notif.emergencyData.unitsRequired} units</Badge>
                        <Badge variant="outline">{notif.emergencyData.requesterName}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleRespond(notif.id)}
                      className="bg-success hover:bg-success/90 whitespace-nowrap"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Donate Now
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notif.id)}
                    >
                      Ignore
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {emergencyNotifications.length === 0 && (
        <Card className="glass-card p-8 text-center">
          <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">No Active Emergencies</h3>
          <p className="text-muted-foreground">
            You'll be notified immediately when a hospital needs your blood type.
          </p>
        </Card>
      )}

      {/* Donor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{donor.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{donor.email}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Availability Status</h3>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${donor.availability ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="font-medium">{donor.availability ? 'Available to Donate' : 'Not Available'}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {donor.availability 
              ? 'You can donate blood at any time'
              : 'You need to wait 3 months from your last donation'}
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;

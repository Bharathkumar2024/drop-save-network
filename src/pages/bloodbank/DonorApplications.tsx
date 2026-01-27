import { useState, useMemo } from 'react';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { mockDonors } from '@/data/mockData';
import { Send, CheckCircle, Clock, User, Phone, Mail, Droplet } from 'lucide-react';
import { toast } from 'sonner';
import { notificationService } from '@/services/NotificationService';

interface DonorApplication {
  id: string;
  donorId: string;
  donorName: string;
  bloodGroup: string;
  phone: string;
  email: string;
  appliedDate: string;
  status: 'pending' | 'selected' | 'notified' | 'accepted';
  campDate?: string;
}

const DonorApplications = () => {
  // Generate mock applications from donors
  const [applications, setApplications] = useState<DonorApplication[]>(() =>
    mockDonors.map((donor, index) => ({
      id: `app-${donor.id}`,
      donorId: donor.id,
      donorName: donor.name,
      bloodGroup: donor.bloodGroup,
      phone: donor.phone,
      email: donor.email,
      appliedDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: index % 3 === 0 ? 'selected' : index % 3 === 1 ? 'notified' : 'pending',
    }))
  );

  const [selectedApp, setSelectedApp] = useState<DonorApplication | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [campDate, setCampDate] = useState('');
  const [campLocation, setCampLocation] = useState('');

  // Statistics
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === 'pending').length,
      selected: applications.filter((a) => a.status === 'selected').length,
      notified: applications.filter((a) => a.status === 'notified').length,
      accepted: applications.filter((a) => a.status === 'accepted').length,
    };
  }, [applications]);

  const handleSelectDonor = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: 'selected' as const } : app
      )
    );
    toast.success('Donor selected for camp');
  };

  const handleSendNotification = () => {
    if (!selectedApp || !campDate || !campLocation) {
      toast.error('Please fill all fields');
      return;
    }

    const message = `Your application is selected! Please come to the camp on ${campDate} at ${campLocation}. Time: 9:00 AM - 4:00 PM`;

    // Send "Real World" Notification via Service
    notificationService.sendCampInvitation(
      selectedApp.donorName,
      selectedApp.phone,
      selectedApp.email,
      { date: campDate, location: campLocation }
    );

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApp.id
          ? { ...app, status: 'notified' as const, campDate }
          : app
      )
    );

    toast.success(`Notification sent to ${selectedApp.donorName} via SMS & Email`);
    setSelectedApp(null);
    setNotificationMessage('');
    setCampDate('');
    setCampLocation('');
  };

  const handleDonorAccept = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: 'accepted' as const } : app
      )
    );
    toast.success('Donor accepted the invitation!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'selected':
        return <Badge className="bg-blue-500">Selected</Badge>;
      case 'notified':
        return <Badge className="bg-orange-500">Notified</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <BloodBankLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-glow mb-2">
          Donor Applications
        </h1>
        <p className="text-muted-foreground">
          Manage donor applications and send camp notifications
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Total Applications</p>
          <p className="text-2xl font-bold text-glow mt-1">{stats.total}</p>
        </Card>
        <Card className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{stats.pending}</p>
        </Card>
        <Card className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Selected</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{stats.selected}</p>
        </Card>
        <Card className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Notified</p>
          <p className="text-2xl font-bold text-purple-500 mt-1">{stats.notified}</p>
        </Card>
        <Card className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Accepted</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{stats.accepted}</p>
        </Card>
      </div>

      {/* Applications List */}
      <Card className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6 text-glow">Donor Applications</h2>

        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="glass-card-primary p-4 rounded-lg border border-border/50 hover:border-red-500/50 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                {/* Donor Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-semibold">{app.donorName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="destructive" className="text-xs">
                          {app.bloodGroup}
                        </Badge>
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{app.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">{app.email}</span>
                  </div>
                </div>

                {/* Applied Date */}
                <div>
                  <p className="text-xs text-muted-foreground">Applied On</p>
                  <p className="font-medium text-sm">
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Camp Date (if notified) */}
                <div>
                  {app.campDate && (
                    <>
                      <p className="text-xs text-muted-foreground">Camp Date</p>
                      <p className="font-medium text-sm text-green-500">{app.campDate}</p>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  {app.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectDonor(app.id)}
                      className="hover:bg-blue-500/20"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Select
                    </Button>
                  )}

                  {app.status === 'selected' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                          className="hover:bg-green-500/20"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Notify
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card">
                        <DialogHeader>
                          <DialogTitle>Send Camp Notification</DialogTitle>
                          <DialogDescription>
                            Send notification to {app.donorName} about the camp details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="campDate">Camp Date</Label>
                            <Input
                              id="campDate"
                              type="date"
                              value={campDate}
                              onChange={(e) => setCampDate(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="campLocation">Camp Location</Label>
                            <Input
                              id="campLocation"
                              placeholder="e.g., Community Center, Metro City"
                              value={campLocation}
                              onChange={(e) => setCampLocation(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message Preview</Label>
                            <Textarea
                              id="message"
                              value={`Your application is selected! Please come to the camp on ${campDate || '[Date]'} at ${campLocation || '[Location]'}. Time: 9:00 AM - 4:00 PM`}
                              readOnly
                              className="mt-1"
                              rows={4}
                            />
                          </div>
                          <Button
                            onClick={handleSendNotification}
                            className="w-full bg-gradient-primary"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Notification
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {app.status === 'notified' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDonorAccept(app.id)}
                      className="hover:bg-green-500/20"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Accepted
                    </Button>
                  )}

                  {app.status === 'accepted' && (
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </BloodBankLayout>
  );
};

export default DonorApplications;
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EmergencyButton = () => {
  const [open, setOpen] = useState(false);
  const [bloodType, setBloodType] = useState('');
  const [units, setUnits] = useState('');
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bloodType || !units) {
      toast.error('Please fill all fields');
      return;
    }

    // Create emergency notification
    const emergencyData = {
      id: `er-${Date.now()}`,
      requesterId: user?.id || '',
      requesterType: (user?.role === 'bloodbank' ? 'bloodBank' : user?.role || 'hospital') as 'hospital' | 'bloodBank',
      requesterName: user?.name || '',
      bloodType,
      unitsRequired: parseInt(units),
      timestamp: new Date().toISOString(),
      status: 'active' as const,
      acknowledgements: []
    };

    // Broadcast notification (in real app, this would be sent to all donors and blood banks)
    addNotification({
      type: 'emergency',
      title: '🚨 EMERGENCY BLOOD REQUEST',
      message: `${user?.name} needs ${units} units of ${bloodType} blood urgently!`,
      emergencyData
    });

    toast.success('Emergency request broadcasted!', {
      description: 'Donors and blood banks have been notified'
    });

    setOpen(false);
    setBloodType('');
    setUnits('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="fixed top-4 right-4 z-50 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold animate-pulse box-glow-strong"
        >
          <AlertTriangle className="h-5 w-5 mr-2 animate-blink" />
          EMERGENCY REQUEST
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-glow flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive animate-pulse" />
            Emergency Blood Request
          </DialogTitle>
          <DialogDescription>
            This will send an urgent notification to all available donors and blood banks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="bloodType">Blood Type Required *</Label>
            <Select value={bloodType} onValueChange={setBloodType}>
              <SelectTrigger id="bloodType" className="mt-1">
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="units">Units Required *</Label>
            <Input
              id="units"
              type="number"
              min="1"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              placeholder="Enter number of units"
              className="mt-1"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Send Emergency Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyButton;

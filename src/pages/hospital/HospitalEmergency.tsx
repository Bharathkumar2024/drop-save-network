import { useState } from 'react';
import { AlertCircle, Send, Users } from 'lucide-react';
import HospitalLayout from '@/components/hospital/HospitalLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';
import { mockHospitals } from '@/data/mockData';
import { socketService } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';
import { hospitalAPI } from '@/lib/api';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const HospitalEmergency = () => {
  const hospital = mockHospitals[0];
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const { user } = useAuth();

  const [bloodGroup, setBloodGroup] = useState('');
  const [unitsNeeded, setUnitsNeeded] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get patients needing blood
  const patientsNeedingBlood = hospital.patients.filter(p => p.status === 'requesting');

  const handleEmergencyRequest = async () => {
    if (!bloodGroup || !unitsNeeded) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get hospital ID from user context or use mock hospital
      const hospitalId = user?.id || hospital.id;

      // Call the backend API to create emergency
      const emergency = await hospitalAPI.createEmergency(hospitalId, {
        bloodType: bloodGroup,
        unitsNeeded: parseInt(unitsNeeded),
        urgencyLevel: 'High'
      });

      console.log('Emergency created:', emergency);

      // Create emergency data for socket broadcast (fallback for mock mode)
      const emergencyData = {
        emergency: {
          id: emergency._id || emergency.id || `emergency-${Date.now()}`,
          hospitalId: hospitalId,
          hospitalName: user?.name || hospital.name,
          bloodType: bloodGroup,
          unitsNeeded: parseInt(unitsNeeded),
          unitsRequired: parseInt(unitsNeeded),
          status: 'active',
          createdAt: new Date().toISOString(),
          requesterName: user?.name || hospital.name,
          city: hospital.location?.split(',')[0] || 'Unknown',
          location: user?.location || hospital.location,
        }
      };

      // Broadcast emergency via socket (for mock mode or additional notification)
      socketService.send('emergency.created', emergencyData);

      // Trigger local notification for hospital
      addNotification({
        type: 'emergency',
        title: '🚨 Emergency Alert Sent',
        message: `Emergency request for ${bloodGroup} blood (${unitsNeeded} units) has been sent to all blood banks and donors.`
      });

      toast({
        title: '✅ Emergency Alert Sent',
        description: `Blood banks and donors have been notified about your ${bloodGroup} blood request.`,
      });

      // Reset form
      setBloodGroup('');
      setUnitsNeeded('');
    } catch (error: any) {
      console.error('Error creating emergency:', error);
      toast({
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to send emergency alert. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HospitalLayout>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-glow mb-2 md:mb-3 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-destructive animate-pulse" />
            Emergency Blood Request
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Send urgent blood requests to all connected blood banks and donors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Request Form */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Send className="h-6 w-6 text-destructive" />
              Send Emergency Alert
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="bloodGroup" className="text-base">Blood Group Required *</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        <span className="font-semibold">{type}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unitsNeeded" className="text-base">Units Needed *</Label>
                <Input
                  id="unitsNeeded"
                  type="number"
                  min="1"
                  placeholder="Enter number of units"
                  value={unitsNeeded}
                  onChange={(e) => setUnitsNeeded(e.target.value)}
                  className="mt-2 h-12"
                />
              </div>

              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <p className="text-sm text-destructive font-semibold mb-2">⚠️ Emergency Alert</p>
                <p className="text-sm text-muted-foreground">
                  This will send immediate notifications to:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>• All connected blood banks</li>
                  <li>• All registered donors in the area</li>
                  <li>• Emergency response teams</li>
                </ul>
              </div>

              <Button
                onClick={handleEmergencyRequest}
                disabled={isSubmitting || !bloodGroup || !unitsNeeded}
                className="w-full h-12 text-lg font-bold bg-destructive hover:bg-destructive/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Sending Alert...
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Send Emergency Alert
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Patients Needing Blood */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Patients Needing Blood
            </h2>

            {patientsNeedingBlood.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-success" />
                </div>
                <p className="text-muted-foreground">No urgent blood requests at the moment</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {patientsNeedingBlood.map(patient => (
                  <div
                    key={patient.id}
                    className="glass-card-primary p-4 rounded-lg border border-border/50 hover:border-destructive/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">Age: {patient.age} • Room: {patient.roomNo}</p>
                      </div>
                      <Badge variant="destructive" className="animate-pulse">
                        Urgent
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Blood Type</p>
                        <Badge variant="destructive" className="mt-1">{patient.bloodTypeNeeded}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Units Required</p>
                        <p className="font-bold text-lg">{patient.unitsRequired}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Case</p>
                      <p className="text-sm font-medium">{patient.case}</p>
                    </div>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full mt-3"
                      onClick={() => {
                        setBloodGroup(patient.bloodTypeNeeded);
                        setUnitsNeeded(patient.unitsRequired.toString());
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Quick Emergency Request
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Emergency Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Emergencies</p>
                <p className="text-3xl font-bold mt-1">24</p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </div>
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-3xl font-bold mt-1">12m</p>
                <p className="text-xs text-success mt-1">↓ 3m faster</p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <Send className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold mt-1">96%</p>
                <p className="text-xs text-success mt-1">↑ 2% increase</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </HospitalLayout>
  );
};

export default HospitalEmergency;
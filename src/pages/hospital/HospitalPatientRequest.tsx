import { useState } from 'react';
import { Users, Send, Building2, CheckCircle } from 'lucide-react';
import HospitalLayout from '@/components/hospital/HospitalLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';
import { mockBloodBanks } from '@/data/mockData';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface PatientRequest {
  id: string;
  name: string;
  age: string;
  bloodGroup: string;
  unitsNeeded: string;
  bloodBankName: string;
  status: 'requesting' | 'received';
  timestamp: string;
}

const HospitalPatientRequest = () => {
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [unitsNeeded, setUnitsNeeded] = useState('');
  const [selectedBloodBank, setSelectedBloodBank] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientRequests, setPatientRequests] = useState<PatientRequest[]>([]);

  // Get nearby blood banks (mock data)
  const nearbyBloodBanks = mockBloodBanks;

  const handleSubmitRequest = async () => {
    if (!patientName || !patientAge || !bloodGroup || !unitsNeeded || !selectedBloodBank) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const selectedBank = nearbyBloodBanks.find(bank => bank.id === selectedBloodBank);
      
      // Create new request
      const newRequest: PatientRequest = {
        id: `req-${Date.now()}`,
        name: patientName,
        age: patientAge,
        bloodGroup,
        unitsNeeded,
        bloodBankName: selectedBank?.name || 'Unknown',
        status: 'requesting',
        timestamp: new Date().toISOString()
      };

      // Add to requests list
      setPatientRequests(prev => [newRequest, ...prev]);

      // Send notification to blood bank
      addNotification({
        type: 'info',
        title: '📤 Blood Request Sent',
        message: `Request for ${bloodGroup} blood sent to ${selectedBank?.name}`
      });

      toast({
        title: '✅ Request Submitted',
        description: `Blood request for ${patientName} has been sent to ${selectedBank?.name}`,
      });

      // Reset form
      setPatientName('');
      setPatientAge('');
      setBloodGroup('');
      setUnitsNeeded('');
      setSelectedBloodBank('');
      setIsSubmitting(false);
    }, 1500);
  };

  const markAsReceived = (requestId: string) => {
    setPatientRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'received' } : req
      )
    );

    toast({
      title: '✅ Blood Received',
      description: 'Patient record updated successfully',
    });
  };

  return (
    <HospitalLayout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-glow mb-3 flex items-center gap-3">
            <Users className="h-10 w-10 text-primary" />
            Patient Blood Request
          </h1>
          <p className="text-lg text-muted-foreground">
            Request blood from connected blood banks for patient treatment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Request Form */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Send className="h-6 w-6 text-primary" />
              New Blood Request
            </h2>

            <div className="space-y-5">
              <div>
                <Label htmlFor="patientName" className="text-base">Patient Name *</Label>
                <Input
                  id="patientName"
                  placeholder="Enter patient full name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <Label htmlFor="patientAge" className="text-base">Patient Age *</Label>
                <Input
                  id="patientAge"
                  type="number"
                  min="1"
                  placeholder="Enter patient age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <Label htmlFor="bloodGroup" className="text-base">Blood Group Required *</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger className="mt-2 h-11">
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
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <Label htmlFor="bloodBank" className="text-base">Select Blood Bank *</Label>
                <Select value={selectedBloodBank} onValueChange={setSelectedBloodBank}>
                  <SelectTrigger className="mt-2 h-11">
                    <SelectValue placeholder="Choose nearby blood bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {nearbyBloodBanks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{bank.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {bank.location}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSubmitRequest}
                disabled={isSubmitting || !patientName || !patientAge || !bloodGroup || !unitsNeeded || !selectedBloodBank}
                className="w-full h-12 text-lg font-bold"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Blood Request
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Nearby Blood Banks */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-accent" />
              Nearby Blood Banks
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {nearbyBloodBanks.map(bank => (
                <div
                  key={bank.id}
                  className="glass-card-primary p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => setSelectedBloodBank(bank.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold">{bank.name}</h3>
                        <p className="text-sm text-muted-foreground">{bank.location}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {bank.reputationScore}% Rating
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Blood Units</p>
                      <p className="font-bold">
                        {bank.preservationList.reduce((sum, unit) => sum + unit.unitsAvailable, 0)} units
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-bold text-success">{bank.successRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Patient Requests History */}
        <Card className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Patient Blood Requests
          </h2>

          {patientRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No blood requests yet. Submit a request above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientRequests.map(request => (
                <div
                  key={request.id}
                  className="glass-card-primary p-5 rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{request.name}</h3>
                      <p className="text-sm text-muted-foreground">Age: {request.age}</p>
                    </div>
                    <Badge variant={request.status === 'requesting' ? 'destructive' : 'success'}>
                      {request.status === 'requesting' ? '🔴 Requesting' : '🟢 Received'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Blood Type</p>
                      <Badge variant="destructive" className="mt-1">{request.bloodGroup}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Units Needed</p>
                      <p className="font-bold text-lg">{request.unitsNeeded}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Blood Bank</p>
                      <p className="font-medium">{request.bloodBankName}</p>
                    </div>
                  </div>

                  {request.status === 'requesting' && (
                    <Button
                      size="sm"
                      variant="success"
                      className="w-full"
                      onClick={() => markAsReceived(request.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Received
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default HospitalPatientRequest;
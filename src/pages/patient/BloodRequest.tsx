import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplet, Phone, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { patientAPI } from '@/lib/api';

const BloodRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [nearbyBloodBanks, setNearbyBloodBanks] = useState<any[]>([]);
  const [showBloodBanks, setShowBloodBanks] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodGroup: '',
    unitsNeeded: '',
    phone: '',
    urgencyLevel: 'Medium',
    hospitalPreference: '',
    additionalNotes: '',
  });

  useEffect(() => {
    // Check if user is authenticated and is a patient
    if (!isAuthenticated || !user || user.role !== 'patient') {
      navigate('/patient/auth');
      return;
    }
    
    // Pre-fill form with patient data
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      age: user.age?.toString() || '',
      bloodGroup: user.bloodGroup || '',
      phone: user.phone || '',
    }));

    // Fetch nearby blood banks (using mock ID for now)
    if (user._id) {
      fetchNearbyBloodBanks(user._id);
    }
  }, [isAuthenticated, user, navigate]);

  const fetchNearbyBloodBanks = async (patientId: string) => {
    try {
      const response = await patientAPI.getNearbyBloodBanks(patientId);
      setNearbyBloodBanks(response.bloodBanks || []);
    } catch (error) {
      console.error('Error fetching nearby blood banks:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Patient data not found. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await patientAPI.createBloodRequest(user._id || 'mock-patient-id', {
        bloodGroup: formData.bloodGroup,
        unitsNeeded: parseInt(formData.unitsNeeded),
        urgencyLevel: formData.urgencyLevel,
        hospitalPreference: formData.hospitalPreference,
        additionalNotes: formData.additionalNotes,
      });

      toast({
        title: "Blood Request Submitted!",
        description: "Nearby blood banks have been notified of your request.",
      });

      // Show nearby blood banks
      setShowBloodBanks(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit blood request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="min-h-screen bg-background bg-blood-pattern lg:ml-64 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/patient/dashboard')}
            className="mb-4 hover:bg-red-600/20 text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-glow mb-2">Blood Request Form</h1>
          <p className="text-muted-foreground">Fill in the details to request blood from nearby blood banks</p>
        </div>

        {/* Blood Request Form */}
        <Card className="p-6 glass-card-primary box-glow mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>

              {/* Age */}
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                />
              </div>

              {/* Blood Group */}
              <div>
                <Label htmlFor="bloodGroup">Blood Group *</Label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Units Needed */}
              <div>
                <Label htmlFor="unitsNeeded">Blood Units Needed *</Label>
                <Input
                  id="unitsNeeded"
                  name="unitsNeeded"
                  type="number"
                  value={formData.unitsNeeded}
                  onChange={handleChange}
                  required
                  placeholder="Enter units needed"
                  min="1"
                  max="20"
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Urgency Level */}
              <div>
                <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                <select
                  id="urgencyLevel"
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {urgencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital Preference */}
              <div className="md:col-span-2">
                <Label htmlFor="hospitalPreference">Hospital Preference (Optional)</Label>
                <Input
                  id="hospitalPreference"
                  name="hospitalPreference"
                  value={formData.hospitalPreference}
                  onChange={handleChange}
                  placeholder="Enter preferred hospital name"
                />
              </div>

              {/* Additional Notes */}
              <div className="md:col-span-2">
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any additional information..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
            >
              {loading ? 'Submitting...' : 'Submit Blood Request'}
            </Button>
          </form>
        </Card>

        {/* Nearby Blood Banks */}
        {showBloodBanks && nearbyBloodBanks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-glow mb-4">Nearby Blood Banks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyBloodBanks.map((bank) => (
                <Card key={bank._id} className="p-6 glass-card-primary box-glow hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-lg box-glow">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-2">{bank.name}</h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{bank.location}, {bank.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{bank.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplet className="w-4 h-4" />
                          <span>Blood Bank ID: {bank.bankId}</span>
                        </div>
                      </div>

                      <a href={`tel:${bank.contactPhone}`}>
                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Blood Bank
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {showBloodBanks && nearbyBloodBanks.length === 0 && (
          <Card className="p-6 glass-card-primary box-glow text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Blood Banks Found</h3>
            <p className="text-muted-foreground">There are no blood banks in your area at the moment.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BloodRequest;
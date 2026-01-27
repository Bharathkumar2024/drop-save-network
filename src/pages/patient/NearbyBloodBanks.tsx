import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, MapPin, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { patientAPI } from '@/lib/api';

const NearbyBloodBanks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is authenticated and is a patient
    if (!isAuthenticated || !user || user.role !== 'patient') {
      navigate('/patient/auth');
      return;
    }
    
    // Fetch nearby blood banks
    if (user._id) {
      fetchNearbyBloodBanks(user._id);
    }
  }, [isAuthenticated, user, navigate]);

  const fetchNearbyBloodBanks = async (patientId: string) => {
    setLoading(true);
    try {
      const response = await patientAPI.getNearbyBloodBanks(patientId);
      setBloodBanks(response.bloodBanks || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch nearby blood banks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-blood-pattern lg:ml-64 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold text-glow mb-2">Nearby Blood Banks</h1>
          <p className="text-muted-foreground">
            Blood banks in {user?.city || 'your area'} ready to help
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Blood Banks List */}
        {!loading && bloodBanks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bloodBanks.map((bank) => (
              <Card key={bank._id} className="p-6 glass-card-primary box-glow hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-red-600 to-red-800 rounded-lg box-glow">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-3">{bank.name}</h3>
                    
                    <div className="space-y-3 mb-4">
                      {/* Location */}
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm">{bank.location}</p>
                          <p className="text-sm">{bank.city}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Contact</p>
                          <p className="text-sm">{bank.contactPhone}</p>
                        </div>
                      </div>

                      {/* Email */}
                      {bank.contactEmail && (
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm">{bank.contactEmail}</p>
                          </div>
                        </div>
                      )}

                      {/* Operating Hours */}
                      {bank.operatingHours && (
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Operating Hours</p>
                            <p className="text-sm">{bank.operatingHours}</p>
                          </div>
                        </div>
                      )}

                      {/* Bank ID */}
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">Bank ID: {bank.bankId}</p>
                      </div>
                    </div>

                    {/* Call Button */}
                    <a href={`tel:${bank.contactPhone}`} className="block">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Blood Bank
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && bloodBanks.length === 0 && (
          <Card className="p-12 glass-card-primary box-glow text-center">
            <div className="max-w-md mx-auto">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Blood Banks Found
              </h3>
              <p className="text-muted-foreground mb-6">
                There are no blood banks registered in {user?.city || 'your area'} at the moment.
                Please check back later or contact nearby hospitals.
              </p>
              <Button
                onClick={() => navigate('/patient/dashboard')}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
              >
                Back to Dashboard
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NearbyBloodBanks;
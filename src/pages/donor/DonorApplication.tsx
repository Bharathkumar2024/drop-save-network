import { useState, useEffect, useMemo } from 'react';
import { MapPin, Calendar, Clock, Navigation, CheckCircle, AlertCircle } from 'lucide-react';
import DonorLayout from '@/components/donor/DonorLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { mockDonors, mockBloodBanks } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface BloodCamp {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  date: string;
  time: string;
  distance?: number;
}

const DonorApplication = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Find donor data
  const donor = useMemo(() => 
    mockDonors.find(d => d.id === user?.id) || mockDonors[0],
    [user?.id]
  );

  // Form state
  const [formData, setFormData] = useState({
    name: donor.name,
    bloodGroup: donor.bloodGroup,
    phone: donor.phone,
    email: donor.email,
    age: '',
    weight: '',
    gender: '',
    occupation: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    pulse: '',
    hb: '',
    bp: '',
    temperature: '',
    lastDonation: donor.lastDonationDate,
    hasDonatedBefore: false,
    medicalConditions: '',
    location: '',
  });

  // Medical history checkboxes
  const [recentProcedures, setRecentProcedures] = useState({
    tattooing: false,
    earPiercing: false,
    dentalExtraction: false,
  });

  const [diseases, setDiseases] = useState({
    heartDisease: false,
    cancer: false,
    diabetes: false,
    hepatitis: false,
    std: false,
    typhoid: false,
    lungDisease: false,
    tuberculosis: false,
    allergicDisease: false,
    kidneyDisease: false,
    epilepsy: false,
    bleedingTendency: false,
    jaundice: false,
    malaria: false,
    faintingSpells: false,
  });

  const [medications, setMedications] = useState({
    antibiotics: false,
    steroids: false,
    aspirin: false,
    vaccinations: false,
    alcohol: false,
    dogBite: false,
    rabiesVaccine: false,
  });

  const [surgeryHistory, setSurgeryHistory] = useState({
    majorSurgery: false,
    minorSurgery: false,
    bloodTransfusion: false,
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationDetecting, setLocationDetecting] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<string | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState<string | null>(null);

  // Mock blood camps with coordinates
  const bloodCamps: BloodCamp[] = useMemo(() => [
    {
      id: 'camp1',
      name: 'Central Blood Bank - Main Camp',
      location: 'Central District, Metro City',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      date: '2025-11-09',
      time: '9:00 AM - 4:00 PM',
    },
    {
      id: 'camp2',
      name: 'City General Hospital Blood Drive',
      location: 'Downtown, Metro City',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      date: '2025-11-14',
      time: '10:00 AM - 3:00 PM',
    },
    {
      id: 'camp3',
      name: 'Community Health Center Camp',
      location: 'Westside, Metro City',
      coordinates: { lat: 40.7489, lng: -73.9680 },
      date: '2025-11-23',
      time: '9:00 AM - 4:00 PM',
    },
    {
      id: 'camp4',
      name: 'Metro Medical Center Blood Camp',
      location: 'Eastside, Metro City',
      coordinates: { lat: 40.7282, lng: -73.9942 },
      date: '2025-11-28',
      time: '8:00 AM - 2:00 PM',
    },
  ], []);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get nearby camps sorted by distance
  const nearbyCamps = useMemo(() => {
    if (!userLocation) return bloodCamps;

    const campsWithDistance = bloodCamps.map(camp => ({
      ...camp,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        camp.coordinates.lat,
        camp.coordinates.lng
      ),
    }));

    return campsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [userLocation, bloodCamps]);

  // Detect user location
  const detectLocation = () => {
    setLocationDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setFormData(prev => ({
            ...prev,
            location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          }));
          setLocationDetecting(false);
          toast({
            title: "Location Detected",
            description: "Your location has been detected successfully!",
          });
        },
        (error) => {
          console.error('Error detecting location:', error);
          // Use mock location for demo
          const mockLat = 40.7128;
          const mockLng = -74.0060;
          setUserLocation({ lat: mockLat, lng: mockLng });
          setFormData(prev => ({
            ...prev,
            location: `Metro City (Demo Location)`,
          }));
          setLocationDetecting(false);
          toast({
            title: "Demo Location Used",
            description: "Using demo location for testing purposes.",
          });
        }
      );
    } else {
      // Use mock location
      const mockLat = 40.7128;
      const mockLng = -74.0060;
      setUserLocation({ lat: mockLat, lng: mockLng });
      setFormData(prev => ({
        ...prev,
        location: `Metro City (Demo Location)`,
      }));
      setLocationDetecting(false);
      toast({
        title: "Demo Location Used",
        description: "Geolocation not supported. Using demo location.",
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle camp selection
  const handleCampSelect = (campId: string) => {
    setSelectedCamp(campId);
  };

  // Submit application
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCamp) {
      toast({
        title: "No Camp Selected",
        description: "Please select a blood camp to apply.",
        variant: "destructive",
      });
      return;
    }

    // Validate form - check all required fields
    if (!formData.age || !formData.weight || !formData.gender || 
        !formData.address || !formData.city || !formData.state || !formData.postalCode) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check eligibility
    const age = parseInt(formData.age);
    const weight = parseInt(formData.weight);
    
    if (age < 18 || age > 65) {
      setEligibilityMessage("Sorry, you are not eligible. Age must be between 18-65 years.");
      setApplicationSubmitted(true);
      return;
    }

    if (weight < 50) {
      setEligibilityMessage("Sorry, you are not eligible. Minimum weight requirement is 50 kg.");
      setApplicationSubmitted(true);
      return;
    }

    // Check last donation date (3 months for males, 4 months for females)
    const lastDonation = new Date(formData.lastDonation);
    const today = new Date();
    const monthsDiff = (today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    // Gender-based waiting period
    const requiredMonths = formData.gender.toLowerCase() === 'female' ? 4 : 3;
    
    if (monthsDiff < requiredMonths) {
      setEligibilityMessage(`Sorry, you must wait ${requiredMonths} months between donations. You can donate again after ${new Date(lastDonation.getTime() + requiredMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}.`);
      setApplicationSubmitted(true);
      return;
    }

    // Check for disqualifying medical conditions
    const hasCriticalDisease = diseases.heartDisease || diseases.cancer || diseases.hepatitis || 
                                diseases.std || diseases.tuberculosis || diseases.kidneyDisease || 
                                diseases.epilepsy;
    
    if (hasCriticalDisease) {
      setEligibilityMessage("Sorry, you are not eligible due to medical history. Please consult with a healthcare professional.");
      setApplicationSubmitted(true);
      return;
    }

    // Check for recent procedures (within 6 months)
    if (recentProcedures.tattooing || recentProcedures.earPiercing) {
      setEligibilityMessage("Sorry, you must wait 6 months after tattooing or ear piercing before donating blood.");
      setApplicationSubmitted(true);
      return;
    }

    // Check for recent medications (within 72 hours)
    if (medications.antibiotics || medications.aspirin) {
      setEligibilityMessage("Sorry, you must wait 72 hours after taking antibiotics or aspirin before donating blood.");
      setApplicationSubmitted(true);
      return;
    }

    // Check for recent surgery or transfusion (within 6 months)
    if (surgeryHistory.majorSurgery || surgeryHistory.bloodTransfusion) {
      setEligibilityMessage("Sorry, you must wait 6 months after major surgery or blood transfusion before donating blood.");
      setApplicationSubmitted(true);
      return;
    }

    // Application successful
    const selectedCampData = nearbyCamps.find(c => c.id === selectedCamp);
    setEligibilityMessage(`Congratulations! Your application has been approved. Please visit ${selectedCampData?.name} on ${selectedCampData?.date} at ${selectedCampData?.time}. You will receive a confirmation message shortly.`);
    setApplicationSubmitted(true);

    toast({
      title: "Application Submitted",
      description: "Your application has been sent to the blood center!",
    });
  };

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  if (applicationSubmitted) {
    return (
      <DonorLayout>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Application Status</h1>
          <p className="text-gray-400">Your application has been processed</p>
        </div>

        <Card className="glass-card p-8 text-center">
          {eligibilityMessage?.includes('Congratulations') ? (
            <>
              <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-green-500 mb-4">Application Approved!</h2>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-500 mb-4">Not Eligible</h2>
            </>
          )}
          
          <p className="text-lg text-gray-300 mb-8">{eligibilityMessage}</p>

          <Button
            onClick={() => {
              setApplicationSubmitted(false);
              setEligibilityMessage(null);
              setSelectedCamp(null);
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Submit Another Application
          </Button>
        </Card>
      </DonorLayout>
    );
  }

  return (
    <DonorLayout>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Apply for Blood Camp</h1>
        <p className="text-gray-400">Fill out the form and find nearby blood camps</p>
      </div>

      {/* Location Detection */}
      <Card className="glass-card p-6 mb-8 border border-red-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="text-lg font-bold text-white">Your Location</h3>
              <p className="text-sm text-gray-400">
                {formData.location || 'Location not detected'}
              </p>
            </div>
          </div>
          <Button
            onClick={detectLocation}
            disabled={locationDetecting}
            className="bg-red-600 hover:bg-red-700"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {locationDetecting ? 'Detecting...' : 'Detect Location'}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Form */}
        <div className="space-y-6">
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-6">📋 Blood Donation Application Form</h2>
            <p className="text-sm text-yellow-400 mb-4">⚠️ Confidential - Please answer all questions correctly</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Personal Information</h3>
                
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="18-65"
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      disabled
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Address Line 2 (Optional)"
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City *"
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State *"
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal Code *"
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Vital Signs</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="Min 50 kg"
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pulse">Pulse (bpm)</Label>
                    <Input
                      id="pulse"
                      name="pulse"
                      value={formData.pulse}
                      onChange={handleInputChange}
                      placeholder="e.g., 72"
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="hb">Haemoglobin (Hb)</Label>
                    <Input
                      id="hb"
                      name="hb"
                      value={formData.hb}
                      onChange={handleInputChange}
                      placeholder="e.g., 13.5"
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bp">Blood Pressure</Label>
                    <Input
                      id="bp"
                      name="bp"
                      value={formData.bp}
                      onChange={handleInputChange}
                      placeholder="e.g., 120/80"
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Input
                      id="temperature"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      placeholder="e.g., 98.6"
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Donation History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Donation History</h3>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="hasDonatedBefore"
                    checked={formData.hasDonatedBefore}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, hasDonatedBefore: checked as boolean }))
                    }
                    className="border-gray-600"
                  />
                  <Label htmlFor="hasDonatedBefore" className="cursor-pointer">
                    Have you donated blood previously?
                  </Label>
                </div>

                {formData.hasDonatedBefore && (
                  <div>
                    <Label htmlFor="lastDonation">Last Donation Date *</Label>
                    <Input
                      id="lastDonation"
                      name="lastDonation"
                      type="date"
                      value={formData.lastDonation}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                )}
              </div>

              {/* Recent Procedures */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Recent Procedures (Last 6 Months)
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="tattooing"
                      checked={recentProcedures.tattooing}
                      onCheckedChange={(checked) => 
                        setRecentProcedures(prev => ({ ...prev, tattooing: checked as boolean }))
                      }
                      className="border-gray-600"
                    />
                    <Label htmlFor="tattooing" className="cursor-pointer">Tattooing</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="earPiercing"
                      checked={recentProcedures.earPiercing}
                      onCheckedChange={(checked) => 
                        setRecentProcedures(prev => ({ ...prev, earPiercing: checked as boolean }))
                      }
                      className="border-gray-600"
                    />
                    <Label htmlFor="earPiercing" className="cursor-pointer">Ear Piercing</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="dentalExtraction"
                      checked={recentProcedures.dentalExtraction}
                      onCheckedChange={(checked) => 
                        setRecentProcedures(prev => ({ ...prev, dentalExtraction: checked as boolean }))
                      }
                      className="border-gray-600"
                    />
                    <Label htmlFor="dentalExtraction" className="cursor-pointer">Dental Extraction</Label>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Medical History - Do you suffer from or have suffered from any of the following?
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'heartDisease', label: 'Heart Disease' },
                    { key: 'cancer', label: 'Cancer/Malignant Disease' },
                    { key: 'diabetes', label: 'Diabetes' },
                    { key: 'hepatitis', label: 'Hepatitis B/C' },
                    { key: 'std', label: 'Sexually Transmitted Diseases' },
                    { key: 'typhoid', label: 'Typhoid (last one year)' },
                    { key: 'lungDisease', label: 'Lung Disease' },
                    { key: 'tuberculosis', label: 'Tuberculosis' },
                    { key: 'allergicDisease', label: 'Allergic Disease' },
                    { key: 'kidneyDisease', label: 'Kidney Disease' },
                    { key: 'epilepsy', label: 'Epilepsy' },
                    { key: 'bleedingTendency', label: 'Abnormal Bleeding Tendency' },
                    { key: 'jaundice', label: 'Jaundice (last one year)' },
                    { key: 'malaria', label: 'Malaria (six months)' },
                    { key: 'faintingSpells', label: 'Fainting Spells' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-3">
                      <Checkbox
                        id={key}
                        checked={diseases[key as keyof typeof diseases]}
                        onCheckedChange={(checked) => 
                          setDiseases(prev => ({ ...prev, [key]: checked as boolean }))
                        }
                        className="border-gray-600"
                      />
                      <Label htmlFor={key} className="cursor-pointer text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Medications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Recent Medications (Past 72 Hours)
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'antibiotics', label: 'Antibiotics' },
                    { key: 'steroids', label: 'Steroids' },
                    { key: 'aspirin', label: 'Aspirin' },
                    { key: 'vaccinations', label: 'Vaccinations' },
                    { key: 'alcohol', label: 'Alcohol' },
                    { key: 'dogBite', label: 'Dog Bite' },
                    { key: 'rabiesVaccine', label: 'Rabies Vaccine (1 year)' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-3">
                      <Checkbox
                        id={key}
                        checked={medications[key as keyof typeof medications]}
                        onCheckedChange={(checked) => 
                          setMedications(prev => ({ ...prev, [key]: checked as boolean }))
                        }
                        className="border-gray-600"
                      />
                      <Label htmlFor={key} className="cursor-pointer text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Surgery History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Surgery/Transfusion History (Past 6 Months)
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="majorSurgery"
                      checked={surgeryHistory.majorSurgery}
                      onCheckedChange={(checked) => 
                        setSurgeryHistory(prev => ({ ...prev, majorSurgery: checked as boolean }))
                      }
                      className="border-gray-600"
                    />
                    <Label htmlFor="majorSurgery" className="cursor-pointer">Major Surgery</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="minorSurgery"
                      checked={surgeryHistory.minorSurgery}
                      onCheckedChange={(checked) => 
                        setSurgeryHistory(prev => ({ ...prev, minorSurgery: checked as boolean }))
                      }
                      className="border-gray-600"
                    />
                    <Label htmlFor="minorSurgery" className="cursor-pointer">Minor Surgery</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="bloodTransfusion"
                      checked={surgeryHistory.bloodTransfusion}
                      onCheckedChange={(checked) => 
                        setSurgeryHistory(prev => ({ ...prev, bloodTransfusion: checked as boolean }))
                      }
                      className="border-gray-600"
                    />
                    <Label htmlFor="bloodTransfusion" className="cursor-pointer">Blood Transfusion</Label>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Additional Medical Information
                </h3>
                
                <div>
                  <Label htmlFor="medicalConditions">Any other medical conditions or notes</Label>
                  <textarea
                    id="medicalConditions"
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white"
                    placeholder="List any other medical conditions, medications, or important information..."
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                disabled={!selectedCamp}
              >
                {selectedCamp ? 'Submit Application' : 'Please Select a Blood Camp First'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Nearby Blood Camps */}
        <div className="space-y-4">
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Nearby Blood Camps
              {userLocation && (
                <span className="text-sm text-gray-400 ml-2">(Sorted by distance)</span>
              )}
            </h2>

            <div className="space-y-3">
              {nearbyCamps.map((camp) => (
                <div
                  key={camp.id}
                  onClick={() => handleCampSelect(camp.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedCamp === camp.id
                      ? 'border-red-500 bg-red-600/20'
                      : 'border-gray-700 hover:border-red-500/50 bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white">{camp.name}</h3>
                    {camp.distance && (
                      <span className="text-xs bg-red-600/30 text-red-400 px-2 py-1 rounded">
                        {camp.distance.toFixed(1)} km
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{camp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(camp.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{camp.time}</span>
                    </div>
                  </div>

                  {selectedCamp === camp.id && (
                    <div className="mt-3 flex items-center gap-2 text-green-500 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Important Notice */}
          <Card className="glass-card p-6 border border-yellow-500/30">
            <h3 className="text-lg font-bold text-yellow-500 mb-3">⚠️ Important Notice</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Ensure you meet all eligibility criteria before applying</li>
              <li>• Bring a valid ID and health certificate to the camp</li>
              <li>• Eat a healthy meal before donation</li>
              <li>• Stay hydrated and avoid alcohol 24 hours before</li>
              <li>• You will receive a confirmation message after review</li>
            </ul>
          </Card>
        </div>
      </div>
    </DonorLayout>
  );
};

export default DonorApplication;
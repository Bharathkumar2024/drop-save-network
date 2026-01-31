import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Mail, Phone, Droplet, CheckCircle2, Building2, Navigation, Heart, Activity, AlertTriangle } from 'lucide-react';
import DonorLayout from '@/components/donor/DonorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const upcomingCamps = [
  {
    id: '1',
    name: 'Central Blood Bank - Main Camp',
    organizer: 'Red Cross Society',
    location: 'Downtown, Metro City',
    address: '123 Main Street, City Center',
    date: '2026-02-15',
    time: '9:00 AM - 5:00 PM',
    distance: '2.5 km',
    capacity: 100,
    registered: 45,
  },
  {
    id: '2',
    name: 'City General Hospital Blood Drive',
    organizer: 'City General Hospital',
    location: 'Downtown, Metro City',
    address: '456 Hospital Road, Medical District',
    date: '2026-02-18',
    time: '10:00 AM - 3:00 PM',
    distance: '3.2 km',
    capacity: 80,
    registered: 32,
  },
  {
    id: '3',
    name: 'Community Health Center Camp',
    organizer: 'Metro Health Foundation',
    location: 'Westside, Metro City',
    address: '789 Community Ave, Westside',
    date: '2026-02-20',
    time: '8:00 AM - 4:00 PM',
    distance: '5.1 km',
    capacity: 60,
    registered: 28,
  },
  {
    id: '4',
    name: 'Metro Medical Center Blood Camp',
    organizer: 'Metro Medical Center',
    location: 'Eastside, Metro City',
    address: '321 Medical Plaza, Eastside',
    date: '2026-02-22',
    time: '9:00 AM - 2:00 PM',
    distance: '6.8 km',
    capacity: 50,
    registered: 15,
  },
];

const DonorApplication = () => {
  const { user } = useAuth();
  const [selectedCamp, setSelectedCamp] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    age: '',
    gender: '',
    bloodGroup: user?.bloodType || '',
    weight: '',
    occupation: '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    emergencyPhone: '',
    lastDonationDate: '',
    hasDonatedBefore: 'no',

    // Recent Health Status
    hasRecentColdFlu: 'no',
    hasDonatedPlatelets: 'no',
    plateletDonationDate: '',

    // Sexual Health Screening
    hadSexualRiskBehavior: 'no',
    hadDrugUseRisk: 'no',

    // Medical Conditions Checkboxes
    medicalConditions: [] as string[],

    // Existing fields
    hasChronicIllness: 'no',
    chronicIllnessDetails: '',
    isOnMedication: 'no',
    medicationDetails: '',
    hasAllergies: 'no',
    allergyDetails: '',
    hasSurgery: 'no',
    surgeryDetails: '',
    hasTattoo: 'no',
    tattooDate: '',
    hasTravelHistory: 'no',
    travelDetails: '',
    smokingStatus: 'no',
    alcoholConsumption: 'no',
    additionalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicalConditionToggle = (condition: string) => {
    setFormData(prev => {
      const conditions = prev.medicalConditions;
      if (conditions.includes(condition)) {
        return { ...prev, medicalConditions: conditions.filter(c => c !== condition) };
      } else {
        return { ...prev, medicalConditions: [...conditions, condition] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCamp) {
      toast.error('Please select a blood camp');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!formData.fullName || !formData.age || !formData.gender || !formData.bloodGroup ||
      !formData.phone || !formData.email || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const camp = upcomingCamps.find(c => c.id === selectedCamp);
    toast.success('Application Submitted Successfully!', {
      description: `You've registered for ${camp?.name} on ${new Date(camp?.date || '').toLocaleDateString()}. We'll contact you soon.`,
    });

    setIsSubmitting(false);
    setSelectedCamp('');
    setAgreedToTerms(false);
  };

  return (
    <DonorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Apply for Blood Donation Camp</h1>
          <p className="text-gray-400">Complete the application form to register for a blood donation camp</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800 shadow-xl">
              <CardHeader className="border-b border-gray-800 bg-red-950/20">
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-red-500" />
                  Blood Donation Application Form
                </CardTitle>
                <p className="text-sm text-yellow-500 mt-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Confidential - Please answer all questions correctly
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
                      <User className="h-5 w-5 text-red-500" />
                      Personal Information
                    </h3>

                    <div>
                      <Label className="text-gray-300 mb-2 block">Full Name *</Label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300 mb-2 block">Age *</Label>
                        <Input
                          type="number"
                          min="18"
                          max="65"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          placeholder="18-65"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-2 block">Gender *</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-2 block">Blood Group *</Label>
                        <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 mb-2 block">Weight (kg) *</Label>
                        <Input
                          type="number"
                          min="50"
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          placeholder="Minimum 50 kg"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-2 block">Occupation</Label>
                        <Input
                          value={formData.occupation}
                          onChange={(e) => handleInputChange('occupation', e.target.value)}
                          placeholder="Your occupation"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
                      <Phone className="h-5 w-5 text-red-500" />
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 mb-2 block">Phone Number *</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1-555-0100"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-2 block">Email Address *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2 block">Address *</Label>
                      <Input
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Street Address"
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2 block">Address Line 2 (Optional)</Label>
                      <Input
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                        placeholder="Apartment, suite, etc."
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300 mb-2 block">City *</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="City"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-2 block">State *</Label>
                        <Input
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="State"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-2 block">PIN Code *</Label>
                        <Input
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="PIN Code"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 mb-2 block">Emergency Contact Name *</Label>
                        <Input
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          placeholder="Contact person name"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-2 block">Emergency Contact Phone *</Label>
                        <Input
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                          placeholder="+1-555-0100"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
                      <Heart className="h-5 w-5 text-red-500" />
                      Medical History
                    </h3>

                    {/* Previous Donation */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Have you donated blood before? *</Label>
                      <RadioGroup value={formData.hasDonatedBefore} onValueChange={(value) => handleInputChange('hasDonatedBefore', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="donated-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="donated-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="donated-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="donated-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {formData.hasDonatedBefore === 'yes' && (
                        <div className="mt-3">
                          <Label className="text-gray-300 mb-2 block">Last Donation Date</Label>
                          <Input
                            type="date"
                            value={formData.lastDonationDate}
                            onChange={(e) => handleInputChange('lastDonationDate', e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white h-12"
                          />
                        </div>
                      )}
                    </div>

                    {/* Recent Cold/Flu */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Have you been sick with a cold or flu in the past 2 weeks? *</Label>
                      <RadioGroup value={formData.hasRecentColdFlu} onValueChange={(value) => handleInputChange('hasRecentColdFlu', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="coldflu-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="coldflu-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="coldflu-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="coldflu-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Platelet/Plasma Donation */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Have you donated platelets or plasma? *</Label>
                      <RadioGroup value={formData.hasDonatedPlatelets} onValueChange={(value) => handleInputChange('hasDonatedPlatelets', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="platelets-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="platelets-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="platelets-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="platelets-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {formData.hasDonatedPlatelets === 'yes' && (
                        <div className="mt-3">
                          <Label className="text-gray-300 mb-2 block">Last platelet/plasma donation date</Label>
                          <Input
                            type="date"
                            value={formData.plateletDonationDate}
                            onChange={(e) => handleInputChange('plateletDonationDate', e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white h-12"
                          />
                        </div>
                      )}
                    </div>

                    {/* Sexual Health Screening */}
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <Label className="text-gray-300 mb-3 block">
                        In the last 48 months, have you had sex with a male who has had sex with another male? *
                      </Label>
                      <RadioGroup value={formData.hadSexualRiskBehavior} onValueChange={(value) => handleInputChange('hadSexualRiskBehavior', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="sexrisk-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="sexrisk-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="sexrisk-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="sexrisk-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <Label className="text-gray-300 mb-3 block">
                        In the last 12 months, have you had sex with anyone who has used needles to take drugs not prescribed by a doctor? *
                      </Label>
                      <RadioGroup value={formData.hadDrugUseRisk} onValueChange={(value) => handleInputChange('hadDrugUseRisk', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="drugrisk-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="drugrisk-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="drugrisk-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="drugrisk-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Medical Conditions Checklist */}
                    <div>
                      <Label className="text-gray-300 mb-3 block font-bold">
                        Do you have or have you ever had any of the following medical conditions? *
                      </Label>
                      <p className="text-sm text-gray-400 mb-4">Check all that apply</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        {[
                          'Cancer',
                          'Heart Disease',
                          'Lung Disease',
                          'Bleeding problems or blood diseases',
                          'Kidney disease',
                          'Liver disease',
                          'Diabetes',
                          'Seizures',
                          'Autoimmune disease',
                          'Hepatitis (Since age 11)',
                          'Hepatitis B or C (anytime)',
                          'HIV/AIDS',
                          'Babesiosis',
                          'Chagas disease',
                          'Malaria',
                          'Syphilis or Gonorrhea',
                          'HTLV',
                          'West Nile Virus',
                          'Zika Virus',
                          'Ebola',
                          'COVID-19 (Currently positive)',
                          'Tuberculosis',
                          'Other blood infections',
                        ].map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                              id={`condition-${condition}`}
                              checked={formData.medicalConditions.includes(condition)}
                              onCheckedChange={() => handleMedicalConditionToggle(condition)}
                              className="border-gray-600 data-[state=checked]:bg-red-600"
                            />
                            <Label
                              htmlFor={`condition-${condition}`}
                              className="text-sm text-gray-300 cursor-pointer"
                            >
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Medications */}
                    <div>
                      <Label className="text-gray-300 mb-3 block font-bold">
                        Are you taking or have you taken any of these medications in the following timeframes? *
                      </Label>
                      <div className="space-y-2 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-aspirin" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-aspirin" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Aspirin</strong> (last 2 days)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-plavix" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-plavix" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Plavix (clopidogrel)</strong> (last 14 days)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-effient" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-effient" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Effient (prasugrel)</strong> (last 3 days)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-brilinta" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-brilinta" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Brilinta (ticagrelor)</strong> (last 14 days)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-ticlid" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-ticlid" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Ticlid (ticlopidine)</strong> (last 14 days)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-feldene" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-feldene" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Feldene (piroxicam)</strong> (last 2 days)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-accutane" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-accutane" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Accutane (isotretinoin)</strong> (last 1 month)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-proscar" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-proscar" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Proscar (finasteride)</strong> or <strong className="text-white">Propecia</strong> (last 1 month)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-avodart" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-avodart" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Avodart (dutasteride)</strong> (last 6 months)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-soriatane" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-soriatane" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Soriatane (acitretin)</strong> (last 3 years)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-tegison" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-tegison" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Tegison (etretinate)</strong> (ever)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-growth-hormone" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-growth-hormone" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Growth hormone from human pituitary glands</strong> (ever)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-insulin-beef" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-insulin-beef" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Insulin from cows (bovine insulin)</strong> (ever since 1980)
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                          <Checkbox id="med-hepatitis-b" className="mt-0.5 border-gray-600 data-[state=checked]:bg-red-600" />
                          <Label htmlFor="med-hepatitis-b" className="text-gray-300 cursor-pointer">
                            <strong className="text-white">Hepatitis B Immune Globulin</strong> (last 12 months)
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Pregnancy Question (for females) */}
                    {formData.gender === 'female' && (
                      <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                        <Label className="text-gray-300 mb-3 block">
                          Are you currently pregnant or have you been pregnant in the last 6 weeks? *
                        </Label>
                        <RadioGroup defaultValue="no">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="pregnant-yes" className="border-gray-600 text-red-500" />
                              <Label htmlFor="pregnant-yes" className="text-white cursor-pointer">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="pregnant-no" className="border-gray-600 text-red-500" />
                              <Label htmlFor="pregnant-no" className="text-white cursor-pointer">No</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    {/* Chronic Illness */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Do you have any chronic illness? *</Label>
                      <RadioGroup value={formData.hasChronicIllness} onValueChange={(value) => handleInputChange('hasChronicIllness', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="illness-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="illness-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="illness-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="illness-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {formData.hasChronicIllness === 'yes' && (
                        <div className="mt-3">
                          <Label className="text-gray-300 mb-2 block">Please specify</Label>
                          <Textarea
                            value={formData.chronicIllnessDetails}
                            onChange={(e) => handleInputChange('chronicIllnessDetails', e.target.value)}
                            placeholder="Describe your chronic illness"
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Medication */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Are you currently on any medication? *</Label>
                      <RadioGroup value={formData.isOnMedication} onValueChange={(value) => handleInputChange('isOnMedication', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="medication-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="medication-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="medication-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="medication-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {formData.isOnMedication === 'yes' && (
                        <div className="mt-3">
                          <Label className="text-gray-300 mb-2 block">Please list medications</Label>
                          <Textarea
                            value={formData.medicationDetails}
                            onChange={(e) => handleInputChange('medicationDetails', e.target.value)}
                            placeholder="List all medications you're taking"
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Allergies */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Do you have any allergies? *</Label>
                      <RadioGroup value={formData.hasAllergies} onValueChange={(value) => handleInputChange('hasAllergies', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="allergy-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="allergy-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="allergy-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="allergy-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {formData.hasAllergies === 'yes' && (
                        <div className="mt-3">
                          <Label className="text-gray-300 mb-2 block">Please specify allergies</Label>
                          <Textarea
                            value={formData.allergyDetails}
                            onChange={(e) => handleInputChange('allergyDetails', e.target.value)}
                            placeholder="List all known allergies"
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Surgery */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Have you had any surgery in the last 6 months? *</Label>
                      <RadioGroup value={formData.hasSurgery} onValueChange={(value) => handleInputChange('hasSurgery', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="surgery-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="surgery-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="surgery-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="surgery-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {formData.hasSurgery === 'yes' && (
                        <div className="mt-3">
                          <Label className="text-gray-300 mb-2 block">Please provide details</Label>
                          <Textarea
                            value={formData.surgeryDetails}
                            onChange={(e) => handleInputChange('surgeryDetails', e.target.value)}
                            placeholder="Describe the surgery and date"
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Tattoo */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Have you gotten a tattoo/piercing in the last 12 months? *</Label>
                      <RadioGroup value={formData.hasTattoo} onValueChange={(value) => handleInputChange('hasTattoo', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="tattoo-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="tattoo-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="tattoo-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="tattoo-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {formData.hasTattoo === 'yes' && (
                        <div className="mt-3">
                          <Label className="text-gray-300 mb-2 block">Date of tattoo/piercing</Label>
                          <Input
                            type="date"
                            value={formData.tattooDate}
                            onChange={(e) => handleInputChange('tattooDate', e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white h-12"
                          />
                        </div>
                      )}
                    </div>

                    {/* Travel History */}
                    <div>
                      <Label className="text-gray-300 mb-3 block">Have you traveled abroad in the last 3 months? *</Label>
                      <RadioGroup value={formData.hasTravelHistory} onValueChange={(value) => handleInputChange('hasTravelHistory', value)}>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="travel-yes" className="border-gray-600 text-red-500" />
                            <Label htmlFor="travel-yes" className="text-white cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="travel-no" className="border-gray-600 text-red-500" />
                            <Label htmlFor="travel-no" className="text-white cursor-pointer">No</Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {formData.hasTravelHistory === 'yes' && (
                        <div className="mt-3">
                          <Label className="text-gray-300 mb-2 block">Countries visited</Label>
                          <Textarea
                            value={formData.travelDetails}
                            onChange={(e) => handleInputChange('travelDetails', e.target.value)}
                            placeholder="List countries and dates"
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lifestyle */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
                      <Activity className="h-5 w-5 text-red-500" />
                      Lifestyle Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-300 mb-3 block">Do you smoke? *</Label>
                        <RadioGroup value={formData.smokingStatus} onValueChange={(value) => handleInputChange('smokingStatus', value)}>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="smoke-yes" className="border-gray-600 text-red-500" />
                              <Label htmlFor="smoke-yes" className="text-white cursor-pointer">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="smoke-no" className="border-gray-600 text-red-500" />
                              <Label htmlFor="smoke-no" className="text-white cursor-pointer">No</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-3 block">Do you consume alcohol? *</Label>
                        <RadioGroup value={formData.alcoholConsumption} onValueChange={(value) => handleInputChange('alcoholConsumption', value)}>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="alcohol-yes" className="border-gray-600 text-red-500" />
                              <Label htmlFor="alcohol-yes" className="text-white cursor-pointer">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="alcohol-no" className="border-gray-600 text-red-500" />
                              <Label htmlFor="alcohol-no" className="text-white cursor-pointer">No</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label className="text-gray-300 mb-2 block">Additional Notes (Optional)</Label>
                    <Textarea
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      placeholder="Any additional information you'd like to share"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <div className="p-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                        className="mt-1 border-blue-500 data-[state=checked]:bg-blue-600"
                      />
                      <div>
                        <Label htmlFor="terms" className="text-white font-medium cursor-pointer">
                          I agree to the terms and conditions *
                        </Label>
                        <p className="text-sm text-gray-400 mt-1">
                          I certify that all information provided above is true and accurate. I understand that providing false information may disqualify me from donating blood.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg h-14"
                    disabled={isSubmitting || !selectedCamp || !agreedToTerms}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting Application...
                      </div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Nearby Blood Camps */}
          <div>
            <Card className="bg-gray-900 border-gray-800 shadow-xl sticky top-6">
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Nearby Blood Camps
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white">{upcomingCamps.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  {upcomingCamps.map((camp) => {
                    const isSelected = selectedCamp === camp.id;
                    const spotsLeft = camp.capacity - camp.registered;
                    const fillPercentage = (camp.registered / camp.capacity) * 100;

                    return (
                      <button
                        key={camp.id}
                        onClick={() => setSelectedCamp(camp.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${isSelected
                          ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                          : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-white text-base leading-tight pr-2">{camp.name}</h4>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Building2 className="h-4 w-4 text-blue-500" />
                            <span className="text-white font-medium">{camp.organizer}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span>{camp.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span className="text-white font-medium">
                              {new Date(camp.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="h-4 w-4 text-purple-500" />
                            <span>{camp.time}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-400">
                            <Navigation className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-500 font-medium">{camp.distance}</span>
                          </div>

                          {/* Capacity Bar */}
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-400">Capacity</span>
                              <span className={`font-bold ${spotsLeft < 20 ? 'text-red-500' : 'text-green-500'}`}>
                                {spotsLeft} spots left
                              </span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${fillPercentage > 80 ? 'bg-red-500' : fillPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                style={{ width: `${fillPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-blue-500/30">
                            <p className="text-xs text-blue-400 font-medium">
                              ✓ Selected for donation
                            </p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DonorLayout>
  );
};

export default DonorApplication;
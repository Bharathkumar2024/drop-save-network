import { useState } from 'react';
import { Heart, MapPin, Mail, Phone, Save, Edit3, X, User, Calendar, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DonorLayout from '@/components/donor/DonorLayout';
import { toast } from 'sonner';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: 'Bharath Kumar',
    email: 'bharathkumar@gmail.com',
    phone: '9363751288',
    bloodType: 'O+',
    age: '20',
    city: 'Salem',
    lastDonation: '2025-12-15',
    totalDonations: 8,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved.'
      });
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    setFormData({
      name: 'Bharath Kumar',
      email: 'bharathkumar@gmail.com',
      phone: '9363751288',
      bloodType: 'O+',
      age: '20',
      city: 'Salem',
      lastDonation: '2025-12-15',
      totalDonations: 8,
    });
    setIsEditing(false);
  };

  return (
    <DonorLayout>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-glow mb-2 md:mb-3 flex items-center gap-3">
              <Heart className="h-8 w-8 md:h-10 md:w-10 text-destructive" />
              Donor Profile
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Manage your donor information
            </p>
          </div>

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:gap-8">
          {/* Personal Information Card */}
          <Card className="glass-card-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-destructive" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic details as a donor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-destructive" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="h-11 border-2"
                    />
                  ) : (
                    <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                      {formData.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-destructive" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-11 border-2"
                    />
                  ) : (
                    <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                      {formData.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-destructive" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-11 border-2"
                    />
                  ) : (
                    <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                      {formData.phone}
                    </div>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-destructive" />
                    City
                  </Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="h-11 border-2"
                    />
                  ) : (
                    <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                      {formData.city}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information Card */}
          <Card className="glass-card-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-destructive" />
                Medical Information
              </CardTitle>
              <CardDescription>
                Blood type and health details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Type */}
                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-destructive" />
                    Blood Type
                  </Label>
                  {isEditing ? (
                    <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-destructive/20 text-destructive font-bold mr-2">
                        {formData.bloodType}
                      </span>
                      {formData.bloodType}
                    </div>
                  )}
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-destructive" />
                    Age
                  </Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="65"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="h-11 border-2"
                    />
                  ) : (
                    <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                      {formData.age} years
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donation History Card */}
          <Card className="glass-card-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                Donation History
              </CardTitle>
              <CardDescription>
                Your blood donation records (Read-only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="text-2xl font-bold text-destructive">
                    {formData.totalDonations}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Donations</div>
                </div>
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="text-lg font-semibold text-green-600">
                    {new Date(formData.lastDonation).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">Last Donation</div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <Heart className="h-10 w-10 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-600">You're a Hero!</div>
                    <div className="text-sm text-muted-foreground">
                      You've saved up to {formData.totalDonations * 3} lives through your donations
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DonorLayout>
  );
};

export default DonorProfile;
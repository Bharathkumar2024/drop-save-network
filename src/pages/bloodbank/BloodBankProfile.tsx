import { useState } from 'react';
import { Droplet, MapPin, Mail, Phone, Save, Edit3, X, Building2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { toast } from 'sonner';

const BloodBankProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: 'Central Blood Bank',
        bloodBankId: 'BBC001',
        location: '123 Medical Center, Downtown',
        city: 'Metro City',
        contactEmail: 'contact@centralbloodbank.org',
        contactPhone: '+1-555-0100',
        operatingHours: '24/7 Emergency Services',
        description: 'Leading blood bank facility providing comprehensive blood banking services and emergency blood supply.',
        totalStock: 450,
        activeDonors: 1200,
        hospitalPartnerships: 45,
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
            name: 'Central Blood Bank',
            bloodBankId: 'BBC001',
            location: '123 Medical Center, Downtown',
            city: 'Metro City',
            contactEmail: 'contact@centralbloodbank.org',
            contactPhone: '+1-555-0100',
            operatingHours: '24/7 Emergency Services',
            description: 'Leading blood bank facility providing comprehensive blood banking services and emergency blood supply.',
            totalStock: 450,
            activeDonors: 1200,
            hospitalPartnerships: 45,
        });
        setIsEditing(false);
    };

    return (
        <BloodBankLayout>
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-6 md:mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-glow mb-2 md:mb-3 flex items-center gap-3">
                            <Droplet className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />
                            Blood Bank Profile
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground">
                            Manage your blood bank information
                        </p>
                    </div>

                    {!isEditing ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
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
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
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
                    {/* Basic Information Card */}
                    <Card className="glass-card-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>
                                Core details about your blood bank
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Blood Bank Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                        Blood Bank Name
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

                                {/* Blood Bank ID */}
                                <div className="space-y-2">
                                    <Label htmlFor="bloodBankId" className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                        Blood Bank ID
                                    </Label>
                                    <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-border/30 flex items-center text-muted-foreground">
                                        {formData.bloodBankId} (Read-only)
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-blue-600" />
                                        Location
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className="h-11 border-2"
                                        />
                                    ) : (
                                        <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                                            {formData.location}
                                        </div>
                                    )}
                                </div>

                                {/* City */}
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-blue-600" />
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

                                {/* Operating Hours */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="operatingHours" className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        Operating Hours
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="operatingHours"
                                            value={formData.operatingHours}
                                            onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                                            className="h-11 border-2"
                                        />
                                    ) : (
                                        <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                                            {formData.operatingHours}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-blue-600" />
                                    Description
                                </Label>
                                {isEditing ? (
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="min-h-[100px] border-2"
                                        placeholder="Brief description about your blood bank..."
                                    />
                                ) : (
                                    <div className="min-h-[100px] px-4 py-3 rounded-md bg-muted/30 border-2 border-transparent">
                                        {formData.description}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information Card */}
                    <Card className="glass-card-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-blue-600" />
                                Contact Information
                            </CardTitle>
                            <CardDescription>
                                How people can reach your blood bank
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-blue-600" />
                                        Email Address
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.contactEmail}
                                            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                            className="h-11 border-2"
                                        />
                                    ) : (
                                        <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                                            {formData.contactEmail}
                                        </div>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-blue-600" />
                                        Phone Number
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="phone"
                                            value={formData.contactPhone}
                                            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                            className="h-11 border-2"
                                        />
                                    ) : (
                                        <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                                            {formData.contactPhone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistics Card */}
                    <Card className="glass-card-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Droplet className="h-5 w-5 text-blue-600" />
                                Blood Bank Statistics
                            </CardTitle>
                            <CardDescription>
                                Performance metrics (Read-only)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formData.totalStock} units
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Blood Stock</div>
                                </div>
                                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                    <div className="text-2xl font-bold text-green-600">
                                        {formData.activeDonors}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Active Donors</div>
                                </div>
                                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {formData.hospitalPartnerships}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Hospital Partnerships</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </BloodBankLayout>
    );
};

export default BloodBankProfile;

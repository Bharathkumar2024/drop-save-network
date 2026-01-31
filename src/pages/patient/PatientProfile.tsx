import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle,
  MapPin,
  Mail,
  Phone,
  Save,
  Edit3,
  X,
  User,
  Calendar,
  Heart,
  Activity,
  LayoutDashboard,
  Droplet,
  Building2,
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientProfile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    emergencyContact: '+91 9876543210',
    emergencyContactName: 'Kumar',
    totalRequests: 3,
    completedRequests: 2,
    lastRequest: '2025-11-20',
  });

  useEffect(() => {
    // Check if user is authenticated and is a patient
    if (!isAuthenticated || !user || user.role !== 'patient') {
      navigate('/patient/auth');
    }
  }, [isAuthenticated, user, navigate]);

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
      emergencyContact: '+91 9876543210',
      emergencyContactName: 'Kumar',
      totalRequests: 3,
      completedRequests: 2,
      lastRequest: '2025-11-20',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully', {
      description: 'Come back soon!'
    });
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
    { icon: Droplet, label: 'Blood Needed', path: '/patient/blood-request' },
    { icon: Building2, label: 'Nearby Blood Banks', path: '/patient/blood-banks' },
    { icon: User, label: 'Profile', path: '/patient/profile' },
  ];

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background bg-blood-pattern">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-blood-pattern">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card-primary box-glow"
      >
        {isSidebarOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-green-600 to-teal-600 text-white w-64 transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Vital Drop</h1>
          <p className="text-green-100 text-sm">Patient Portal</p>
        </div>

        {/* Welcome Message */}
        <div className="px-6 py-4 bg-white/10 backdrop-blur-sm">
          <p className="text-sm text-green-100">Welcome,</p>
          <p className="text-lg font-semibold">{user?.name || 'Patient'} 👋</p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${location.pathname === item.path ? 'bg-white/20 border-l-4 border-white' : ''
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-glow mb-2 md:mb-3 flex items-center gap-3">
                <UserCircle className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
                Patient Profile
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Manage your health information
              </p>
            </div>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600"
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
                  className="bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600"
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
                  <User className="h-5 w-5 text-green-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your basic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
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
                      <Mail className="h-4 w-4 text-green-600" />
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
                      <Phone className="h-4 w-4 text-green-600" />
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
                      <MapPin className="h-4 w-4 text-green-600" />
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
                  <Heart className="h-5 w-5 text-green-600" />
                  Medical Information
                </CardTitle>
                <CardDescription>
                  Health and blood type details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blood Type */}
                  <div className="space-y-2">
                    <Label htmlFor="bloodType" className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-green-600" />
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
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600/20 text-green-600 font-bold mr-2">
                          {formData.bloodType}
                        </span>
                        {formData.bloodType}
                      </div>
                    )}
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      Age
                    </Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        max="120"
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

            {/* Emergency Contact Card */}
            <Card className="glass-card-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Emergency Contact
                </CardTitle>
                <CardDescription>
                  Contact person in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Emergency Contact Name */}
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      Contact Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                        className="h-11 border-2"
                      />
                    ) : (
                      <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                        {formData.emergencyContactName}
                      </div>
                    )}
                  </div>

                  {/* Emergency Contact Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      Contact Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="h-11 border-2"
                      />
                    ) : (
                      <div className="h-11 px-4 py-2 rounded-md bg-muted/30 border-2 border-transparent flex items-center">
                        {formData.emergencyContact}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request History Card */}
            <Card className="glass-card-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Blood Request History
                </CardTitle>
                <CardDescription>
                  Your blood request records (Read-only)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div className="text-2xl font-bold text-green-600">
                      {formData.totalRequests}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Requests</div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-600">
                      {formData.completedRequests}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <div className="text-lg font-semibold text-purple-600">
                      {new Date(formData.lastRequest).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">Last Request</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientProfile;
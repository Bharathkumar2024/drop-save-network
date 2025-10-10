import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { mockDonors } from '@/data/mockData';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupBloodGroup, setSignupBloodGroup] = useState('');
  const [signupLastDonation, setSignupLastDonation] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock validation
    const donor = mockDonors.find(d => d.email === loginEmail);
    if (donor && loginOtp) {
      login({
        id: donor.id,
        name: donor.name,
        role: 'donor',
        bloodGroup: donor.bloodGroup,
        email: donor.email
      });
      toast.success('Login successful!');
      navigate('/donor/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupName || !signupBloodGroup || !signupCity || !signupEmail || !signupPhone) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Mock signup success
    login({
      id: 'new-donor',
      name: signupName,
      role: 'donor',
      bloodGroup: signupBloodGroup,
      email: signupEmail
    });
    toast.success('Registration successful!');
    navigate('/donor/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-background bg-blood-pattern flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card-primary p-6 md:p-8 box-glow">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-danger rounded-full flex items-center justify-center mx-auto mb-4 box-glow">
            <Droplet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">Donor Access</h1>
          <p className="text-sm text-muted-foreground">Save lives through blood donation</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginEmail">Email / Phone</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Demo: alex.turner@email.com</p>
              </div>
              <div>
                <Label htmlFor="loginOtp">OTP</Label>
                <Input
                  id="loginOtp"
                  placeholder="Enter OTP"
                  value={loginOtp}
                  onChange={(e) => setLoginOtp(e.target.value)}
                  className="mt-1"
                />
                <Button type="button" variant="ghost" size="sm" className="mt-1 text-xs text-primary">
                  Send OTP
                </Button>
              </div>
              <Button type="submit" className="w-full bg-gradient-danger">
                Login to Dashboard
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signupName">Full Name *</Label>
                <Input
                  id="signupName"
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupBloodGroup">Blood Group *</Label>
                <Select value={signupBloodGroup} onValueChange={setSignupBloodGroup}>
                  <SelectTrigger id="signupBloodGroup" className="mt-1">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="signupLastDonation">Last Donation Date</Label>
                <Input
                  id="signupLastDonation"
                  type="date"
                  value={signupLastDonation}
                  onChange={(e) => setSignupLastDonation(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupCity">City *</Label>
                <Input
                  id="signupCity"
                  placeholder="Metro City"
                  value={signupCity}
                  onChange={(e) => setSignupCity(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupPhone">Phone Number *</Label>
                <Input
                  id="signupPhone"
                  placeholder="+1-555-0101"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupEmail">Email *</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-danger">
                Register as Donor
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default DonorAuth;

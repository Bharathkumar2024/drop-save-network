import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { mockHospitals } from '@/data/mockData';

const HospitalAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Login state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupLocation, setSignupLocation] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupVerification, setSignupVerification] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock validation
    const hospital = mockHospitals.find(h => h.hospitalId === loginId);
    if (hospital && loginPassword) {
      login({
        id: hospital.id,
        name: hospital.name,
        role: 'hospital',
        hospitalId: hospital.hospitalId,
        location: hospital.location
      });
      toast.success('Login successful!');
      navigate('/hospital/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupName || !signupLocation || !signupId || !signupVerification || !signupPassword) {
      toast.error('Please fill all fields');
      return;
    }
    
    // Mock signup success
    login({
      id: 'new-hospital',
      name: signupName,
      role: 'hospital',
      hospitalId: signupId,
      location: signupLocation
    });
    toast.success('Registration successful!');
    navigate('/hospital/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-background bg-blood-pattern flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card-primary p-6 md:p-8 box-glow">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 box-glow">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">Hospital Access</h1>
          <p className="text-sm text-muted-foreground">Manage emergency blood requests</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginId">Hospital ID</Label>
                <Input
                  id="loginId"
                  placeholder="e.g., CGH001"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Demo ID: CGH001</p>
              </div>
              <div>
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary">
                Login to Dashboard
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signupName">Hospital Name</Label>
                <Input
                  id="signupName"
                  placeholder="Enter hospital name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupLocation">Location</Label>
                <Input
                  id="signupLocation"
                  placeholder="City, State"
                  value={signupLocation}
                  onChange={(e) => setSignupLocation(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupId">Unique Hospital ID</Label>
                <Input
                  id="signupId"
                  placeholder="e.g., ABC123"
                  value={signupId}
                  onChange={(e) => setSignupId(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupVerification">Verification Code</Label>
                <Input
                  id="signupVerification"
                  placeholder="Enter verification code"
                  value={signupVerification}
                  onChange={(e) => setSignupVerification(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="Create password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary">
                Register Hospital
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

export default HospitalAuth;

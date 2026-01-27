import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

const HospitalAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupLocation, setSignupLocation] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const resetLoginForm = () => {
    setLoginId('');
    setLoginPassword('');
    setIsLoginLoading(false);
  };

  const resetSignupForm = () => {
    setSignupName('');
    setSignupLocation('');
    setSignupId('');
    setSignupEmail('');
    setSignupPhone('');
    setSignupPassword('');
    setIsSignupLoading(false);
  };

  const handleTabChange = (value: 'login' | 'signup') => {
    setActiveTab(value);
    if (value === 'login') {
      resetSignupForm();
    } else {
      resetLoginForm();
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!loginId || !loginPassword) {
      toast.error('Please provide both Hospital ID and password.');
      return;
    }

    setIsLoginLoading(true);
    try {
      const { token, hospital } = await authAPI.hospitalLogin({
        hospitalId: loginId.trim(),
        password: loginPassword,
      });

      login(
        {
          id: hospital.id,
          name: hospital.name,
          role: 'hospital',
          hospitalId: hospital.hospitalId,
          location: hospital.location,
          city: hospital.city,
          contactEmail: hospital.contactEmail,
          contactPhone: hospital.contactPhone,
          stats: hospital.stats,
        },
        token
      );

      toast.success('Login successful!');
      navigate('/hospital/dashboard');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        'Unable to log in. Please verify your credentials and try again.';
      toast.error(message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();

    if (!signupName || !signupLocation || !signupId || !signupEmail || !signupPhone || !signupPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSignupLoading(true);
    try {
      const { token, hospital } = await authAPI.hospitalSignup({
        name: signupName.trim(),
        location: signupLocation.trim(),
        hospitalId: signupId.trim(),
        password: signupPassword,
        contactEmail: signupEmail.trim(),
        contactPhone: signupPhone.trim(),
      });

      login(
        {
          id: hospital.id,
          name: hospital.name,
          role: 'hospital',
          hospitalId: hospital.hospitalId,
          location: hospital.location,
          city: hospital.city,
          contactEmail: hospital.contactEmail,
          contactPhone: hospital.contactPhone,
        },
        token
      );

      toast.success('Hospital registered successfully!');
      navigate('/hospital/dashboard');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        'Could not complete registration. Please review your details and try again.';
      toast.error(message);
    } finally {
      setIsSignupLoading(false);
    }
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

        <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as 'login' | 'signup')} className="w-full">
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
                  onChange={(event) => setLoginId(event.target.value)}
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
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoginLoading}>
                {isLoginLoading ? 'Authenticating...' : 'Login to Dashboard'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signupName">Hospital Name *</Label>
                <Input
                  id="signupName"
                  placeholder="Enter hospital name"
                  value={signupName}
                  onChange={(event) => setSignupName(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupLocation">Location (City, State) *</Label>
                <Input
                  id="signupLocation"
                  placeholder="Metro City, State"
                  value={signupLocation}
                  onChange={(event) => setSignupLocation(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupId">Unique Hospital ID *</Label>
                <Input
                  id="signupId"
                  placeholder="e.g., ABC123"
                  value={signupId}
                  onChange={(event) => setSignupId(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupEmail">Contact Email *</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="contact@hospital.com"
                  value={signupEmail}
                  onChange={(event) => setSignupEmail(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupPhone">Contact Phone *</Label>
                <Input
                  id="signupPhone"
                  placeholder="+1-555-0100"
                  value={signupPhone}
                  onChange={(event) => setSignupPhone(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupPassword">Create Password *</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="Enter a secure password"
                  value={signupPassword}
                  onChange={(event) => setSignupPassword(event.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary" disabled={isSignupLoading}>
                {isSignupLoading ? 'Registering...' : 'Register Hospital'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground text-center mt-6">
          Registration grants immediate access to the hospital dashboard where you can manage blood requests and monitor inventory status in real time.
        </p>
      </Card>
    </div>
  );
};

export default HospitalAuth;
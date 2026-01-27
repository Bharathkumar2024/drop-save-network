import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHospitalAuth } from '@/contexts/HospitalAuthContext';
import { toast } from 'sonner';

const HospitalAuthSupabase = () => {
  const navigate = useNavigate();
  const { signInHospital, signUpHospital, signInWithGoogle } = useHospitalAuth();


  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Signup form
  const [signupHospitalName, setSignupHospitalName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupLicenseNumber, setSignupLicenseNumber] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupState, setSignupState] = useState('');
  const [signupPostalCode, setSignupPostalCode] = useState('');
  const [signupHospitalType, setSignupHospitalType] = useState('');
  const [signupBedCapacity, setSignupBedCapacity] = useState('');
  const [signupBio, setSignupBio] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const resetLoginForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setIsLoginLoading(false);
  };

  const resetSignupForm = () => {
    setSignupHospitalName('');
    setSignupEmail('');
    setSignupPhone('');
    setSignupLicenseNumber('');
    setSignupAddress('');
    setSignupCity('');
    setSignupState('');
    setSignupPostalCode('');
    setSignupHospitalType('');
    setSignupBedCapacity('');
    setSignupBio('');
    setSignupPassword('');
    setSignupConfirmPassword('');
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

    if (!loginEmail || !loginPassword) {
      toast.error('Please provide both email and password.');
      return;
    }

    setIsLoginLoading(true);
    try {
      await signInHospital(loginEmail.trim(), loginPassword);
      navigate('/hospital/dashboard-supabase');
    } catch (error: any) {
      // Error already handled in context
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();

    // Validation
    if (!signupHospitalName || !signupEmail || !signupPhone || !signupLicenseNumber ||
      !signupAddress || !signupCity || !signupState || !signupPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsSignupLoading(true);
    try {
      await signUpHospital(signupEmail.trim(), signupPassword, {
        hospital_name: signupHospitalName.trim(),
        phone: signupPhone.trim(),
        license_number: signupLicenseNumber.trim(),
        address: signupAddress.trim(),
        city: signupCity.trim(),
        state: signupState.trim(),
        postal_code: signupPostalCode.trim() || undefined,
        location: `${signupCity.trim()}, ${signupState.trim()}`,
        hospital_type: signupHospitalType || undefined,
        bed_capacity: signupBedCapacity ? parseInt(signupBedCapacity) : undefined,
        bio: signupBio.trim() || undefined,
      });

      navigate('/hospital/dashboard-supabase');
    } catch (error: any) {
      // Error already handled in context
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background bg-blood-pattern flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-card-primary p-6 md:p-8 box-glow">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 box-glow">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">Hospital Portal</h1>
          <p className="text-sm text-muted-foreground">Manage emergency blood requests & patient care</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Register Hospital</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginEmail">Hospital Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="hospital@example.com"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  className="mt-1"
                  autoComplete="email"
                />
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
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoginLoading}>
                {isLoginLoading ? 'Authenticating...' : 'Login to Dashboard'}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full relative"
                onClick={() => signInWithGoogle()}
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="signupHospitalName">Hospital Name *</Label>
                  <Input
                    id="signupHospitalName"
                    placeholder="e.g., City General Hospital"
                    value={signupHospitalName}
                    onChange={(event) => setSignupHospitalName(event.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="signupEmail">Email Address *</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="contact@hospital.com"
                    value={signupEmail}
                    onChange={(event) => setSignupEmail(event.target.value)}
                    className="mt-1"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <Label htmlFor="signupPhone">Phone Number *</Label>
                  <Input
                    id="signupPhone"
                    placeholder="+1-555-0100"
                    value={signupPhone}
                    onChange={(event) => setSignupPhone(event.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="signupLicenseNumber">License Number *</Label>
                  <Input
                    id="signupLicenseNumber"
                    placeholder="e.g., LIC-2024-001"
                    value={signupLicenseNumber}
                    onChange={(event) => setSignupLicenseNumber(event.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="signupHospitalType">Hospital Type</Label>
                  <Select value={signupHospitalType} onValueChange={setSignupHospitalType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General Hospital</SelectItem>
                      <SelectItem value="Specialty">Specialty Hospital</SelectItem>
                      <SelectItem value="Emergency">Emergency Center</SelectItem>
                      <SelectItem value="Teaching">Teaching Hospital</SelectItem>
                      <SelectItem value="Trauma">Trauma Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="signupAddress">Address *</Label>
                  <Input
                    id="signupAddress"
                    placeholder="123 Healthcare Ave"
                    value={signupAddress}
                    onChange={(event) => setSignupAddress(event.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="signupCity">City *</Label>
                  <Input
                    id="signupCity"
                    placeholder="Metro City"
                    value={signupCity}
                    onChange={(event) => setSignupCity(event.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="signupState">State *</Label>
                  <Input
                    id="signupState"
                    placeholder="State"
                    value={signupState}
                    onChange={(event) => setSignupState(event.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="signupPostalCode">Postal Code</Label>
                  <Input
                    id="signupPostalCode"
                    placeholder="10001"
                    value={signupPostalCode}
                    onChange={(event) => setSignupPostalCode(event.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="signupBedCapacity">Bed Capacity</Label>
                  <Input
                    id="signupBedCapacity"
                    type="number"
                    placeholder="e.g., 500"
                    value={signupBedCapacity}
                    onChange={(event) => setSignupBedCapacity(event.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="signupBio">Hospital Description</Label>
                  <Textarea
                    id="signupBio"
                    placeholder="Brief description about your hospital..."
                    value={signupBio}
                    onChange={(event) => setSignupBio(event.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="signupPassword">Create Password *</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                    className="mt-1"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <Label htmlFor="signupConfirmPassword">Confirm Password *</Label>
                  <Input
                    id="signupConfirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={signupConfirmPassword}
                    onChange={(event) => setSignupConfirmPassword(event.target.value)}
                    className="mt-1"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary" disabled={isSignupLoading}>
                {isSignupLoading ? 'Registering Hospital...' : 'Register Hospital'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Registration grants immediate access to the hospital dashboard for managing blood requests and patient records in real-time.
        </p>
      </Card>
    </div>
  );
};

export default HospitalAuthSupabase;
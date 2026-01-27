import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorAuthSupabase = () => {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, loading } = useSupabaseAuth();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupBloodGroup, setSignupBloodGroup] = useState('');
  const [signupLastDonation, setSignupLastDonation] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      await login(loginEmail, loginPassword, 'donor');
      navigate('/donor/dashboard');
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupName || !signupBloodGroup || !signupCity || !signupEmail || !signupPhone || !signupPassword) {
      toast.error('Please fill all required fields');
      return;
    }

    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await signup(signupEmail, signupPassword, {
        name: signupName,
        bloodGroup: signupBloodGroup,
        city: signupCity,
        phone: signupPhone,
        lastDonation: signupLastDonation,
        role: 'donor'
      });
      navigate('/donor/dashboard');
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      // Redirect will happen automatically
    } catch (error) {
      // Error is handled in the context
    }
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

        {/* Google Sign In Button */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-6 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 flex items-center justify-center gap-3 py-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginEmail">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-danger" disabled={loading}>
                {loading ? 'Signing in...' : 'Login to Dashboard'}
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
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="signupBloodGroup">Blood Group *</Label>
                <Select value={signupBloodGroup} onValueChange={setSignupBloodGroup} disabled={loading}>
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="signupPassword">Password *</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="mt-1"
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-danger" disabled={loading}>
                {loading ? 'Creating account...' : 'Register as Donor'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => navigate('/')}
          disabled={loading}
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default DonorAuthSupabase;
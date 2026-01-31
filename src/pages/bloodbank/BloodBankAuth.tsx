import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Mail, Lock, Building2, MapPin, Phone, Eye, EyeOff, Chrome, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

const BloodBankAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Login state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Signup state
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
    setShowPassword(false);
    if (value === 'login') {
      resetSignupForm();
    } else {
      resetLoginForm();
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google OAuth integration coming soon!', {
      description: 'This feature will be available in the next update.'
    });
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!loginId || !loginPassword) {
      toast.error('Please provide both Blood Bank ID and password.');
      return;
    }

    setIsLoginLoading(true);
    try {
      const { token, bloodBank } = await authAPI.bloodBankLogin({
        bloodBankId: loginId.trim(),
        password: loginPassword,
      });

      login(
        {
          id: bloodBank.id,
          name: bloodBank.name,
          role: 'bloodbank',
          bloodBankId: bloodBank.bloodBankId,
          location: bloodBank.location,
          city: bloodBank.city,
          contactEmail: bloodBank.contactEmail,
          contactPhone: bloodBank.contactPhone,
        },
        token
      );

      toast.success('Login successful!');
      navigate('/bloodbank/dashboard');
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
      const { token, bloodBank } = await authAPI.bloodBankSignup({
        name: signupName.trim(),
        location: signupLocation.trim(),
        bloodBankId: signupId.trim(),
        password: signupPassword,
        contactEmail: signupEmail.trim(),
        contactPhone: signupPhone.trim(),
      });

      login(
        {
          id: bloodBank.id,
          name: bloodBank.name,
          role: 'bloodbank',
          bloodBankId: bloodBank.bloodBankId,
          location: bloodBank.location,
          city: bloodBank.city,
          contactEmail: bloodBank.contactEmail,
          contactPhone: bloodBank.contactPhone,
        },
        token
      );

      toast.success('Blood Bank registered successfully!');
      navigate('/bloodbank/dashboard');
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
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background with Gradient - Blood Bank Theme (Blue/Cyan) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-background to-cyan-500/5">
        {/* Animated circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Main Auth Card */}
      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-card/80 border-2 border-border/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
        <div className="p-8 md:p-10">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Droplet className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2 animate-fade-in">
              Blood Bank Portal
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Manage blood inventory and save lives
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as 'login' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="loginId" className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Blood Bank ID
                  </Label>
                  <div className="relative group">
                    <Input
                      id="loginId"
                      placeholder="Enter your blood bank ID"
                      value={loginId}
                      onChange={(event) => setLoginId(event.target.value)}
                      className="h-12 pl-4 pr-4 bg-background/50 border-2 border-border/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-blue-500/30"
                    />
                  </div>
                  <p className="text-xs text-blue-600/70 font-medium mt-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    Demo: BBC001
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      className="h-12 pl-4 pr-12 bg-background/50 border-2 border-border/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-blue-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-base shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 border-2 border-border/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 transform hover:scale-[1.02] group"
              >
                <Chrome className="h-5 w-5 mr-2 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-semibold">Continue with Google</span>
              </Button>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup" className="space-y-5">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signupName" className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Blood Bank Name
                  </Label>
                  <Input
                    id="signupName"
                    placeholder="Enter blood bank name"
                    value={signupName}
                    onChange={(event) => setSignupName(event.target.value)}
                    className="h-11 bg-background/50 border-2 border-border/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupLocation" className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Location
                  </Label>
                  <Input
                    id="signupLocation"
                    placeholder="City, State"
                    value={signupLocation}
                    onChange={(event) => setSignupLocation(event.target.value)}
                    className="h-11 bg-background/50 border-2 border-border/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupId" className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Blood Bank ID
                  </Label>
                  <Input
                    id="signupId"
                    placeholder="Unique ID (e.g., BBC123)"
                    value={signupId}
                    onChange={(event) => setSignupId(event.target.value)}
                    className="h-11 bg-background/50 border-2 border-border/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Email Address
                  </Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="contact@bloodbank.com"
                    value={signupEmail}
                    onChange={(event) => setSignupEmail(event.target.value)}
                    className="h-11 bg-background/50 border-2 border-border/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPhone" className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    Phone Number
                  </Label>
                  <Input
                    id="signupPhone"
                    placeholder="+1-555-0100"
                    value={signupPhone}
                    onChange={(event) => setSignupPhone(event.target.value)}
                    className="h-11 bg-background/50 border-2 border-border/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword" className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signupPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password"
                      value={signupPassword}
                      onChange={(event) => setSignupPassword(event.target.value)}
                      className="h-11 pr-12 bg-background/50 border-2 border-border/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-base shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] mt-6"
                  disabled={isSignupLoading}
                >
                  {isSignupLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    'Register Blood Bank'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">Or sign up with</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 border-2 border-border/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 transform hover:scale-[1.02] group"
              >
                <Chrome className="h-5 w-5 mr-2 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-semibold">Sign up with Google</span>
              </Button>
            </TabsContent>
          </Tabs>

          {/* Footer Notice */}
          <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              💉 Professional blood inventory management. Help save lives through efficient distribution.
            </p>
          </div>
        </div>
      </Card>

      {/* Back to Home Link */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-sm text-muted-foreground hover:text-blue-600 transition-colors font-medium flex items-center gap-2 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>
    </div>
  );
};

export default BloodBankAuth;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Login state
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupBloodGroup, setSignupBloodGroup] = useState('');
  const [signupAge, setSignupAge] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation - any name and password is valid
    if (loginName && loginPassword) {
      setIsLoggingIn(true);
      
      // Generate mock token
      const mockToken = 'patient-token-' + Date.now();
      
      // Login with user data and token
      login({
        id: 'patient-' + Date.now(),
        name: loginName,
        role: 'patient',
        email: loginName.toLowerCase().replace(/\s+/g, '.') + '@patient.com'
      }, mockToken);
      
      toast.success('Login successful!');
      
      // Small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/patient/dashboard', { replace: true });
      }, 100);
    } else {
      toast.error('Please enter name and password');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupName || !signupPassword || !signupBloodGroup || !signupAge || !signupCity || !signupPhone) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSigningUp(true);
    
    // Generate mock token
    const mockToken = 'patient-token-' + Date.now();
    
    // Mock signup success - any valid data is accepted
    login({
      id: 'patient-' + Date.now(),
      name: signupName,
      role: 'patient',
      bloodGroup: signupBloodGroup,
      age: signupAge,
      city: signupCity,
      phone: signupPhone,
      email: signupEmail || signupName.toLowerCase().replace(/\s+/g, '.') + '@patient.com'
    }, mockToken);
    
    toast.success('Registration successful!');
    
    // Small delay to ensure state is updated before navigation
    setTimeout(() => {
      navigate('/patient/dashboard', { replace: true });
    }, 100);
  };

  return (
    <div className="min-h-screen w-full bg-background bg-blood-pattern flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card-primary p-6 md:p-8 box-glow">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 box-glow">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">Patient Access</h1>
          <p className="text-sm text-muted-foreground">Request blood from nearby blood banks</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginName">Name</Label>
                <Input
                  id="loginName"
                  type="text"
                  placeholder="Enter your name"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="mt-1"
                  required
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
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login to Dashboard'
                )}
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="signupPassword">Password *</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="mt-1"
                  minLength={6}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signupAge">Age *</Label>
                  <Input
                    id="signupAge"
                    type="number"
                    placeholder="25"
                    value={signupAge}
                    onChange={(e) => setSignupAge(e.target.value)}
                    className="mt-1"
                    min="1"
                    max="120"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signupBloodGroup">Blood Group *</Label>
                  <Select value={signupBloodGroup} onValueChange={setSignupBloodGroup}>
                    <SelectTrigger id="signupBloodGroup" className="mt-1">
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
              <div>
                <Label htmlFor="signupCity">City *</Label>
                <Input
                  id="signupCity"
                  placeholder="Metro City"
                  value={signupCity}
                  onChange={(e) => setSignupCity(e.target.value)}
                  className="mt-1"
                  required
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="signupEmail">Email (Optional)</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register as Patient'
                )}
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

export default PatientAuth;
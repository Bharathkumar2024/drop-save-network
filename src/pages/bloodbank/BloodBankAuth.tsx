import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { mockBloodBanks } from '@/data/mockData';

const BloodBankAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Login state
  const [loginBankId, setLoginBankId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupBankName, setSignupBankName] = useState('');
  const [signupOwnerName, setSignupOwnerName] = useState('');
  const [signupLocation, setSignupLocation] = useState('');
  const [signupBankId, setSignupBankId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [certificates, setCertificates] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setCertificates(fileNames);
      toast.success(`${fileNames.length} certificate(s) uploaded`);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock validation
    const bloodBank = mockBloodBanks.find(bb => bb.bankId === loginBankId);
    if (bloodBank && loginPassword) {
      login({
        id: bloodBank.id,
        name: bloodBank.name,
        role: 'bloodbank',
        bankId: bloodBank.bankId,
        ownerName: bloodBank.ownerName
      });
      toast.success('Login successful!');
      navigate('/bloodbank/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupBankName || !signupOwnerName || !signupLocation || !signupBankId || !signupPassword) {
      toast.error('Please fill all fields');
      return;
    }
    
    if (certificates.length === 0) {
      toast.error('Please upload at least one certificate');
      return;
    }
    
    // Mock signup success
    login({
      id: 'new-bloodbank',
      name: signupBankName,
      role: 'bloodbank',
      bankId: signupBankId,
      ownerName: signupOwnerName
    });
    toast.success('Registration successful!');
    navigate('/bloodbank/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-background bg-blood-pattern flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card-primary p-6 md:p-8 box-glow">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 box-glow">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">Blood Bank Access</h1>
          <p className="text-sm text-muted-foreground">Manage inventory and coordinate deliveries</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginBankId">Blood Bank ID</Label>
                <Input
                  id="loginBankId"
                  placeholder="e.g., CBB001"
                  value={loginBankId}
                  onChange={(e) => setLoginBankId(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Demo ID: CBB001</p>
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
                <Label htmlFor="signupBankName">Blood Bank Name *</Label>
                <Input
                  id="signupBankName"
                  placeholder="Central Blood Bank"
                  value={signupBankName}
                  onChange={(e) => setSignupBankName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupOwnerName">Owner Name *</Label>
                <Input
                  id="signupOwnerName"
                  placeholder="Dr. John Smith"
                  value={signupOwnerName}
                  onChange={(e) => setSignupOwnerName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupLocation">Location / City *</Label>
                <Input
                  id="signupLocation"
                  placeholder="Metro City"
                  value={signupLocation}
                  onChange={(e) => setSignupLocation(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupBankId">Unique Blood Bank ID *</Label>
                <Input
                  id="signupBankId"
                  placeholder="e.g., XYZ001"
                  value={signupBankId}
                  onChange={(e) => setSignupBankId(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signupPassword">Password *</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="Create password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="certificates">Approved Certificates *</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="certificates"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('certificates')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Certificates
                  </Button>
                </div>
                {certificates.length > 0 && (
                  <div className="mt-2 text-xs text-success">
                    ✓ {certificates.length} file(s) uploaded: {certificates.join(', ')}
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full bg-gradient-primary">
                Register Blood Bank
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

export default BloodBankAuth;

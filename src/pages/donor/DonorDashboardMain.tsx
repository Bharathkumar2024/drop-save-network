import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Droplet, Calendar, Gift, Trophy, TrendingUp, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import DonorLayout from '@/components/donor/DonorLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockDonors } from '@/data/mockData';

const DonorDashboardMain = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Find donor data or use first donor as fallback - memoized
  const donor = useMemo(() => 
    mockDonors.find(d => d.id === user?.id) || mockDonors[0],
    [user?.id]
  );
  
  // Calculate donation stats (mock data) - memoized
  const donationStats = useMemo(() => {
    const totalDonations = Math.floor(donor.reputation / 10);
    const livesImpacted = totalDonations * 3;
    const bloodDonatedLiters = (totalDonations * 0.45).toFixed(1);
    
    return {
      totalDonations,
      livesImpacted,
      bloodDonatedLiters
    };
  }, [donor.reputation]);
  
  const { totalDonations, livesImpacted, bloodDonatedLiters } = donationStats;

  return (
    <DonorLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Your impact saves lives</p>
      </div>

      {/* Welcome Card */}
      <Card className="card-royal p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-glow">
            <Heart className="h-10 w-10 text-white" fill="currentColor" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Welcome back, {donor.name}!
            </h2>
            <p className="text-lg text-primary font-medium">
              Thank you for being a life-saver. Your contributions matter.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-2">
              <Droplet className="h-4 w-4 mr-2" />
              {donor.bloodGroup}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Droplet className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Donations</p>
              <p className="text-3xl font-bold text-foreground">{totalDonations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center">
              <Heart className="h-7 w-7 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lives Impacted</p>
              <p className="text-3xl font-bold text-foreground">{livesImpacted}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
              <Trophy className="h-7 w-7 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reputation Score</p>
              <p className="text-3xl font-bold text-foreground">{donor.reputation}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Blood Donation Criteria Section */}
      <Card className="card-royal p-6 md:p-8 mb-8">
        <div className="text-center mb-8">
          <Badge className="bg-primary text-white mb-4">Eligibility Guidelines</Badge>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Blood Donation Criteria
          </h3>
          <p className="text-muted-foreground">
            Please ensure you meet these requirements before donating
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Age Requirement */}
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Age Requirement</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Age between <strong className="text-foreground">18 and 65 years</strong></li>
                <li>• 16–17 year-olds may donate with consent</li>
                <li>• Over 65 with physician approval</li>
              </ul>
            </div>
          </div>

          {/* Weight Requirement */}
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Weight Requirement</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Minimum <strong className="text-foreground">50 kg</strong> body weight</li>
                <li>• 45 kg acceptable for 350 ml donations</li>
              </ul>
            </div>
          </div>

          {/* Health Conditions */}
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Health Conditions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Must be in <strong className="text-foreground">good health</strong></li>
                <li>• No cold, flu, or active infections</li>
                <li>• Wait 6 months after tattoos/piercings</li>
              </ul>
            </div>
          </div>

          {/* Haemoglobin Levels */}
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Droplet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Haemoglobin Levels</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Females: <strong className="text-foreground">≥12.0 g/dl</strong></li>
                <li>• Males: <strong className="text-foreground">≥13.0 g/dl</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Donation Frequency */}
        <div className="mt-8 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Waiting Period Between Donations</h4>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Males:</strong> Every 3 months (12 weeks) • 
                <strong className="text-foreground ml-2">Females:</strong> Every 4 months (16 weeks)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="p-6 cursor-pointer hover-lift hover:border-primary/50 transition-all"
          onClick={() => navigate('/donor/dashboard')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">Upcoming Events</h4>
            <p className="text-xs text-muted-foreground">3 blood drives near you</p>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover-lift hover:border-primary/50 transition-all"
          onClick={() => navigate('/donor/dashboard')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">Last Donation</h4>
            <p className="text-xs text-muted-foreground">{new Date(donor.lastDonationDate).toLocaleDateString()}</p>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover-lift hover:border-primary/50 transition-all"
          onClick={() => navigate('/donor/reputation')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Gift className="h-7 w-7 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">Rewards</h4>
            <p className="text-xs text-muted-foreground">View your rewards</p>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover-lift hover:border-primary/50 transition-all"
          onClick={() => navigate('/donor/reputation')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">Eligible</h4>
            <p className="text-xs text-muted-foreground">Ready to donate</p>
          </div>
        </Card>
      </div>
    </DonorLayout>
  );
};

export default DonorDashboardMain;

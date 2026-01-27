import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Droplet, Calendar, Gift, Trophy, TrendingUp } from 'lucide-react';
import DonorLayout from '@/components/donor/DonorLayout';
import { Card } from '@/components/ui/card';
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Your impact saves lives</p>
      </div>

      {/* Warm Welcome Header */}
      <Card className="glass-card-primary p-6 md:p-8 mb-8 border-2 border-red-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center animate-optimized">
            <Heart className="h-8 w-8 text-white" fill="white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome, {donor.name}!
            </h2>
            <p className="text-base md:text-lg text-red-400 font-semibold">
              Thank you for being a life-saver.
            </p>
          </div>
        </div>
      </Card>

      {/* Blood Donation Criteria Section */}
      <Card className="glass-card p-6 md:p-8 mb-8 border border-red-500/20">
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
            🔴 Blood Donation Criteria for Donors
          </h3>
          <p className="text-sm text-muted-foreground">
            Please ensure you meet these requirements before donating
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Requirement */}
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Age Requirement
            </h4>
            <div className="text-sm md:text-base text-gray-300 space-y-2 pl-7">
              <p>• You are aged between <strong className="text-white">18 and 65 years</strong>.</p>
              <p>• In some countries, 16–17-year-olds may donate with consent and health clearance.</p>
              <p>• Regular donors over 65 years may be accepted with physician approval (some countries set an upper limit of 60 years).</p>
            </div>
          </div>

          {/* Weight Requirement */}
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weight Requirement
            </h4>
            <div className="text-sm md:text-base text-gray-300 space-y-2 pl-7">
              <p>• You must weigh at least <strong className="text-white">50 kg</strong>.</p>
              <p>• In some cases, 45 kg is acceptable for 350 ml ±10% donations.</p>
            </div>
          </div>

          {/* Health Conditions */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Conditions
            </h4>
            <div className="text-sm md:text-base text-gray-300 space-y-2 pl-7">
              <p>• You must be in <strong className="text-white">good health</strong> at the time of donation.</p>
              <p>• Do not donate if you have cold, flu, sore throat, stomach bug, or any infection.</p>
              <p>• Wait <strong className="text-white">6 months</strong> after tattoos or piercings (or 12 hours if done professionally and healed).</p>
              <p>• After dental visits: wait <strong className="text-white">24 hours</strong> for minor, <strong className="text-white">1 month</strong> for major procedures.</p>
            </div>
          </div>

          {/* Haemoglobin Levels */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <Droplet className="h-5 w-5" />
              Minimum Haemoglobin Levels
            </h4>
            <div className="text-sm md:text-base text-gray-300 space-y-2 pl-7 flex gap-8">
              <p>• Females: <strong className="text-white">≥12.0 g/dl</strong></p>
              <p>• Males: <strong className="text-white">≥13.0 g/dl</strong></p>
            </div>
          </div>

          {/* Donation Frequency - Waiting Period */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Donation Frequency - Waiting Period Between Donations
            </h4>
            <div className="text-sm md:text-base text-gray-300 space-y-2 pl-7">
              <p>• <strong className="text-white">Males:</strong> Can donate blood once every <strong className="text-red-400">3 months</strong> (12 weeks)</p>
              <p>• <strong className="text-white">Females:</strong> Can donate blood once every <strong className="text-red-400">4 months</strong> (16 weeks)</p>
              <p className="text-yellow-400 mt-3">⚠️ <strong>Important:</strong> Please wait for the recommended period before your next donation to ensure your body fully recovers and maintains healthy iron levels.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Overview Panel */}
      <Card className="glass-card p-6 mb-8">
        <h3 className="text-2xl font-bold text-red-600 mb-6">Overview Panel</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card-primary p-4 border border-red-500/20">
            <p className="text-sm text-muted-foreground mb-1">Donor Name</p>
            <p className="text-xl font-bold text-white">{donor.name}</p>
          </div>
          <div className="glass-card-primary p-4 border border-red-500/20">
            <p className="text-sm text-muted-foreground mb-1">Total Donations</p>
            <p className="text-xl font-bold text-red-500">{totalDonations}</p>
          </div>
          <div className="glass-card-primary p-4 border border-red-500/20">
            <p className="text-sm text-muted-foreground mb-1">Last Donation</p>
            <p className="text-xl font-bold text-white">
              {new Date(donor.lastDonationDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card 
          className="glass-card p-6 hover:border-red-500/50 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/donor/dashboard')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-red-500" />
            </div>
            <h4 className="font-semibold mb-1">Upcoming Events</h4>
            <p className="text-xs text-muted-foreground">3 blood drives near you</p>
          </div>
        </Card>

        <Card 
          className="glass-card p-6 hover:border-red-500/50 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/donor/dashboard')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-3">
              <Droplet className="h-6 w-6 text-red-500" />
            </div>
            <h4 className="font-semibold mb-1">Donation History</h4>
            <p className="text-xs text-muted-foreground">{totalDonations} total donations</p>
          </div>
        </Card>

        <Card 
          className="glass-card p-6 hover:border-red-500/50 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/donor/reputation')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-3">
              <Gift className="h-6 w-6 text-red-500" />
            </div>
            <h4 className="font-semibold mb-1">Reward Progress</h4>
            <p className="text-xs text-muted-foreground">View your rewards</p>
          </div>
        </Card>

        <Card 
          className="glass-card p-6 hover:border-red-500/50 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/donor/reputation')}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-3">
              <Trophy className="h-6 w-6 text-red-500" />
            </div>
            <h4 className="font-semibold mb-1">Reputational Score</h4>
            <p className="text-xs text-muted-foreground">View your impact</p>
          </div>
        </Card>
      </div>

      {/* Blood Group Info */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your Blood Group</p>
            <p className="text-4xl font-bold text-red-600">{donor.bloodGroup}</p>
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center box-glow">
            <Droplet className="h-10 w-10 text-white" fill="white" />
          </div>
        </div>
      </Card>
    </DonorLayout>
  );
};

export default DonorDashboardMain;
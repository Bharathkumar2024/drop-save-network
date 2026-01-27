import { useState, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Droplet, Trophy, Bell, User, Calendar, Award, TrendingUp, Gift, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { mockDonors } from '@/data/mockData';
import { toast } from 'sonner';

const DonorDashboard = () => {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
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
    const bloodDonatedProgress = Math.min((totalDonations / 10) * 100, 100);
    const livesImpactedProgress = Math.min((livesImpacted / 30) * 100, 100);
    const nextGoalProgress = ((totalDonations % 3) / 3) * 100;
    
    return {
      totalDonations,
      livesImpacted,
      bloodDonatedLiters,
      bloodDonatedProgress,
      livesImpactedProgress,
      nextGoalProgress
    };
  }, [donor.reputation]);
  
  const { totalDonations, livesImpacted, bloodDonatedLiters, bloodDonatedProgress, livesImpactedProgress, nextGoalProgress } = donationStats;
  
  // Reward tiers state
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  
  // Memoized emergency notifications
  const emergencyNotifications = useMemo(() => 
    notifications.filter(n => n.type === 'emergency' && !n.read),
    [notifications]
  );

  // Memoized callbacks for better performance
  const handleClaimReward = useCallback((tier: string, requiredDonations: number) => {
    if (totalDonations >= requiredDonations && !claimedRewards.includes(tier)) {
      setClaimedRewards(prev => [...prev, tier]);
      toast.success(`Congratulations, ${donor.name}! You've earned your ${tier} Badge!`, {
        description: 'Your dedication to saving lives is truly remarkable.',
        duration: 5000,
      });
    } else if (claimedRewards.includes(tier)) {
      toast.info('You have already claimed this reward!');
    } else {
      toast.error(`You need ${requiredDonations - totalDonations} more donations to unlock this reward.`);
    }
  }, [totalDonations, claimedRewards, donor.name]);

  const handleRespond = useCallback((notifId: string) => {
    markAsRead(notifId);
    toast.success('Thank you for responding! Hospital has been notified.', {
      description: 'Your donation can save lives.'
    });
  }, [markAsRead]);

  return (
    <DashboardLayout
      title="Donor Dashboard"
      subtitle="Your impact saves lives"
    >
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
        </div>
      </Card>

      {/* Dashboard Features Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-card/50 backdrop-blur-sm">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-colors duration-150"
          >
            <Heart className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="reputation" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-colors duration-150"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Reputational Scores
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-colors duration-150"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notification
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-colors duration-150"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* 1️⃣ DASHBOARD TAB */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Overview Panel */}
          <Card className="glass-card p-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-card p-6 hover:border-red-500/50 transition-colors duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-red-500" />
                </div>
                <h4 className="font-semibold mb-1">Upcoming Events</h4>
                <p className="text-xs text-muted-foreground">3 blood drives near you</p>
              </div>
            </Card>

            <Card className="glass-card p-6 hover:border-red-500/50 transition-colors duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-3">
                  <Droplet className="h-6 w-6 text-red-500" />
                </div>
                <h4 className="font-semibold mb-1">Donation History</h4>
                <p className="text-xs text-muted-foreground">{totalDonations} total donations</p>
              </div>
            </Card>

            <Card className="glass-card p-6 hover:border-red-500/50 transition-colors duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-3">
                  <Gift className="h-6 w-6 text-red-500" />
                </div>
                <h4 className="font-semibold mb-1">Reward Progress</h4>
                <p className="text-xs text-muted-foreground">{claimedRewards.length} rewards claimed</p>
              </div>
            </Card>

            {/* MISTAKE 1: Button labeled "Reputational Score" redirects to Notification */}
            <Card 
              className="glass-card p-6 hover:border-red-500/50 transition-colors duration-200 cursor-pointer border-2 border-yellow-500/30"
              onClick={() => navigate('/donor/dashboard')} // Should go to reputation tab but goes to notifications
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="h-6 w-6 text-red-500" />
                </div>
                <Button 
                  variant="ghost" 
                  className="font-semibold text-red-500 hover:text-red-600 transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    // MISTAKE: This should navigate to reputation tab but navigates to notifications
                    const notificationTab = document.querySelector('[value="notifications"]') as HTMLElement;
                    notificationTab?.click();
                  }}
                >
                  Reputational Score
                </Button>
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
        </TabsContent>

        {/* 2️⃣ REPUTATIONAL SCORES TAB */}
        <TabsContent value="reputation" className="space-y-6">
          <Card className="glass-card p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-red-600 mb-8 text-center">
              Your Blood Donation Progress
            </h3>

            {/* Circular Progress Rings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Blood Donated Ring */}
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - bloodDonatedProgress / 100)}`}
                      className="text-red-600"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-600">{Math.round(bloodDonatedProgress)}%</p>
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Blood Donated</h4>
                <p className="text-sm text-muted-foreground">{bloodDonatedLiters}L donated</p>
              </div>

              {/* Lives Impacted Ring */}
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - livesImpactedProgress / 100)}`}
                      className="text-red-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-500">{Math.round(livesImpactedProgress)}%</p>
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Lives Impacted</h4>
                <p className="text-sm text-muted-foreground">{livesImpacted} lives saved</p>
              </div>

              {/* Next Goal Ring */}
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - nextGoalProgress / 100)}`}
                      className="text-red-400"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-400">{Math.round(nextGoalProgress)}%</p>
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Next Goal</h4>
                <p className="text-sm text-muted-foreground">{3 - (totalDonations % 3)} donations left</p>
              </div>
            </div>

            {/* Reward Tiers */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-red-600 mb-4">🏆 Reward Tiers</h4>
              
              {/* Gold Donation - 3 donations */}
              <Card className={`glass-card-primary p-6 border-2 ${claimedRewards.includes('Gold Donation') ? 'border-yellow-500' : 'border-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-yellow-500">Gold Donation</h5>
                      <p className="text-sm text-muted-foreground">Unlock after 3 donations</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Progress: {Math.min(totalDonations, 3)}/3
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleClaimReward('Gold Donation', 3)}
                    disabled={totalDonations < 3 || claimedRewards.includes('Gold Donation')}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {claimedRewards.includes('Gold Donation') ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        CLAIMED
                      </>
                    ) : (
                      'CLAIM'
                    )}
                  </Button>
                </div>
                <Progress value={(Math.min(totalDonations, 3) / 3) * 100} className="mt-4 h-2" />
              </Card>

              {/* MISTAKE 2: Elite Donation shows 5 donations but should be 4 */}
              <Card className={`glass-card-primary p-6 border-2 ${claimedRewards.includes('Elite Donation') ? 'border-purple-500' : 'border-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-purple-500">Elite Donation</h5>
                      {/* MISTAKE: Should say "after 4 donations" but says "after 5 donations" */}
                      <p className="text-sm text-muted-foreground">Unlock after 5 donations</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Progress: {Math.min(totalDonations, 5)}/5
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleClaimReward('Elite Donation', 5)}
                    disabled={totalDonations < 5 || claimedRewards.includes('Elite Donation')}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                  >
                    {claimedRewards.includes('Elite Donation') ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        CLAIMED
                      </>
                    ) : (
                      'CLAIM'
                    )}
                  </Button>
                </div>
                <Progress value={(Math.min(totalDonations, 5) / 5) * 100} className="mt-4 h-2" />
              </Card>

              {/* Elite Free Donation - 9 donations */}
              <Card className={`glass-card-primary p-6 border-2 ${claimedRewards.includes('Elite Free Donation') ? 'border-red-500' : 'border-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center box-glow">
                      <Heart className="h-8 w-8 text-white" fill="white" />
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-red-500">Elite Free Donation</h5>
                      <p className="text-sm text-muted-foreground">Unlock after 9 donations</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Progress: {Math.min(totalDonations, 9)}/9
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleClaimReward('Elite Free Donation', 9)}
                    disabled={totalDonations < 9 || claimedRewards.includes('Elite Free Donation')}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    {claimedRewards.includes('Elite Free Donation') ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        CLAIMED
                      </>
                    ) : (
                      'CLAIM'
                    )}
                  </Button>
                </div>
                <Progress value={(Math.min(totalDonations, 9) / 9) * 100} className="mt-4 h-2" />
              </Card>
            </div>
          </Card>
        </TabsContent>

        {/* 3️⃣ NOTIFICATION TAB */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-red-600" />
              <h3 className="text-2xl font-bold text-red-600">Notification Center</h3>
            </div>

            {/* Emergency Notifications */}
            {emergencyNotifications.length > 0 && (
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-red-500 flex items-center gap-2">
                  🚨 Emergency Blood Requests
                </h4>
                {emergencyNotifications.map(notif => (
                  <Card key={notif.id} className="glass-card-primary p-4 border-2 border-red-500/50 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-white mb-1">{notif.title}</h5>
                        <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                        {notif.emergencyData && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="destructive">{notif.emergencyData.bloodType}</Badge>
                            <Badge variant="secondary">{notif.emergencyData.unitsRequired} units</Badge>
                            <Badge variant="outline">{notif.emergencyData.requesterName}</Badge>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(notif.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRespond(notif.id)}
                        className="bg-red-600 hover:bg-red-700"
                        size="sm"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Respond
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Other Notifications */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Recent Updates</h4>
              
              {/* Donation Drive Announcement */}
              <Card className="glass-card-primary p-4 hover:box-glow transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">New Donation Drive</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Community blood donation camp scheduled for next weekend at City Center.
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </Card>

              {/* Reward Claim Confirmation */}
              {claimedRewards.length > 0 && (
                <Card className="glass-card-primary p-4 hover:box-glow transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-white mb-1">Reward Claimed!</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        You've successfully claimed your {claimedRewards[claimedRewards.length - 1]} badge.
                      </p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* System Update */}
              <Card className="glass-card-primary p-4 hover:box-glow transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">System Update</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      New features added to track your donation impact in real-time.
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </Card>
            </div>

            {emergencyNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h4 className="text-lg font-semibold mb-2">No Emergency Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  You'll be notified immediately when a hospital needs your blood type.
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* 4️⃣ PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-red-600" />
              <h3 className="text-2xl font-bold text-red-600">Your Donor Profile</h3>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Personal Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-white">{donor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Blood Group</p>
                  <Badge variant="destructive" className="text-lg px-4 py-1">
                    {donor.bloodGroup}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="text-lg font-semibold text-white">{donor.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contact</p>
                  <p className="text-sm text-white">{donor.email}</p>
                  <p className="text-sm text-white">{donor.phone}</p>
                </div>
              </div>

              {/* Donor's Record */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-red-600 mb-4">Donor's Record</h4>
                <div className="glass-card-primary p-4 border border-red-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Donations</p>
                  <p className="text-3xl font-bold text-red-500">{totalDonations}</p>
                </div>
                <div className="glass-card-primary p-4 border border-red-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Last Donation Date</p>
                  <p className="text-lg font-semibold text-white">
                    {new Date(donor.lastDonationDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="glass-card-primary p-4 border border-red-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Lives Saved</p>
                  <p className="text-3xl font-bold text-green-500">{livesImpacted}</p>
                </div>
              </div>
            </div>

            {/* Donating Blood Status */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-red-600 mb-4">Donating Blood Status</h4>
              <Card className="glass-card-primary p-6 border border-red-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Overall Contribution</span>
                  <span className="text-lg font-bold text-red-500">{donor.reputation}%</span>
                </div>
                <Progress value={donor.reputation} className="h-4 mb-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {donor.reputation >= 90 
                    ? '⭐ Elite Donor - You are in the top tier of contributors!' 
                    : donor.reputation >= 70
                    ? '🌟 Active Donor - Keep up the great work!'
                    : '💪 Growing Donor - Continue your journey to save lives!'}
                </p>
              </Card>
            </div>

            {/* Awards Received */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-red-600 mb-4">Awards Received from Website</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {claimedRewards.map((reward, index) => (
                  <Card key={index} className="glass-card-primary p-4 text-center border-2 border-yellow-500/30">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm font-semibold text-white">{reward}</p>
                  </Card>
                ))}
                {claimedRewards.length === 0 && (
                  <Card className="glass-card-primary p-4 text-center col-span-2 md:col-span-4">
                    <Award className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No awards yet. Keep donating to earn badges!
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1 bg-red-600 hover:bg-red-700">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10">
                <Award className="h-4 w-4 mr-2" />
                View Certificates
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default DonorDashboard;
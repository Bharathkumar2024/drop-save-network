import { useState, useMemo, useCallback } from 'react';
import { Trophy, Award, Heart, CheckCircle } from 'lucide-react';
import DonorLayout from '@/components/donor/DonorLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { mockDonors } from '@/data/mockData';
import { toast } from 'sonner';

const DonorReputation = () => {
  const { user } = useAuth();
  
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

  return (
    <DonorLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Reputational Scores</h1>
        <p className="text-gray-400">Track your impact and earn rewards</p>
      </div>

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

          {/* Elite Donation - 5 donations */}
          <Card className={`glass-card-primary p-6 border-2 ${claimedRewards.includes('Elite Donation') ? 'border-purple-500' : 'border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-purple-500">Elite Donation</h5>
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
    </DonorLayout>
  );
};

export default DonorReputation;
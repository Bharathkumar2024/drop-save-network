import { useState, useMemo } from 'react';
import { User, Award, Trophy } from 'lucide-react';
import DonorLayout from '@/components/donor/DonorLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { mockDonors } from '@/data/mockData';

const DonorProfile = () => {
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
    
    return {
      totalDonations,
      livesImpacted
    };
  }, [donor.reputation]);
  
  const { totalDonations, livesImpacted } = donationStats;

  // Reward tiers state
  const [claimedRewards] = useState<string[]>([]);

  return (
    <DonorLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your donor information</p>
      </div>

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
    </DonorLayout>
  );
};

export default DonorProfile;
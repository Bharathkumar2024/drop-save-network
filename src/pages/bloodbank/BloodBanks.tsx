import { useMemo } from 'react';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockBloodBanks } from '@/data/mockData';
import { Building2, CheckCircle, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleMapWrapper from '@/components/common/GoogleMapWrapper';

interface BloodBankWithStats {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  bankId: string;
  registrationDate: string;
  verified: boolean;
  hospitalsLinked: number;
  totalHospitals: number;
  reputationScore: number;
  successRate: number;
}

const BloodBanks = () => {
  // Generate blood banks with stats
  const bloodBanks = useMemo<BloodBankWithStats[]>(() => {
    return mockBloodBanks.map((bank, index) => ({
      id: bank.id,
      name: bank.name,
      ownerName: bank.ownerName,
      location: bank.location,
      bankId: bank.bankId,
      registrationDate: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      verified: bank.otpVerified,
      hospitalsLinked: Math.floor(Math.random() * 15) + 5,
      totalHospitals: 20,
      reputationScore: bank.reputationScore,
      successRate: bank.successRate,
    }));
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: bloodBanks.length,
      verified: bloodBanks.filter((b) => b.verified).length,
      avgReputation:
        bloodBanks.reduce((sum, b) => sum + b.reputationScore, 0) / bloodBanks.length,
      totalHospitalsLinked: bloodBanks.reduce((sum, b) => sum + b.hospitalsLinked, 0),
    };
  }, [bloodBanks]);

  return (
    <BloodBankLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-glow mb-2">
          Registered Blood Banks
        </h1>
        <p className="text-muted-foreground">
          Network of verified blood banks and their hospital connections
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Banks</p>
              <p className="text-3xl font-bold text-glow mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verified Banks</p>
              <p className="text-3xl font-bold text-green-500 mt-1">{stats.verified}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Reputation</p>
              <p className="text-3xl font-bold text-purple-500 mt-1">
                {stats.avgReputation.toFixed(0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hospital Links</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">
                {stats.totalHospitalsLinked}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="map" className="mt-0">
          <div className="mb-6">
            <GoogleMapWrapper
              height="600px"
              locations={bloodBanks.map(b => ({
                lat: 0,
                lng: 0,
                title: b.name
              }))}
            />
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">

          {/* Blood Banks List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bloodBanks.map((bank) => {
              const linkagePercentage = (bank.hospitalsLinked / bank.totalHospitals) * 100;

              return (
                <Card
                  key={bank.id}
                  className="glass-card p-6 hover:border-red-500/50 transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-glow">{bank.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {bank.bankId}</p>
                      </div>
                    </div>
                    {bank.verified && (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Owner & Location */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="font-medium">{bank.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{bank.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Registered: {new Date(bank.registrationDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Hospital Linkage Ring Visualization */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Hospital Connections</span>
                      <span className="text-sm text-muted-foreground">
                        {bank.hospitalsLinked} / {bank.totalHospitals}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Ring Chart */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <svg className="w-20 h-20 transform -rotate-90">
                          {/* Background circle */}
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-red-500/20"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - linkagePercentage / 100)
                              }`}
                            className="text-red-500 transition-all duration-500"
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* Center percentage */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-glow">
                            {linkagePercentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar Alternative */}
                      <div className="flex-1">
                        <div className="h-2 bg-red-500/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                            style={{ width: `${linkagePercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {linkagePercentage.toFixed(1)}% hospitals connected
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reputation & Success Rate */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Reputation</p>
                      <p className="text-2xl font-bold text-purple-500">
                        {bank.reputationScore}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                      <p className="text-2xl font-bold text-green-500">{bank.successRate}%</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button variant="outline" className="w-full hover:bg-red-500/20">
                    View Details
                  </Button>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </BloodBankLayout>
  );
};

export default BloodBanks;
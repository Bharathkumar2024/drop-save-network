import { useState, useMemo } from 'react';
import { Users, Activity, Heart, AlertCircle, Building2, TrendingUp } from 'lucide-react';
import HospitalLayout from '@/components/hospital/HospitalLayout';
import AdvertisementCarousel from '@/components/hospital/AdvertisementCarousel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockHospitals } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const HospitalDashboardNew = () => {
  const hospital = mockHospitals[0];

  // Calculate statistics
  const patientsNeedingBlood = useMemo(() =>
    hospital.patients.filter(p => p.status === 'requesting'),
    [hospital.patients]
  );

  const patientsReceived = useMemo(() =>
    hospital.patients.filter(p => p.status === 'received'),
    [hospital.patients]
  );

  // Mock connected blood banks count
  const connectedBloodBanks = 5;

  // Mock weekly data for chart
  const weeklyData = [
    { day: 'Mon', requests: 12, fulfilled: 10 },
    { day: 'Tue', requests: 15, fulfilled: 13 },
    { day: 'Wed', requests: 8, fulfilled: 8 },
    { day: 'Thu', requests: 18, fulfilled: 15 },
    { day: 'Fri', requests: 14, fulfilled: 12 },
    { day: 'Sat', requests: 10, fulfilled: 9 },
    { day: 'Sun', requests: 7, fulfilled: 7 },
  ];

  return (
    <HospitalLayout>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl">
        {/* Welcome Message */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-glow mb-2 md:mb-3">
            Welcome to {hospital.name}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Managing blood donation and patient care with excellence
          </p>
        </div>

        {/* Advertisement Carousel */}
        <div className="mb-6 md:mb-8">
          <AdvertisementCarousel
            hospitalName={hospital.name}
            hospitalBio="Providing world-class healthcare services with state-of-the-art facilities and dedicated medical professionals. Committed to saving lives through efficient blood management."
            connectedBloodBanks={connectedBloodBanks}
            patientsNeedingBlood={patientsNeedingBlood.length}
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="glass-card p-4 md:p-6 hover:border-primary/50 transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl md:text-3xl font-bold mt-1">{hospital.patients.length}</p>
                <p className="text-xs text-success mt-1">↑ Active Cases</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 md:p-6 hover:border-destructive/50 transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blood Requests</p>
                <p className="text-2xl md:text-3xl font-bold mt-1 text-destructive">{patientsNeedingBlood.length}</p>
                <p className="text-xs text-destructive mt-1">🚨 Urgent</p>
              </div>
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive animate-pulse" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 md:p-6 hover:border-success/50 transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Donors Connected</p>
                <p className="text-2xl md:text-3xl font-bold mt-1 text-success">{hospital.totalDonorsConnected}</p>
                <p className="text-xs text-success mt-1">↑ +24 this week</p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4 md:p-6 hover:border-accent/50 transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blood Banks</p>
                <p className="text-2xl md:text-3xl font-bold mt-1">{connectedBloodBanks}</p>
                <p className="text-xs text-accent mt-1">Connected</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card p-6 hover:border-destructive/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-destructive/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="h-7 w-7 text-destructive animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Emergency Request</h3>
                <p className="text-sm text-muted-foreground">Send urgent blood alerts</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 hover:border-primary/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Request Blood</h3>
                <p className="text-sm text-muted-foreground">For patient treatment</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 hover:border-success/50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-success/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="h-7 w-7 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-lg">View Records</h3>
                <p className="text-sm text-muted-foreground">Patient blood history</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Blood Requests
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#DC2626" name="Requests" />
                <Bar dataKey="fulfilled" fill="#22C55E" name="Fulfilled" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-success" />
              Fulfillment Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="fulfilled"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{ fill: '#22C55E', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 text-glow">Recent Patient Activity</h3>
          <div className="space-y-3">
            {hospital.patients.slice(0, 5).map(patient => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${patient.status === 'requesting' ? 'bg-destructive animate-pulse' : 'bg-success'}`} />
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.case}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="destructive">{patient.bloodTypeNeeded}</Badge>
                  <span className="text-sm font-medium">{patient.unitsRequired} units</span>
                  <Badge variant={patient.status === 'requesting' ? 'destructive' : 'success'}>
                    {patient.status === 'requesting' ? 'Requesting' : 'Received'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default HospitalDashboardNew;
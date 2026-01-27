import { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Calendar, Users, Activity, Award } from 'lucide-react';
import HospitalLayout from '@/components/hospital/HospitalLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockHospitals, mockBloodBanks } from '@/data/mockData';

const HospitalProfile = () => {
  const hospital = mockHospitals[0];
  const connectedBloodBanks = mockBloodBanks;

  // Mock newly registered blood banks
  const newBloodBanks = [
    {
      id: 'new1',
      name: 'Metro Blood Center',
      location: 'North District',
      registeredDate: '2025-10-08',
      distance: '2.5 km'
    },
    {
      id: 'new2',
      name: 'City Life Blood Bank',
      location: 'East Zone',
      registeredDate: '2025-10-05',
      distance: '3.8 km'
    }
  ];

  return (
    <HospitalLayout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-glow mb-3 flex items-center gap-3">
            <Building2 className="h-10 w-10 text-primary" />
            Hospital Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your hospital information and connections
          </p>
        </div>

        {/* Hospital Information Card */}
        <Card className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Hospital Logo/Icon */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* Hospital Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{hospital.name}</h2>
                  <Badge variant="success" className="text-sm">
                    <Activity className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <Button variant="outline">Edit Profile</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold">{hospital.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hospital ID</p>
                    <p className="font-semibold">{hospital.hospitalId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="font-semibold">+1-555-HOSPITAL</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold">info@citygeneralhospital.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Registered Since</p>
                    <p className="font-semibold">January 2020</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Certification</p>
                    <p className="font-semibold">ISO 9001:2015</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-bold mt-1">{hospital.patients.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blood Banks</p>
                <p className="text-3xl font-bold mt-1">{connectedBloodBanks.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Donors</p>
                <p className="text-3xl font-bold mt-1">{hospital.totalDonorsConnected}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </Card>

          <Card className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Units Received</p>
                <p className="text-3xl font-bold mt-1">{hospital.totalBloodUnitsReceived}</p>
              </div>
              <Activity className="h-8 w-8 text-destructive" />
            </div>
          </Card>
        </div>

        {/* Tabs for Blood Banks */}
        <Card className="glass-card p-6">
          <Tabs defaultValue="connected" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="connected">
                Connected Blood Banks ({connectedBloodBanks.length})
              </TabsTrigger>
              <TabsTrigger value="new">
                Newly Registered ({newBloodBanks.length})
              </TabsTrigger>
            </TabsList>

            {/* Connected Blood Banks */}
            <TabsContent value="connected">
              <div className="space-y-4">
                {connectedBloodBanks.map(bank => (
                  <div
                    key={bank.id}
                    className="glass-card-primary p-5 rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center">
                          <Building2 className="h-7 w-7 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{bank.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {bank.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          <Award className="h-3 w-3 mr-1" />
                          {bank.reputationScore}%
                        </Badge>
                        <Badge variant="success">Connected</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Bank ID</p>
                        <p className="font-semibold text-sm">{bank.bankId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Blood Units</p>
                        <p className="font-semibold text-sm">
                          {bank.preservationList.reduce((sum, unit) => sum + unit.unitsAvailable, 0)} units
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                        <p className="font-semibold text-sm text-success">{bank.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dispatches</p>
                        <p className="font-semibold text-sm">{bank.sendRecords.length}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="default" className="flex-1">
                        Request Blood
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Newly Registered Blood Banks */}
            <TabsContent value="new">
              <div className="space-y-4">
                {newBloodBanks.map(bank => (
                  <div
                    key={bank.id}
                    className="glass-card-primary p-5 rounded-lg border border-border/50 hover:border-success/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-success/20 rounded-full flex items-center justify-center">
                          <Building2 className="h-7 w-7 text-success" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{bank.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {bank.location}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">
                        <Activity className="h-3 w-3 mr-1 animate-pulse" />
                        New
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Registered</p>
                        <p className="font-semibold text-sm">
                          {new Date(bank.registeredDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="font-semibold text-sm">{bank.distance}</p>
                      </div>
                    </div>

                    <Button size="sm" variant="default" className="w-full">
                      Connect with Blood Bank
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default HospitalProfile;
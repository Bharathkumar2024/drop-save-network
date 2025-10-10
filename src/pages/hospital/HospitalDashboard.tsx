import { useState } from 'react';
import { Users, Activity, Heart, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import EmergencyButton from '@/components/shared/EmergencyButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockHospitals, bloodTypeDistribution, Patient } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COLORS = ['#DC2626', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

const HospitalDashboard = () => {
  const hospital = mockHospitals[0];
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const patientsNeedingBlood = hospital.patients.filter(p => p.status === 'requesting');
  const patientsReceived = hospital.patients.filter(p => p.status === 'received');
  const needingPercentage = (patientsNeedingBlood.length / hospital.patients.length) * 100;
  const receivedPercentage = (patientsReceived.length / hospital.patients.length) * 100;

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditMode(true);
  };

  return (
    <DashboardLayout
      title={hospital.name}
      subtitle={`${hospital.location} • ID: ${hospital.hospitalId}`}
    >
      <EmergencyButton />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="glass-card p-4 md:p-6 hover:box-glow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <p className="text-2xl md:text-3xl font-bold mt-1">{hospital.patients.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 md:p-6 hover:box-glow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Blood Requests</p>
              <p className="text-2xl md:text-3xl font-bold mt-1 text-destructive">{patientsNeedingBlood.length}</p>
            </div>
            <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 md:p-6 hover:box-glow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Donors Connected</p>
              <p className="text-2xl md:text-3xl font-bold mt-1 text-success">{hospital.totalDonorsConnected}</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 md:p-6 hover:box-glow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Units Received</p>
              <p className="text-2xl md:text-3xl font-bold mt-1">{hospital.totalBloodUnitsReceived}</p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Card>
      </div>

      {/* Blood Need Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Patients Needing Blood</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Requesting Blood</span>
              <span className="font-bold text-destructive">{patientsNeedingBlood.length}/{hospital.patients.length}</span>
            </div>
            <Progress value={needingPercentage} className="h-3" />
            <p className="text-xs text-center font-semibold text-destructive">{needingPercentage.toFixed(0)}% Need Blood</p>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Patients Received Blood</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Received Blood</span>
              <span className="font-bold text-success">{patientsReceived.length}/{hospital.patients.length}</span>
            </div>
            <Progress value={receivedPercentage} className="h-3" />
            <p className="text-xs text-center font-semibold text-success">{receivedPercentage.toFixed(0)}% Fulfilled</p>
          </div>
        </Card>
      </div>

      {/* Quick Status Strip */}
      <Card className="glass-card p-4 mb-6">
        <h3 className="text-sm font-semibold mb-3">Quick Patient Status</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {hospital.patients.map(patient => (
            <div
              key={patient.id}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 whitespace-nowrap cursor-pointer hover:bg-muted transition-colors"
              onClick={() => handleEditPatient(patient)}
            >
              <div className={`w-2 h-2 rounded-full ${patient.status === 'requesting' ? 'bg-destructive animate-pulse' : 'bg-success'}`} />
              <span className="text-xs font-medium">{patient.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Patients List */}
      <Card className="glass-card p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-glow">Patient Records</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full space-y-3">
            {hospital.patients.map(patient => (
              <div
                key={patient.id}
                className="glass-card-primary p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => handleEditPatient(patient)}
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Room</p>
                    <p className="font-medium">{patient.roomNo}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Case</p>
                    <p className="font-medium">{patient.case}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Blood Type</p>
                    <Badge variant="destructive">{patient.bloodTypeNeeded}</Badge>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Units</p>
                    <p className="font-bold">{patient.unitsRequired}</p>
                  </div>
                  <div className="flex justify-end">
                    <Badge variant={patient.status === 'requesting' ? 'destructive' : 'success'}>
                      {patient.status === 'requesting' ? '🔴 Requesting' : '🟢 Received'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Blood Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={bloodTypeDistribution}
                dataKey="percentage"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {bloodTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Blood Units Available</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bloodTypeDistribution}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="units" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Edit Patient Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div>
                <Label>Patient Name</Label>
                <Input value={selectedPatient.name} className="mt-1" readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Age</Label>
                  <Input value={selectedPatient.age} className="mt-1" readOnly />
                </div>
                <div>
                  <Label>Room No</Label>
                  <Input value={selectedPatient.roomNo} className="mt-1" readOnly />
                </div>
              </div>
              <div>
                <Label>Case / Injury</Label>
                <Input value={selectedPatient.case} className="mt-1" readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Blood Type Needed</Label>
                  <Input value={selectedPatient.bloodTypeNeeded} className="mt-1" readOnly />
                </div>
                <div>
                  <Label>Units Required</Label>
                  <Input value={selectedPatient.unitsRequired} className="mt-1" readOnly />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={selectedPatient.status}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requesting">Requesting</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => setEditMode(false)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default HospitalDashboard;

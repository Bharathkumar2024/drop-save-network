import { useState, useMemo } from 'react';
import { FileText, Search, Filter, Download, Calendar } from 'lucide-react';
import HospitalLayout from '@/components/hospital/HospitalLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockHospitals, mockBloodBanks } from '@/data/mockData';

interface BloodRecord {
  id: string;
  patientName: string;
  bloodGroup: string;
  bloodBankName: string;
  unitsReceived: number;
  dateReceived: string;
  timeReceived: string;
}

const HospitalPatientRecords = () => {
  const hospital = mockHospitals[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock blood records - in real app, this would come from Supabase
  const bloodRecords: BloodRecord[] = useMemo(() => {
    return hospital.patients
      .filter(p => p.status === 'received')
      .map(patient => ({
        id: patient.id,
        patientName: patient.name,
        bloodGroup: patient.bloodTypeNeeded,
        bloodBankName: mockBloodBanks[0].name,
        unitsReceived: patient.unitsRequired,
        dateReceived: new Date(patient.admittedDate).toLocaleDateString(),
        timeReceived: '14:30'
      }));
  }, [hospital.patients]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return bloodRecords.filter(record => {
      const matchesSearch = record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.bloodBankName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBloodType = filterBloodType === 'all' || record.bloodGroup === filterBloodType;
      
      return matchesSearch && matchesBloodType;
    });
  }, [bloodRecords, searchQuery, filterBloodType]);

  // Statistics
  const totalUnitsReceived = bloodRecords.reduce((sum, record) => sum + record.unitsReceived, 0);
  const uniqueBloodBanks = new Set(bloodRecords.map(r => r.bloodBankName)).size;

  const handleExportRecords = () => {
    // In real app, this would generate and download a CSV/PDF
    alert('Exporting records... (Feature to be implemented)');
  };

  return (
    <HospitalLayout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-glow mb-3 flex items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            Patient Blood Records
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time history of blood received by patients
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-3xl font-bold mt-1">{bloodRecords.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Units Received</p>
                <p className="text-3xl font-bold mt-1">{totalUnitsReceived}</p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blood Banks</p>
                <p className="text-3xl font-bold mt-1">{uniqueBloodBanks}</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold mt-1">{bloodRecords.length}</p>
              </div>
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or blood bank..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Select value={filterBloodType} onValueChange={setFilterBloodType}>
                <SelectTrigger className="w-[150px] h-11">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Blood Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleExportRecords} className="h-11">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Records Table */}
        <Card className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">Blood Received Records</h2>

          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {searchQuery || filterBloodType !== 'all' 
                  ? 'No records match your filters' 
                  : 'No blood records available yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 font-semibold">Patient Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Blood Group</th>
                    <th className="text-left py-3 px-4 font-semibold">Blood Bank</th>
                    <th className="text-left py-3 px-4 font-semibold">Units</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr 
                      key={record.id}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-semibold">{record.patientName}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="destructive">{record.bloodGroup}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{record.bloodBankName}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-lg">{record.unitsReceived}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{record.dateReceived}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{record.timeReceived}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="success">✓ Received</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Recent Activity Timeline */}
        <Card className="glass-card p-6 mt-6">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {filteredRecords.slice(0, 5).map((record, index) => (
              <div key={record.id} className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  {index < filteredRecords.slice(0, 5).length - 1 && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-border/50" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-semibold">{record.patientName} received blood</p>
                  <p className="text-sm text-muted-foreground">
                    {record.unitsReceived} units of {record.bloodGroup} from {record.bloodBankName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {record.dateReceived} at {record.timeReceived}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default HospitalPatientRecords;
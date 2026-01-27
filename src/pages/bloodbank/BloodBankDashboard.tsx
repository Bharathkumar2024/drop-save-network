import { useMemo, useCallback } from 'react';
import { Package, TruckIcon, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import EmergencyButton from '@/components/shared/EmergencyButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockBloodBanks, bloodTypeDistribution, successRateTimeSeries } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#DC2626', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

const BloodBankDashboard = () => {
  const bloodBank = mockBloodBanks[0];
  
  // Performance: Memoize expensive calculations
  const totalStock = useMemo(() => 
    bloodBank.preservationList.reduce((sum, unit) => sum + unit.unitsAvailable, 0),
    [bloodBank.preservationList]
  );
  
  const maxCapacity = 300;
  
  const stockPercentage = useMemo(() => 
    (totalStock / maxCapacity) * 100,
    [totalStock]
  );
  
  // Performance: Memoize filtered arrays
  const availableUnits = useMemo(() => 
    bloodBank.preservationList.filter(u => u.status === 'available'),
    [bloodBank.preservationList]
  );
  
  const reservedUnits = useMemo(() => 
    bloodBank.preservationList.filter(u => u.status === 'reserved'),
    [bloodBank.preservationList]
  );
  
  const dispatchedUnits = useMemo(() => 
    bloodBank.preservationList.filter(u => u.status === 'dispatched'),
    [bloodBank.preservationList]
  );

  // Performance: useCallback for event handlers
  const handleExportRecord = useCallback((recordId: string) => {
    toast.success('Send record exported successfully', {
      description: 'Safety record has been generated for download'
    });
  }, []);

  // Performance: useCallback for utility functions
  const isNearExpiry = useCallback((expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days <= 7;
  }, []);

  const isExpired = useCallback((expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  }, []);

  return (
    <DashboardLayout
      title={bloodBank.name}
      subtitle={`${bloodBank.location} • ID: ${bloodBank.bankId}`}
    >
      <EmergencyButton />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="glass-card p-4 md:p-6 hover:border-primary/50 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Blood Stock</p>
              <p className="text-2xl md:text-3xl font-bold mt-1">{totalStock}</p>
              <p className="text-xs text-muted-foreground">units</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 md:p-6 hover:border-success/50 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl md:text-3xl font-bold mt-1 text-success">{bloodBank.successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 md:p-6 hover:border-accent/50 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Shipments</p>
              <p className="text-2xl md:text-3xl font-bold mt-1">{reservedUnits.length + dispatchedUnits.length}</p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <TruckIcon className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 md:p-6 hover:border-primary/50 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reputation</p>
              <p className="text-2xl md:text-3xl font-bold mt-1 text-primary">{bloodBank.reputationScore}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Stock Level */}
      <Card className="glass-card p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Overall Blood Stock Level</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Stock / Capacity</span>
            <span className="font-bold">{totalStock} / {maxCapacity} units</span>
          </div>
          <Progress value={stockPercentage} className="h-4" />
          <p className="text-xs text-center font-semibold text-primary">{stockPercentage.toFixed(1)}% Stock Level</p>
        </div>
      </Card>

      {/* Preservation Blood List */}
      <Card className="glass-card p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 text-glow">Blood Preservation Inventory</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full space-y-3">
            {bloodBank.preservationList.map(unit => {
              const nearExpiry = isNearExpiry(unit.expiryDate);
              const expired = isExpired(unit.expiryDate);
              
              return (
                <div
                  key={unit.id}
                  className={`glass-card-primary p-4 rounded-lg border transition-all ${
                    expired ? 'border-destructive/50 bg-destructive/5' : 
                    nearExpiry ? 'border-yellow-500/50 bg-yellow-500/5' : 
                    'border-border/50 hover:border-primary/50'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                    <div>
                      <p className="font-semibold text-lg">{unit.bloodType}</p>
                      {expired && <Badge variant="destructive" className="mt-1">Expired</Badge>}
                      {nearExpiry && !expired && <Badge className="mt-1 bg-yellow-500">Expiring Soon</Badge>}
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Units</p>
                      <p className="font-bold text-lg">{unit.unitsAvailable}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Storage</p>
                      <p className="font-medium">{unit.storageConditions}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Collection</p>
                      <p className="font-medium">{new Date(unit.collectionDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Expiry</p>
                      <p className="font-medium">{new Date(unit.expiryDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Batch ID</p>
                      <p className="font-mono text-xs">{unit.batchId}</p>
                    </div>
                    <div className="flex justify-end">
                      <Badge variant={
                        unit.status === 'available' ? 'success' : 
                        unit.status === 'reserved' ? 'secondary' : 
                        'outline'
                      }>
                        {unit.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Send Records (Audit Trail) */}
      <Card className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <h3 className="text-xl font-bold text-glow">Shipment & Safety Records</h3>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export All Records
          </Button>
        </div>
        <div className="space-y-3">
          {bloodBank.sendRecords.map(record => (
            <div key={record.id} className="glass-card-primary p-4 rounded-lg border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                <div>
                  <p className="font-semibold">{record.hospitalName}</p>
                  <p className="text-xs text-muted-foreground">ID: {record.hospitalId}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Blood Types</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {record.bloodTypes.map(type => (
                      <Badge key={type} variant="destructive" className="text-xs">{type}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Units Sent</p>
                  <p className="font-bold text-lg">{record.unitsSent}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Dispatch Time</p>
                  <p className="font-medium">{new Date(record.dispatchTimestamp).toLocaleString()}</p>
                </div>
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleExportRecord(record.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Transport:</span> {record.transportConditions}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-semibold">Staff:</span> {record.responsibleStaff}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Blood Stock Distribution</h3>
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

        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Success Rate Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={successRateTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" />
              <YAxis domain={[85, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#22C55E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Stock Status Pie Chart */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Stock Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Available', value: availableUnits.length, fill: '#22C55E' },
                { name: 'Reserved', value: reservedUnits.length, fill: '#F97316' },
                { name: 'Dispatched', value: dispatchedUnits.length, fill: '#3B82F6' }
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </DashboardLayout>
  );
};

export default BloodBankDashboard;

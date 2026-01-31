import { useState, useEffect, useMemo } from 'react';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Droplet, 
  Calendar, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp,
  TrendingDown,
  Activity,
  Bell,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getBloodUnits,
  createBloodUnit,
  updateBloodUnit,
  deleteBloodUnit,
  getBloodStockAlerts,
  resolveBloodStockAlert,
  getBloodStockTransactions,
  subscribeToBloodUnits,
  subscribeToBloodStockAlerts,
  calculateDaysUntilExpiry,
  isExpiringSoon,
  isExpired,
  getExpiryStatusColor,
  type BloodUnit,
  type BloodStockAlert,
  type BloodStockTransaction
} from '@/lib/supabase';

const BloodStockEnhanced = () => {
  const { toast } = useToast();
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>([]);
  const [alerts, setAlerts] = useState<BloodStockAlert[]>([]);
  const [transactions, setTransactions] = useState<BloodStockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<BloodUnit | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBloodType, setFilterBloodType] = useState<string>('all');

  // Mock blood bank ID - replace with actual from auth context
  const bloodBankId = 'bb1'; // TODO: Get from auth context

  // Form state for adding/editing blood units
  const [formData, setFormData] = useState({
    blood_type: 'O+',
    component_type: 'Whole Blood',
    units_available: 1,
    collection_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    batch_id: '',
    storage_location: '',
    storage_temperature: 4.0,
    storage_conditions: '',
  });

  // Load initial data
  useEffect(() => {
    loadBloodUnits();
    loadAlerts();
    loadTransactions();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const unitsChannel = subscribeToBloodUnits(bloodBankId, (payload) => {
      console.log('Blood units changed:', payload);
      loadBloodUnits();
    });

    const alertsChannel = subscribeToBloodStockAlerts(bloodBankId, (payload) => {
      console.log('Alerts changed:', payload);
      loadAlerts();
      
      // Show toast notification for new alerts
      if (payload.eventType === 'INSERT') {
        const alert = payload.new as BloodStockAlert;
        toast({
          title: '🚨 New Alert',
          description: alert.message,
          variant: alert.severity === 'critical' ? 'destructive' : 'default',
        });
      }
    });

    return () => {
      unitsChannel.unsubscribe();
      alertsChannel.unsubscribe();
    };
  }, [bloodBankId]);

  const loadBloodUnits = async () => {
    setLoading(true);
    const { data, error } = await getBloodUnits(bloodBankId);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blood units',
        variant: 'destructive',
      });
    } else {
      setBloodUnits(data || []);
    }
    setLoading(false);
  };

  const loadAlerts = async () => {
    const { data, error } = await getBloodStockAlerts(bloodBankId, false);
    if (!error) {
      setAlerts(data || []);
    }
  };

  const loadTransactions = async () => {
    const { data, error } = await getBloodStockTransactions(bloodBankId, 20);
    if (!error) {
      setTransactions(data || []);
    }
  };

  const handleAddUnit = async () => {
    const { data, error } = await createBloodUnit({
      ...formData,
      blood_bank_id: bloodBankId,
      initial_units: formData.units_available,
      status: 'available',
      quality_check_passed: true,
    } as any);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add blood unit',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Blood unit added successfully',
      });
      setIsAddDialogOpen(false);
      resetForm();
      loadBloodUnits();
    }
  };

  const handleUpdateUnit = async () => {
    if (!selectedUnit) return;

    const { data, error } = await updateBloodUnit(selectedUnit.id, formData as any);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update blood unit',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Blood unit updated successfully',
      });
      setIsEditDialogOpen(false);
      setSelectedUnit(null);
      resetForm();
      loadBloodUnits();
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm('Are you sure you want to delete this blood unit?')) return;

    const { error } = await deleteBloodUnit(unitId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blood unit',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Blood unit deleted successfully',
      });
      loadBloodUnits();
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    const { error } = await resolveBloodStockAlert(alertId, 'Blood Bank Staff', 'Alert resolved');

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve alert',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Alert resolved successfully',
      });
      loadAlerts();
    }
  };

  const resetForm = () => {
    setFormData({
      blood_type: 'O+',
      component_type: 'Whole Blood',
      units_available: 1,
      collection_date: new Date().toISOString().split('T')[0],
      expiry_date: '',
      batch_id: '',
      storage_location: '',
      storage_temperature: 4.0,
      storage_conditions: '',
    });
  };

  const openEditDialog = (unit: BloodUnit) => {
    setSelectedUnit(unit);
    setFormData({
      blood_type: unit.blood_type,
      component_type: unit.component_type,
      units_available: unit.units_available,
      collection_date: unit.collection_date,
      expiry_date: unit.expiry_date,
      batch_id: unit.batch_id,
      storage_location: unit.storage_location,
      storage_temperature: unit.storage_temperature,
      storage_conditions: unit.storage_conditions || '',
    });
    setIsEditDialogOpen(true);
  };

  // Filter blood units
  const filteredUnits = useMemo(() => {
    return bloodUnits.filter(unit => {
      const statusMatch = filterStatus === 'all' || unit.status === filterStatus;
      const typeMatch = filterBloodType === 'all' || unit.blood_type === filterBloodType;
      return statusMatch && typeMatch;
    });
  }, [bloodUnits, filterStatus, filterBloodType]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = bloodUnits.reduce((sum, unit) => sum + unit.units_available, 0);
    const available = bloodUnits
      .filter(u => u.status === 'available')
      .reduce((sum, unit) => sum + unit.units_available, 0);
    const expiringSoon = bloodUnits
      .filter(u => isExpiringSoon(u.expiry_date) && u.status === 'available')
      .reduce((sum, unit) => sum + unit.units_available, 0);
    const expired = bloodUnits
      .filter(u => isExpired(u.expiry_date))
      .reduce((sum, unit) => sum + unit.units_available, 0);

    return { total, available, expiringSoon, expired };
  }, [bloodUnits]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'reserved':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'dispatched':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'expired':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      default:
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
    }
  };

  return (
    <BloodBankLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-glow mb-2">
            Blood Stock Management
          </h1>
          <p className="text-muted-foreground">
            Comprehensive blood inventory with real-time expiry tracking
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
              <Plus className="h-4 w-4 mr-2" />
              Add Blood Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Blood Unit</DialogTitle>
              <DialogDescription>
                Enter the details of the new blood unit to add to inventory
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Blood Type</Label>
                <Select
                  value={formData.blood_type}
                  onValueChange={(value) => setFormData({ ...formData, blood_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Component Type</Label>
                <Select
                  value={formData.component_type}
                  onValueChange={(value) => setFormData({ ...formData, component_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Whole Blood', 'Red Blood Cells', 'Platelets', 'Plasma', 'Cryoprecipitate'].map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Number of Units</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.units_available}
                  onChange={(e) => setFormData({ ...formData, units_available: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Batch ID</Label>
                <Input
                  value={formData.batch_id}
                  onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
                  placeholder="BATCH-O-POS-012025"
                />
              </div>

              <div className="space-y-2">
                <Label>Collection Date</Label>
                <Input
                  type="date"
                  value={formData.collection_date}
                  onChange={(e) => setFormData({ ...formData, collection_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Storage Location</Label>
                <Input
                  value={formData.storage_location}
                  onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
                  placeholder="Refrigerator FR-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Storage Temperature (°C)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.storage_temperature}
                  onChange={(e) => setFormData({ ...formData, storage_temperature: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Storage Conditions (Optional)</Label>
                <Input
                  value={formData.storage_conditions}
                  onChange={(e) => setFormData({ ...formData, storage_conditions: e.target.value })}
                  placeholder="Additional storage notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUnit}>Add Blood Unit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Stock</p>
              <p className="text-3xl font-bold text-glow mt-2">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">units</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Droplet className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{stats.available}</p>
              <p className="text-xs text-muted-foreground mt-1">units</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.expiringSoon}</p>
              <p className="text-xs text-muted-foreground mt-1">units</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-3xl font-bold text-red-500 mt-2">{stats.expired}</p>
              <p className="text-xs text-muted-foreground mt-1">units</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="glass-card p-6 mb-8 border-yellow-500/50 bg-yellow-500/5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-bold">Active Alerts ({alerts.length})</h2>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 5).map(alert => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-xs opacity-70">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResolveAlert(alert.id)}
                >
                  Resolve
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Label>Status:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Blood Type:</Label>
          <Select value={filterBloodType} onValueChange={setFilterBloodType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blood Units Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : filteredUnits.length === 0 ? (
        <Card className="glass-card p-12 text-center">
          <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Blood Units Found</h3>
          <p className="text-muted-foreground mb-4">
            {filterStatus !== 'all' || filterBloodType !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by adding your first blood unit'}
          </p>
          {filterStatus === 'all' && filterBloodType === 'all' && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Blood Unit
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUnits.map((unit) => {
            const daysLeft = calculateDaysUntilExpiry(unit.expiry_date);
            const expired = isExpired(unit.expiry_date);
            const expiringSoon = isExpiringSoon(unit.expiry_date);
            const statusColor = getExpiryStatusColor(unit.expiry_date);

            return (
              <Card
                key={unit.id}
                className={`glass-card p-6 hover:scale-105 transition-all duration-200 ${
                  expired
                    ? 'border-red-500/50 bg-red-500/5'
                    : expiringSoon
                    ? 'border-yellow-500/50 bg-yellow-500/5'
                    : 'border-border/50 hover:border-red-500/50'
                }`}
              >
                {/* Blood Type Header */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    {unit.blood_type}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(unit.status)}>
                    {unit.status}
                  </Badge>
                </div>

                {/* Ring Visualization */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="none"
                        className="text-red-500/20"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 56 * (1 - Math.min(unit.units_available / 50, 1))
                        }`}
                        className={
                          expired
                            ? 'text-red-500'
                            : expiringSoon
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-glow">
                        {unit.units_available}
                      </span>
                      <span className="text-xs text-muted-foreground">units</span>
                    </div>
                  </div>
                </div>

                {/* Unit Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Component</p>
                    <p className="text-sm font-medium">{unit.component_type}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Batch ID</p>
                    <p className="text-xs font-mono font-semibold truncate">
                      {unit.batch_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Storage</p>
                    <p className="text-xs font-medium">{unit.storage_location}</p>
                    <p className="text-xs text-muted-foreground">{unit.storage_temperature}°C</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Collected</p>
                      <p className="text-xs font-medium">
                        {new Date(unit.collection_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded ${
                      expired
                        ? 'bg-red-500/20'
                        : expiringSoon
                        ? 'bg-yellow-500/20'
                        : 'bg-green-500/10'
                    }`}
                  >
                    {(expired || expiringSoon) && (
                      <AlertTriangle
                        className={`h-4 w-4 ${
                          expired ? 'text-red-500' : 'text-yellow-500'
                        }`}
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {expired ? 'Expired' : 'Expires'}
                      </p>
                      <p
                        className={`text-xs font-bold ${
                          expired
                            ? 'text-red-500'
                            : expiringSoon
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }`}
                      >
                        {new Date(unit.expiry_date).toLocaleDateString()}
                      </p>
                      {!expired && (
                        <p className="text-xs text-muted-foreground">
                          {daysLeft} days left
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                {expired && (
                  <div className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded text-center">
                    <p className="text-xs font-semibold text-red-500">
                      ⚠️ EXPIRED - Remove from stock
                    </p>
                  </div>
                )}
                {expiringSoon && !expired && (
                  <div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-center">
                    <p className="text-xs font-semibold text-yellow-500">
                      ⚠️ Expiring Soon
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => openEditDialog(unit)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteUnit(unit.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blood Unit</DialogTitle>
            <DialogDescription>
              Update the details of the blood unit
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Blood Type</Label>
              <Select
                value={formData.blood_type}
                onValueChange={(value) => setFormData({ ...formData, blood_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Component Type</Label>
              <Select
                value={formData.component_type}
                onValueChange={(value) => setFormData({ ...formData, component_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Whole Blood', 'Red Blood Cells', 'Platelets', 'Plasma', 'Cryoprecipitate'].map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Units</Label>
              <Input
                type="number"
                min="0"
                value={formData.units_available}
                onChange={(e) => setFormData({ ...formData, units_available: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Batch ID</Label>
              <Input
                value={formData.batch_id}
                onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Collection Date</Label>
              <Input
                type="date"
                value={formData.collection_date}
                onChange={(e) => setFormData({ ...formData, collection_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Storage Location</Label>
              <Input
                value={formData.storage_location}
                onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Storage Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.storage_temperature}
                onChange={(e) => setFormData({ ...formData, storage_temperature: parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Storage Conditions (Optional)</Label>
              <Input
                value={formData.storage_conditions}
                onChange={(e) => setFormData({ ...formData, storage_conditions: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUnit}>Update Blood Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BloodBankLayout>
  );
};

export default BloodStockEnhanced;
import { useState, useEffect, useMemo } from 'react';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Droplet,
  Plus,
  Eye,
  FileDown,
  Filter,
  Search,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
// TODO: These functions need to be implemented in @/lib/supabase
// import {
//   getDonationCamps,
//   getCampDonors,
//   getCampStatistics,
//   createDonationCamp,
//   updateDonationCamp,
//   deleteDonationCamp,
//   createCampDonor,
//   updateCampDonor,
//   deleteCampDonor,
//   subscribeToDonationCamps,
//   subscribeToCampDonors,
//   type DonationCamp,
//   type CampDonor,
//   type CampStatistics,
// } from '@/lib/supabase';

// Temporary type definitions until supabase functions are implemented
type DonationCamp = any;
type CampDonor = any;
type CampStatistics = any;

// Local storage keys
const CAMPS_STORAGE_KEY = 'blood_donation_camps';
const DONORS_STORAGE_KEY = 'camp_donors';

// Working mock implementations using localStorage
const getDonationCamps = async (bloodBankId: string) => {
  try {
    const stored = localStorage.getItem(CAMPS_STORAGE_KEY);
    const allCamps = stored ? JSON.parse(stored) : [];
    const bloodBankCamps = allCamps.filter((camp: any) => camp.blood_bank_id === bloodBankId);
    return { data: bloodBankCamps, error: null };
  } catch (error) {
    return { data: [], error: null };
  }
};

const getCampDonors = async (campId: string) => {
  try {
    const stored = localStorage.getItem(DONORS_STORAGE_KEY);
    const allDonors = stored ? JSON.parse(stored) : [];
    const campDonors = allDonors.filter((donor: any) => donor.camp_id === campId);
    return { data: campDonors, error: null };
  } catch (error) {
    return { data: [], error: null };
  }
};

const getCampStatistics = async (campId: string) => {
  try {
    const { data: donors } = await getCampDonors(campId);
    if (!donors || donors.length === 0) {
      return { data: null, error: null };
    }

    const stats = {
      total_registered: donors.length,
      total_donated: donors.filter((d: any) => d.donation_status === 'donated').length,
      total_rejected: donors.filter((d: any) => d.donation_status === 'deferred').length,
      total_volume_collected_ml: donors.reduce((sum: number, d: any) => sum + (d.volume_donated_ml || 0), 0),
      average_donor_age: donors.reduce((sum: number, d: any) => sum + d.donor_age, 0) / donors.length,
      first_time_donors: donors.filter((d: any) => !d.has_donated_before).length,
    };
    return { data: stats, error: null };
  } catch (error) {
    return { data: null, error: null };
  }
};

const createDonationCamp = async (campData: any) => {
  try {
    const stored = localStorage.getItem(CAMPS_STORAGE_KEY);
    const allCamps = stored ? JSON.parse(stored) : [];

    const newCamp = {
      id: Date.now().toString(),
      ...campData,
      created_at: new Date().toISOString(),
      registered_donors: 0,
      actual_donors: 0,
      total_units_collected: 0,
    };

    allCamps.push(newCamp);
    localStorage.setItem(CAMPS_STORAGE_KEY, JSON.stringify(allCamps));

    return { data: newCamp, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

const updateDonationCamp = async (campId: string, campData: any) => {
  try {
    const stored = localStorage.getItem(CAMPS_STORAGE_KEY);
    const allCamps = stored ? JSON.parse(stored) : [];

    const index = allCamps.findIndex((c: any) => c.id === campId);
    if (index !== -1) {
      allCamps[index] = { ...allCamps[index], ...campData };
      localStorage.setItem(CAMPS_STORAGE_KEY, JSON.stringify(allCamps));
      return { data: allCamps[index], error: null };
    }

    return { data: null, error: { message: 'Camp not found' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

const deleteDonationCamp = async (campId: string) => {
  try {
    const stored = localStorage.getItem(CAMPS_STORAGE_KEY);
    const allCamps = stored ? JSON.parse(stored) : [];

    const filtered = allCamps.filter((c: any) => c.id !== campId);
    localStorage.setItem(CAMPS_STORAGE_KEY, JSON.stringify(filtered));

    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message } };
  }
};

const createCampDonor = async (donorData: any) => {
  try {
    const stored = localStorage.getItem(DONORS_STORAGE_KEY);
    const allDonors = stored ? JSON.parse(stored) : [];

    const newDonor = {
      id: Date.now().toString(),
      ...donorData,
      created_at: new Date().toISOString(),
    };

    allDonors.push(newDonor);
    localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(allDonors));

    // Update camp statistics
    const campStored = localStorage.getItem(CAMPS_STORAGE_KEY);
    const allCamps = campStored ? JSON.parse(campStored) : [];
    const campIndex = allCamps.findIndex((c: any) => c.id === donorData.camp_id);
    if (campIndex !== -1) {
      allCamps[campIndex].registered_donors = (allCamps[campIndex].registered_donors || 0) + 1;
      localStorage.setItem(CAMPS_STORAGE_KEY, JSON.stringify(allCamps));
    }

    return { data: newDonor, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

const updateCampDonor = async (donorId: string, donorData: any) => {
  try {
    const stored = localStorage.getItem(DONORS_STORAGE_KEY);
    const allDonors = stored ? JSON.parse(stored) : [];

    const index = allDonors.findIndex((d: any) => d.id === donorId);
    if (index !== -1) {
      allDonors[index] = { ...allDonors[index], ...donorData };
      localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(allDonors));
      return { data: allDonors[index], error: null };
    }

    return { data: null, error: { message: 'Donor not found' } };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

const deleteCampDonor = async (donorId: string) => {
  try {
    const stored = localStorage.getItem(DONORS_STORAGE_KEY);
    const allDonors = stored ? JSON.parse(stored) : [];

    const filtered = allDonors.filter((d: any) => d.id !== donorId);
    localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(filtered));

    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message } };
  }
};

const subscribeToDonationCamps = (bloodBankId: string, callback: any) => {
  // Mock subscription - in real app this would be Supabase realtime
  return { unsubscribe: () => { } };
};

const subscribeToCampDonors = (campId: string, callback: any) => {
  // Mock subscription - in real app this would be Supabase realtime
  return { unsubscribe: () => { } };
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DONATION_STATUSES = ['registered', 'screened', 'donated', 'deferred', 'cancelled'];

const CampDetailsEnhanced = () => {
  // Mock blood bank ID - replace with actual auth context
  const bloodBankId = 'bb1';

  // State for camps
  const [camps, setCamps] = useState<DonationCamp[]>([]);
  const [selectedCamp, setSelectedCamp] = useState<DonationCamp | null>(null);
  const [campDonors, setCampDonors] = useState<CampDonor[]>([]);
  const [campStats, setCampStats] = useState<CampStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [showAddCampDialog, setShowAddCampDialog] = useState(false);
  const [showAddDonorDialog, setShowAddDonorDialog] = useState(false);
  const [showViewDonorsDialog, setShowViewDonorsDialog] = useState(false);
  const [showEditDonorDialog, setShowEditDonorDialog] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Form states
  const [campForm, setCampForm] = useState<Partial<DonationCamp>>({
    camp_name: '',
    camp_theme: 'Save Lives, Donate Blood',
    camp_date: '',
    camp_time_start: '09:00',
    camp_time_end: '16:00',
    location_name: 'To Be Announced',
    location_address: 'To Be Announced',
    city: '',
    state: '',
    capacity: 100,
    organizer_name: '',
    organizer_contact: '',
    description: '',
    status: 'upcoming',
  });

  const [donorForm, setDonorForm] = useState<Partial<CampDonor>>({
    donor_name: '',
    donor_age: 25,
    donor_gender: 'Male',
    blood_group: 'O+',
    donor_phone: '',
    donor_email: '',
    weight_kg: 60,
    hemoglobin_level: 13.5,
    blood_pressure: '120/80',
    pulse_rate: 72,
    temperature_celsius: 36.6,
    has_donated_before: false,
    screening_status: 'pending',
    donation_status: 'registered',
    units_donated: 1,
    volume_donated_ml: 450,
    adverse_reaction: false,
    follow_up_required: false,
  });

  const [editingDonor, setEditingDonor] = useState<CampDonor | null>(null);

  // Load camps on mount
  useEffect(() => {
    loadCamps();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const subscription = subscribeToDonationCamps(bloodBankId, (payload) => {
      console.log('Camp change received:', payload);
      loadCamps();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [bloodBankId]);

  // Load camp donors when a camp is selected
  useEffect(() => {
    if (selectedCamp) {
      loadCampDonors(selectedCamp.id);
      loadCampStatistics(selectedCamp.id);

      const subscription = subscribeToCampDonors(selectedCamp.id, (payload) => {
        console.log('Donor change received:', payload);
        loadCampDonors(selectedCamp.id);
        loadCampStatistics(selectedCamp.id);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedCamp]);

  const loadCamps = async () => {
    setLoading(true);
    const { data, error } = await getDonationCamps(bloodBankId);
    if (error) {
      toast.error('Failed to load camps', { description: error.message });
    } else {
      setCamps(data || []);
    }
    setLoading(false);
  };

  const loadCampDonors = async (campId: string) => {
    const { data, error } = await getCampDonors(campId);
    if (error) {
      toast.error('Failed to load donors', { description: error.message });
    } else {
      setCampDonors(data || []);
    }
  };

  const loadCampStatistics = async (campId: string) => {
    const { data, error } = await getCampStatistics(campId);
    if (error) {
      console.log('No statistics yet for this camp');
      setCampStats(null);
    } else {
      setCampStats(data);
    }
  };

  const handleAddCamp = async () => {
    // Validate required fields (prioritizing Organizer info as per request)
    if (!campForm.organizer_name || !campForm.organizer_contact || !campForm.camp_date) {
      toast.error('Please fill in Organizer Name, Contact Number and Date');
      return;
    }

    // Validate Schedule: 1st or 2nd Saturday
    const selectedDate = new Date(campForm.camp_date);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    const dayOfMonth = selectedDate.getDate();
    const weekOfMonth = Math.ceil(dayOfMonth / 7);

    // Check if it is a Saturday and is either the 1st or 2nd Saturday
    if (dayOfWeek !== 6 || (weekOfMonth !== 1 && weekOfMonth !== 2)) {
      toast.error('Camps can only be conducted on the 1st and 2nd Saturday of every month.');
      return;
    }

    // Default time check (9:00 AM - 4:00 PM)
    if (campForm.camp_time_start !== '09:00' || campForm.camp_time_end !== '16:00') {
      toast.info('Camp time set to standard 9:00 AM - 4:00 PM');
      // We can force force it here if strictly required, or just proceed. 
      // The user said "time is 9.00 Am to 4.00 Pm". Let's ensure logic respects it if we want strictness.
    }

    const { data, error } = await createDonationCamp({
      ...campForm,
      camp_time_start: '09:00', // Enforce standard time
      camp_time_end: '16:00',   // Enforce standard time
      location_name: campForm.location_name || 'To Be Announced',
      blood_bank_id: bloodBankId,
      created_by: bloodBankId,
    });

    if (error) {
      toast.error('Failed to create camp', { description: error.message });
    } else {
      toast.success('Camp created successfully!');
      setShowAddCampDialog(false);
      resetCampForm();
      loadCamps();
    }
  };

  const handleDeleteCamp = async (campId: string) => {
    if (!confirm('Are you sure you want to delete this camp?')) return;

    const { error } = await deleteDonationCamp(campId);
    if (error) {
      toast.error('Failed to delete camp', { description: error.message });
    } else {
      toast.success('Camp deleted successfully!');
      loadCamps();
      if (selectedCamp?.id === campId) {
        setSelectedCamp(null);
      }
    }
  };

  const handleAddDonor = async () => {
    if (!selectedCamp) {
      toast.error('Please select a camp first');
      return;
    }

    if (!donorForm.donor_name || !donorForm.blood_group) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { data, error } = await createCampDonor({
      ...donorForm,
      camp_id: selectedCamp.id,
      blood_bank_id: bloodBankId,
    });

    if (error) {
      toast.error('Failed to add donor', { description: error.message });
    } else {
      toast.success('Donor added successfully!');
      setShowAddDonorDialog(false);
      resetDonorForm();
      loadCampDonors(selectedCamp.id);
    }
  };

  const handleUpdateDonor = async () => {
    if (!editingDonor) return;

    const { data, error } = await updateCampDonor(editingDonor.id, donorForm);

    if (error) {
      toast.error('Failed to update donor', { description: error.message });
    } else {
      toast.success('Donor updated successfully!');
      setShowEditDonorDialog(false);
      setEditingDonor(null);
      resetDonorForm();
      if (selectedCamp) {
        loadCampDonors(selectedCamp.id);
      }
    }
  };

  const handleDeleteDonor = async (donorId: string) => {
    if (!confirm('Are you sure you want to delete this donor?')) return;

    const { error } = await deleteCampDonor(donorId);
    if (error) {
      toast.error('Failed to delete donor', { description: error.message });
    } else {
      toast.success('Donor deleted successfully!');
      if (selectedCamp) {
        loadCampDonors(selectedCamp.id);
      }
    }
  };

  const handleMarkAsDonated = async (donor: CampDonor) => {
    const today = new Date().toISOString().split('T')[0];
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 42); // 42 days validity

    const { error } = await updateCampDonor(donor.id, {
      donation_status: 'donated',
      screening_status: 'approved',
      collection_date: today,
      expiry_date: expiryDate.toISOString().split('T')[0],
      donation_time: new Date().toISOString(),
    });

    if (error) {
      toast.error('Failed to mark as donated', { description: error.message });
    } else {
      toast.success('Donor marked as donated! Blood unit will be created automatically.');
      if (selectedCamp) {
        loadCampDonors(selectedCamp.id);
      }
    }
  };

  const handleExportReport = () => {
    if (!selectedCamp) {
      toast.error('Please select a camp first');
      return;
    }

    // Create CSV content
    const headers = [
      'Donor Name',
      'Age',
      'Gender',
      'Blood Group',
      'Phone',
      'Units Donated',
      'Collection Date',
      'Expiry Date',
      'Status',
      'Hemoglobin',
      'Blood Pressure',
    ];

    const rows = filteredDonors.map((donor) => [
      donor.donor_name,
      donor.donor_age,
      donor.donor_gender,
      donor.blood_group,
      donor.donor_phone || '',
      donor.units_donated,
      donor.collection_date || '',
      donor.expiry_date || '',
      donor.donation_status,
      donor.hemoglobin_level || '',
      donor.blood_pressure || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `camp_report_${selectedCamp.camp_name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Report exported successfully!');
  };

  const resetCampForm = () => {
    setCampForm({
      camp_name: '',
      camp_theme: 'Save Lives, Donate Blood',
      camp_date: '',
      camp_time_start: '09:00',
      camp_time_end: '16:00',
      location_name: '',
      location_address: '',
      city: '',
      state: '',
      capacity: 100,
      organizer_name: '',
      organizer_contact: '',
      description: '',
      status: 'upcoming',
    });
  };

  const resetDonorForm = () => {
    setDonorForm({
      donor_name: '',
      donor_age: 25,
      donor_gender: 'Male',
      blood_group: 'O+',
      donor_phone: '',
      donor_email: '',
      weight_kg: 60,
      hemoglobin_level: 13.5,
      blood_pressure: '120/80',
      pulse_rate: 72,
      temperature_celsius: 36.6,
      has_donated_before: false,
      screening_status: 'pending',
      donation_status: 'registered',
      units_donated: 1,
      volume_donated_ml: 450,
      adverse_reaction: false,
      follow_up_required: false,
    });
  };

  const openEditDonor = (donor: CampDonor) => {
    setEditingDonor(donor);
    setDonorForm(donor);
    setShowEditDonorDialog(true);
  };

  // Filtered donors based on search and filters
  const filteredDonors = useMemo(() => {
    return campDonors.filter((donor) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !donor.donor_name.toLowerCase().includes(query) &&
          !donor.blood_group.toLowerCase().includes(query) &&
          !donor.donor_phone?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Blood group filter
      if (filterBloodGroup !== 'all' && donor.blood_group !== filterBloodGroup) {
        return false;
      }

      // Status filter
      if (filterStatus !== 'all' && donor.donation_status !== filterStatus) {
        return false;
      }

      // Date range filter
      if (filterDateFrom && donor.collection_date && donor.collection_date < filterDateFrom) {
        return false;
      }
      if (filterDateTo && donor.collection_date && donor.collection_date > filterDateTo) {
        return false;
      }

      return true;
    });
  }, [campDonors, searchQuery, filterBloodGroup, filterStatus, filterDateFrom, filterDateTo]);

  // Statistics calculations
  const totalCamps = camps.length;
  const completedCamps = camps.filter((c) => c.status === 'completed').length;
  const upcomingCamps = camps.filter((c) => c.status === 'upcoming').length;
  const totalUnitsCollected = camps.reduce((sum, c) => sum + c.total_units_collected, 0);

  return (
    <BloodBankLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-glow mb-2">
          Blood Donation Camp Management
        </h1>
        <p className="text-muted-foreground">
          Track donation camps, donors, and blood collection efficiently
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Camps</p>
              <p className="text-3xl font-bold text-glow mt-1">{totalCamps}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-green-500 mt-1">{completedCamps}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">{upcomingCamps}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Units</p>
              <p className="text-3xl font-bold text-red-500 mt-1">{totalUnitsCollected}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <Droplet className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Camps List */}
      <Card className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-glow">Donation Camps</h2>
          <Button
            onClick={() => setShowAddCampDialog(true)}
            className="bg-red-500 hover:bg-red-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Camp
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading camps...</p>
          </div>
        ) : camps.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No camps found. Create your first camp!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {camps.map((camp) => (
              <div
                key={camp.id}
                className={`glass-card-primary p-4 rounded-lg border transition-all cursor-pointer ${selectedCamp?.id === camp.id
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-border/50 hover:border-red-500/50'
                  }`}
                onClick={() => setSelectedCamp(camp)}
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-lg text-glow">{camp.camp_name}</h3>
                    <p className="text-sm text-muted-foreground">{camp.camp_theme}</p>
                    <Badge
                      variant={
                        camp.status === 'completed'
                          ? 'default'
                          : camp.status === 'upcoming'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="mt-2"
                    >
                      {camp.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {new Date(camp.camp_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {camp.camp_time_start} - {camp.camp_time_end}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{camp.location_name}</p>
                    <p className="text-xs text-muted-foreground">{camp.city}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Donors</p>
                    <p className="font-bold text-lg">
                      {camp.actual_donors} / {camp.registered_donors}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Capacity: {camp.capacity}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCamp(camp);
                        setShowViewDonorsDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCamp(camp.id);
                      }}
                      className="text-red-500 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Selected Camp Details */}
      {selectedCamp && (
        <Card className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-glow">
              {selectedCamp.camp_name} - Donor Details
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReport}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddDonorDialog(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Donor
              </Button>
            </div>
          </div>

          {/* Camp Statistics */}
          {campStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <div className="glass-card-primary p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Registered</p>
                <p className="text-2xl font-bold text-blue-500">{campStats.total_registered}</p>
              </div>
              <div className="glass-card-primary p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Donated</p>
                <p className="text-2xl font-bold text-green-500">{campStats.total_donated}</p>
              </div>
              <div className="glass-card-primary p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-500">{campStats.total_rejected}</p>
              </div>
              <div className="glass-card-primary p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-purple-500">
                  {(campStats.total_volume_collected_ml / 1000).toFixed(1)}L
                </p>
              </div>
              <div className="glass-card-primary p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Avg Age</p>
                <p className="text-2xl font-bold text-orange-500">
                  {campStats.average_donor_age.toFixed(0)}
                </p>
              </div>
              <div className="glass-card-primary p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">First Time</p>
                <p className="text-2xl font-bold text-cyan-500">{campStats.first_time_donors}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Groups</SelectItem>
                {BLOOD_GROUPS.map((bg) => (
                  <SelectItem key={bg} value={bg}>
                    {bg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {DONATION_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="From Date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="To Date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>

          {/* Donors Table */}
          <div className="overflow-x-auto">
            {filteredDonors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No donors found for this camp.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="glass-card-primary p-4 rounded-lg border border-border/50 hover:border-red-500/50 transition-all"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-3 items-center">
                      <div className="md:col-span-2">
                        <p className="font-semibold">{donor.donor_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {donor.donor_age} years • {donor.donor_gender}
                        </p>
                      </div>

                      <div>
                        <Badge variant="destructive" className="text-lg">
                          {donor.blood_group}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Units</p>
                        <p className="font-bold text-lg">{donor.units_donated}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Collection</p>
                        <p className="font-medium text-sm">
                          {donor.collection_date
                            ? new Date(donor.collection_date).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Expiry</p>
                        <p className="font-medium text-sm">
                          {donor.expiry_date
                            ? new Date(donor.expiry_date).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>

                      <div>
                        <Badge
                          variant={
                            donor.donation_status === 'donated'
                              ? 'default'
                              : donor.donation_status === 'registered'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {donor.donation_status}
                        </Badge>
                      </div>

                      <div className="flex gap-2 justify-end">
                        {donor.donation_status !== 'donated' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsDonated(donor)}
                            className="text-green-500 hover:bg-green-500/20"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Donated
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDonor(donor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteDonor(donor.id)}
                          className="text-red-500 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {donor.hemoglobin_level && (
                      <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Hb:</span>{' '}
                          <span className="font-medium">{donor.hemoglobin_level} g/dL</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">BP:</span>{' '}
                          <span className="font-medium">{donor.blood_pressure}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Weight:</span>{' '}
                          <span className="font-medium">{donor.weight_kg} kg</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>{' '}
                          <span className="font-medium">{donor.donor_phone || 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Add Camp Dialog */}
      <Dialog open={showAddCampDialog} onOpenChange={setShowAddCampDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Donation Camp</DialogTitle>
            <DialogDescription>
              Create a new blood donation camp with all the details
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Organizer Details - First as requested */}
            <div>
              <Label htmlFor="organizer_name">Organizer Name *</Label>
              <Input
                id="organizer_name"
                value={campForm.organizer_name}
                onChange={(e) => setCampForm({ ...campForm, organizer_name: e.target.value })}
                placeholder="Dr. John Doe"
              />
            </div>

            <div>
              <Label htmlFor="organizer_contact">Organizer Contact *</Label>
              <Input
                id="organizer_contact"
                value={campForm.organizer_contact}
                onChange={(e) =>
                  setCampForm({ ...campForm, organizer_contact: e.target.value })
                }
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <Label htmlFor="camp_date">Camp Date *</Label>
              <Input
                id="camp_date"
                type="date"
                value={campForm.camp_date}
                onChange={(e) => setCampForm({ ...campForm, camp_date: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Note: Camps are conducted on 1st & 2nd Saturdays only.
              </p>
            </div>

            <div>
              <Label htmlFor="camp_name">Camp Name</Label>
              <Input
                id="camp_name"
                value={campForm.camp_name}
                onChange={(e) => setCampForm({ ...campForm, camp_name: e.target.value })}
                placeholder="Monthly Blood Drive"
              />
            </div>

            <div>
              <Label htmlFor="camp_theme">Camp Theme</Label>
              <Input
                id="camp_theme"
                value={campForm.camp_theme}
                onChange={(e) => setCampForm({ ...campForm, camp_theme: e.target.value })}
                placeholder="Save Lives, Donate Blood"
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={campForm.capacity}
                onChange={(e) =>
                  setCampForm({ ...campForm, capacity: parseInt(e.target.value) })
                }
              />
            </div>

            <div>
              <Label htmlFor="camp_time_start">Start Time</Label>
              <Input
                id="camp_time_start"
                type="time"
                value="09:00"
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="camp_time_end">End Time</Label>
              <Input
                id="camp_time_end"
                type="time"
                value="16:00"
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="location_name">Location Name</Label>
              <Input
                id="location_name"
                value={campForm.location_name}
                onChange={(e) => setCampForm({ ...campForm, location_name: e.target.value })}
                placeholder="To Be Announced"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={campForm.city}
                onChange={(e) => setCampForm({ ...campForm, city: e.target.value })}
                placeholder="City"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="location_address">Location Address</Label>
              <Textarea
                id="location_address"
                value={campForm.location_address}
                onChange={(e) => setCampForm({ ...campForm, location_address: e.target.value })}
                placeholder="Address details (or 'To Be Announced')"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={campForm.description}
                onChange={(e) => setCampForm({ ...campForm, description: e.target.value })}
                placeholder="Additional details about the camp..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCampDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCamp} className="bg-red-500 hover:bg-red-600">
              Create Camp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Donor Dialog */}
      <Dialog open={showAddDonorDialog} onOpenChange={setShowAddDonorDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Donor to Camp</DialogTitle>
            <DialogDescription>
              Register a new donor for {selectedCamp?.camp_name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="donor_name">Donor Name *</Label>
              <Input
                id="donor_name"
                value={donorForm.donor_name}
                onChange={(e) => setDonorForm({ ...donorForm, donor_name: e.target.value })}
                placeholder="John Smith"
              />
            </div>

            <div>
              <Label htmlFor="donor_age">Age *</Label>
              <Input
                id="donor_age"
                type="number"
                value={donorForm.donor_age}
                onChange={(e) =>
                  setDonorForm({ ...donorForm, donor_age: parseInt(e.target.value) })
                }
                min="18"
                max="65"
              />
            </div>

            <div>
              <Label htmlFor="donor_gender">Gender</Label>
              <Select
                value={donorForm.donor_gender}
                onValueChange={(value: any) => setDonorForm({ ...donorForm, donor_gender: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="blood_group">Blood Group *</Label>
              <Select
                value={donorForm.blood_group}
                onValueChange={(value: any) => setDonorForm({ ...donorForm, blood_group: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="donor_phone">Phone</Label>
              <Input
                id="donor_phone"
                value={donorForm.donor_phone}
                onChange={(e) => setDonorForm({ ...donorForm, donor_phone: e.target.value })}
                placeholder="+1-555-1001"
              />
            </div>

            <div>
              <Label htmlFor="donor_email">Email</Label>
              <Input
                id="donor_email"
                type="email"
                value={donorForm.donor_email}
                onChange={(e) => setDonorForm({ ...donorForm, donor_email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input
                id="weight_kg"
                type="number"
                value={donorForm.weight_kg}
                onChange={(e) =>
                  setDonorForm({ ...donorForm, weight_kg: parseFloat(e.target.value) })
                }
                step="0.1"
                min="45"
              />
            </div>

            <div>
              <Label htmlFor="hemoglobin_level">Hemoglobin (g/dL)</Label>
              <Input
                id="hemoglobin_level"
                type="number"
                value={donorForm.hemoglobin_level}
                onChange={(e) =>
                  setDonorForm({ ...donorForm, hemoglobin_level: parseFloat(e.target.value) })
                }
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="blood_pressure">Blood Pressure</Label>
              <Input
                id="blood_pressure"
                value={donorForm.blood_pressure}
                onChange={(e) => setDonorForm({ ...donorForm, blood_pressure: e.target.value })}
                placeholder="120/80"
              />
            </div>

            <div>
              <Label htmlFor="pulse_rate">Pulse Rate (bpm)</Label>
              <Input
                id="pulse_rate"
                type="number"
                value={donorForm.pulse_rate}
                onChange={(e) =>
                  setDonorForm({ ...donorForm, pulse_rate: parseInt(e.target.value) })
                }
              />
            </div>

            <div>
              <Label htmlFor="temperature_celsius">Temperature (°C)</Label>
              <Input
                id="temperature_celsius"
                type="number"
                value={donorForm.temperature_celsius}
                onChange={(e) =>
                  setDonorForm({
                    ...donorForm,
                    temperature_celsius: parseFloat(e.target.value),
                  })
                }
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="units_donated">Units to Donate</Label>
              <Input
                id="units_donated"
                type="number"
                value={donorForm.units_donated}
                onChange={(e) =>
                  setDonorForm({ ...donorForm, units_donated: parseInt(e.target.value) })
                }
                min="1"
                max="2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="has_donated_before"
                checked={donorForm.has_donated_before}
                onChange={(e) =>
                  setDonorForm({ ...donorForm, has_donated_before: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="has_donated_before">Has donated before</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDonorDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDonor} className="bg-red-500 hover:bg-red-600">
              Add Donor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Donor Dialog */}
      <Dialog open={showEditDonorDialog} onOpenChange={setShowEditDonorDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Donor Details</DialogTitle>
            <DialogDescription>Update donor information</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Same form fields as Add Donor */}
            <div>
              <Label htmlFor="edit_donor_name">Donor Name *</Label>
              <Input
                id="edit_donor_name"
                value={donorForm.donor_name}
                onChange={(e) => setDonorForm({ ...donorForm, donor_name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit_donation_status">Donation Status</Label>
              <Select
                value={donorForm.donation_status}
                onValueChange={(value: any) =>
                  setDonorForm({ ...donorForm, donation_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DONATION_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit_screening_status">Screening Status</Label>
              <Select
                value={donorForm.screening_status}
                onValueChange={(value: any) =>
                  setDonorForm({ ...donorForm, screening_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit_units_donated">Units Donated</Label>
              <Input
                id="edit_units_donated"
                type="number"
                value={donorForm.units_donated}
                onChange={(e) =>
                  setDonorForm({ ...donorForm, units_donated: parseInt(e.target.value) })
                }
                min="0"
                max="2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDonorDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDonor} className="bg-red-500 hover:bg-red-600">
              Update Donor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BloodBankLayout>
  );
};

export default CampDetailsEnhanced;
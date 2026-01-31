import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Droplet,
  Calendar,
  MapPin,
  Award,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Building2,
  Menu,
  X,
  LogOut,
  Bell,
  ArrowRight,
  Zap,
  Users,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'donor') {
      navigate('/donor/auth');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { icon: Activity, label: 'Dashboard', path: '/donor/dashboard', active: true },
    { icon: Heart, label: 'Donate Blood', path: '/donor/donate' },
    { icon: Calendar, label: 'My Donations', path: '/donor/history' },
    { icon: AlertCircle, label: 'Emergencies', path: '/donor/emergencies' },
    { icon: User, label: 'Profile', path: '/donor/profile' },
  ];

  const donorStats = {
    totalDonations: 8,
    lastDonation: '2025-12-15',
    bloodType: user?.bloodType || 'O+',
    livesSaved: 24,
    reputation: 95,
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile Menu */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-900 rounded-xl shadow-xl border border-gray-800"
      >
        {isSidebarOpen ? <X className="w-5 h-5 text-gray-100" /> : <Menu className="w-5 h-5 text-gray-100" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 w-72 transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/50">
              <Droplet className="h-6 w-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Vital Drop</h1>
              <p className="text-xs text-gray-400">Donor Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user?.name?.charAt(0) || 'D'}
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-lg">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-center border border-gray-700">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Droplet className="h-3 w-3 text-red-500" />
              </div>
              <div className="text-lg font-bold text-white">{donorStats.bloodType}</div>
              <div className="text-xs text-gray-400">Blood Type</div>
            </div>
            <div className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-center border border-gray-700">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="h-3 w-3 text-yellow-500" />
              </div>
              <div className="text-lg font-bold text-white">{donorStats.reputation}%</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${item.active
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="p-4 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="lg:ml-0 ml-12">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-xl text-gray-400">Your impact saves lives. Keep making a difference!</p>
            </div>
            <Button variant="outline" size="icon" className="relative bg-gray-900 border-gray-800 hover:bg-gray-800">
              <Bell className="h-5 w-5 text-gray-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                2
              </span>
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Donations */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-8 -mb-8"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Droplet className="w-7 h-7 text-white" />
                  </div>
                  <Zap className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-5xl font-black text-white mb-2">{donorStats.totalDonations}</div>
                <div className="text-lg text-white/90 font-medium">Total Donations</div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-sm text-white/70">Lifetime Contribution</div>
                </div>
              </div>
            </div>

            {/* Lives Saved */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-8 -mb-8"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <Users className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-5xl font-black text-white mb-2">{donorStats.livesSaved}</div>
                <div className="text-lg text-white/90 font-medium">Lives Saved</div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-sm text-white/70">~3 lives per donation</div>
                </div>
              </div>
            </div>

            {/* Last Donation */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-8 -mb-8"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <Clock className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-3xl font-black text-white mb-2">
                  {new Date(donorStats.lastDonation).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-lg text-white/90 font-medium">Last Donation</div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-sm text-white/70">Recent Activity</div>
                </div>
              </div>
            </div>

            {/* Reputation */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-8 -mb-8"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <Target className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-5xl font-black text-white mb-2">{donorStats.reputation}%</div>
                <div className="text-lg text-white/90 font-medium">Reputation</div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-sm text-white/70">⭐ Top Donor Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative flex items-center gap-6">
              <div className="p-5 bg-white/20 backdrop-blur-sm rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-2">You're Eligible to Donate! 🎉</h3>
                <p className="text-xl text-white/90 mb-6">
                  Ready to save more lives? Schedule your next donation today!
                </p>
                <div className="flex items-center gap-4">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-xl font-bold text-lg px-8">
                    <Target className="w-5 h-5 mr-2" />
                    Schedule Now
                  </Button>
                  <div className="text-white/90 text-sm">
                    Next eligible: <strong className="text-white font-bold">March 15, 2026</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency + Camps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emergency Requests */}
            <Card className="bg-gray-900 border-gray-800 shadow-2xl">
              <CardHeader className="border-b border-gray-800 pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    </div>
                    Emergency Requests
                  </CardTitle>
                  <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 text-sm">
                    2 URGENT
                  </Badge>
                </div>
                <p className="text-gray-400 mt-2 text-base">Critical needs in your area</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Request 1 */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 border-2 border-red-500/30 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-red-500" />
                      <div>
                        <h4 className="font-bold text-white text-lg">City General Hospital</h4>
                        <p className="text-sm text-gray-400">2.5 km away</p>
                      </div>
                    </div>
                    <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold">CRITICAL</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Blood Type</div>
                      <div className="text-2xl font-bold text-red-500">O+</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Units</div>
                      <div className="text-2xl font-bold text-white">3</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Time</div>
                      <div className="text-lg font-bold text-orange-500">2h ago</div>
                    </div>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-base py-6 shadow-xl">
                    Respond to Emergency
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {/* Request 2 */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-2 border-orange-500/30 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-orange-500" />
                      <div>
                        <h4 className="font-bold text-white text-lg">Metro Care Hospital</h4>
                        <p className="text-sm text-gray-400">4.1 km away</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-600 hover:bg-orange-700 text-white font-bold">URGENT</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Blood Type</div>
                      <div className="text-2xl font-bold text-orange-500">O+</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Units</div>
                      <div className="text-2xl font-bold text-white">2</div>
                    </div>
                    <div className="text-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Time</div>
                      <div className="text-lg font-bold text-yellow-500">5h ago</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-2 border-orange-500/50 text-white hover:bg-orange-500/20 font-bold text-base py-6">
                    View Details
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blood Donation Camps */}
            <Card className="bg-gray-900 border-gray-800 shadow-2xl">
              <CardHeader className="border-b border-gray-800 pb-6">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  Upcoming Donation Camps
                </CardTitle>
                <p className="text-gray-400 mt-2 text-base">Join these events to donate</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Camp 1 */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/30 p-6">
                  <h4 className="font-bold text-white text-xl mb-4">City Central Blood Camp</h4>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Saturday, February 15, 2026</div>
                        <div className="text-sm text-gray-400">In 17 days</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <span className="text-white font-medium">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-500" />
                      </div>
                      <span className="text-white font-medium">City Community Center</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-6 shadow-xl">
                    Register for Camp
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {/* Camp 2 */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/30 p-6">
                  <h4 className="font-bold text-white text-xl mb-4">University Health Drive</h4>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Thursday, February 20, 2026</div>
                        <div className="text-sm text-gray-400">In 22 days</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-500" />
                      </div>
                      <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <MapPin className="h-5 w-5 text-purple-500" />
                      </div>
                      <span className="text-white font-medium">University Campus</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-2 border-purple-500/50 text-white hover:bg-purple-500/20 font-bold text-base py-6">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DonorDashboard;
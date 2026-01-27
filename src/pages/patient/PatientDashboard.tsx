import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Droplet, 
  Building2, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Advertisement Slider Component
const AdvertisementSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Welcome to Vital Drop!",
      description: "Your trusted platform for blood donation and emergency blood requests",
      gradient: "from-red-500 to-red-700"
    },
    {
      title: "Nearby Blood Banks",
      description: "Find blood banks in your area ready to help in emergencies",
      gradient: "from-red-600 to-red-800"
    },
    {
      title: "Nearby Hospitals",
      description: "Connect with hospitals and healthcare facilities near you",
      gradient: "from-red-500 to-red-900"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${slide.gradient} flex flex-col items-center justify-center text-white p-8`}>
            <h2 className="text-3xl font-bold mb-4 text-center">{slide.title}</h2>
            <p className="text-lg text-center max-w-2xl">{slide.description}</p>
          </div>
        </div>
      ))}
      
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and is a patient
    if (!isAuthenticated || !user || user.role !== 'patient') {
      navigate('/patient/auth');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
    { icon: Droplet, label: 'Blood Needed', path: '/patient/blood-request' },
    { icon: Building2, label: 'Nearby Blood Banks', path: '/patient/blood-banks' },
    { icon: User, label: 'Profile', path: '/patient/profile' },
  ];

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background bg-blood-pattern">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-blood-pattern">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card-primary box-glow"
      >
        {isSidebarOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-red-600 to-red-800 text-white w-64 transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Vital Drop</h1>
          <p className="text-red-100 text-sm">Patient Portal</p>
        </div>

        {/* Welcome Message */}
        <div className="px-6 py-4 bg-white/10 backdrop-blur-sm">
          <p className="text-sm text-red-100">Welcome,</p>
          <p className="text-lg font-semibold">{user?.name || 'Patient'} 👋</p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
                location.pathname === item.path ? 'bg-white/20 border-l-4 border-white' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-glow mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your patient dashboard</p>
          </div>

          {/* Advertisement Slider */}
          <div className="mb-8">
            <AdvertisementSlider />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 glass-card-primary box-glow hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-lg box-glow">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="text-2xl font-bold text-foreground">{user?.bloodGroup || 'N/A'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-primary box-glow hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-lg box-glow">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="text-2xl font-bold text-foreground">{user?.age || 'N/A'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card-primary box-glow hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-lg box-glow">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="text-2xl font-bold text-foreground">{user?.city || 'N/A'}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="p-6 bg-gradient-to-br from-red-500 to-red-700 text-white cursor-pointer box-glow hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/patient/blood-request')}
            >
              <Droplet className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-glow">Request Blood</h3>
              <p className="text-red-100">Submit a blood request to nearby blood banks</p>
            </Card>

            <Card 
              className="p-6 bg-gradient-to-br from-red-600 to-red-800 text-white cursor-pointer box-glow hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/patient/blood-banks')}
            >
              <Building2 className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-glow">Find Blood Banks</h3>
              <p className="text-red-100">View nearby blood banks and contact them</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
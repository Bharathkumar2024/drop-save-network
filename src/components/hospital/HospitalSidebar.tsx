import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertCircle,
  Users,
  FileText,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const HospitalSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/hospital/dashboard',
      description: 'Overview & Statistics'
    },
    {
      icon: AlertCircle,
      label: 'Emergency',
      path: '/hospital/emergency',
      description: 'Emergency Blood Requests'
    },
    {
      icon: Users,
      label: 'Patient Needed Blood',
      path: '/hospital/patient-request',
      description: 'Request Blood for Patients'
    },
    {
      icon: FileText,
      label: 'Patient Records',
      path: '/hospital/patient-records',
      description: 'Blood Received History'
    },
    {
      icon: Building2,
      label: 'Hospital Profile',
      path: '/hospital/profile',
      description: 'Connected Blood Banks'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 left-4 z-50 md:hidden bg-card/95 backdrop-blur-md border border-border/50 shadow-lg hover:bg-card"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-card/95 backdrop-blur-md border-r border-border/50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <div className="mb-8 mt-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Hospital</h2>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", isActive && "animate-pulse")} />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{item.label}</span>
                    <span className="text-xs opacity-80">{item.description}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground">
              Drop Save Hospital System
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default HospitalSidebar;
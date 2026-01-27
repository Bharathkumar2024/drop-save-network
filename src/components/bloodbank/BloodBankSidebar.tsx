import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Droplet, Building2, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const BloodBankSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/bloodbank/dashboard',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      path: '/bloodbank/notifications',
    },
    {
      id: 'camp-details',
      label: 'Camp Details',
      icon: <Calendar className="h-5 w-5" />,
      path: '/bloodbank/camp-details',
    },
    {
      id: 'donor-applications',
      label: 'Donor Applications',
      icon: <Users className="h-5 w-5" />,
      path: '/bloodbank/donor-applications',
    },
    {
      id: 'blood-records',
      label: 'Blood Bank Records',
      icon: <Droplet className="h-5 w-5" />,
      path: '/bloodbank/blood-records',
    },
    {
      id: 'blood-stock',
      label: 'Blood Stock',
      icon: <Droplet className="h-5 w-5" />,
      path: '/bloodbank/blood-stock',
    },
    {
      id: 'blood-banks',
      label: 'Blood Banks',
      icon: <Building2 className="h-5 w-5" />,
      path: '/bloodbank/blood-banks',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/bloodbank/auth');
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-red-500/30 flex flex-col z-50">
      {/* Logo/Branding */}
      <div className="p-6 border-b border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-700 rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-glow">Drop Save</h2>
            <p className="text-xs text-muted-foreground">Blood Bank Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          const showBadge = item.id === 'notifications' && unreadCount > 0;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-red-500/20 hover:border-red-500/50',
                isActive
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                  : 'text-muted-foreground border border-transparent'
              )}
            >
              <span className={cn(isActive && 'text-white')}>{item.icon}</span>
              <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
              {showBadge && (
                <Badge variant="destructive" className="ml-auto">
                  {unreadCount}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-red-500/30">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 hover:bg-red-500/20 hover:text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default BloodBankSidebar;
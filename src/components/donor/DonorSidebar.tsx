import { useNavigate, useLocation } from 'react-router-dom';
import { Droplet, Trophy, Bell, User, LogOut, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const DonorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Droplet className="h-5 w-5" />,
      path: '/donor/dashboard',
    },
    {
      id: 'apply',
      label: 'Apply for Camp',
      icon: <FileText className="h-5 w-5" />,
      path: '/donor/apply',
    },
    {
      id: 'reputation',
      label: 'Reputational Scores',
      icon: <Trophy className="h-5 w-5" />,
      path: '/donor/reputation',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      path: '/donor/notifications',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
      path: '/donor/profile',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/donor/auth');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50 shadow-xl">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/50">
            <Droplet className="h-6 w-6 text-white" fill="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Vital Drop</h2>
            <p className="text-xs text-gray-400">Donor Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-red-600/20 hover:border-red-500/50 border border-transparent",
                isActive && "bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/20",
                !isActive && "text-gray-300 hover:text-white"
              )}
            >
              <span className={cn(
                "transition-colors duration-200",
                isActive && "text-white",
                !isActive && "text-red-400"
              )}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-red-500/20">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center gap-3 border-red-500/30 hover:bg-red-600/20 hover:border-red-500/50 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 text-red-400" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default DonorSidebar;
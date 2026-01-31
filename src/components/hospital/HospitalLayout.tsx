import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/shared/NotificationBell';
import HospitalSidebar from './HospitalSidebar';

interface HospitalLayoutProps {
  children: ReactNode;
}

const HospitalLayout = ({ children }: HospitalLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full bg-background bg-blood-pattern">
      {/* Sidebar */}
      <HospitalSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-card/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-4">
                <h1
                  className="text-xl md:text-2xl font-bold text-glow cursor-pointer animate-blink"
                  onClick={() => navigate('/')}
                >
                  Vital Drop
                </h1>
              </div>

              {/* User Info and Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <NotificationBell />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hidden md:flex hover:bg-destructive/20"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
          <div className="min-h-full pl-0 md:pl-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HospitalLayout;
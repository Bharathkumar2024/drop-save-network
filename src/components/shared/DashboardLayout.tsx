import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from './NotificationBell';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-background bg-medical-pattern">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-sm shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-card border-r border-border">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Button variant="ghost" onClick={() => navigate('/')} className="justify-start">
                      Home
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="justify-start text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>

              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Droplet className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-foreground">Drop Save</h1>
                  <p className="text-xs text-muted-foreground">Blood Network</p>
                </div>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <NotificationBell />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hidden md:flex hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">{title}</h2>
          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Main Content */}
        <div className="pb-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

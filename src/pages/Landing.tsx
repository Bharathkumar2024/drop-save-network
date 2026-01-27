import { useNavigate } from 'react-router-dom';
import { Building2, Droplet, Building, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import heroBackground from '@/assets/hero-background.jpg';

const Landing = () => {
  const navigate = useNavigate();

  const accessCards = [
    {
      id: 'hospital',
      title: '🏥 Hospitals',
      description: 'Manage emergency blood requests and patient records',
      icon: Building2,
      path: '/hospital/auth',
      gradient: 'from-red-600 to-orange-600'
    },
    {
      id: 'donor',
      title: '🩸 Donors',
      description: 'Respond to urgent blood donation requests',
      icon: Droplet,
      path: '/donor/auth',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      id: 'bloodbank',
      title: '🏬 Blood Banks',
      description: 'Track inventory and coordinate with hospitals',
      icon: Building,
      path: '/bloodbank/auth',
      gradient: 'from-orange-600 to-red-700'
    },
    {
      id: 'patient',
      title: '🤒 Patients',
      description: 'Request blood and connect with nearby blood banks',
      icon: User,
      path: '/patient/auth',
      gradient: 'from-red-600 to-red-800'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background bg-blood-pattern relative overflow-hidden">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16 animate-slide-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-glow-strong animate-blink">
            Drop Save
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Connecting hospitals, donors, and blood banks to save lives in real time
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <p className="text-sm text-primary font-medium">Live Emergency Network</p>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </header>

        {/* Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto mb-12">
          {accessCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className="glass-card-primary p-6 md:p-8 cursor-pointer group hover:box-glow-strong transition-all duration-300 border-2 hover:border-primary/50 animate-slide-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => navigate(card.path)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon with ripple effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-ripple" />
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${card.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 box-glow`}>
                      <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold group-hover:text-glow transition-all">
                    {card.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm md:text-base text-muted-foreground">
                    {card.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all animate-wave">
                    <span>Enter</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Stats Banner */}
        <div className="glass-card rounded-2xl p-6 md:p-8 max-w-4xl mx-auto animate-slide-in-up" style={{ animationDelay: '450ms' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">342+</div>
              <div className="text-sm text-muted-foreground">Active Donors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">1,250+</div>
              <div className="text-sm text-muted-foreground">Lives Saved</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-success mb-2">96%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p>© 2025 Drop Save - Blood Donation Crisis Management Platform | Human Support Available 24/7</p>
        </footer>
      </div>
    </div >
  );
};

export default Landing;

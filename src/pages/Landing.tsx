import { useNavigate } from 'react-router-dom';
import { Building2, Droplet, Building, User, Heart, Shield, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { memo, useMemo } from 'react';

const Landing = () => {
  const navigate = useNavigate();

  const accessCards = useMemo(() => [
    {
      id: 'hospital',
      title: 'Hospitals',
      description: 'Manage emergency blood requests and patient records with precision',
      icon: Building2,
      path: '/hospital/auth',
      gradient: 'from-[#8B0000] via-[#DC143C] to-[#FF1744]'
    },
    {
      id: 'donor',
      title: 'Donors',
      description: 'Be a hero - respond to urgent blood donation requests',
      icon: Droplet,
      path: '/donor/auth',
      gradient: 'from-[#DC143C] via-[#FF1744] to-[#8B0000]'
    },
    {
      id: 'bloodbank',
      title: 'Blood Banks',
      description: 'Track inventory and coordinate with hospitals efficiently',
      icon: Building,
      path: '/bloodbank/auth',
      gradient: 'from-[#8B0000] to-[#DC143C]'
    },
    {
      id: 'patient',
      title: 'Patients',
      description: 'Request blood and connect with nearby blood banks instantly',
      icon: User,
      path: '/patient/auth',
      gradient: 'from-[#DC143C] to-[#8B0000]'
    }
  ], []);

  const features = useMemo(() => [
    {
      icon: Heart,
      title: 'Save Lives',
      description: 'Every donation matters'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'HIPAA compliant platform'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Always here to help'
    }
  ], []);

  return (
    <div className="min-h-screen w-full bg-white bg-royal-pattern relative overflow-hidden">
      {/* OPTIMIZED: Reduced floating elements from 3 to 2 for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#8B0000]/8 to-transparent rounded-full blur-3xl animate-elegant-float gpu-accelerated" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-[#DC143C]/6 to-transparent rounded-full blur-3xl animate-elegant-float gpu-accelerated" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-12 md:mb-20 animate-slide-in-up">
          <div className="mb-6">
            <div className="inline-block p-4 bg-gradient-to-br from-[#8B0000] to-[#DC143C] rounded-2xl shadow-royal mb-6 animate-elegant-float">
              <Droplet className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-royal drop-shadow-lg">
            Drop Save Network
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto px-4 mb-8 leading-relaxed">
            A <span className="font-bold text-[#8B0000]">professional</span> platform connecting hospitals, donors, and blood banks to <span className="font-bold text-[#DC143C]">save lives</span> in real time
          </p>
          <div className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-elegant inline-flex">
            <div className="w-3 h-3 bg-[#DC143C] rounded-full animate-pulse" />
            <p className="text-sm font-semibold text-[#8B0000] uppercase tracking-wide">Live Emergency Network Active</p>
            <div className="w-3 h-3 bg-[#DC143C] rounded-full animate-pulse" />
          </div>
        </header>

        {/* Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto mb-16">
          {accessCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className="glass-card-royal p-8 cursor-pointer group hover:shadow-royal transition-all duration-500 border-2 border-[#8B0000]/20 hover:border-[#DC143C]/40 animate-slide-in-up overflow-hidden relative"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => navigate(card.path)}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="flex flex-col items-center text-center space-y-5 relative z-10">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-elegant`}>
                      <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold text-[#8B0000] group-hover:text-[#DC143C] transition-colors duration-300">
                    {card.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center gap-2 text-[#8B0000] font-bold group-hover:gap-4 transition-all duration-300">
                    <span className="uppercase tracking-wide text-sm">Access Portal</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-6 text-center animate-slide-in-up hover:shadow-elegant transition-all duration-300"
                  style={{ animationDelay: `${(index + 4) * 150}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8B0000] to-[#DC143C] rounded-xl mb-4 shadow-elegant">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#8B0000] mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="glass-card-royal rounded-3xl p-8 md:p-12 max-w-5xl mx-auto animate-slide-in-up shadow-royal border-2 border-[#8B0000]/20" style={{ animationDelay: '600ms' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-[#8B0000] to-[#DC143C] bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                342+
              </div>
              <div className="text-sm md:text-base text-gray-700 font-semibold uppercase tracking-wide">Active Donors</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-[#DC143C] to-[#FF1744] bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                1,250+
              </div>
              <div className="text-sm md:text-base text-gray-700 font-semibold uppercase tracking-wide">Lives Saved</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-[#8B0000] to-[#DC143C] bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                96%
              </div>
              <div className="text-sm md:text-base text-gray-700 font-semibold uppercase tracking-wide">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-gray-600">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 text-[#8B0000] font-semibold">
              <Heart className="w-4 h-4 fill-current animate-pulse" />
              <span>Powered by compassion, driven by technology</span>
              <Heart className="w-4 h-4 fill-current animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500">© 2025 Drop Save Network - Professional Blood Donation Management Platform</p>
          <p className="text-gray-500 mt-1">Medical Support Available 24/7 | HIPAA Compliant</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;

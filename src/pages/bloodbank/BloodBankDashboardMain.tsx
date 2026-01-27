import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockBloodBanks } from '@/data/mockData';
import { ChevronLeft, ChevronRight, Award, Building2, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BloodBankDashboardMain = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get blood bank data from mock
  const bloodBank = useMemo(() => mockBloodBanks[0], []);

  // Carousel slides
  const slides = [
    {
      id: 1,
      title: 'Bank Owner Introduction',
      content: `Welcome! I'm ${bloodBank.ownerName}, the owner of ${bloodBank.name}. We are committed to saving lives through efficient blood management and distribution. Our facility is equipped with state-of-the-art preservation technology and staffed by dedicated professionals.`,
      icon: <Building2 className="h-12 w-12 text-red-500" />,
    },
    {
      id: 2,
      title: 'Blood Distribution Records',
      content: `We have successfully distributed ${bloodBank.sendRecords.reduce((sum, record) => sum + record.unitsSent, 0)} units of blood to hospitals in need. Our success rate stands at ${bloodBank.successRate}%, ensuring timely and safe delivery of life-saving blood products.`,
      icon: <TrendingUp className="h-12 w-12 text-green-500" />,
    },
    {
      id: 3,
      title: 'Blood Camp Information',
      content: 'Blood camps are conducted every month on the 1st and 2nd Saturdays. Camp locations will be announced later. Please help us by donating blood and saving lives. Your contribution makes a difference!',
      icon: <Calendar className="h-12 w-12 text-blue-500" />,
    },
  ];

  // Auto-advance carousel every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Calculate total stock
  const totalStock = useMemo(
    () => bloodBank.preservationList.reduce((sum, unit) => sum + unit.unitsAvailable, 0),
    [bloodBank.preservationList]
  );

  // Calculate blood group distribution for ring visualization
  const bloodGroupStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    bloodBank.preservationList.forEach((unit) => {
      stats[unit.bloodType] = (stats[unit.bloodType] || 0) + unit.unitsAvailable;
    });
    return Object.entries(stats).map(([type, units]) => ({
      type,
      units,
      percentage: (units / totalStock) * 100,
    }));
  }, [bloodBank.preservationList, totalStock]);

  return (
    <BloodBankLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-glow mb-2">
          Welcome to {bloodBank.name}
        </h1>
        <p className="text-muted-foreground">
          {bloodBank.location} • Managed by {bloodBank.ownerName}
        </p>
        <Badge className="mt-2 bg-green-500">
          <Award className="h-3 w-3 mr-1" />
          Reputation Score: {bloodBank.reputationScore}
        </Badge>
      </div>

      {/* Achievements Carousel */}
      <Card className="glass-card p-6 mb-8 relative overflow-hidden">
        <h2 className="text-xl font-bold mb-4 text-glow">Achievements & Information</h2>

        <div className="relative min-h-[200px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-500 ${index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
                }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center border-2 border-red-500/30">
                  {slide.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-glow">{slide.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{slide.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevSlide}
            className="hover:bg-red-500/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                  ? 'bg-red-500 w-8'
                  : 'bg-red-500/30 hover:bg-red-500/50'
                  }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextSlide}
            className="hover:bg-red-500/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Blood Bank Records - Ring Format */}
      <Card className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6 text-glow">Blood Bank Records</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bloodGroupStats.map((stat) => (
            <div key={stat.type} className="flex flex-col items-center">
              {/* Ring Visualization */}
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-red-500/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - stat.percentage / 100)}`}
                    className="text-red-500 transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-glow">{stat.units}</span>
                  <span className="text-xs text-muted-foreground">units</span>
                </div>
              </div>

              {/* Blood type label */}
              <div className="mt-3 text-center">
                <Badge variant="destructive" className="text-sm">
                  {stat.type}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.percentage.toFixed(1)}% of stock
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </BloodBankLayout>
  );
};

export default BloodBankDashboardMain;
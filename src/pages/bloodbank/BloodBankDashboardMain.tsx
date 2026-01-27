import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockBloodBanks } from '@/data/mockData';
import { ChevronLeft, ChevronRight, Award, Building2, Calendar, TrendingUp, Droplet, Package, Users } from 'lucide-react';
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
      content: `Welcome! I'm ${bloodBank.ownerName}, the owner of ${bloodBank.name}. We are committed to saving lives through efficient blood management and distribution.`,
      icon: <Building2 className="h-8 w-8 text-primary" />,
    },
    {
      id: 2,
      title: 'Blood Distribution Records',
      content: `We have successfully distributed ${bloodBank.sendRecords.reduce((sum, record) => sum + record.unitsSent, 0)} units of blood to hospitals in need. Our success rate stands at ${bloodBank.successRate}%.`,
      icon: <TrendingUp className="h-8 w-8 text-success" />,
    },
    {
      id: 3,
      title: 'Blood Camp Information',
      content: 'Blood camps are conducted every month on the 1st and 2nd Saturdays. Camp locations will be announced. Your contribution makes a difference!',
      icon: <Calendar className="h-8 w-8 text-accent" />,
    },
  ];

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome to {bloodBank.name}
            </h1>
            <p className="text-muted-foreground">
              {bloodBank.location} • Managed by {bloodBank.ownerName}
            </p>
          </div>
          <Badge className="w-fit bg-success/10 text-success border-success/20 px-4 py-2">
            <Award className="h-4 w-4 mr-2" />
            Reputation: {bloodBank.reputationScore}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Stock</p>
              <p className="text-3xl font-bold text-foreground">{totalStock} units</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-3xl font-bold text-foreground">{bloodBank.successRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
              <Users className="h-7 w-7 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Donors</p>
              <p className="text-3xl font-bold text-foreground">245</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements Carousel */}
      <Card className="card-royal p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Achievements & Information</h2>

        <div className="relative min-h-[180px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-500 ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center border border-border">
                  {slide.icon}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{slide.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{slide.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevSlide}
            className="hover:bg-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-primary w-8'
                    : 'bg-border w-2 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextSlide}
            className="hover:bg-primary/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Blood Bank Records - Ring Format */}
      <Card className="card-royal p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Blood Inventory by Type</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bloodGroupStats.map((stat) => (
            <div key={stat.type} className="flex flex-col items-center">
              {/* Ring Visualization */}
              <div className="relative w-28 h-28 md:w-32 md:h-32">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    className="text-secondary"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - stat.percentage / 100)}`}
                    className="text-primary transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{stat.units}</span>
                  <span className="text-xs text-muted-foreground">units</span>
                </div>
              </div>

              {/* Blood type label */}
              <div className="mt-3 text-center">
                <Badge className="bg-primary text-white text-sm px-3 py-1">
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

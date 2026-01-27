import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Building2, Users, Droplet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvertisementCarouselProps {
  hospitalName: string;
  hospitalBio: string;
  connectedBloodBanks: number;
  patientsNeedingBlood: number;
}

const AdvertisementCarousel = ({
  hospitalName,
  hospitalBio,
  connectedBloodBanks,
  patientsNeedingBlood
}: AdvertisementCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedCount, setAnimatedCount] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Connected Blood Banks',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <Building2 className="h-16 w-16 mb-4 text-white" />
          <h3 className="text-2xl font-bold text-white mb-2">Blood Bank Network</h3>
          <div className="relative w-32 h-32 mb-4">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(animatedCount / connectedBloodBanks) * 351.86} 351.86`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{animatedCount}</span>
            </div>
          </div>
          <p className="text-white/90 text-sm">Connected Blood Banks</p>
        </div>
      )
    },
    {
      id: 2,
      title: 'Hospital Information',
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <Building2 className="h-16 w-16 mb-4 text-white" />
          <h3 className="text-3xl font-bold text-white mb-4">{hospitalName}</h3>
          <p className="text-white/90 text-lg leading-relaxed max-w-md">
            {hospitalBio}
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: 'Patients Needing Blood',
      icon: Users,
      color: 'from-red-500 to-orange-500',
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <Droplet className="h-16 w-16 mb-4 text-white animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2">Urgent Blood Requests</h3>
          <div className="relative mb-4">
            <div className="text-7xl font-bold text-white animate-pulse">
              {patientsNeedingBlood}
            </div>
          </div>
          <p className="text-white/90 text-sm">Patients Currently Need Blood</p>
          {patientsNeedingBlood > 0 && (
            <div className="mt-4 px-4 py-2 bg-white/20 rounded-full">
              <p className="text-white text-xs font-semibold">🚨 Immediate Action Required</p>
            </div>
          )}
        </div>
      )
    }
  ];

  // Auto-rotate slides every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Animate count for blood banks slide
  useEffect(() => {
    if (currentSlide === 0) {
      setAnimatedCount(0);
      const duration = 1000;
      const steps = 20;
      const increment = connectedBloodBanks / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= connectedBloodBanks) {
          setAnimatedCount(connectedBloodBanks);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [currentSlide, connectedBloodBanks]);

  return (
    <Card className="relative overflow-hidden h-80 mb-8">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-500 ease-in-out",
            index === currentSlide
              ? "opacity-100 translate-x-0"
              : index < currentSlide
              ? "opacity-0 -translate-x-full"
              : "opacity-0 translate-x-full"
          )}
        >
          <div className={cn("w-full h-full bg-gradient-to-br", slide.color)}>
            {slide.content}
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Card>
  );
};

export default AdvertisementCarousel;
import { useNavigate } from 'react-router-dom';
import { Building2, Droplet, Building, User, Heart, Phone, Shield, Clock, ChevronRight, Star, Users, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

  const accessCards = [
    {
      id: 'hospital',
      title: 'Hospitals',
      description: 'Manage emergency blood requests and coordinate patient care with our network',
      icon: Building2,
      path: '/hospital/auth',
      accent: 'from-primary to-primary-dark'
    },
    {
      id: 'donor',
      title: 'Donors',
      description: 'Register as a life-saver and respond to urgent blood donation requests',
      icon: Droplet,
      path: '/donor/auth',
      accent: 'from-primary-glow to-primary'
    },
    {
      id: 'bloodbank',
      title: 'Blood Banks',
      description: 'Track inventory, manage preservation, and coordinate with hospitals',
      icon: Building,
      path: '/bloodbank/auth',
      accent: 'from-primary to-primary-glow'
    },
    {
      id: 'patient',
      title: 'Patients',
      description: 'Request blood units and connect with nearby blood banks instantly',
      icon: User,
      path: '/patient/auth',
      accent: 'from-primary-dark to-primary'
    }
  ];

  const features = [
    {
      icon: Clock,
      title: '24/7 Emergency Response',
      description: 'Round-the-clock availability for critical blood requirements'
    },
    {
      icon: Shield,
      title: 'Verified Network',
      description: 'All donors and blood banks are thoroughly verified for safety'
    },
    {
      icon: Activity,
      title: 'Real-time Tracking',
      description: 'Track blood availability and requests in real-time'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Donors', icon: Users },
    { value: '50,000+', label: 'Lives Saved', icon: Heart },
    { value: '500+', label: 'Partner Hospitals', icon: Building2 },
    { value: '98%', label: 'Success Rate', icon: Star }
  ];

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Droplet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Drop Save</h1>
                <p className="text-xs text-muted-foreground">Blood Donation Network</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </nav>
            <Button 
              onClick={() => navigate('/donor/auth')} 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg"
            >
              <Phone className="h-4 w-4 mr-2" />
              Emergency: 1800-BLOOD
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-hero-pattern overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Trusted by 500+ Hospitals Nationwide</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Every Drop <br />
              <span className="text-gradient">Saves a Life</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              India's most trusted blood donation network connecting hospitals, donors, and blood banks 
              to ensure life-saving blood reaches those in need — on time, every time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button 
                size="lg" 
                onClick={() => navigate('/donor/auth')}
                className="btn-royal text-lg px-8 py-6"
              >
                <Heart className="h-5 w-5 mr-2" />
                Become a Donor
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/hospital/auth')}
                className="btn-outline-royal text-lg px-8 py-6"
              >
                Request Blood
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="text-center p-4 rounded-2xl bg-card border border-border shadow-soft animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              How Can We Help You?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a hospital in need, a donor ready to help, or a blood bank managing inventory — 
              we've got you covered.
            </p>
          </div>

          {/* Access Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {accessCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.id}
                  className="group card-royal p-6 cursor-pointer hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(card.path)}
                >
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">
                      {card.description}
                    </p>

                    {/* Link */}
                    <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>Get Started</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left Content */}
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 mb-6">
                Trusted by Thousands Across India
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Drop Save is built on trust, speed, and reliability. Our platform ensures that every blood 
                request is handled with the utmost care and urgency it deserves.
              </p>

              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                {/* Decorative Rings */}
                <div className="absolute inset-0 border-2 border-primary/10 rounded-full" />
                <div className="absolute inset-8 border-2 border-primary/15 rounded-full" />
                <div className="absolute inset-16 border-2 border-primary/20 rounded-full" />
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-glow-strong animate-heartbeat">
                    <Heart className="h-16 w-16 text-white" fill="currentColor" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-8 w-16 h-16 bg-card rounded-2xl shadow-elegant flex items-center justify-center animate-float">
                  <Droplet className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute bottom-12 left-4 w-14 h-14 bg-card rounded-2xl shadow-elegant flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute top-1/2 right-0 w-12 h-12 bg-card rounded-xl shadow-elegant flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-white rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Save a Life?
            </h2>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              Join thousands of donors, hospitals, and blood banks working together to ensure 
              no one dies due to lack of blood. Your contribution matters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/donor/auth')}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 font-semibold shadow-xl"
              >
                <Heart className="h-5 w-5 mr-2" />
                Register as Donor
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/hospital/auth')}
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 font-semibold"
              >
                Partner with Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Droplet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Drop Save</h3>
                  <p className="text-xs text-white/60">Blood Donation Network</p>
                </div>
              </div>
              <p className="text-white/70 max-w-sm leading-relaxed">
                Connecting donors, hospitals, and blood banks to save lives across India. 
                Every drop counts in our mission to ensure blood availability for all.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-primary transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-white/70 hover:text-primary transition-colors text-sm">How It Works</a></li>
                <li><a href="#" className="text-white/70 hover:text-primary transition-colors text-sm">Become a Donor</a></li>
                <li><a href="#" className="text-white/70 hover:text-primary transition-colors text-sm">Partner Hospitals</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Emergency Contact</h4>
              <ul className="space-y-2">
                <li className="text-white/70 text-sm">24/7 Helpline: 1800-BLOOD</li>
                <li className="text-white/70 text-sm">Email: help@dropsave.in</li>
                <li className="text-white/70 text-sm">WhatsApp: +91 9876543210</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/60">
                © 2025 Drop Save - Blood Donation Crisis Management Platform. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-white/60 hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

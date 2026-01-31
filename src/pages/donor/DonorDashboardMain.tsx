import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DonorLayout from '@/components/donor/DonorLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  Heart,
  Droplet,
  Calendar,
  Activity,
  Award,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Target,
  ArrowRight,
  X
} from 'lucide-react';

const DonorDashboardMain = () => {
  const { user } = useAuth();

  const stats = {
    totalDonations: 8,
    livesSaved: 24,
    lastDonation: 'Dec 15, 2025',
    bloodType: user?.bloodType || 'O+',
    reputation: 95,
  };

  return (
    <DonorLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-pink-700 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome, {user?.name?.split(' ')[0] || 'Donor'}! 👋
            </h1>
            <p className="text-xl text-white/90">Thank you for being a life-saver.</p>
          </div>
        </div>

        {/* Blood Donation Criteria - MOVED TO TOP */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-red-50 dark:bg-red-950/20">
            <CardTitle className="text-2xl text-red-600 dark:text-red-500 flex items-center gap-3">
              <Heart className="h-6 w-6" />
              Blood Donation Criteria for Donors
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Please ensure you meet these requirements before donating</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Age Requirement */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-red-600 dark:text-red-500 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Age Requirement
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">You are aged between <strong className="text-gray-900 dark:text-white">18-65 years</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">In some countries, 16-17-year-olds may donate with consent and health clearance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Regular donors over 65 years may be accepted with physician approval</span>
                  </li>
                </ul>
              </div>

              {/* Weight Requirement */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-red-600 dark:text-red-500 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Weight Requirement
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">You must weigh at least <strong className="text-gray-900 dark:text-white">50 kg (110 lbs)</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">In some cases, 45 kg is acceptable for 350 ml ±10% donations</span>
                  </li>
                </ul>
              </div>

              {/* Health Conditions */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-red-600 dark:text-red-500 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Health Conditions
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">You must be in <strong className="text-gray-900 dark:text-white">good health</strong> at the time of donation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Do not donate if you have cold, flu, sore throat, stomach bug, or any infection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Wait 1 week after tattoos or piercings (12 hours if done professionally)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">After dental work: wait 24 hours for minor, 1 month for major procedures</span>
                  </li>
                </ul>
              </div>

              {/* Haemoglobin Levels */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-red-600 dark:text-red-500 flex items-center gap-2">
                  <Droplet className="h-5 w-5" />
                  Minimum Haemoglobin Levels
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Females: <strong className="text-gray-900 dark:text-white">12.5 g/dL</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Males: <strong className="text-gray-900 dark:text-white">13.0 g/dL</strong></span>
                  </li>
                </ul>
              </div>

              {/* Donation Frequency */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="font-bold text-xl text-red-600 dark:text-red-500 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Donation Frequency - Waiting Period Between Donations
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Whole blood:</strong> Can donate once every <strong className="text-red-600 dark:text-red-500">3 months (12 weeks)</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Plasma donation:</strong> Can donate every <strong className="text-red-600 dark:text-red-500">4 months (16 weeks)</strong>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-2 border-red-200 dark:border-red-800/30">
              <div className="flex items-center gap-4">
                <Heart className="h-12 w-12 text-red-600 dark:text-red-500" />
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-red-600 dark:text-red-500 mb-1">Ready to Save Lives?</h4>
                  <p className="text-gray-700 dark:text-gray-300">Every donation can save up to 3 lives. Book your appointment today!</p>
                </div>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                  Donate Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Donations */}
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Droplet className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-5xl font-black mb-1">{stats.totalDonations}</div>
              <div className="text-sm text-white/90">Total Donations</div>
            </CardContent>
          </Card>

          {/* Lives Saved */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Heart className="w-6 h-6" />
                </div>
                <Users className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-5xl font-black mb-1">{stats.livesSaved}</div>
              <div className="text-sm text-white/90">Lives Saved</div>
            </CardContent>
          </Card>

          {/* Last Donation */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <Clock className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-2xl font-black mb-1">{stats.lastDonation}</div>
              <div className="text-sm text-white/90">Last Donation</div>
            </CardContent>
          </Card>

          {/* Reputation */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <Target className="w-5 h-5 text-white/70" />
              </div>
              <div className="text-5xl font-black mb-1">{stats.reputation}%</div>
              <div className="text-sm text-white/90">Reputation</div>
            </CardContent>
          </Card>
        </div>

        {/* Eligibility Banner */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">You're Eligible to Donate! 🎉</h3>
                <p className="text-white/90 mb-3">Great news! Schedule your next donation and save more lives.</p>
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-bold">
                  <Target className="w-4 h-4 mr-2" />
                  Schedule Donation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Requests & Blood Camps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Requests */}
          <Card className="bg-gray-900 border-gray-800 shadow-xl">
            <CardHeader className="border-b border-gray-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  Emergency Requests
                </CardTitle>
                <Badge className="bg-red-600 text-white">2 URGENT</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Request 1 */}
              <div className="p-5 bg-gradient-to-br from-red-500/10 to-red-600/10 border-2 border-red-500/30 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-red-500" />
                    <div>
                      <h4 className="font-bold text-white text-lg">City General Hospital</h4>
                      <p className="text-sm text-gray-400">2.5 km away</p>
                    </div>
                  </div>
                  <Badge className="bg-red-600 text-white font-bold text-xs">CRITICAL</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Blood</div>
                    <div className="text-xl font-bold text-red-500">O+</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Units</div>
                    <div className="text-xl font-bold text-white">3</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Time</div>
                    <div className="text-lg font-bold text-orange-500">2h</div>
                  </div>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                  Respond Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Request 2 */}
              <div className="p-5 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-2 border-orange-500/30 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-bold text-white text-lg">Metro Care Hospital</h4>
                      <p className="text-sm text-gray-400">4.1 km away</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-600 text-white font-bold text-xs">URGENT</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Blood</div>
                    <div className="text-xl font-bold text-orange-500">O+</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Units</div>
                    <div className="text-xl font-bold text-white">2</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Time</div>
                    <div className="text-lg font-bold text-yellow-500">5h</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-2 border-orange-500/50 text-white hover:bg-orange-500/20 font-bold">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Blood Donation Camps */}
          <Card className="bg-gray-900 border-gray-800 shadow-xl">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-xl text-white flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                Upcoming Donation Camps
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Camp 1 */}
              <div className="p-5 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/30 rounded-xl">
                <h4 className="font-bold text-white text-xl mb-4">City Central Blood Camp</h4>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Saturday, February 15, 2026</div>
                      <div className="text-sm text-gray-400">In 17 days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-white font-medium">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <MapPin className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-white font-medium">City Community Center</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Register for Camp
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Camp 2 */}
              <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/30 rounded-xl">
                <h4 className="font-bold text-white text-xl mb-4">University Health Drive</h4>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Thursday, February 20, 2026</div>
                      <div className="text-sm text-gray-400">In 22 days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Clock className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <MapPin className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-white font-medium">University Campus</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-2 border-purple-500/50 text-white hover:bg-purple-500/20 font-bold">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DonorLayout >
  );
};

export default DonorDashboardMain;
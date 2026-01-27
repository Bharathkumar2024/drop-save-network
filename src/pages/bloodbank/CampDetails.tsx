import { useState, useMemo } from 'react';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockBloodBanks } from '@/data/mockData';
import { Calendar, Clock, MapPin, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface CampSchedule {
  month: string;
  year: number;
  firstSaturday: string;
  secondSaturday: string;
  location: string;
  theme: string;
  selectedDonors: number;
}

const CampDetails = () => {
  const bloodBank = useMemo(() => mockBloodBanks[0], []);
  const [isEditing, setIsEditing] = useState(false);
  const [campTheme, setCampTheme] = useState('Save Lives, Donate Blood');
  const [campLocation, setCampLocation] = useState('Community Center, Metro City');

  // Generate camp schedules for next 6 months
  const [campSchedules, setCampSchedules] = useState<CampSchedule[]>(() => {
    const schedules: CampSchedule[] = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();

      // Find 2nd and 4th Saturdays
      const saturdays: number[] = [];
      for (let day = 1; day <= 31; day++) {
        const testDate = new Date(year, date.getMonth(), day);
        if (testDate.getMonth() !== date.getMonth()) break;
        if (testDate.getDay() === 6) saturdays.push(day);
      }

      schedules.push({
        month,
        year,
        firstSaturday: saturdays[0] ? `${month} ${saturdays[0]}, ${year}` : 'TBD',
        secondSaturday: saturdays[1] ? `${month} ${saturdays[1]}, ${year}` : 'TBD',
        location: 'To be announced',
        theme: 'Save Lives, Donate Blood',
        selectedDonors: Math.floor(Math.random() * 50) + 10,
      });
    }

    return schedules;
  });

  const handleSaveTheme = () => {
    toast.success('Camp details updated successfully!');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCampTheme('Save Lives, Donate Blood');
    setCampLocation('Community Center, Metro City');
  };

  return (
    <BloodBankLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-glow mb-2">
          Blood Donation Camp Details
        </h1>
        <p className="text-muted-foreground">
          {bloodBank.name} • Organized by {bloodBank.ownerName}
        </p>
      </div>

      {/* Camp Information Card */}
      <Card className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-glow">Camp Information</h2>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="hover:bg-red-500/20"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveTheme}
                className="hover:bg-green-500/20"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="hover:bg-red-500/20"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camp Timing */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Camp Timing</h3>
                <p className="text-2xl font-bold text-glow">9.00 Am to 4.00 Pm</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Every 1st and 2nd Saturday of the month
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Camps are conducted monthly on the 1st and 2nd Saturdays
                </p>
              </div>
            </div>
          </div>

          {/* Camp Theme & Location */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="campTheme">Camp Theme</Label>
                  <Input
                    id="campTheme"
                    value={campTheme}
                    onChange={(e) => setCampTheme(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="campLocation">Default Location</Label>
                  <Textarea
                    id="campLocation"
                    value={campLocation}
                    onChange={(e) => setCampLocation(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Camp Theme</h3>
                    <p className="text-muted-foreground">{campTheme}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">{campLocation}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Specific locations announced before each camp
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-red-500">Important:</span> Blood camps are
            conducted every month on the 1st and 2nd Saturdays. Camp locations will be
            announced later. Please help us by donating blood and saving lives!
          </p>
        </div>
      </Card>

      {/* Monthly Camp Schedule */}
      <Card className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6 text-glow">Monthly Camp Schedule</h2>

        <div className="space-y-4">
          {campSchedules.map((schedule, index) => (
            <div
              key={index}
              className="glass-card-primary p-4 rounded-lg border border-border/50 hover:border-red-500/50 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <h3 className="font-bold text-lg text-glow">
                    {schedule.month} {schedule.year}
                  </h3>
                  <Badge variant="outline" className="mt-1">
                    {schedule.selectedDonors} donors selected
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">1st Saturday</p>
                  <p className="font-semibold">{schedule.firstSaturday}</p>
                  <p className="text-xs text-green-500">9.00 Am to 4.00 Pm</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">2nd Saturday</p>
                  <p className="font-semibold">{schedule.secondSaturday}</p>
                  <p className="text-xs text-green-500">9.00 Am to 4.00 Pm</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-sm">{schedule.location}</p>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-red-500/20"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </BloodBankLayout >
  );
};

export default CampDetails;
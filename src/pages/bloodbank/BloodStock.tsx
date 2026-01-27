import { useMemo } from 'react';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockBloodBanks } from '@/data/mockData';
import { Droplet, Calendar, AlertTriangle } from 'lucide-react';

const BloodStock = () => {
  const bloodBank = useMemo(() => mockBloodBanks[0], []);

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  // Check if near expiry (within 7 days)
  const isNearExpiry = (expiryDate: string) => {
    return getDaysUntilExpiry(expiryDate) <= 7;
  };

  // Check if expired
  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-500';
      case 'reserved':
        return 'text-orange-500';
      case 'dispatched':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };

  // Calculate total stock
  const totalStock = useMemo(
    () => bloodBank.preservationList.reduce((sum, unit) => sum + unit.unitsAvailable, 0),
    [bloodBank.preservationList]
  );

  return (
    <BloodBankLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-glow mb-2">Blood Stock</h1>
        <p className="text-muted-foreground">
          Current inventory of blood units with expiry tracking
        </p>
      </div>

      {/* Total Stock Summary */}
      <Card className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Blood Stock</p>
            <p className="text-4xl font-bold text-glow mt-2">{totalStock} Units</p>
          </div>
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <Droplet className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </Card>

      {/* Blood Stock Grid - Compact Square Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bloodBank.preservationList.map((unit) => {
          const daysLeft = getDaysUntilExpiry(unit.expiryDate);
          const nearExpiry = isNearExpiry(unit.expiryDate);
          const expired = isExpired(unit.expiryDate);

          return (
            <Card
              key={unit.id}
              className={`glass-card p-6 hover:scale-105 transition-all duration-200 ${
                expired
                  ? 'border-red-500/50 bg-red-500/5'
                  : nearExpiry
                  ? 'border-yellow-500/50 bg-yellow-500/5'
                  : 'border-border/50 hover:border-red-500/50'
              }`}
            >
              {/* Blood Type Header */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant="destructive" className="text-lg px-3 py-1">
                  {unit.bloodType}
                </Badge>
                <Badge
                  variant="outline"
                  className={getStatusColor(unit.status)}
                >
                  {unit.status}
                </Badge>
              </div>

              {/* Ring Visualization */}
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      className="text-red-500/20"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 56 * (1 - Math.min(unit.unitsAvailable / 50, 1))
                      }`}
                      className={
                        expired
                          ? 'text-red-500'
                          : nearExpiry
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-glow">
                      {unit.unitsAvailable}
                    </span>
                    <span className="text-xs text-muted-foreground">units</span>
                  </div>
                </div>
              </div>

              {/* Unit Details */}
              <div className="space-y-3">
                {/* Batch ID */}
                <div>
                  <p className="text-xs text-muted-foreground">Batch ID</p>
                  <p className="text-xs font-mono font-semibold truncate">
                    {unit.batchId}
                  </p>
                </div>

                {/* Storage Conditions */}
                <div>
                  <p className="text-xs text-muted-foreground">Storage</p>
                  <p className="text-xs font-medium">{unit.storageConditions}</p>
                </div>

                {/* Collection Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Collected</p>
                    <p className="text-xs font-medium">
                      {new Date(unit.collectionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Expiry Date */}
                <div
                  className={`flex items-center gap-2 p-2 rounded ${
                    expired
                      ? 'bg-red-500/20'
                      : nearExpiry
                      ? 'bg-yellow-500/20'
                      : 'bg-green-500/10'
                  }`}
                >
                  {(expired || nearExpiry) && (
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        expired ? 'text-red-500' : 'text-yellow-500'
                      }`}
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      {expired ? 'Expired' : 'Expires'}
                    </p>
                    <p
                      className={`text-xs font-bold ${
                        expired
                          ? 'text-red-500'
                          : nearExpiry
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`}
                    >
                      {new Date(unit.expiryDate).toLocaleDateString()}
                    </p>
                    {!expired && (
                      <p className="text-xs text-muted-foreground">
                        {daysLeft} days left
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              {expired && (
                <div className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded text-center">
                  <p className="text-xs font-semibold text-red-500">
                    ⚠️ EXPIRED - Remove from stock
                  </p>
                </div>
              )}
              {nearExpiry && !expired && (
                <div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-center">
                  <p className="text-xs font-semibold text-yellow-500">
                    ⚠️ Expiring Soon
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </BloodBankLayout>
  );
};

export default BloodStock;
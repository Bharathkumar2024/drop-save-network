import { useMemo, useCallback } from 'react';
import BloodBankLayout from '@/components/bloodbank/BloodBankLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockBloodBanks } from '@/data/mockData';
import { FileText, Download, Building2, Calendar, Droplet } from 'lucide-react';
import { toast } from 'sonner';

const BloodBankRecords = () => {
  const bloodBank = useMemo(() => mockBloodBanks[0], []);

  const handleDownloadRecord = useCallback((recordId: string, hospitalName: string) => {
    toast.success(`Downloading record for ${hospitalName}`, {
      description: 'Record will be saved as PDF',
    });
    // Simulate download
    console.log(`Downloading record: ${recordId}`);
  }, []);

  const handleExportAll = useCallback(() => {
    toast.success('Exporting all records', {
      description: 'All records will be compiled into a single PDF',
    });
  }, []);

  // Calculate total units sent
  const totalUnitsSent = useMemo(
    () => bloodBank.sendRecords.reduce((sum, record) => sum + record.unitsSent, 0),
    [bloodBank.sendRecords]
  );

  return (
    <BloodBankLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-glow mb-2">
          Blood Bank Records
        </h1>
        <p className="text-muted-foreground">
          Detailed records of blood units distributed to hospitals
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-3xl font-bold text-glow mt-1">
                {bloodBank.sendRecords.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Units Sent</p>
              <p className="text-3xl font-bold text-glow mt-1">{totalUnitsSent}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <Droplet className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-3xl font-bold text-green-500 mt-1">
                {bloodBank.successRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Records List */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-glow">Distribution Records</h2>
          <Button
            variant="outline"
            onClick={handleExportAll}
            className="hover:bg-red-500/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All Records
          </Button>
        </div>

        <div className="space-y-4">
          {bloodBank.sendRecords.map((record) => (
            <div
              key={record.id}
              className="glass-card-primary p-6 rounded-lg border border-border/50 hover:border-red-500/50 transition-all"
            >
              {/* Main Record Info */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                {/* Hospital Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{record.hospitalName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {record.hospitalId}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {record.bloodTypes.map((type) => (
                          <Badge key={type} variant="destructive" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Units Sent */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Units Sent</p>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-red-500" />
                    <span className="text-2xl font-bold text-glow">{record.unitsSent}</span>
                  </div>
                </div>

                {/* Dispatch Time */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dispatch Time</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-sm">
                        {new Date(record.dispatchTimestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.dispatchTimestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadRecord(record.id, record.hospitalName)}
                    className="hover:bg-green-500/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Additional Details */}
              <div className="pt-4 border-t border-border/50 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-muted-foreground min-w-[140px]">
                    Transport Conditions:
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {record.transportConditions}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-muted-foreground min-w-[140px]">
                    Responsible Staff:
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {record.responsibleStaff}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-muted-foreground min-w-[140px]">
                    Record ID:
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">{record.id}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 flex justify-end">
                <Badge className="bg-green-500">
                  <FileText className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </BloodBankLayout>
  );
};

export default BloodBankRecords;
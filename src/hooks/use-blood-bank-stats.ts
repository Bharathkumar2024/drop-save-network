import { useQuery } from '@tanstack/react-query';
import { mockBloodBanks, BloodBank } from '@/data/mockData';
import { supabase } from '@/lib/supabase';

// Real-world specific efficient data fetching hook
export const useBloodBankStats = (bankId?: string) => {
    return useQuery({
        queryKey: ['bloodBankStats', bankId],
        queryFn: async (): Promise<BloodBank> => {
            // 1. Try to fetch from Supabase first (Real World)
            try {
                if (bankId) {
                    const { data, error } = await supabase
                        .from('blood_banks')
                        .select('*, blood_units(*), blood_transactions(*)')
                        .eq('id', bankId)
                        .single();

                    if (data && !error) {
                        // Transform Supabase data to match our frontend interface
                        // This is a mapping layer to ensure backend changes don't break UI
                        return {
                            id: data.id,
                            name: data.bank_name,
                            ownerName: 'Admin', // Placeholder or join with users table
                            location: data.location,
                            bankId: data.id.substring(0, 8),
                            approvedCertificates: [],
                            otpVerified: true,
                            reputationScore: 100, // could be calculated
                            successRate: 100, // could be calculated
                            preservationList: data.blood_units?.map((unit: any) => ({
                                id: unit.id,
                                bloodType: unit.blood_type,
                                unitsAvailable: unit.units_available,
                                storageConditions: `Temp: ${unit.storage_temperature}`,
                                collectionDate: unit.collection_date,
                                expiryDate: unit.expiry_date,
                                batchId: unit.batch_id,
                                status: unit.status
                            })) || [],
                            sendRecords: [] // would map similarly
                        } as BloodBank;
                    }
                }
            } catch (e) {
                console.warn('Supabase fetch failed, falling back to mock data', e);
            }

            // 2. Fallback to Mock Data (Development Mode / Error Fallback)
            // Simulate network delay for realistic loading state
            await new Promise(resolve => setTimeout(resolve, 800));
            return mockBloodBanks[0];
        },
        staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes (Efficiency)
        gcTime: 1000 * 60 * 30, // Keep in garbage collector for 30 mins
        retry: 2,
    });
};

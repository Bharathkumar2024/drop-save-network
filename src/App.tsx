import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { HospitalAuthProvider } from "@/contexts/HospitalAuthContext";
import { BloodBankAuthProvider } from "@/contexts/BloodBankAuthContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { setupGlobalErrorHandlers, queryErrorHandler } from "@/lib/errorHandler";
import Landing from "./pages/Landing";
import HospitalAuth from "./pages/hospital/HospitalAuth";
import HospitalAuthSupabase from "./pages/hospital/HospitalAuthSupabase";
import HospitalDashboardNew from "./pages/hospital/HospitalDashboardNew";
import HospitalEmergency from "./pages/hospital/HospitalEmergency";
import HospitalPatientRequest from "./pages/hospital/HospitalPatientRequest";
import HospitalPatientRecords from "./pages/hospital/HospitalPatientRecords";
import HospitalProfile from "./pages/hospital/HospitalProfile";
import DonorAuth from "./pages/donor/DonorAuth";
import DonorAuthSupabase from "./pages/donor/DonorAuthSupabase";
import DonorDashboardMain from "./pages/donor/DonorDashboardMain";
import DonorApplication from "./pages/donor/DonorApplication";
import DonorReputation from "./pages/donor/DonorReputation";
import DonorNotifications from "./pages/donor/DonorNotifications";
import DonorProfile from "./pages/donor/DonorProfile";
import BloodBankAuth from "./pages/bloodbank/BloodBankAuth";
import BloodBankAuthSupabase from "./pages/bloodbank/BloodBankAuthSupabase";
import BloodBankDashboardMain from "./pages/bloodbank/BloodBankDashboardMain";
import CampDetails from "./pages/bloodbank/CampDetails";
import CampDetailsEnhanced from "./pages/bloodbank/CampDetailsEnhanced";
import DonorApplications from "./pages/bloodbank/DonorApplications";
import BloodBankRecords from "./pages/bloodbank/BloodBankRecords";
import BloodStock from "./pages/bloodbank/BloodStock";
import BloodBanks from "./pages/bloodbank/BloodBanks";
import BloodBankNotifications from "./pages/bloodbank/BloodBankNotifications";
import PatientAuth from "./pages/patient/PatientAuth";
import PatientDashboard from "./pages/patient/PatientDashboard";
import BloodRequest from "./pages/patient/BloodRequest";
import NearbyBloodBanks from "./pages/patient/NearbyBloodBanks";
import PatientProfile from "./pages/patient/PatientProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: queryErrorHandler,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
});

const App = () => {
  // Initialize global error handlers on mount
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  const useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true';

  const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    if (useSupabase) {
      return (
        <SupabaseAuthProvider>
          <HospitalAuthProvider>
            <BloodBankAuthProvider>
              {children}
            </BloodBankAuthProvider>
          </HospitalAuthProvider>
        </SupabaseAuthProvider>
      );
    }
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthWrapper>
            <NotificationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />

                  {/* Hospital Routes */}
                  <Route path="/hospital/auth" element={<HospitalAuth />} />
                  <Route path="/hospital/dashboard" element={<HospitalDashboardNew />} />
                  <Route path="/hospital/emergency" element={<HospitalEmergency />} />
                  <Route path="/hospital/patient-request" element={<HospitalPatientRequest />} />
                  <Route path="/hospital/patient-records" element={<HospitalPatientRecords />} />
                  <Route path="/hospital/profile" element={<HospitalProfile />} />

                  {/* Hospital Routes (Supabase - Alternative Auth) */}
                  <Route path="/hospital/auth-supabase" element={<HospitalAuthSupabase />} />

                  {/* Donor Routes with Sidebar Navigation */}
                  <Route path="/donor/auth" element={useSupabase ? <DonorAuthSupabase /> : <DonorAuth />} />
                  <Route path="/donor/dashboard" element={<DonorDashboardMain />} />
                  <Route path="/donor/apply" element={<DonorApplication />} />
                  <Route path="/donor/reputation" element={<DonorReputation />} />
                  <Route path="/donor/notifications" element={<DonorNotifications />} />
                  <Route path="/donor/profile" element={<DonorProfile />} />

                  {/* Blood Bank Routes with Sidebar Navigation */}
                  <Route path="/bloodbank/auth" element={useSupabase ? <BloodBankAuthSupabase /> : <BloodBankAuth />} />
                  <Route path="/bloodbank/dashboard" element={<BloodBankDashboardMain />} />
                  <Route path="/bloodbank/camp-details" element={<CampDetailsEnhanced />} />
                  <Route path="/bloodbank/camp-details-old" element={<CampDetails />} />
                  <Route path="/bloodbank/donor-applications" element={<DonorApplications />} />
                  <Route path="/bloodbank/blood-records" element={<BloodBankRecords />} />
                  <Route path="/bloodbank/blood-stock" element={<BloodStock />} />
                  <Route path="/bloodbank/blood-banks" element={<BloodBanks />} />
                  <Route path="/bloodbank/notifications" element={<BloodBankNotifications />} />

                  {/* Patient Routes with Sidebar Navigation */}
                  <Route path="/patient/auth" element={<PatientAuth />} />
                  <Route path="/patient/dashboard" element={<PatientDashboard />} />
                  <Route path="/patient/blood-request" element={<BloodRequest />} />
                  <Route path="/patient/blood-banks" element={<NearbyBloodBanks />} />
                  <Route path="/patient/profile" element={<PatientProfile />} />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </AuthWrapper>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

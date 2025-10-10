import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Landing from "./pages/Landing";
import HospitalAuth from "./pages/hospital/HospitalAuth";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import DonorAuth from "./pages/donor/DonorAuth";
import DonorDashboard from "./pages/donor/DonorDashboard";
import BloodBankAuth from "./pages/bloodbank/BloodBankAuth";
import BloodBankDashboard from "./pages/bloodbank/BloodBankDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              
              {/* Hospital Routes */}
              <Route path="/hospital/auth" element={<HospitalAuth />} />
              <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
              
              {/* Donor Routes */}
              <Route path="/donor/auth" element={<DonorAuth />} />
              <Route path="/donor/dashboard" element={<DonorDashboard />} />
              
              {/* Blood Bank Routes */}
              <Route path="/bloodbank/auth" element={<BloodBankAuth />} />
              <Route path="/bloodbank/dashboard" element={<BloodBankDashboard />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { ReactNode } from 'react';
import BloodBankSidebar from './BloodBankSidebar';

interface BloodBankLayoutProps {
  children: ReactNode;
}

const BloodBankLayout = ({ children }: BloodBankLayoutProps) => {
  return (
    <div className="min-h-screen bg-background bg-blood-pattern">
      <BloodBankSidebar />
      <main className="ml-64 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default BloodBankLayout;
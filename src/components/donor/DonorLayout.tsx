import { ReactNode } from 'react';
import DonorSidebar from './DonorSidebar';

interface DonorLayoutProps {
  children: ReactNode;
}

const DonorLayout = ({ children }: DonorLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <DonorSidebar />
      <main className="ml-64 min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DonorLayout;
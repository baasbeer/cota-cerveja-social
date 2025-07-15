import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminDashboard } from './AdminDashboard';
import { BrewerDashboard } from './BrewerDashboard';
import { InvestorDashboard } from './InvestorDashboard';
import { RoleGate } from '@/components/auth/RoleGate';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { role, isLoading } = useUserRole();

  if (!user) {
    return <div>Carregando...</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <RoleGate role="ADMIN">
          <AdminDashboard />
        </RoleGate>
        
        <RoleGate role="BREWER">
          <BrewerDashboard />
        </RoleGate>
        
        <RoleGate role="INVESTOR">
          <InvestorDashboard />
        </RoleGate>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import SharesOverview from '@/components/dashboard/SharesOverview';

const MyShares = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Minhas Cotas</h1>
          <p className="text-muted-foreground">
            Gerencie suas cotas e acompanhe seus investimentos na BaasBeer
          </p>
        </div>
        <SharesOverview />
      </main>
    </div>
  );
};

export default MyShares;
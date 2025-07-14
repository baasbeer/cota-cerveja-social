import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import VotingSection from '@/components/dashboard/VotingSection';

const Voting = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Votações</h1>
          <p className="text-muted-foreground">
            Participe das decisões da cervejaria através do seu poder de voto
          </p>
        </div>
        <VotingSection />
      </main>
    </div>
  );
};

export default Voting;
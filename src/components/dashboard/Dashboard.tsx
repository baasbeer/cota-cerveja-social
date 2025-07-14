import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SharesOverview from './SharesOverview';
import VotingSection from './VotingSection';
import { Beer, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Bem-vindo ao <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">BaasBeer</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Participe das decisões da cervejaria através do sistema de cotas e ajude a criar as melhores cervejas artesanais
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Beer className="mr-2 h-5 w-5" />
                Comprar Cotas
              </Button>
              <Button size="lg" variant="outline">
                <Calendar className="mr-2 h-5 w-5" />
                Próximas Votações
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shares Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Visão Geral das Cotas</h2>
              <SharesOverview />
            </section>

            {/* Voting Section */}
            <section>
              <VotingSection />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status do Sócio</CardTitle>
                <CardDescription>
                  Olá, {user?.email?.split('@')[0]}!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tipo de Conta</span>
                  <Badge variant="secondary">Sócio Participante</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Assinatura</span>
                  <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Créditos Chopp</span>
                  <span className="text-sm font-bold text-primary">R$ 0,00</span>
                </div>
              </CardContent>
            </Card>

            {/* Production Status */}
            <Card>
              <CardHeader>
                <CardTitle>Produção Atual</CardTitle>
                <CardDescription>
                  Acompanhe o que está sendo produzido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium">IPA Tropical</p>
                    <p className="text-xs text-muted-foreground">Em fermentação</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Pilsen Artesanal</p>
                    <p className="text-xs text-muted-foreground">Planejada</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Cronograma
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Nova votação disponível</p>
                    <p className="text-xs text-muted-foreground">Escolha da receita de outubro</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Beer className="h-4 w-4 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Produção iniciada</p>
                    <p className="text-xs text-muted-foreground">IPA Tropical em fermentação</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Ver todas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
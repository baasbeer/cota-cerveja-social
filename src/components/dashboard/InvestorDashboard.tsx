import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wallet, TrendingUp, Clock, Award, Vote, Bell } from 'lucide-react';

export const InvestorDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Portfólio</h1>
          <p className="text-muted-foreground">
            Acompanhe seus investimentos e cotas de cerveja
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </Button>
          <Button size="sm">
            <Vote className="mr-2 h-4 w-4" />
            Votar Agora
          </Button>
        </div>
      </div>

      {/* Resumo do portfólio */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investido</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.450</div>
            <p className="text-xs text-muted-foreground">
              Em 8 produções
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotas Recebidas</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187L</div>
            <p className="text-xs text-muted-foreground">
              +23L este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 6 meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45L</div>
            <p className="text-xs text-muted-foreground">
              Em produção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Investimentos ativos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meus Investimentos Ativos</CardTitle>
            <CardDescription>
              Produções em andamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">IPA Tropical - 15L</span>
                <Badge variant="default">Fermentando</Badge>
              </div>
              <Progress value={65} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ 225 investidos</span>
                <span>15 dias restantes</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pilsen Premium - 20L</span>
                <Badge variant="secondary">Maturando</Badge>
              </div>
              <Progress value={85} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ 300 investidos</span>
                <span>5 dias restantes</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stout Imperial - 10L</span>
                <Badge variant="outline">Planejando</Badge>
              </div>
              <Progress value={25} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ 180 investidos</span>
                <span>Aguardando início</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oportunidades de Investimento</CardTitle>
            <CardDescription>
              Produções abertas para financiamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Weizen Clássica</p>
                  <p className="text-xs text-muted-foreground">R$ 15/L • Meta: 500L</p>
                  <Progress value={75} className="h-1 mt-1" />
                </div>
                <Button size="sm">
                  Investir
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Porter Defumada</p>
                  <p className="text-xs text-muted-foreground">R$ 18/L • Meta: 300L</p>
                  <Progress value={45} className="h-1 mt-1" />
                </div>
                <Button size="sm">
                  Investir
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Lager Artesanal</p>
                  <p className="text-xs text-muted-foreground">R$ 12/L • Meta: 800L</p>
                  <Progress value={30} className="h-1 mt-1" />
                </div>
                <Button size="sm">
                  Investir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Votações e histórico */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Votações Abertas</CardTitle>
            <CardDescription>
              Receitas aguardando sua aprovação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Belgian Ale Tradicional</p>
                <p className="text-xs text-muted-foreground">Por João Silva • Encerra em 2 dias</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="text-green-600">
                  Aprovar
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  Rejeitar
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">IPA Session Low Carb</p>
                <p className="text-xs text-muted-foreground">Por Maria Costa • Encerra em 5 dias</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="text-green-600">
                  Aprovar
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  Rejeitar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cotas para Retirar</CardTitle>
            <CardDescription>
              Cervejas prontas para degustação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pilsen Especial - 25L</p>
                <p className="text-xs text-muted-foreground">Produzida em Jan/2024</p>
              </div>
              <Badge variant="default">Pronta</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">IPA Citrus - 18L</p>
                <p className="text-xs text-muted-foreground">Produzida em Dez/2023</p>
              </div>
              <Badge variant="default">Pronta</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Stout Coffee - 12L</p>
                <p className="text-xs text-muted-foreground">Produzida em Nov/2023</p>
              </div>
              <Badge variant="default">Pronta</Badge>
            </div>
            
            <Button className="w-full mt-4">
              Agendar Retirada
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wallet, TrendingUp, Clock, Award, Bell, Coins, CalendarCheck } from 'lucide-react';
import { BeerCoinBalance } from '@/components/beer-coins/BeerCoinBalance';
import { BeerCoinTransactions } from '@/components/beer-coins/BeerCoinTransactions';
import { InvestWithCoins } from '@/components/investments/InvestWithCoins';

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
        </div>
      </div>

      {/* Resumo do portfólio */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <BeerCoinBalance />

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
            <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Produções ativas
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
                <span>15 Beer Coins investidos</span>
                <span>15 dias restantes</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pilsen Premium - 20L</span>
                <Badge variant="secondary">Pronta</Badge>
              </div>
              <Progress value={100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>20 Beer Coins investidos</span>
                <span>Pronta para retirada</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stout Imperial - 10L</span>
                <Badge variant="outline">Financiamento</Badge>
              </div>
              <Progress value={25} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 Beer Coins investidos</span>
                <span>Aguardando meta</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oportunidades de Investimento</CardTitle>
            <CardDescription>
              Invista usando seus Beer Coins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Weizen Clássica</p>
                  <p className="text-xs text-muted-foreground">1.5 Coins/L • Meta: 500L</p>
                  <Progress value={75} className="h-1 mt-1" />
                </div>
                <InvestWithCoins
                  productionId="1"
                  productionName="Weizen Clássica"
                  pricePerLiter={1.5}
                  maxLiters={125}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Porter Defumada</p>
                  <p className="text-xs text-muted-foreground">1.8 Coins/L • Meta: 300L</p>
                  <Progress value={45} className="h-1 mt-1" />
                </div>
                <InvestWithCoins
                  productionId="2"
                  productionName="Porter Defumada"
                  pricePerLiter={1.8}
                  maxLiters={165}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Lager Artesanal</p>
                  <p className="text-xs text-muted-foreground">1.2 Coins/L • Meta: 800L</p>
                  <Progress value={30} className="h-1 mt-1" />
                </div>
                <InvestWithCoins
                  productionId="3"
                  productionName="Lager Artesanal"
                  pricePerLiter={1.2}
                  maxLiters={560}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Beer Coins e retiradas */}
      <div className="grid gap-6 md:grid-cols-2">
        <BeerCoinTransactions />

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
                <p className="text-sm font-medium">Pilsen Premium - 20L</p>
                <p className="text-xs text-muted-foreground">Pronta desde ontem</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Pronta</Badge>
                <Button size="sm" variant="outline">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Agendar
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">IPA Citrus - 15L</p>
                <p className="text-xs text-muted-foreground">Agendado para amanhã</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Agendado</Badge>
                <Button size="sm" variant="outline" disabled>
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Reagendar
                </Button>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <Button className="w-full">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Ver Todos os Agendamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
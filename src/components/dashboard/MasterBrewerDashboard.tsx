import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Beaker, Clock, Users, BarChart3, Plus, MessageCircle, Calendar } from 'lucide-react';

export const MasterBrewerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel do Mestre Cervejeiro</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e produções
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            Mensagens
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Receita
          </Button>
        </div>
      </div>

      {/* Estatísticas do cervejeiro */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Ativas</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 neste mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Produção</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3.200L em processo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investidores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +5 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovação</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de sucesso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Produções em andamento */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produções em Andamento</CardTitle>
            <CardDescription>
              Acompanhe o progresso das suas cervejas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">IPA Tropical - 500L</span>
                <Badge variant="default">Fermentando</Badge>
              </div>
              <Progress value={65} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>15 dias restantes</span>
                <span>95% financiado</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Atualizar Status
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pilsen Premium - 800L</span>
                <Badge variant="secondary">Maturando</Badge>
              </div>
              <Progress value={85} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 dias restantes</span>
                <span>100% financiado</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Retiradas
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stout Imperial - 300L</span>
                <Badge variant="outline">Financiamento</Badge>
              </div>
              <Progress value={45} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Meta em 12 dias</span>
                <span>45% financiado</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Promover
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Ações</CardTitle>
            <CardDescription>
              O que precisa da sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Pilsen Premium - Pronta!</p>
                  <p className="text-xs text-muted-foreground">47 investidores aguardando retirada</p>
                </div>
                <Button size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Organizar
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">IPA Citrus - Fermentação</p>
                  <p className="text-xs text-muted-foreground">Verificar temperatura e densidade</p>
                </div>
                <Button size="sm" variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Atualizar
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Weizen - Financiamento</p>
                  <p className="text-xs text-muted-foreground">Precisando de mais investidores</p>
                </div>
                <Button size="sm" variant="outline">
                  Promover
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Porter Defumada - Planejamento</p>
                  <p className="text-xs text-muted-foreground">Definir data de início da produção</p>
                </div>
                <Button size="sm" variant="outline">
                  Planejar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receitas e histórico */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Minhas Receitas</CardTitle>
            <CardDescription>
              Receitas aprovadas e em desenvolvimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">IPA Tropical Premium</p>
                <p className="text-xs text-muted-foreground">Aprovada • 3 produções realizadas</p>
              </div>
              <div className="flex gap-1">
                <Badge variant="default">Ativa</Badge>
                <Button size="sm" variant="outline">
                  Editar
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pilsen Artesanal</p>
                <p className="text-xs text-muted-foreground">Aprovada • 5 produções realizadas</p>
              </div>
              <div className="flex gap-1">
                <Badge variant="default">Ativa</Badge>
                <Button size="sm" variant="outline">
                  Editar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Belgian Dubbel Experimental</p>
                <p className="text-xs text-muted-foreground">Em desenvolvimento</p>
              </div>
              <div className="flex gap-1">
                <Badge variant="secondary">Rascunho</Badge>
                <Button size="sm" variant="outline">
                  Continuar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback dos Investidores</CardTitle>
            <CardDescription>
              Comentários sobre suas produções
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">⭐⭐⭐⭐⭐ IPA Tropical</p>
                  <p className="text-xs text-muted-foreground">"Excepcional! Equilibrio perfeito de lúpulo."</p>
                  <p className="text-xs text-muted-foreground font-medium">- Maria Silva</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">⭐⭐⭐⭐ Pilsen Premium</p>
                  <p className="text-xs text-muted-foreground">"Cremosa e refrescante, adorei!"</p>
                  <p className="text-xs text-muted-foreground font-medium">- João Santos</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">⭐⭐⭐⭐⭐ Stout Coffee</p>
                  <p className="text-xs text-muted-foreground">"Notas de café muito bem balanceadas."</p>
                  <p className="text-xs text-muted-foreground font-medium">- Ana Costa</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
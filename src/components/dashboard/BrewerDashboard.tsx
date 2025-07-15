import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Beer, Calendar, Clock, Star, Plus, MessageSquare } from 'lucide-react';

export const BrewerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Área do Cervejeiro</h1>
          <p className="text-muted-foreground">
            Gerencie suas produções e propostas de receitas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comunicados
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Receita
          </Button>
        </div>
      </div>

      {/* Status das produções */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produções Ativas</CardTitle>
            <Beer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              2 em fermentação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Para assumir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45d</div>
            <p className="text-xs text-muted-foreground">
              Por produção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Média das avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Produções em andamento */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Minhas Produções em Andamento</CardTitle>
            <CardDescription>
              Status atual das suas produções
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">IPA Tropical - Lote #23</span>
                <Badge variant="default">Fermentando</Badge>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">15 dias restantes</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pilsen Premium - Lote #24</span>
                <Badge variant="secondary">Maturando</Badge>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">5 dias restantes</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stout Imperial - Lote #25</span>
                <Badge variant="outline">Planejando</Badge>
              </div>
              <Progress value={25} className="h-2" />
              <p className="text-xs text-muted-foreground">Aguardando insumos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produções Disponíveis</CardTitle>
            <CardDescription>
              Produções aprovadas para assumir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Weizen Clássica</p>
                  <p className="text-xs text-muted-foreground">500L • R$ 15/L</p>
                </div>
                <Button size="sm" variant="outline">
                  Assumir
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Porter Defumada</p>
                  <p className="text-xs text-muted-foreground">300L • R$ 18/L</p>
                </div>
                <Button size="sm" variant="outline">
                  Assumir
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Lager Artesanal</p>
                  <p className="text-xs text-muted-foreground">800L • R$ 12/L</p>
                </div>
                <Button size="sm" variant="outline">
                  Assumir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendario e avaliações */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cronograma da Semana</CardTitle>
            <CardDescription>
              Próximas atividades programadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Iniciar fermentação - IPA Tropical</p>
                <p className="text-xs text-muted-foreground">Hoje, 14:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Teste de densidade - Pilsen</p>
                <p className="text-xs text-muted-foreground">Amanhã, 10:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Recebimento de malte</p>
                <p className="text-xs text-muted-foreground">Sexta, 09:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Avaliações</CardTitle>
            <CardDescription>
              Feedback dos investidores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-current text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">IPA Citrus</span>
              </div>
              <p className="text-xs text-muted-foreground">
                "Equilibrio perfeito entre amargor e aroma. Excelente!"
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-current text-yellow-400" />
                  ))}
                  <Star className="h-3 w-3 text-gray-300" />
                </div>
                <span className="text-sm font-medium">Stout Coffee</span>
              </div>
              <p className="text-xs text-muted-foreground">
                "Sabor intenso de café, talvez um pouco forte demais."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
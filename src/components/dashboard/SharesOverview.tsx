import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PurchaseSharesModal from '@/components/shares/PurchaseSharesModal';
import { Coins, TrendingUp, Users, ShoppingCart } from 'lucide-react';
interface SharesData {
  userShares: number;
  totalShares: number;
  shareValue: number;
  userVotingPower: number;
}
const SharesOverview: React.FC = () => {
  const [sharesData, setSharesData] = useState<SharesData>({
    userShares: 0,
    totalShares: 0,
    shareValue: 100,
    userVotingPower: 0
  });
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const {
    user
  } = useAuth();
  const fetchSharesData = async () => {
    if (!user) return;
    try {
      // Get user profile
      const {
        data: profile
      } = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
      if (profile) {
        // Get user shares
        const {
          data: userShares
        } = await supabase.from('beer_shares').select('*').eq('owner_id', profile.id);

        // Get total shares sold
        const {
          data: totalShares
        } = await supabase.from('beer_shares').select('share_number');
        setSharesData({
          userShares: userShares?.length || 0,
          totalShares: totalShares?.length || 0,
          shareValue: 100,
          // Base value, could be dynamic
          userVotingPower: (userShares?.length || 0) / 10000 * 100
        });
      }
    } catch (error) {
      console.error('Error fetching shares data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSharesData();
  }, [user]);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  if (loading) {
    return <div className="animate-pulse h-64 bg-muted rounded-lg"></div>;
  }
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minhas Cotas</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{sharesData.userShares}</div>
            <p className="text-xs text-muted-foreground">
              de 10.000 cotas totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Investido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(sharesData.userShares * sharesData.shareValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(sharesData.shareValue)}/cota
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poder de Voto</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {sharesData.userVotingPower.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              do total de decisões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotas Vendidas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{sharesData.totalShares}</div>
            <Progress value={sharesData.totalShares / 10000 * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistema de Cotas BaasBeer</CardTitle>
          <CardDescription>
            Participe das decisões da cervejaria através do sistema de cotas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Como funciona:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 10.000 cotas totais disponíveis</li>
                <li>• Cada cota = R$ 100,00</li>
                <li>• 1 cota = 0,01% do poder de voto</li>
                <li>• Participe das decisões da cervejaria</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Seus benefícios:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Voto nas receitas mensais</li>
                <li>• Degustações exclusivas</li>
                <li>• Desconto no brewpub</li>
                <li>• Dividendos mensais</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setShowPurchaseModal(true)}>
              Comprar Cotas
            </Button>
            
          </div>
        </CardContent>
      </Card>
      
      <PurchaseSharesModal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} onPurchaseSuccess={fetchSharesData} />
    </div>;
};
export default SharesOverview;
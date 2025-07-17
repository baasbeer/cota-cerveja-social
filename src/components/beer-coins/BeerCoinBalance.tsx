import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import { useBeerCoins } from '@/hooks/useBeerCoins';

export const BeerCoinBalance: React.FC = () => {
  const { balance, isLoadingBalance } = useBeerCoins();

  if (isLoadingBalance) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Beer Coins</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">...</div>
          <p className="text-xs text-muted-foreground">
            Carregando...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Beer Coins</CardTitle>
        <Coins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{balance.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground">
          Disponível para investir
        </p>
      </CardContent>
    </Card>
  );
};
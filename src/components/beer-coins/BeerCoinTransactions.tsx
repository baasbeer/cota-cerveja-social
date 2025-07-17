import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBeerCoins } from '@/hooks/useBeerCoins';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const BeerCoinTransactions: React.FC = () => {
  const { transactions, isLoadingTransactions } = useBeerCoins();

  if (isLoadingTransactions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Beer Coins</CardTitle>
          <CardDescription>Suas transações recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Beer Coins</CardTitle>
        <CardDescription>Suas transações recentes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
        ) : (
          transactions.slice(0, 5).map((transaction: any) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={transaction.transaction_type === 'CREDIT' ? 'default' : 'secondary'}>
                  {transaction.transaction_type === 'CREDIT' ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useBeerCoins = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['beerCoinBalance', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      // Mock data until beer_coin_balance is added to profiles
      return 50.0;
    },
    enabled: !!user,
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['beerCoinTransactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Mock data until beer_coin_transactions table is created
      return [
        {
          id: '1',
          amount: 50.0,
          transaction_type: 'CREDIT',
          description: 'Bônus de boas-vindas',
          created_at: new Date().toISOString(),
        }
      ];
    },
    enabled: !!user,
  });

  const addBeerCoins = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Mock implementation until database is updated
      return 50.0 + amount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beerCoinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['beerCoinTransactions'] });
      toast({
        title: "Beer Coins atualizados",
        description: "Sua transação foi processada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível processar a transação.",
        variant: "destructive",
      });
    },
  });

  return {
    balance: balance || 0,
    transactions: transactions || [],
    isLoadingBalance,
    isLoadingTransactions,
    addBeerCoins,
  };
};
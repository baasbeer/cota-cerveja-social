import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBeerCoins } from '@/hooks/useBeerCoins';
import { useToast } from '@/hooks/use-toast';
import { Coins } from 'lucide-react';

interface InvestWithCoinsProps {
  productionId: string;
  productionName: string;
  pricePerLiter: number;
  maxLiters: number;
}

export const InvestWithCoins: React.FC<InvestWithCoinsProps> = ({
  productionId,
  productionName,
  pricePerLiter,
  maxLiters,
}) => {
  const [liters, setLiters] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const { balance, addBeerCoins } = useBeerCoins();
  const { toast } = useToast();

  const totalCost = liters * pricePerLiter;
  const hasEnoughCoins = balance >= totalCost;

  const handleInvest = async () => {
    if (!hasEnoughCoins) {
      toast({
        title: "Beer Coins insuficientes",
        description: "Você não tem Beer Coins suficientes para este investimento.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Deduct beer coins
      await addBeerCoins.mutateAsync({
        amount: -totalCost,
        description: `Investimento em ${productionName} - ${liters}L`,
      });

      // TODO: Create investment record
      // This would create an investment in the investments table

      toast({
        title: "Investimento realizado!",
        description: `Você investiu ${liters}L em ${productionName} usando ${totalCost.toFixed(2)} Beer Coins.`,
      });

      setIsOpen(false);
      setLiters(1);
    } catch (error) {
      toast({
        title: "Erro ao investir",
        description: "Não foi possível processar seu investimento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Coins className="mr-2 h-4 w-4" />
          Investir com Coins
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Investir com Beer Coins</DialogTitle>
          <DialogDescription>
            Use seus Beer Coins para investir em {productionName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="liters" className="text-right">
              Litros
            </Label>
            <Input
              id="liters"
              type="number"
              min="1"
              max={maxLiters}
              value={liters}
              onChange={(e) => setLiters(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Custo</Label>
            <div className="col-span-3 text-sm">
              {totalCost.toFixed(2)} Beer Coins
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Seu saldo</Label>
            <div className="col-span-3 text-sm">
              {balance.toFixed(2)} Beer Coins
            </div>
          </div>
          {!hasEnoughCoins && (
            <div className="text-sm text-destructive">
              Você precisa de mais {(totalCost - balance).toFixed(2)} Beer Coins para este investimento.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleInvest}
            disabled={!hasEnoughCoins || addBeerCoins.isPending}
          >
            {addBeerCoins.isPending ? 'Processando...' : 'Confirmar Investimento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from '@/hooks/use-toast';
import { Coins, ShoppingCart } from 'lucide-react';

interface PurchaseSharesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
}

const PurchaseSharesModal: React.FC<PurchaseSharesModalProps> = ({ isOpen, onClose, onPurchaseSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { profile } = useUserProfile();

  const sharePrice = 100;
  const totalPrice = quantity * sharePrice;

  const handlePurchase = async () => {
    if (!profile || quantity < 1) return;

    setLoading(true);
    try {
      // Get available share numbers
      const { data: existingShares } = await supabase
        .from('beer_shares')
        .select('share_number')
        .order('share_number');

      const usedNumbers = existingShares?.map(s => s.share_number) || [];
      const availableNumbers = [];
      
      for (let i = 1; i <= 10000; i++) {
        if (!usedNumbers.includes(i)) {
          availableNumbers.push(i);
        }
        if (availableNumbers.length === quantity) break;
      }

      if (availableNumbers.length < quantity) {
        toast({
          title: 'Cotas insuficientes',
          description: 'Não há cotas suficientes disponíveis.',
          variant: 'destructive'
        });
        return;
      }

      // Create share records
      const shareRecords = availableNumbers.slice(0, quantity).map(shareNumber => ({
        owner_id: profile.id,
        share_number: shareNumber,
        purchase_price: sharePrice,
        current_value: sharePrice
      }));

      const { error } = await supabase
        .from('beer_shares')
        .insert(shareRecords);

      if (error) {
        toast({
          title: 'Erro na compra',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Compra realizada!',
          description: `Você adquiriu ${quantity} cota(s) com sucesso.`
        });
        onPurchaseSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar a compra.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Comprar Cotas
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade de cotas</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Preço por cota:</span>
              <span className="font-medium">R$ {sharePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantidade:</span>
              <span className="font-medium">{quantity}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handlePurchase} disabled={loading}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {loading ? 'Processando...' : 'Comprar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseSharesModal;
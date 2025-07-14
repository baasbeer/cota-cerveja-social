import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from '@/hooks/use-toast';
import { Vote, Clock } from 'lucide-react';

interface VoteModalProps {
  proposal: any;
  isOpen: boolean;
  onClose: () => void;
  onVoteSuccess: () => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ proposal, isOpen, onClose, onVoteSuccess }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { profile } = useUserProfile();

  const handleVote = async () => {
    if (!profile || selectedOption === null) return;

    setLoading(true);
    try {
      // Get user voting power
      const { data: shares } = await supabase
        .from('beer_shares')
        .select('id')
        .eq('owner_id', profile.id);

      const votingPower = shares?.length || 1;

      // Submit vote
      const { error } = await supabase
        .from('votes')
        .insert({
          proposal_id: proposal.id,
          voter_id: profile.id,
          selected_option: selectedOption,
          voting_power: votingPower
        });

      if (error) {
        toast({
          title: 'Erro ao votar',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Voto registrado!',
          description: 'Seu voto foi registrado com sucesso.'
        });
        onVoteSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao processar seu voto.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            {proposal.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">{proposal.description}</p>
          
          <div className="space-y-3">
            <h4 className="font-medium">Opções de voto:</h4>
            {Array.isArray(proposal.options) && proposal.options.map((option: any, index: number) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption === index
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedOption(index)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedOption === index ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`} />
                  <div>
                    <p className="font-medium">{option.text || option}</p>
                    {option.description && (
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleVote} 
              disabled={selectedOption === null || loading}
            >
              {loading ? 'Votando...' : 'Confirmar Voto'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoteModal;
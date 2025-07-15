import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import VoteModal from '@/components/voting/VoteModal';
import CreateRecipeModal from '@/components/recipes/CreateRecipeModal';
import { Vote, Clock, Users, CheckCircle, Plus, MoreVertical } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface VotingProposal {
  id: string;
  title: string;
  description: string;
  proposal_type: string;
  voting_ends_at: string;
  status: string;
  options: Json;
  results: Json;
}

const VotingSection: React.FC = () => {
  const [proposals, setProposals] = useState<VotingProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<VotingProposal | null>(null);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const fetchProposals = async () => {
    try {
      const { data } = await supabase
        .from('voting_proposals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const getProposalTypeLabel = (type: string) => {
    const types = {
      'beer_recipe': 'Receita de Cerveja',
      'ingredients': 'Ingredientes',
      'label_design': 'Design do Rótulo',
      'pricing': 'Precificação',
      'strategic': 'Estratégico'
    };
    return types[type as keyof typeof types] || type;
  };

  const getProposalTypeColor = (type: string) => {
    const colors = {
      'beer_recipe': 'bg-amber-100 text-amber-800',
      'ingredients': 'bg-green-100 text-green-800',
      'label_design': 'bg-blue-100 text-blue-800',
      'pricing': 'bg-purple-100 text-purple-800',
      'strategic': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return 'Encerrada';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-muted rounded-lg"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Votações Ativas</h2>
          <p className="text-muted-foreground">
            Participe das decisões da cervejaria
          </p>
        </div>
        {/* Desktop Buttons */}
        <div className={`flex gap-2 ${isMobile ? 'hidden' : ''}`}>
          <Button variant="outline" onClick={() => setShowCreateRecipe(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Receita
          </Button>
          <Button variant="outline">
            <Vote className="mr-2 h-4 w-4" />
            Histórico
          </Button>
        </div>

        {/* Mobile Hamburger Menu */}
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowCreateRecipe(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Receita
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Vote className="mr-2 h-4 w-4" />
                Histórico
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {proposals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Vote className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma votação ativa</h3>
            <p className="text-muted-foreground text-center">
              Não há votações abertas no momento. Fique atento às próximas decisões!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                    <CardDescription>{proposal.description}</CardDescription>
                  </div>
                  <Badge className={getProposalTypeColor(proposal.proposal_type)}>
                    {getProposalTypeLabel(proposal.proposal_type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTimeLeft(proposal.voting_ends_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>0 votos</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {Array.isArray(proposal.options) && proposal.options.map((option: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">{option.text || option}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={0} className="w-24" />
                          <span className="text-sm text-muted-foreground">0%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <Vote className="mr-2 h-4 w-4" />
                      Votar
                    </Button>
                    <Button variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {selectedProposal && (
        <VoteModal
          proposal={selectedProposal}
          isOpen={!!selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onVoteSuccess={() => fetchProposals()}
        />
      )}
      
      <CreateRecipeModal
        isOpen={showCreateRecipe}
        onClose={() => setShowCreateRecipe(false)}
        onSuccess={() => fetchProposals()}
      />
    </div>
  );
};

export default VotingSection;
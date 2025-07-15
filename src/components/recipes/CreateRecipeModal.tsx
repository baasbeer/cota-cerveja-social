import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { TablesInsert } from '@/integrations/supabase/types';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface ProcessStep {
  step: number;
  description: string;
  temperature?: string;
  duration?: string;
}

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    abv: '',
    ibu: '',
    srm: ''
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: 'kg' }
  ]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    { step: 1, description: '', temperature: '', duration: '' }
  ]);
  const { user } = useAuth();

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: 'kg' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addProcessStep = () => {
    setProcessSteps([...processSteps, { 
      step: processSteps.length + 1, 
      description: '', 
      temperature: '', 
      duration: '' 
    }]);
  };

  const removeProcessStep = (index: number) => {
    const updated = processSteps.filter((_, i) => i !== index);
    // Reorder steps
    updated.forEach((step, i) => {
      step.step = i + 1;
    });
    setProcessSteps(updated);
  };

  const updateProcessStep = (index: number, field: keyof ProcessStep, value: string) => {
    const updated = [...processSteps];
    updated[index] = { ...updated[index], [field]: value };
    setProcessSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Perfil não encontrado');
      }

      // Filter empty ingredients and process steps
      const filteredIngredients = ingredients.filter(ing => ing.name.trim() && ing.amount.trim());
      const filteredSteps = processSteps.filter(step => step.description.trim());

      // Create recipe
      const recipeData: TablesInsert<'beer_recipes'> = {
        name: formData.name,
        description: formData.description,
        abv: formData.abv ? parseFloat(formData.abv) : null,
        ibu: formData.ibu ? parseInt(formData.ibu) : null,
        srm: formData.srm ? parseInt(formData.srm) : null,
        ingredients: filteredIngredients as any,
        process_steps: filteredSteps as any,
        created_by: profile.id,
        status: 'DRAFT'
      };

      const { data: recipe, error: recipeError } = await supabase
        .from('beer_recipes')
        .insert(recipeData)
        .select();

      if (recipeError) throw recipeError;

      // Create voting proposal for the recipe
      const votingEndDate = new Date();
      votingEndDate.setDate(votingEndDate.getDate() + 7); // 7 days from now

      const { error: proposalError } = await supabase
        .from('voting_proposals')
        .insert({
          title: `Receita: ${formData.name}`,
          description: `Votação para aprovar a receita "${formData.name}". ${formData.description}`,
          proposal_type: 'beer_recipe',
          options: [
            { text: 'Aprovar receita', value: 'approve' },
            { text: 'Rejeitar receita', value: 'reject' },
            { text: 'Solicitar mudanças', value: 'changes' }
          ],
          voting_ends_at: votingEndDate.toISOString(),
          created_by: profile.id,
          status: 'active'
        });

      if (proposalError) throw proposalError;

      toast({
        title: "Receita criada com sucesso!",
        description: "A receita foi criada e está disponível para votação.",
      });

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({ name: '', description: '', abv: '', ibu: '', srm: '' });
      setIngredients([{ name: '', amount: '', unit: 'kg' }]);
      setProcessSteps([{ step: 1, description: '', temperature: '', duration: '' }]);
      
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast({
        title: "Erro ao criar receita",
        description: "Ocorreu um erro ao criar a receita. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Receita de Cerveja</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Receita *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: IPA Tropical"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="abv">ABV (%)</Label>
                  <Input
                    id="abv"
                    type="number"
                    step="0.1"
                    value={formData.abv}
                    onChange={(e) => setFormData({...formData, abv: e.target.value})}
                    placeholder="5.2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ibu">IBU (Amargor)</Label>
                  <Input
                    id="ibu"
                    type="number"
                    value={formData.ibu}
                    onChange={(e) => setFormData({...formData, ibu: e.target.value})}
                    placeholder="35"
                  />
                </div>
                <div>
                  <Label htmlFor="srm">SRM (Cor)</Label>
                  <Input
                    id="srm"
                    type="number"
                    value={formData.srm}
                    onChange={(e) => setFormData({...formData, srm: e.target.value})}
                    placeholder="8"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o estilo, sabor e características da cerveja..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Ingredientes</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Ingrediente</Label>
                      <Input
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        placeholder="Ex: Malte Pilsen"
                      />
                    </div>
                    <div className="w-24">
                      <Label>Quantidade</Label>
                      <Input
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                        placeholder="5"
                      />
                    </div>
                    <div className="w-20">
                      <Label>Unidade</Label>
                      <select
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="L">L</option>
                        <option value="ml">ml</option>
                        <option value="un">un</option>
                      </select>
                    </div>
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Processo de Fabricação</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addProcessStep}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Etapa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">Etapa {step.step}</Badge>
                      {processSteps.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeProcessStep(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Descrição *</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                          placeholder="Descreva detalhadamente esta etapa do processo..."
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Temperatura</Label>
                          <Input
                            value={step.temperature}
                            onChange={(e) => updateProcessStep(index, 'temperature', e.target.value)}
                            placeholder="65°C"
                          />
                        </div>
                        <div>
                          <Label>Duração</Label>
                          <Input
                            value={step.duration}
                            onChange={(e) => updateProcessStep(index, 'duration', e.target.value)}
                            placeholder="60 minutos"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Criar Receita
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecipeModal;
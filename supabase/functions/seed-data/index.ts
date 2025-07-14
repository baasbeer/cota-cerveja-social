import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create sample voting proposals
    const sampleProposals = [
      {
        title: "Receita para Cerveja de Outubro",
        description: "Escolha qual estilo de cerveja devemos produzir no mês de outubro",
        proposal_type: "beer_recipe",
        voting_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        options: [
          { text: "IPA Tropical com Manga e Maracujá", description: "Uma IPA refrescante com frutas tropicais" },
          { text: "Stout Imperial com Café", description: "Stout encorpada com notas de café torrado" },
          { text: "Pilsen Artesanal", description: "Pilsen clara e refrescante no estilo tradicional" }
        ],
        results: {}
      },
      {
        title: "Design do Rótulo - Edição Limitada",
        description: "Vote no design do rótulo para nossa próxima edição limitada",
        proposal_type: "label_design",
        voting_ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        options: [
          { text: "Arte Minimalista", description: "Design limpo e moderno" },
          { text: "Ilustração Vintage", description: "Estilo retrô com elementos artesanais" },
          { text: "Arte Contemporânea", description: "Design ousado e colorido" }
        ],
        results: {}
      },
      {
        title: "Horário de Funcionamento do Brewpub",
        description: "Defina os novos horários de funcionamento do nosso brewpub",
        proposal_type: "strategic",
        voting_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        options: [
          { text: "Ter-Dom 16h-00h", description: "Funcionamento de terça a domingo" },
          { text: "Qua-Sab 17h-01h", description: "Funcionamento de quarta a sábado" },
          { text: "Qui-Dom 18h-00h", description: "Funcionamento de quinta a domingo" }
        ],
        results: {}
      }
    ];

    // Insert sample data
    for (const proposal of sampleProposals) {
      // First, get a random user to be the creator
      const { data: profiles } = await supabaseClient
        .from('profiles')
        .select('id')
        .limit(1);

      if (profiles && profiles.length > 0) {
        const { error } = await supabaseClient
          .from('voting_proposals')
          .insert({
            ...proposal,
            created_by: profiles[0].id
          });

        if (error) {
          console.error('Error inserting proposal:', error);
        }
      }
    }

    // Create sample beer recipes
    const sampleRecipes = [
      {
        name: "IPA Tropical",
        description: "Cerveja IPA com notas tropicais de manga e maracujá",
        ingredients: [
          { name: "Malte Pilsen", amount: "5kg" },
          { name: "Malte Caramelo", amount: "0.5kg" },
          { name: "Lúpulo Citra", amount: "50g" },
          { name: "Lúpulo Mosaic", amount: "30g" },
          { name: "Manga", amount: "2kg" },
          { name: "Maracujá", amount: "1kg" }
        ],
        process_steps: [
          "Moagem dos maltes",
          "Mosturação a 65°C por 60 minutos",
          "Fervura por 60 minutos com adições de lúpulo",
          "Fermentação primária por 7 dias",
          "Adição de frutas na fermentação secundária",
          "Maturação por 14 dias"
        ],
        abv: 6.5,
        ibu: 65,
        srm: 8,
        status: "in_production"
      },
      {
        name: "Pilsen Artesanal",
        description: "Cerveja Pilsen clara e refrescante",
        ingredients: [
          { name: "Malte Pilsen", amount: "4kg" },
          { name: "Lúpulo Saaz", amount: "30g" },
          { name: "Fermento Lager", amount: "1 pacote" }
        ],
        process_steps: [
          "Moagem dos maltes",
          "Mosturação a 62°C por 90 minutos",
          "Fervura por 60 minutos",
          "Fermentação a 12°C por 14 dias",
          "Maturação a 2°C por 21 dias"
        ],
        abv: 4.8,
        ibu: 25,
        srm: 3,
        status: "development"
      }
    ];

    // Insert sample recipes
    for (const recipe of sampleRecipes) {
      const { data: profiles } = await supabaseClient
        .from('profiles')
        .select('id')
        .limit(1);

      if (profiles && profiles.length > 0) {
        const { error } = await supabaseClient
          .from('beer_recipes')
          .insert({
            ...recipe,
            created_by: profiles[0].id
          });

        if (error) {
          console.error('Error inserting recipe:', error);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Sample data created successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
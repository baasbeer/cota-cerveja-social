-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create beer shares table for the 10,000 shares system
CREATE TABLE public.beer_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  share_number INTEGER NOT NULL UNIQUE CHECK (share_number >= 1 AND share_number <= 10000),
  purchase_price DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  current_value DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_for_sale BOOLEAN DEFAULT FALSE,
  sale_price DECIMAL(10,2)
);

-- Create subscriptions table for monthly recurring payments
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'paused')),
  monthly_amount DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  beer_credits DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voting proposals table
CREATE TABLE public.voting_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposal_type TEXT NOT NULL CHECK (proposal_type IN ('beer_recipe', 'ingredients', 'label_design', 'pricing', 'strategic')),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  voting_starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  voting_ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  options JSONB NOT NULL DEFAULT '[]',
  results JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.voting_proposals(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  selected_option INTEGER NOT NULL,
  voting_power INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, voter_id)
);

-- Create beer recipes table
CREATE TABLE public.beer_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  process_steps JSONB NOT NULL DEFAULT '[]',
  abv DECIMAL(4,2),
  ibu INTEGER,
  srm INTEGER,
  status TEXT NOT NULL DEFAULT 'development' CHECK (status IN ('development', 'approved', 'in_production', 'completed')),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  approved_at TIMESTAMP WITH TIME ZONE,
  production_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create production batches table
CREATE TABLE public.production_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.beer_recipes(id) ON DELETE CASCADE,
  batch_number TEXT NOT NULL UNIQUE,
  volume_liters INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'brewing', 'fermenting', 'conditioning', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beer_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beer_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_batches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for beer shares
CREATE POLICY "Users can view all shares" ON public.beer_shares FOR SELECT USING (true);
CREATE POLICY "Users can update own shares" ON public.beer_shares FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = owner_id));
CREATE POLICY "Users can insert shares" ON public.beer_shares FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = owner_id));

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_id));
CREATE POLICY "Users can update own subscription" ON public.subscriptions FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_id));
CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_id));

-- Create RLS policies for voting proposals
CREATE POLICY "Users can view active proposals" ON public.voting_proposals FOR SELECT USING (true);
CREATE POLICY "Founders can insert proposals" ON public.voting_proposals FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = created_by));
CREATE POLICY "Founders can update own proposals" ON public.voting_proposals FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = created_by));

-- Create RLS policies for votes
CREATE POLICY "Users can view votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes" ON public.votes FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = voter_id));

-- Create RLS policies for beer recipes
CREATE POLICY "Users can view all recipes" ON public.beer_recipes FOR SELECT USING (true);
CREATE POLICY "Founders can insert recipes" ON public.beer_recipes FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = created_by));
CREATE POLICY "Founders can update own recipes" ON public.beer_recipes FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = created_by));

-- Create RLS policies for production batches
CREATE POLICY "Users can view all batches" ON public.production_batches FOR SELECT USING (true);
CREATE POLICY "Founders can insert batches" ON public.production_batches FOR INSERT WITH CHECK (true);
CREATE POLICY "Founders can update batches" ON public.production_batches FOR UPDATE USING (true);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to calculate user voting power
CREATE OR REPLACE FUNCTION public.get_user_voting_power(user_profile_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.beer_shares
    WHERE owner_id = user_profile_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
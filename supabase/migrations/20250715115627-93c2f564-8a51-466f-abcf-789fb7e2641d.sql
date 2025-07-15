-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('ADMIN', 'BREWER', 'INVESTOR');

-- Add role and additional fields to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'INVESTOR';
ALTER TABLE public.profiles ADD COLUMN phone TEXT;
ALTER TABLE public.profiles ADD COLUMN address TEXT;
ALTER TABLE public.profiles ADD COLUMN active BOOLEAN DEFAULT true;

-- Brewer-specific fields
ALTER TABLE public.profiles ADD COLUMN brewery_name TEXT;
ALTER TABLE public.profiles ADD COLUMN experience_years INTEGER;
ALTER TABLE public.profiles ADD COLUMN certifications TEXT;

-- Investor-specific fields  
ALTER TABLE public.profiles ADD COLUMN investment_limit DECIMAL(10,2);
ALTER TABLE public.profiles ADD COLUMN preferred_styles TEXT[];

-- Update existing beer_recipes table to match new structure
ALTER TABLE public.beer_recipes ADD COLUMN style TEXT;
ALTER TABLE public.beer_recipes ADD COLUMN instructions TEXT;
ALTER TABLE public.beer_recipes ADD COLUMN batch_size INTEGER;
ALTER TABLE public.beer_recipes ADD COLUMN estimated_cost DECIMAL(10,2);

-- Update status enum for beer_recipes
CREATE TYPE public.recipe_status AS ENUM ('DRAFT', 'VOTING', 'APPROVED', 'REJECTED');
ALTER TABLE public.beer_recipes ADD COLUMN new_status public.recipe_status DEFAULT 'DRAFT';
UPDATE public.beer_recipes SET new_status = 'DRAFT' WHERE status = 'development';
UPDATE public.beer_recipes SET new_status = 'APPROVED' WHERE status != 'development';
ALTER TABLE public.beer_recipes DROP COLUMN status;
ALTER TABLE public.beer_recipes RENAME COLUMN new_status TO status;

-- Create productions table
CREATE TABLE public.productions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES public.beer_recipes(id),
  brewer_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  target_amount INTEGER, -- litros
  quota_price DECIMAL(10,2), -- preço por litro
  min_quotas INTEGER,
  max_quotas INTEGER,
  status TEXT DEFAULT 'VOTING' CHECK (status IN ('VOTING', 'FUNDING', 'BREWING', 'FERMENTING', 'READY', 'COMPLETED')),
  voting_deadline TIMESTAMP WITH TIME ZONE,
  funding_deadline TIMESTAMP WITH TIME ZONE,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  actual_completion TIMESTAMP WITH TIME ZONE,
  final_volume INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create investments table
CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID REFERENCES public.productions(id),
  investor_id UUID REFERENCES public.profiles(id),
  quotas_purchased INTEGER,
  amount_paid DECIMAL(10,2),
  quotas_received INTEGER DEFAULT 0,
  delivery_status TEXT DEFAULT 'PENDING' CHECK (delivery_status IN ('PENDING', 'PARTIAL', 'COMPLETED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create production_votes table (renamed from votes to avoid conflicts)
CREATE TABLE public.production_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID REFERENCES public.productions(id),
  voter_id UUID REFERENCES public.profiles(id),
  vote_type TEXT CHECK (vote_type IN ('APPROVE', 'REJECT')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(production_id, voter_id)
);

-- Create beer_reviews table
CREATE TABLE public.beer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID REFERENCES public.productions(id),
  reviewer_id UUID REFERENCES public.profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  flavor_notes TEXT,
  aroma_rating INTEGER CHECK (aroma_rating >= 1 AND aroma_rating <= 5),
  appearance_rating INTEGER CHECK (appearance_rating >= 1 AND appearance_rating <= 5),
  overall_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for productions
CREATE POLICY "Users can view all productions" ON public.productions FOR SELECT USING (true);
CREATE POLICY "Admins and brewers can insert productions" ON public.productions FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('ADMIN', 'BREWER')
    )
  );
CREATE POLICY "Admins and assigned brewers can update productions" ON public.productions FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND (profiles.role = 'ADMIN' OR profiles.id = productions.brewer_id)
    )
  );

-- RLS Policies for investments
CREATE POLICY "Users can view all investments" ON public.investments FOR SELECT USING (true);
CREATE POLICY "Investors can insert their own investments" ON public.investments FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.id = investments.investor_id
      AND profiles.role IN ('INVESTOR', 'ADMIN')
    )
  );
CREATE POLICY "Users can update their own investments" ON public.investments FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND (profiles.id = investments.investor_id OR profiles.role = 'ADMIN')
    )
  );

-- RLS Policies for production_votes
CREATE POLICY "Users can view all votes" ON public.production_votes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own votes" ON public.production_votes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.id = production_votes.voter_id
    )
  );

-- RLS Policies for beer_reviews
CREATE POLICY "Users can view all reviews" ON public.beer_reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON public.beer_reviews FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.id = beer_reviews.reviewer_id
    )
  );
CREATE POLICY "Users can update their own reviews" ON public.beer_reviews FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.id = beer_reviews.reviewer_id
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.id = notifications.user_id
    )
  );
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.id = notifications.user_id
    )
  );

-- Update existing RLS policies for beer_recipes to support new roles
DROP POLICY IF EXISTS "Founders can insert recipes" ON public.beer_recipes;
DROP POLICY IF EXISTS "Founders can update own recipes" ON public.beer_recipes;

CREATE POLICY "Admins and brewers can insert recipes" ON public.beer_recipes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.id = beer_recipes.created_by
      AND profiles.role IN ('ADMIN', 'BREWER')
    )
  );

CREATE POLICY "Admins and brewers can update own recipes" ON public.beer_recipes FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND (profiles.id = beer_recipes.created_by OR profiles.role = 'ADMIN')
      AND profiles.role IN ('ADMIN', 'BREWER')
    )
  );

-- Create trigger for updated_at on productions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_productions_updated_at
    BEFORE UPDATE ON public.productions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_profile_id UUID)
RETURNS public.user_role
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role
    FROM public.profiles
    WHERE id = user_profile_id
  );
END;
$$;
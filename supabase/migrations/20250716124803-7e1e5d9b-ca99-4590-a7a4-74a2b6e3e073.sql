-- Continue with the beer coin system implementation

-- Create beer_coin_transactions table
CREATE TABLE IF NOT EXISTS beer_coin_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('PURCHASE', 'INVESTMENT', 'REFUND', 'BONUS')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_beer_coin_transactions_user
    FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE
);

-- Enable RLS on beer_coin_transactions
ALTER TABLE beer_coin_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for beer_coin_transactions
CREATE POLICY "Users can view their own transactions" 
ON beer_coin_transactions 
FOR SELECT 
USING (user_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own transactions" 
ON beer_coin_transactions 
FOR INSERT 
WITH CHECK (user_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Update productions table
ALTER TABLE productions DROP COLUMN IF EXISTS voting_deadline;
ALTER TABLE productions ALTER COLUMN status TYPE TEXT;
DROP TYPE IF EXISTS production_status;
CREATE TYPE production_status AS ENUM ('FUNDING', 'BREWING', 'FERMENTING', 'READY', 'COMPLETED');
ALTER TABLE productions ALTER COLUMN status TYPE production_status USING 
  CASE 
    WHEN status = 'VOTING' THEN 'FUNDING'::production_status
    WHEN status = 'FUNDING' THEN 'FUNDING'::production_status
    WHEN status = 'BREWING' THEN 'BREWING'::production_status
    WHEN status = 'FERMENTING' THEN 'FERMENTING'::production_status
    WHEN status = 'READY' THEN 'READY'::production_status
    WHEN status = 'COMPLETED' THEN 'COMPLETED'::production_status
    ELSE 'FUNDING'::production_status
  END;
ALTER TABLE productions ALTER COLUMN status SET DEFAULT 'FUNDING'::production_status;

-- Add contact and pickup info
ALTER TABLE productions ADD COLUMN IF NOT EXISTS brewer_contact TEXT;
ALTER TABLE productions ADD COLUMN IF NOT EXISTS pickup_instructions TEXT;

-- Update investments table
ALTER TABLE investments ADD COLUMN IF NOT EXISTS beer_coins_used DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS pickup_scheduled BOOLEAN DEFAULT false;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS pickup_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS pickup_notes TEXT;

-- Recreate the get_user_role function with new enum
CREATE OR REPLACE FUNCTION public.get_user_role(user_profile_id uuid)
RETURNS user_role
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

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recreate RLS policies with new roles
CREATE POLICY "Admins and master brewers can insert recipes" 
ON beer_recipes 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND id = beer_recipes.created_by 
  AND role IN ('ADMIN', 'MASTER_BREWER')
));

CREATE POLICY "Admins and master brewers can update own recipes" 
ON beer_recipes 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND (id = beer_recipes.created_by OR role = 'ADMIN') 
  AND role IN ('ADMIN', 'MASTER_BREWER')
));

CREATE POLICY "Admins and master brewers can insert productions" 
ON productions 
FOR INSERT 
WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'MASTER_BREWER'));

CREATE POLICY "Admins and assigned brewers can update productions" 
ON productions 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND (role = 'ADMIN' OR id = productions.brewer_id)
));

CREATE POLICY "Users can update their own investments" 
ON investments 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND (id = investments.investor_id OR role = 'ADMIN')
));

CREATE POLICY "Investor brewers can insert their own investments" 
ON investments 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND id = investments.investor_id 
  AND role IN ('INVESTOR_BREWER', 'ADMIN')
));

-- Function to update beer coin balance
CREATE OR REPLACE FUNCTION update_beer_coin_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET 
      available_to_invest = available_to_invest - NEW.beer_coins_used,
      total_invested = total_invested + NEW.beer_coins_used
    WHERE id = NEW.investor_id;
    
    INSERT INTO beer_coin_transactions (user_id, transaction_type, amount, description, reference_id)
    VALUES (NEW.investor_id, 'INVESTMENT', NEW.beer_coins_used, 'Investimento em produção', NEW.production_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for investment balance updates
CREATE TRIGGER trigger_update_beer_coin_balance
  AFTER INSERT ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_beer_coin_balance();

-- Function to add beer coins
CREATE OR REPLACE FUNCTION add_beer_coins(user_profile_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET 
    beer_coin_balance = beer_coin_balance + amount,
    available_to_invest = available_to_invest + amount
  WHERE id = user_profile_id;
  
  INSERT INTO beer_coin_transactions (user_id, transaction_type, amount, description)
  VALUES (user_profile_id, 'PURCHASE', amount, 'Compra de Beer Coins');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
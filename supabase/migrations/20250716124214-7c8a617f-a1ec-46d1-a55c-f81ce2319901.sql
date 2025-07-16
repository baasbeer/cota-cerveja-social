-- Remove voting-related tables and implement Beer Coin system

-- Drop voting tables
DROP TABLE IF EXISTS production_votes CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS voting_proposals CASCADE;

-- Update profiles table to support new role structure and beer coins
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS beer_coin_balance DECIMAL(10,2) DEFAULT 100.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_invested DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_to_invest DECIMAL(10,2) DEFAULT 100.00;

-- Update user roles enum to match new structure
ALTER TYPE user_role RENAME TO user_role_old;
CREATE TYPE user_role AS ENUM ('ADMIN', 'MASTER_BREWER', 'INVESTOR_BREWER');

-- Update profiles table to use new enum
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING 
  CASE 
    WHEN role::text = 'ADMIN' THEN 'ADMIN'::user_role
    WHEN role::text = 'BREWER' THEN 'MASTER_BREWER'::user_role
    WHEN role::text = 'INVESTOR' THEN 'INVESTOR_BREWER'::user_role
    ELSE 'INVESTOR_BREWER'::user_role
  END;
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'INVESTOR_BREWER'::user_role;

-- Drop old enum
DROP TYPE user_role_old;

-- Create beer_coin_transactions table for tracking all transactions
CREATE TABLE beer_coin_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('PURCHASE', 'INVESTMENT', 'REFUND', 'BONUS')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_id UUID, -- Can reference investments, productions, etc
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

-- Update productions table to remove voting-related fields
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

-- Add contact information for brewers
ALTER TABLE productions ADD COLUMN IF NOT EXISTS brewer_contact TEXT;
ALTER TABLE productions ADD COLUMN IF NOT EXISTS pickup_instructions TEXT;

-- Update investments table
ALTER TABLE investments ADD COLUMN IF NOT EXISTS beer_coins_used DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS pickup_scheduled BOOLEAN DEFAULT false;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS pickup_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE investments ADD COLUMN IF NOT EXISTS pickup_notes TEXT;

-- Update beer_recipes table to restrict creation to master brewers
-- Update RLS policies for beer_recipes
DROP POLICY IF EXISTS "Admins and brewers can insert recipes" ON beer_recipes;
CREATE POLICY "Admins and master brewers can insert recipes" 
ON beer_recipes 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND id = beer_recipes.created_by 
  AND role IN ('ADMIN', 'MASTER_BREWER')
));

DROP POLICY IF EXISTS "Admins and brewers can update own recipes" ON beer_recipes;
CREATE POLICY "Admins and master brewers can update own recipes" 
ON beer_recipes 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND (id = beer_recipes.created_by OR role = 'ADMIN') 
  AND role IN ('ADMIN', 'MASTER_BREWER')
));

-- Update productions table RLS policies
DROP POLICY IF EXISTS "Admins and brewers can insert productions" ON productions;
CREATE POLICY "Admins and master brewers can insert productions" 
ON productions 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND role IN ('ADMIN', 'MASTER_BREWER')
));

DROP POLICY IF EXISTS "Admins and assigned brewers can update productions" ON productions;
CREATE POLICY "Admins and assigned brewers can update productions" 
ON productions 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND (role = 'ADMIN' OR id = productions.brewer_id)
));

-- Update investments table RLS policies
DROP POLICY IF EXISTS "Investors can insert their own investments" ON investments;
CREATE POLICY "Investor brewers can insert their own investments" 
ON investments 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() 
  AND id = investments.investor_id 
  AND role IN ('INVESTOR_BREWER', 'ADMIN')
));

-- Function to update beer coin balance when making investments
CREATE OR REPLACE FUNCTION update_beer_coin_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update available balance when investment is made
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET 
      available_to_invest = available_to_invest - NEW.beer_coins_used,
      total_invested = total_invested + NEW.beer_coins_used
    WHERE id = NEW.investor_id;
    
    -- Record transaction
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

-- Function to add beer coins (for admin use)
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
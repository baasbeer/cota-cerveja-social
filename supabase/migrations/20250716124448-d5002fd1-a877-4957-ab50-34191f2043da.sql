-- Step 1: Drop ALL policies that might reference the role column
DROP POLICY IF EXISTS "Users can update their own investments" ON investments;
DROP POLICY IF EXISTS "Users can view all investments" ON investments;
DROP POLICY IF EXISTS "Admins and brewers can insert recipes" ON beer_recipes;
DROP POLICY IF EXISTS "Admins and brewers can update own recipes" ON beer_recipes;
DROP POLICY IF EXISTS "Admins and brewers can insert productions" ON productions;
DROP POLICY IF EXISTS "Admins and assigned brewers can update productions" ON productions;
DROP POLICY IF EXISTS "Investors can insert their own investments" ON investments;

-- Step 2: Drop voting tables
DROP TABLE IF EXISTS production_votes CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS voting_proposals CASCADE;

-- Step 3: Add new columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS beer_coin_balance DECIMAL(10,2) DEFAULT 100.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_invested DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_to_invest DECIMAL(10,2) DEFAULT 100.00;

-- Step 4: Update enum and role column
ALTER TYPE user_role RENAME TO user_role_old;
CREATE TYPE user_role AS ENUM ('ADMIN', 'MASTER_BREWER', 'INVESTOR_BREWER');

ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING 
  CASE 
    WHEN role::text = 'ADMIN' THEN 'ADMIN'::user_role
    WHEN role::text = 'BREWER' THEN 'MASTER_BREWER'::user_role
    WHEN role::text = 'INVESTOR' THEN 'INVESTOR_BREWER'::user_role
    ELSE 'INVESTOR_BREWER'::user_role
  END;
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'INVESTOR_BREWER'::user_role;

DROP TYPE user_role_old;
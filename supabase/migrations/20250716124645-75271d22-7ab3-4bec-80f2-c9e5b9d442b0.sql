-- Drop the function that depends on the old type
DROP FUNCTION IF EXISTS get_user_role(uuid);

-- Now drop the old type with CASCADE
DROP TYPE user_role_old CASCADE;
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = 'ADMIN' | 'MASTER_BREWER' | 'INVESTOR_BREWER';

interface UserPermissions {
  canCreateRecipes: boolean;
  canAssumeProductions: boolean;
  canInvest: boolean;
  canManageUsers: boolean;
  canManageProductions: boolean;
  canManageBeerCoins: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  address: string | null;
  active: boolean;
  brewery_name: string | null;
  experience_years: number | null;
  certifications: string | null;
  investment_limit: number | null;
  preferred_styles: string[] | null;
  beer_coin_balance?: number | null;
  created_at: string;
  updated_at: string;
}

const getPermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case 'ADMIN':
      return {
        canCreateRecipes: true,
        canAssumeProductions: true,
        canInvest: true,
        canManageUsers: true,
        canManageProductions: true,
        canManageBeerCoins: true,
      };
    case 'MASTER_BREWER':
      return {
        canCreateRecipes: true,
        canAssumeProductions: true,
        canInvest: false,
        canManageUsers: false,
        canManageProductions: true,
        canManageBeerCoins: false,
      };
    case 'INVESTOR_BREWER':
      return {
        canCreateRecipes: false,
        canAssumeProductions: false,
        canInvest: true,
        canManageUsers: false,
        canManageProductions: false,
        canManageBeerCoins: false,
      };
    default:
      return {
        canCreateRecipes: false,
        canAssumeProductions: false,
        canInvest: false,
        canManageUsers: false,
        canManageProductions: false,
        canManageBeerCoins: false,
      };
  }
};

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user,
  });

  const role = profile?.role || 'INVESTOR_BREWER';
  const permissions = getPermissions(role);

  return {
    profile,
    role,
    permissions,
    isLoading,
    error,
    hasRole: (requiredRole: UserRole | UserRole[]) => {
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(role);
      }
      return role === requiredRole;
    },
  };
};
import React from 'react';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface RoleGateProps {
  role: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showAlert?: boolean;
}

export const RoleGate: React.FC<RoleGateProps> = ({ 
  role, 
  children, 
  fallback,
  showAlert = false 
}) => {
  const { hasRole, isLoading } = useUserRole();

  if (isLoading) {
    return null;
  }

  const hasPermission = hasRole(role);

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showAlert) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar este conteúdo.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  return <>{children}</>;
};
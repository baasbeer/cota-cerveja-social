import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Beer, User, LogOut, Menu, X, Settings, Users, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { RoleGate } from '@/components/auth/RoleGate';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, role } = useUserRole();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MASTER_BREWER': return 'Mestre Cervejeiro';
      case 'INVESTOR_BREWER': return 'Investidor';
      default: return 'Usuário';
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'MASTER_BREWER': return 'secondary';
      case 'INVESTOR_BREWER': return 'default';
      default: return 'outline';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Beer className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BaasBeer
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className={`flex items-center space-x-4 ${isMobile ? 'hidden' : ''}`}>
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link 
                  to="/dashboard" 
                  className={location.pathname === '/dashboard' ? 'text-primary' : ''}
                >
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link 
                  to="/minhas-cotas" 
                  className={location.pathname === '/minhas-cotas' ? 'text-primary' : ''}
                >
                  Minhas Cotas
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link 
                  to="/votacoes" 
                  className={location.pathname === '/votacoes' ? 'text-primary' : ''}
                >
                  Votações
                </Link>
              </Button>
              <Button variant="ghost" size="sm" disabled>
                Produção
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getRoleVariant(role)} className="text-xs">
                        {getRoleDisplayName(role)}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <RoleGate role="ADMIN">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      Gerenciar Usuários
                    </DropdownMenuItem>
                  </RoleGate>
                  <RoleGate role="MASTER_BREWER">
                    <DropdownMenuItem>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Minhas Produções
                    </DropdownMenuItem>
                  </RoleGate>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="default" size="sm">
              Entrar
            </Button>
          )}
        </nav>

        {/* Mobile Hamburger Menu */}
        {isMobile && (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle className="flex items-center justify-between">
                  Menu
                  <DrawerClose asChild>
                    <Button variant="ghost" size="sm">
                      <X className="h-6 w-6" />
                    </Button>
                  </DrawerClose>
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-6">
                {user ? (
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild 
                      className="w-full justify-start"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <Link 
                        to="/dashboard" 
                        className={location.pathname === '/dashboard' ? 'text-primary font-medium' : ''}
                      >
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild 
                      className="w-full justify-start"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <Link 
                        to="/minhas-cotas" 
                        className={location.pathname === '/minhas-cotas' ? 'text-primary font-medium' : ''}
                      >
                        Minhas Cotas
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild 
                      className="w-full justify-start"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <Link 
                        to="/votacoes" 
                        className={location.pathname === '/votacoes' ? 'text-primary font-medium' : ''}
                      >
                        Votações
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled 
                      className="w-full justify-start"
                    >
                      Produção
                    </Button>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
                          <Badge variant={getRoleVariant(role)} className="text-xs mt-1">
                            {getRoleDisplayName(role)}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => {
                          signOut();
                          setIsDrawerOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Entrar
                  </Button>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </header>
  );
};

export default Header;
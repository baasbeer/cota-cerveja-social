import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Beer, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Beer className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BaasBeer
          </span>
        </div>

        <nav className="flex items-center space-x-4">
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
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
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
      </div>
    </header>
  );
};

export default Header;
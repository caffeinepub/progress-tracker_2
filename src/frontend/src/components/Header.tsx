import { CheckSquare, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function Header() {
  const { login, clear, loginStatus, identity, isLoggingIn } = useInternetIdentity();

  const isLoggedIn = loginStatus === 'success' && identity;
  const principal = identity?.getPrincipal().toString();
  const truncatedPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : '';

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10 flex-shrink-0">
              <CheckSquare className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">
                Progress Tracker
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Track your tasks and daily progress
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-mono">
                    {truncatedPrincipal}
                  </span>
                </div>
                <Button
                  onClick={clear}
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9 sm:h-10"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="sm"
                className="gap-2 h-9 sm:h-10"
              >
                <LogIn className="h-4 w-4" />
                <span>{isLoggingIn ? 'Connecting...' : 'Login'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

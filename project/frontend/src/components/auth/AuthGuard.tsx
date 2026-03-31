import { useState, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { Spinner } from '@/components/ui/spinner';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthGuardProps {
  children: ReactNode;
  showGoogleLogin?: boolean;
}

export function AuthGuard({ children, showGoogleLogin = false }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [view, setView] = useState<'login' | 'register'>('login');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        {view === 'login' ? (
          <LoginForm
            onSwitchToRegister={() => setView('register')}
            showGoogleLogin={showGoogleLogin}
          />
        ) : (
          <RegisterForm onSwitchToLogin={() => setView('login')} />
        )}
      </div>
    );
  }

  return <>{children}</>;
}

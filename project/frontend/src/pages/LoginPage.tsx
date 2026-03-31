import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, displayName || undefined);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="border-[3px] border-ink bg-cream p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
        <h1 className="font-display font-bold text-2xl mb-6">
          {isRegister ? '✍️ Register' : '👋 Login'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block font-display font-medium text-sm mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-ink bg-stone text-ink font-sans focus:outline-none focus:ring-2 focus:ring-yellow"
                placeholder="Viviano"
              />
            </div>
          )}
          <div>
            <label className="block font-display font-medium text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-ink bg-stone text-ink font-sans focus:outline-none focus:ring-2 focus:ring-yellow"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block font-display font-medium text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-ink bg-stone text-ink font-sans focus:outline-none focus:ring-2 focus:ring-yellow"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 border-2 border-destructive bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-yellow border-[3px] border-ink font-display font-bold text-sm shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
          >
            {loading
              ? 'Loading...'
              : isRegister
                ? 'Create Account'
                : 'Log In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-sm text-muted-foreground hover:text-ink transition-colors underline decoration-dotted underline-offset-4"
          >
            {isRegister
              ? 'Already have an account? Log in'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

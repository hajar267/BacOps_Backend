'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    try {
      await login(username.trim(), password);
      router.push('/app/dashboard');
    } catch {
      // error already set in the store
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-primary items-center justify-center p-12">
        <div className="max-w-md text-white">
          <img src="/arma_logo.jpg" alt="BacOps" className="w-24 mb-8" />
          <h2 className="text-3xl font-bold mb-4">Gestion des Bacs & RFID</h2>
          <p className="text-white/80 text-lg">
            Suivi en temps réel de votre flotte de conteneurs et interventions terrain.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 bg-surface-bg">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl p-10 bg-white shadow-sm shadow-black/5"
        >
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <img src="/arma_logo.jpg" alt="BacOps" className="w-24 mb-4" />
          </div>

          <h1 className="text-xl font-bold mb-1 text-text-primary">
            Connexion
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            Accédez à votre espace BacOps
          </p>

          <div className="relative mb-4">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-border
                         focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                         outline-none transition-all text-text-primary placeholder:text-text-secondary/60"
            />
          </div>

          <div className="relative mb-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-surface-border
                         focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                         outline-none transition-all text-text-primary placeholder:text-text-secondary/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-brand-error bg-brand-error/10 rounded-lg px-3 py-2 mb-4 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 rounded-lg font-semibold text-white bg-brand-primary
                       hover:bg-brand-primary/90 active:scale-[0.98] transition-all
                       disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isLoading ? 'Connexion...' : 'Se Connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
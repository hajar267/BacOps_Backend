'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function AccessDeniedPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    router.replace('/app/auth/login');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <section className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-text-primary">Accès non disponible</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Le tableau de bord administrateur est réservé aux administrateurs.
        </p>
        {user?.role.name && (
          <p className="mt-3 text-xs text-text-secondary">
            Rôle actuel : {user.role.name}
          </p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          Se déconnecter
        </button>
      </section>
    </main>
  );
}
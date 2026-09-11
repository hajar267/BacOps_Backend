import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AppEntryPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-primary px-6 py-12">
      <div className="w-full max-w-md text-center text-white">
        <Image
          src="/arma_logo.jpg"
          alt="BacOps"
          width={128}
          height={128}
          className="mx-auto mb-8 h-32 w-32 rounded-2xl object-cover shadow-lg shadow-black/20"
          priority
        />
        <h1 className="text-4xl font-bold tracking-tight">Gestion des Bacs & RFID</h1>
        <p className="mt-4 text-lg text-white/80">
          Suivez votre flotte de conteneurs et vos interventions terrain.
        </p>
        <Link
          href="/app/auth/login"
          className="mx-auto mt-10 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-brand-primary shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
        >
          Se connecter
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </main>
  );
}

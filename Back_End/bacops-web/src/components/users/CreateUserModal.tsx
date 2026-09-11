'use client';

import { useEffect, useState } from 'react';
import { X, User, Mail, Lock, Shield, Loader2 } from 'lucide-react';
import { userService } from '@/services/userService';
import { CreateUserPayload, RoleOption, UserListItem } from '@/types/user';

interface CreateUserModalProps {
  onClose: () => void;
  onCreated: (user: UserListItem) => void;
}

export function CreateUserModal({ onClose, onCreated }: CreateUserModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService.listRoles().then(setRoles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !roleName) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const payload: CreateUserPayload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        roleName,
      };
      const newUser = await userService.create(payload);
      onCreated(newUser);
      onClose();
    } catch {
      setError("Une erreur est survenue lors de la création de l'utilisateur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-sm shadow-black/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
          <h2 className="text-lg font-bold text-text-primary">Créer un nouvel utilisateur</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-1.5 block">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-border
                             focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                             outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text-primary mb-1.5 block">
                Nom
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                className="w-full px-3 py-2.5 rounded-lg border border-surface-border
                           focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                           outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez l'adresse email"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-border
                           focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                           outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-border
                           focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                           outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Rôle
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              <select
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-surface-border
                           focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                           outline-none transition-all text-sm appearance-none bg-white text-text-primary"
              >
                <option value="" disabled>
                  Sélectionnez un rôle
                </option>
                {roles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-brand-error mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-semibold text-white bg-brand-primary
                       hover:bg-brand-primary/90 active:scale-[0.98] transition-all
                       disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Création...' : "Créer l'utilisateur"}
          </button>
        </form>
      </div>
    </div>
  );
}

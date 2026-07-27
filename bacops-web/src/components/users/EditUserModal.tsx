'use client';

import { useEffect, useState } from 'react';
import {
  X,
  User,
  Mail,
  Shield,
  Loader2,
} from 'lucide-react';

import { userService } from '@/services/userService';
import {
  UserListItem,
  RoleOption,
  UpdateUserPayload,
} from '@/types/user';

interface EditUserModalProps {
  user: UserListItem;
  onClose: () => void;
  onUpdated: (user: UserListItem) => void;
}

export function EditUserModal({
  user,
  onClose,
  onUpdated,
}: EditUserModalProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [roleName, setRoleName] = useState(user.role.name);
  const [active, setActive] = useState(user.active);

  const [roles, setRoles] = useState<RoleOption[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService.listRoles().then(setRoles);
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !roleName
    ) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: UpdateUserPayload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        roleName,
        active,
      };

      const updated = await userService.update(
        user.id,
        payload
      );

      onUpdated(updated);

      onClose();
    } catch {
      setError(
        "Une erreur est survenue lors de la modification."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-sm shadow-black/10">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-surface-border px-6 py-5">

          <h2 className="text-lg font-bold text-text-primary">
            Modifier un utilisateur
          </h2>

          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5"/>
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5"
        >

          {/* First Name */}

          <label className="mb-1 block text-sm font-medium text-text-primary">
            Prénom
          </label>

          <div className="relative mb-4">
            <User className="absolute left-3 top-3 h-4 w-4 text-text-secondary"/>

            <input
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              className="w-full rounded-lg border border-surface-border py-2.5 pl-10 pr-3"
            />
          </div>

          {/* Last Name */}

          <label className="mb-1 block text-sm font-medium text-text-primary">
            Nom
          </label>

          <input
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
            className="mb-4 w-full rounded-lg border border-surface-border px-3 py-2.5"
          />

          {/* Email */}

          <label className="mb-1 block text-sm font-medium text-text-primary">
            Email
          </label>

          <div className="relative mb-4">

            <Mail className="absolute left-3 top-3 h-4 w-4 text-text-secondary"/>

            <input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-lg border border-surface-border py-2.5 pl-10 pr-3"
            />

          </div>

          {/* Role */}

          <label className="mb-1 block text-sm font-medium text-text-primary">
            Rôle
          </label>

          <div className="relative mb-5">

            <Shield className="absolute left-3 top-3 h-4 w-4 text-text-secondary"/>

            <select
              value={roleName}
              onChange={(e) =>
                setRoleName(e.target.value)
              }
              className="w-full appearance-none rounded-lg border border-surface-border bg-white py-2.5 pl-10 pr-3"
            >
              {roles.map((role) => (
                <option
                  key={role.name}
                  value={role.name}
                >
                  {role.label}
                </option>
              ))}
            </select>

          </div>

          {/* Status */}

          <div className="mb-6 flex items-center justify-between rounded-lg border border-surface-border p-4">

            <div>

              <p className="font-medium text-text-primary">
                Compte
              </p>

              <p className="text-sm text-text-secondary">
                {active
                  ? "L'utilisateur peut se connecter."
                  : "L'utilisateur est désactivé."}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setActive(!active)
              }
              className={`relative h-7 w-12 rounded-full transition ${
                active
                  ? 'bg-brand-success'
                  : 'bg-surface-border'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  active
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>

          </div>

          {error && (
            <p className="mb-4 text-sm text-brand-error">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-surface-border px-5 py-2.5"
            >
              Annuler
            </button>

            <button
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 font-semibold text-white"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin"/>
              )}

              {isSubmitting
                ? 'Enregistrement...'
                : 'Enregistrer'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
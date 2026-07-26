export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface NavGroup {
  type: 'group';
  label: string;
  icon: string;
  items: NavItem[];
}

export interface NavLink extends NavItem {
  type: 'link';
}

export type NavEntry = NavLink | NavGroup;

export const NAV_ITEMS: Record<string, NavEntry[]> = {
  admin: [
    {
      type: 'group',
      label: 'Configuration',
      icon: 'settings',
      items: [
        { label: 'Types de bac', href: '/dashboard/types', icon: 'box' },
        { label: 'Procès-Verbaux', href: '/dashboard/pv', icon: 'file' },
      ],
    },
    {
      type: 'group',
      label: 'Utilisateurs',
      icon: 'users',
      items: [
        { label: 'Gestion des utilisateurs', href: '/dashboard/users', icon: 'users' },
      ],
    },
    {
      type: 'group',
      label: 'Mon compte',
      icon: 'user',
      items: [
        { label: 'Changer mot de passe', href: '/dashboard/account/password', icon: 'lock' },
      ],
    },
  ],
  install: [
    {
      type: 'group',
      label: 'Mon compte',
      icon: 'user',
      items: [
        { label: 'Changer mot de passe', href: '/dashboard/account/password', icon: 'lock' },
      ],
    },
  ],
  magasin: [
    {
      type: 'group',
      label: 'Mon compte',
      icon: 'user',
      items: [
        { label: 'Changer mot de passe', href: '/dashboard/account/password', icon: 'lock' },
      ],
    },
  ],
};

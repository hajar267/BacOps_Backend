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
      label: 'Mon compte',
      icon: 'user',
      items: [
        { label: 'Changer mot de passe', href: '/app/dashboard/account/password', icon: 'lock' },
      ],
    },
    {
      type: 'group',
      label: 'Utilisateurs',
      icon: 'users',
      items: [
        { label: 'Gestion des utilisateurs', href: '/app/dashboard/users', icon: 'users' },
        { label: 'permissions', href: '/app/dashboard/roles', icon: 'Shield' },
      ],
    },
    {
      type: 'group',
      label: 'Configuration',
      icon: 'settings',
      items: [
        { label: 'Types de bac', href: '/app/dashboard/types', icon: 'box' },
        { label: 'Procès-Verbaux', href: '/app/dashboard/pv', icon: 'file' },
        { label: 'Gestion des arronds', href: '/app/dashboard/arrond', icon: 'map' },
      ],
    },
  ],
  install: [
    {
      type: 'group',
      label: 'Mon compte',
      icon: 'user',
      items: [
        { label: 'Changer mot de passe', href: '/app/dashboard/account/password', icon: 'lock' },
      ],
    },
  ],
  magasin: [
    {
      type: 'group',
      label: 'Mon compte',
      icon: 'user',
      items: [
        { label: 'Changer mot de passe', href: '/app/dashboard/account/password', icon: 'lock' },
      ],
    },
  ],
};

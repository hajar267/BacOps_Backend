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
      type: 'link',
      label: 'Tableau de bord',
      href: '/app/admin/dashboard',
      icon: 'layoutdashboard',
    },
    {
      type: 'link',
      label: 'Rechercher',
      href: '/app/admin/search',
      icon: 'search',
    },
    // {
    //   type: 'group',
    //   label: 'Mon compte',
    //   icon: 'user',
    //   items: [
    //     { label: 'Changer mot de passe', href: '/app/dashboard/account/password', icon: 'lock' },
    //   ],
    // },
    {
      type: 'group',
      label: 'Utilisateurs',
      icon: 'users',
      items: [
        { label: 'Gestion des utilisateurs', href: '/app/admin/users', icon: 'users' },
        { label: 'permissions', href: '/app/admin/roles', icon: 'Shield' },
      ],
    },
    {
      type: 'group',
      label: 'Configuration',
      icon: 'settings',
      items: [
        { label: 'Types de bac', href: '/app/admin/types', icon: 'box' },
        { label: 'Procès-Verbaux', href: '/app/admin/pv', icon: 'file' },
        { label: 'Gestion des arronds', href: '/app/admin/arrond', icon: 'map' },
        { label: 'Fournisseurs', href: '/app/admin/supplier', icon: 'truck' },
        { label: 'Cadre de commande', href: '/app/admin/commande', icon: 'tag' },
        { label: 'Decharges', href: '/app/admin/decharges', icon: 'files' },
      ],
    },
  ],
  install: [
    {
      type: 'link',
      label: 'Installations',
      href: '/app/install',
      icon: 'map',
    },
  ],
  magasin: [
    {
      type: 'link',
      label: 'Stock',
      href: '/app/magasin',
      icon: 'box',
    },
  ],
};

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut, LayoutDashboard, FileText, Users, Box, Tag,
  ListChecks, Settings, User, Lock, ChevronDown, 
  ChevronRight, Shield, MapPinned, Truck, FolderArchive,
  Search, PanelLeftClose, PanelLeftOpen, X
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getInitials } from '@/utils/initials';
import { NAV_ITEMS, NavEntry } from '@/constants/navigation';

interface SidebarProps {
  items?: NavEntry[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onMobileClose?: () => void;
}

const ICONS: Record<string, React.ElementType> = {
  chart: LayoutDashboard,
  file: FileText,
  files: FolderArchive,
  users: Users,
  box: Box,
  tag: Tag,
  checklist: ListChecks,
  settings: Settings,
  user: User,
  lock: Lock,
  Shield: Shield,
  map: MapPinned,
  truck: Truck,
  layoutdashboard: LayoutDashboard,
  search: Search,
};

export function Sidebar({ items, collapsed = false, onCollapsedChange, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!user) return null;

  const navEntries: NavEntry[] = items ?? NAV_ITEMS[user.role.name] ?? [];

  const handleLogout = async () => {
    await logout();
    router.push('/app/auth/login');
  };

  return (
    <aside className={`h-screen flex flex-col bg-white border-r border-surface-border transition-[width] duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* User block */}
      <div className={`relative border-b border-surface-border bg-brand-primary/6 ${collapsed ? 'p-3 pb-8' : 'p-5 pb-8'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          {!collapsed && <div className="w-11 h-11 rounded-full bg-brand-primary/15 border border-brand-primary/20 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-text-primary tracking-wide">
              {getInitials(user.firstName, user.lastName)}
            </span>
          </div>}
          <div className={collapsed ? 'hidden' : 'min-w-0'}>
            <p className="font-bold text-text-primary truncate">
              {user.firstName} {user.lastName}
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-brand-primary/15 text-text-primary">
              {user.role.name.toUpperCase()}
            </span>
          </div>
        </div>
        {onCollapsedChange && (
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="absolute right-2 bottom-2 hidden h-8 w-8 items-center justify-center rounded-lg bg-white text-text-secondary shadow-sm ring-1 ring-surface-border transition-colors hover:bg-surface-bg hover:text-text-primary md:flex"
            aria-label={collapsed ? 'Ouvrir la barre latérale' : 'Réduire la barre latérale'}
            title={collapsed ? 'Ouvrir la barre latérale' : 'Réduire la barre latérale'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        )}
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-white/60 hover:text-text-primary md:hidden"
            aria-label="Fermer la barre latérale"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 overflow-y-auto ${collapsed ? 'p-2' : 'p-3'}`}>
        {navEntries.map((entry) => {
          if (entry.type === 'link') {
            const Icon = ICONS[entry.icon] ?? LayoutDashboard;
            const isActive = pathname === entry.href;
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-primary/15 text-text-primary'
                    : 'text-text-secondary hover:bg-surface-bg'
                }`}
                onClick={onMobileClose}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className={collapsed ? 'hidden' : ''}>{entry.label}</span>
              </Link>
            );
          }

          // Group
          const GroupIcon = ICONS[entry.icon] ?? Settings;
          const isOpen = expanded === entry.label;
          return (
            <div key={entry.label} className="mb-1">
              <button
                onClick={() => setExpanded(isOpen ? null : entry.label)}
                className={`w-full flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-bg ${collapsed ? 'justify-center px-1' : 'px-3'}`}
              >
                <GroupIcon className="w-4.5 h-4.5" />
                <span className={collapsed ? 'hidden' : 'flex-1 text-left'}>{entry.label}</span>
                {!collapsed && (isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                ))}
              </button>

              {isOpen && !collapsed && (
                <div className="ml-6 mt-1 border-l border-surface-border pl-3">
                  {entry.items.map((item) => {
                    const ItemIcon = ICONS[item.icon] ?? Box;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-brand-primary/15 text-text-primary'
                            : 'text-text-secondary hover:bg-surface-bg'
                        }`}
                        onClick={onMobileClose}
                      >
                        <ItemIcon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`border-t border-surface-border ${collapsed ? 'p-2' : 'p-4'}`}>
        <button
          onClick={handleLogout}
          type="button"
          onClickCapture={onMobileClose}
          className={`w-full flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-bg ${collapsed ? 'justify-center px-1' : 'px-3'}`}
        >
          <LogOut className="w-4.5 h-4.5" />
          <span className={collapsed ? 'hidden' : ''}>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}

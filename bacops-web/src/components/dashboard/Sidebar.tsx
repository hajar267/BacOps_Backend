'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut, LayoutDashboard, FileText, Users, Box, Tag,
  ListChecks, Settings, User, Lock, ChevronDown, ChevronRight, Shield, MapPinned
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getInitials } from '@/utils/initials';
import { NAV_ITEMS, NavEntry } from '@/constants/navigation';

const ICONS: Record<string, React.ElementType> = {
  chart: LayoutDashboard,
  file: FileText,
  users: Users,
  box: Box,
  tag: Tag,
  checklist: ListChecks,
  settings: Settings,
  user: User,
  lock: Lock,
  Shield: Shield,
  map: MapPinned,
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!user) return null;

  const navEntries: NavEntry[] = NAV_ITEMS[user.role.name] ?? [];

  const handleLogout = () => {
    logout();
    router.push('/app/auth/login');
  };

  return (
    <aside className="w-64 h-screen flex flex-col bg-white border-r border-surface-border">
      {/* User block */}
      <div className="p-5 border-b border-surface-border bg-brand-primary/6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-brand-primary/15 border border-brand-primary/20 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-text-primary tracking-wide">
              {getInitials(user.firstName, user.lastName)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-text-primary truncate">
              {user.firstName} {user.lastName}
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-brand-primary/15 text-text-primary">
              {user.role.name.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
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
              >
                <Icon className="w-4.5 h-4.5" />
                {entry.label}
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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-text-secondary hover:bg-surface-bg transition-colors"
              >
                <GroupIcon className="w-4.5 h-4.5" />
                <span className="flex-1 text-left">{entry.label}</span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {isOpen && (
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
      <div className="p-4 border-t border-surface-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-bg transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

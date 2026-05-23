'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Boxes,
  Calendar,
  Book,
  Truck,
  Bell,
  Megaphone,
  CreditCard,
  Settings,
  LogOut,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarNavProps {
  items: NavItem[];
  schoolName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export default function SidebarNav({
  items,
  schoolName,
  userRole,
  onLogout,
}: SidebarNavProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="glass glass-lg sticky top-0 flex h-screen w-64 flex-col border-r border-slate-800/50 bg-slate-900/80">
      {/* Header */}
      <div className="border-b border-slate-800/50 px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
            <BookOpen size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-foreground">DVLD</h1>
            <p className="text-xs text-muted-foreground">Portal</p>
          </div>
        </div>
      </div>

      {/* School/User Info */}
      {schoolName && (
        <div className="border-b border-slate-800/50 px-6 py-4">
          <p className="text-xs text-muted-foreground">School</p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">
            {schoolName}
          </p>
          {userRole && (
            <p className="mt-2 text-xs capitalize text-cyan-400">{userRole}</p>
          )}
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-slate-800/50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer - Logout */}
      <div className="border-t border-slate-800/50 p-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-slate-800/50"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}

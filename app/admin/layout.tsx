import SidebarNav from '@/components/layout/SidebarNav';
import { LayoutDashboard, BarChart3 } from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Revenue Report',
    href: '/admin/revenue',
    icon: <BarChart3 size={20} />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNav items={navItems} schoolName="System Administrator" userRole="Admin" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

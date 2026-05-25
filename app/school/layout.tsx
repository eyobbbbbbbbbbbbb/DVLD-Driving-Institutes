import SidebarNav from '@/components/layout/SidebarNav';
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
  CheckSquare,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/school/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Students',
    href: '/school/students',
    icon: <Users size={20} />,
  },
  {
    label: 'Training Batches',
    href: '/school/batches',
    icon: <Boxes size={20} />,
  },
  {
    label: 'Attendance',
    href: '/school/attendance',
    icon: <Calendar size={20} />,
  },
  {
    label: 'Test Eligibility',
    href: '/school/eligibility',
    icon: <CheckSquare size={20} />,
  },
  {
    label: 'Courses',
    href: '/school/courses',
    icon: <Book size={20} />,
  },
  {
    label: 'Vehicles',
    href: '/school/vehicles',
    icon: <Truck size={20} />,
  },
  {
    label: 'Announcements',
    href: '/school/announcements',
    icon: <Megaphone size={20} />,
  },
  {
    label: 'Notifications',
    href: '/school/notifications',
    icon: <Bell size={20} />,
  },
  {
    label: 'Payments',
    href: '/school/payments',
    icon: <CreditCard size={20} />,
  },
  {
    label: 'Settings',
    href: '/school/settings',
    icon: <Settings size={20} />,
  },
];

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNav items={navItems} schoolName="DVLD Training Academy" userRole="School Admin" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

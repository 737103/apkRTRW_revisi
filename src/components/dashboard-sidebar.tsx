'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, BarChart2, FileText, Megaphone, Settings, Building, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function DashboardSidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Performance Data', icon: BarChart2 },
    { href: '#', label: 'Manage Users', icon: Users, disabled: true },
    { href: '#', label: 'Settings', icon: Settings, disabled: true },
  ];

  const userLinks = [
    { href: '/dashboard/submit-report', label: 'Submit Report', icon: FileText },
    { href: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
    { href: '#', label: 'Settings', icon: Settings, disabled: true },
  ];
  
  const baseDashboardLink = { href: isAdmin ? '/admin/dashboard' : '/dashboard', label: 'Dashboard', icon: Home };

  const navLinks = isAdmin ? [baseDashboardLink, ...adminLinks] : [baseDashboardLink, ...userLinks];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
            <Building className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">RT RW Tracker</h1>
        </div>
        <nav className="flex-1 space-y-1">
            {navLinks.map((link) => (
                <Button
                    key={link.label}
                    variant={pathname === link.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-base h-11"
                    asChild
                    disabled={link.disabled}
                >
                    <Link href={link.href}>
                        <link.icon className="mr-3 h-5 w-5" />
                        {link.label}
                    </Link>
                </Button>
            ))}
        </nav>
        <div className="mt-auto">
          <Separator className="my-2" />
          <Button variant="ghost" className="w-full justify-start text-base h-11" asChild>
            <Link href="/">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Link>
          </Button>
        </div>
    </aside>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Megaphone, Settings, Building, LogOut, FileText, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const LOGGED_IN_USER_KEY = 'rt-rw-logged-in-user';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState<{ fullName: string; position: string } | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('rt-rw-role');
    const isAdminRole = role === 'admin';
    setIsAdmin(isAdminRole);

    try {
      if (isAdminRole) {
        setUserInfo({ fullName: 'Admin', position: 'Administrator' });
      } else {
        const loggedInUserStr = localStorage.getItem(LOGGED_IN_USER_KEY);
        if (loggedInUserStr) {
          const loggedInUser = JSON.parse(loggedInUserStr);
          setUserInfo({
            fullName: loggedInUser.fullName || 'Pengguna',
            position: loggedInUser.position || 'Anggota'
          });
        } else {
          router.push('/'); // Redirect if no user data found for user role
        }
      }
    } catch (error) {
      console.error("Failed to load user info from localStorage", error);
      router.push('/');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    localStorage.removeItem('rt-rw-role');
    router.push('/');
  }

  const adminLinks = [
    { href: '/dashboards/admin/manage-users', label: 'Kelola Pengguna', icon: Users },
    { href: '/dashboards/admin/announcements', label: 'Kelola Pengumuman', icon: Megaphone },
    { href: '/dashboards/admin/settings', label: 'Pengaturan Akun', icon: Settings },
  ];

  const userLinks = [
    { href: '/dashboards/dashboard/submit-report', label: 'Kirim Laporan', icon: FileText },
    { href: '/dashboards/dashboard/performance-data', label: 'Data Kinerja', icon: FileText },
    { href: '/dashboards/dashboard/announcements', label: 'Pengumuman', icon: Megaphone },
  ];
  
  const baseDashboardLink = { href: isAdmin ? '/dashboards/admin/dashboard' : '/dashboards/dashboard', label: 'Dasbor', icon: Home };

  const navLinks = isAdmin ? [baseDashboardLink, ...adminLinks] : [baseDashboardLink, ...userLinks];

  if (!userInfo) {
    return null; // or a loading skeleton
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
            <Building className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Aplikasi Kinerja</h1>
        </div>
        
        {userInfo && (
            <div className="px-2 mb-4">
              <Separator />
              <div className="flex items-center gap-3 pt-4">
                <User className="h-6 w-6 text-muted-foreground" />
                <div>
                    <p className="font-semibold text-sm">{userInfo.fullName}</p>
                    <p className="text-xs text-muted-foreground">{userInfo.position}</p>
                </div>
              </div>
            </div>
        )}

        <nav className="flex-1 space-y-1">
            {navLinks.map((link) => (
                <Button
                    key={link.label}
                    variant={pathname.startsWith(link.href) ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-base h-11"
                    asChild
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
          <Button variant="ghost" className="w-full justify-start text-base h-11" onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" />
              Keluar
          </Button>
        </div>
    </aside>
  );
}

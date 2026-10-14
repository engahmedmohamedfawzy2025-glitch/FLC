'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthState, logout, type AuthState } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Menu,
  Package,
  Lightbulb,
  Wrench,
  Briefcase,
  Users,
  Newspaper,
  Search,
  Star,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileText,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/identity', label: 'Website Identity', icon: Building2 },
  { href: '/admin/content', label: 'Site Content', icon: FileText },
  { href: '/admin/navigation', label: 'Navigation', icon: Menu },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/solutions', label: 'Solutions', icon: Lightbulb },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/stats', label: 'Statistics', icon: BarChart3 },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/users', label: 'Users', icon: ShieldCheck, superAdminOnly: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({ authenticated: false, profile: null, loading: true });

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setAuthState({ authenticated: false, profile: null, loading: false });
      return;
    }
    getAuthState().then(setAuthState);
  }, [pathname, isLoginPage]);

  useEffect(() => {
    if (!authState.loading && !authState.authenticated && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [authState, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading admin panel...</div>
      </div>
    );
  }

  if (!authState.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Redirecting to login...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  const isSuperAdmin = authState.profile?.role === 'super_admin';
  const visibleNavItems = navItems.filter(item => !item.superAdminOnly || isSuperAdmin);

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={cn(
          'fixed top-0 bottom-0 z-40 bg-card border-e border-border flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                FLC
              </div>
              <span className="font-bold text-sm text-foreground">Dashboard</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs mx-auto">
              FLC
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4 text-foreground" /> : <ChevronLeft className="h-4 w-4 text-foreground" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border space-y-1">
          {!collapsed && authState.profile && (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">{authState.profile.email}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={cn('inline-block w-2 h-2 rounded-full', authState.profile.isActive ? 'bg-success' : 'bg-destructive')} />
                {authState.profile.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </div>
            </div>
          )}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={collapsed ? 'View Website' : undefined}
          >
            <ExternalLink className="shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
            {!collapsed && <span>View Website</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className={cn('flex-1 transition-all duration-300', collapsed ? 'ms-16' : 'ms-64')}>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

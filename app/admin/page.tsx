'use client';

import { AdminCard, AdminPageHeader } from '@/components/admin/ui';
import { useEffect, useState } from 'react';
import { fetchProducts, fetchSolutions, fetchServices, fetchProjects, fetchClients, fetchNews, fetchTestimonials, fetchStats } from '@/lib/content';
import { Package, Lightbulb, Briefcase, Wrench, Users, Newspaper, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Counts {
  products: number; solutions: number; services: number; projects: number;
  clients: number; news: number; testimonials: number; stats: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchSolutions(), fetchServices(), fetchProjects(), fetchClients(), fetchNews(), fetchTestimonials(), fetchStats()])
      .then(([p, s, sv, pr, c, n, t, st]) => {
        setCounts({
          products: p.length, solutions: s.length, services: sv.length,
          projects: pr.length, clients: c.length, news: n.length,
          testimonials: t.length, stats: st.length,
        });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        setCounts({
          products: 0, solutions: 0, services: 0, projects: 0,
          clients: 0, news: 0, testimonials: 0, stats: 0,
        });
      });
  }, []);

  if (!counts) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const statCards = [
    { label: 'Products', count: counts.products, icon: Package, href: '/admin/products', color: 'text-primary' },
    { label: 'Solutions', count: counts.solutions, icon: Lightbulb, href: '/admin/solutions', color: 'text-accent' },
    { label: 'Projects', count: counts.projects, icon: Briefcase, href: '/admin/projects', color: 'text-primary' },
    { label: 'Services', count: counts.services, icon: Wrench, href: '/admin/services', color: 'text-accent' },
    { label: 'Clients', count: counts.clients, icon: Users, href: '/admin/clients', color: 'text-primary' },
    { label: 'News', count: counts.news, icon: Newspaper, href: '/admin/news', color: 'text-accent' },
  ];

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Overview of your website content and health" />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <AdminCard className="hover:border-primary/30 transition-colors cursor-pointer">
              <stat.icon className={`h-8 w-8 ${stat.color} mb-3`} />
              <div className="text-2xl font-bold text-foreground">{stat.count}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            {statCards.map((s) => (
              <Link key={s.href} href={s.href} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:text-primary transition-colors">
                <span className="text-sm text-foreground">Manage {s.label}</span>
                <span className="text-xs text-muted-foreground">{s.count} items</span>
              </Link>
            ))}
            <Link href="/admin/identity" className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:text-primary transition-colors">
              <span className="text-sm text-foreground">Website Identity & Contact</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link href="/admin/settings" className="flex items-center justify-between py-2 hover:text-primary transition-colors">
              <span className="text-sm text-foreground">System Settings</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Content Overview
          </h2>
          <div className="space-y-3">
            <Link href="/admin/testimonials" className="flex items-center justify-between py-2 border-b border-border hover:text-primary transition-colors">
              <span className="text-sm text-muted-foreground">Testimonials</span>
              <span className="text-sm font-bold text-foreground">{counts.testimonials}</span>
            </Link>
            <Link href="/admin/stats" className="flex items-center justify-between py-2 border-b border-border hover:text-primary transition-colors">
              <span className="text-sm text-muted-foreground">Statistics</span>
              <span className="text-sm font-bold text-foreground">{counts.stats}</span>
            </Link>
            <Link href="/admin/identity" className="flex items-center justify-between py-2 hover:text-primary transition-colors">
              <span className="text-sm text-muted-foreground">Site Identity Settings</span>
              <span className="text-xs text-primary">Configure</span>
            </Link>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { useLocale } from '@/components/layout/locale-provider';
import { useSiteConfig } from '@/lib/use-site-config';
import { localized } from '@/config/i18n.config';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const siteConfig = useSiteConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const companyName = localized(siteConfig.identity.companyName, locale);
  const logoUrl = siteConfig.identity.logo || '/logo.svg';
  const isArabic = locale === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await login(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A1118] px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(50,224,196,0.12),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(27,59,111,0.45),_transparent_42%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#32E0C4]/70 to-transparent" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#32E0C4]/25 bg-[#132030] shadow-2xl shadow-black/30">
            {logoUrl && logoUrl !== '/logo.svg' ? (
              <Image src={logoUrl} alt={companyName} width={48} height={48} className="h-12 w-12 rounded-xl object-contain" unoptimized />
            ) : (
              <span className="text-2xl font-bold text-[#32E0C4]">{companyName.charAt(0)}</span>
            )}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#32E0C4]">{companyName}</p>
          <h1 className="mt-3 text-2xl font-bold text-white">{isArabic ? 'لوحة التحكم' : 'Admin Panel'}</h1>
          <p className="mt-2 text-sm text-white/50">
            {isArabic ? 'سجّل الدخول لإدارة موقعك' : 'Sign in to manage your website'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-[#132030]/90 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#32E0C4]/10 text-[#32E0C4]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{isArabic ? 'دخول آمن' : 'Secure access'}</p>
              <p className="mt-0.5 text-xs text-white/45">{isArabic ? 'بياناتك محمية' : 'Your information is protected'}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">{isArabic ? 'البريد الإلكتروني' : 'Email address'}</label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0A1118]/70 px-11 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#32E0C4]/60 focus:ring-2 focus:ring-[#32E0C4]/15"
                  placeholder="admin@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">{isArabic ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0A1118]/70 px-11 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#32E0C4]/60 focus:ring-2 focus:ring-[#32E0C4]/15"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#32E0C4] px-4 py-3.5 text-sm font-bold text-[#0A1118] transition-all hover:bg-[#6FE5D8] hover:shadow-lg hover:shadow-[#32E0C4]/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isArabic ? 'جارٍ تسجيل الدخول...' : 'Signing in...'}
              </>
            ) : (
              <>
                {isArabic ? 'تسجيل الدخول' : 'Sign in'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

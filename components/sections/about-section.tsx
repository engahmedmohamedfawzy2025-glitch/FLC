'use client';

import { useLocale } from '@/components/layout/locale-provider';
import { useSiteConfig } from '@/lib/use-site-config';
import { useSiteContent } from '@/hooks/use-site-content';
import { localized, t } from '@/config/i18n.config';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { Target, Eye, Users } from 'lucide-react';
import type { Locale, LocalizedString } from '@/types';

export function AboutSection({ locale, title }: { locale: Locale; title?: LocalizedString }) {
  const siteConfig = useSiteConfig();
  const { getText } = useSiteContent(locale);
  const sectionTitle = title ? localized(title, locale) : t('about.title', locale);
  const description = localized(siteConfig.identity.shortDescription, locale);

  const values = [
    {
      icon: Target,
      title: getText('about_mission_title', { ar: 'رسالتنا', en: 'Our Mission' }),
      desc: getText('about_mission_desc', { ar: 'تمكين المؤسسات من تحقيق التحول الرقمي عبر حلول تقنية مبتكرة وموثوقة.', en: 'Empowering enterprises to achieve digital transformation through innovative and reliable technology solutions.' }),
    },
    {
      icon: Eye,
      title: getText('about_vision_title', { ar: 'رؤيتنا', en: 'Our Vision' }),
      desc: getText('about_vision_desc', { ar: 'أن نكون الشريك التقني الأول للمؤسسات الطموحة في المنطقة والعالم.', en: 'To be the leading technology partner for ambitious enterprises in the region and beyond.' }),
    },
    {
      icon: Users,
      title: getText('about_values_title', { ar: 'قيمنا', en: 'Our Values' }),
      desc: getText('about_values_desc', { ar: 'الثقة، الابتكار، الجودة، والالتزام بنتائج استثنائية لعملائنا.', en: 'Trust, innovation, quality, and commitment to exceptional results for our clients.' }),
    },
  ];

  return (
    <section className="section-spacing section-divider bg-background">
      <div className="container-site">
        <ScrollReveal className="max-w-2xl mb-12">
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, i) => (
            <ScrollReveal key={i} delay={i * 100} className="h-full">
              <div className="group flex h-full min-h-[250px] flex-col rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

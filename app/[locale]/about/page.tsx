'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/layout/page-header';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { useSiteConfig } from '@/lib/use-site-config';
import { useSiteContent } from '@/hooks/use-site-content';
import { localized, t } from '@/config/i18n.config';
import { StatsSection } from '@/components/sections/stats-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { AboutStats } from '@/components/lists/about-stats';
import { Target, Eye, Users, Award, ShieldCheck, TrendingUp } from 'lucide-react';
import type { Locale } from '@/types';

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const siteConfig = useSiteConfig();
  const { getText } = useSiteContent(locale);

  const values = [
    { icon: Target, title: getText('about_mission_title', { ar: 'رسالتنا', en: 'Our Mission' }), desc: getText('about_mission_desc', { ar: 'تمكين المؤسسات من تحقيق التحول الرقمي عبر حلول تقنية مبتكرة وموثوقة.', en: 'Empowering enterprises to achieve digital transformation through innovative and reliable technology solutions.' }) },
    { icon: Eye, title: getText('about_vision_title', { ar: 'رؤيتنا', en: 'Our Vision' }), desc: getText('about_vision_desc', { ar: 'أن نكون الشريك التقني الأول للمؤسسات الطموحة في المنطقة والعالم.', en: 'To be the leading technology partner for ambitious enterprises in the region and beyond.' }) },
    { icon: Users, title: getText('about_values_title', { ar: 'قيمنا', en: 'Our Values' }), desc: getText('about_values_desc', { ar: 'الثقة، الابتكار، الجودة، والالتزام بنتائج استثنائية لعملائنا.', en: 'Trust, innovation, quality, and commitment to exceptional results for our clients.' }) },
  ];

  const features = [
    { icon: ShieldCheck, title: getText('about_feature_1_title', { ar: 'موثوقية وأمان', en: 'Reliability & Security' }), desc: getText('about_feature_1_desc', { ar: 'نضمن أعلى معايير الأمان وحماية البيانات', en: 'We guarantee the highest security and data protection standards' }) },
    { icon: Award, title: getText('about_feature_2_title', { ar: 'معايير عالمية', en: 'Global Standards' }), desc: getText('about_feature_2_desc', { ar: 'معتمدون وفق المعايير الدولية', en: 'Certified according to international standards' }) },
    { icon: TrendingUp, title: getText('about_feature_3_title', { ar: 'نتائج ملموسة', en: 'Measurable Results' }), desc: getText('about_feature_3_desc', { ar: 'نحقق عائد استثمار واضح', en: 'We deliver clear return on investment' }) },
  ];

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title={t('about.title', locale)}
          subtitle={localized(siteConfig.identity.shortDescription, locale)}
          breadcrumbs={[{ label: t('nav.about', locale) }]}
        />

        {/* About content */}
        <section className="section-spacing bg-background">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {localized(siteConfig.identity.companyName, locale)}
                </span>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
                  {getText('about_heading', { ar: 'نبني المستقبل الرقمي', en: 'Building the Digital Future' })}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  {getText('about_paragraph_1', { ar: 'منذ تأسيسنا، نلتزم بتقديم حلول تقنية متقدمة تساعد المؤسسات على تحقيق أهدافها. نفهم تحديات السوق المحلي والإقليمي ونقدم حلولاً مصممة خصيصاً لتلبية احتياجاته.', en: 'Since our founding, we have been committed to delivering advanced technology solutions that help enterprises achieve their goals. We understand the local and regional market challenges and provide solutions tailored to meet its needs.' })}
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {getText('about_paragraph_2', { ar: 'فريقنا من أكثر من 120 خبيراً يعمل بشغف على تقديم أفضل الحلول لعملائنا، مع التركيز على الجودة والابتكار والاستدامة.', en: 'Our team of over 120 experts works passionately to deliver the best solutions to our clients, focusing on quality, innovation, and sustainability.' })}
                </p>
              </ScrollReveal>
              <AboutStats locale={locale} />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-spacing bg-surface">
          <div className="container-site">
            <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {getText('about_features_heading', { ar: 'ما الذي يميزنا', en: 'What Sets Us Apart' })}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
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

        {/* Features */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container-site">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feat, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0">
                      <feat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {feat.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <StatsSection locale={locale} />
        <TestimonialsSection locale={locale} />
      </main>
      <Footer />
    </>
  );
}

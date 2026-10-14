'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHeader } from '@/components/layout/page-header';
import { ScrollReveal } from '@/components/layout/scroll-reveal';
import { ContactForm, ContactInfoCard } from '@/components/forms/contact-form';
import { useSiteContent } from '@/hooks/use-site-content';
import { t } from '@/config/i18n.config';
import type { Locale } from '@/types';

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const { getText } = useSiteContent(locale);

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title={t('contact.title', locale)}
          subtitle={t('contact.subtitle', locale)}
          breadcrumbs={[{ label: t('nav.contact', locale) }]}
        />

        <section className="section-spacing bg-background">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ScrollReveal className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {getText('contact_info_heading', { ar: 'معلومات التواصل', en: 'Get in Touch' })}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {getText('contact_info_desc', { ar: 'نحن هنا لمساعدتك. اختر الطريقة المناسبة للتواصل معنا.', en: 'We are here to help. Choose the best way to reach us.' })}
                </p>
                <ContactInfoCard />
              </ScrollReveal>

              <ScrollReveal delay={100} className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {getText('contact_form_heading', { ar: 'أرسل لنا رسالة', en: 'Send Us a Message' })}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {getText('contact_form_desc', { ar: 'املأ النموذج وسيتواصل معك فريقنا قريباً.', en: 'Fill out the form and our team will get back to you shortly.' })}
                </p>
                <ContactForm />
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

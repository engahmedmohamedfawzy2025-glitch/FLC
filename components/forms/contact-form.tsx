'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale } from '@/components/layout/locale-provider';
import { contactFormConfig } from '@/config/media.config';
import { useSiteConfig } from '@/lib/use-site-config';
import { localized, t } from '@/config/i18n.config';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { locale } = useLocale();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const fields = contactFormConfig.fields.filter((f) => f.enabled).sort((a, b) => a.order - b.order);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormValues) => {
    setStatus('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => {
            const isRequired = field.required;
            const error = errors[field.name as keyof ContactFormValues];
            return (
              <div key={field.id} className={cn(field.type === 'textarea' && 'sm:col-span-2')}>
                <label htmlFor={field.id} className="block text-sm font-medium text-foreground mb-1.5">
                  {localized(field.label, locale)}
                  {isRequired && <span className="text-destructive ms-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    {...register(field.name as keyof ContactFormValues)}
                    placeholder={field.placeholder ? localized(field.placeholder, locale) : ''}
                    rows={5}
                    className={cn(
                      'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                      'placeholder:text-muted-foreground/50 resize-none',
                      error && 'border-destructive'
                    )}
                  />
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    {...register(field.name as keyof ContactFormValues)}
                    placeholder={field.placeholder ? localized(field.placeholder, locale) : ''}
                    className={cn(
                      'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                      'placeholder:text-muted-foreground/50',
                      error && 'border-destructive'
                    )}
                  />
                )}
                {error && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {error.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {status === 'success' && (
          <div className="rounded-lg bg-success/10 border border-success/20 px-4 py-3 text-sm text-success flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {localized(contactFormConfig.successMessage, locale)}
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {localized(contactFormConfig.errorMessage, locale)}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground',
            'hover:bg-primary/90 transition-colors disabled:opacity-60'
          )}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('common.sending', locale)}
            </>
          ) : (
            <>
              {t('common.send', locale)}
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export function ContactInfoCard() {
  const { locale, dir } = useLocale();
  const siteConfig = useSiteConfig();
  const info = [
    { icon: Mail, label: { ar: 'البريد الإلكتروني', en: 'Email' }, value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: Phone, label: { ar: 'الهاتف', en: 'Phone' }, value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone}` },
    { icon: MapPin, label: { ar: 'العنوان', en: 'Address' }, value: localized(siteConfig.contact.address, locale) },
    { icon: Clock, label: { ar: 'ساعات العمل', en: 'Business Hours' }, value: localized(siteConfig.contact.businessHours, locale) },
  ];

  return (
    <div className="space-y-4">
      {info.map((item, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <item.icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {localized(item.label, locale)}
            </div>
            {item.href ? (
              <a href={item.href} className="text-sm font-semibold text-foreground hover:text-primary transition-colors" dir={dir === 'rtl' && i === 1 ? 'ltr' : undefined}>
                {item.value}
              </a>
            ) : (
              <div className="text-sm font-semibold text-foreground">{item.value}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import type { MediaPreset, FooterConfig, ContactFormConfig } from '@/types';

export const mediaPresets: Record<string, MediaPreset> = {
  hero: {
    name: 'Hero',
    recommendedWidth: 1920,
    recommendedHeight: 800,
    aspectRatio: '12/5',
  },
  product: {
    name: 'Product',
    recommendedWidth: 1200,
    recommendedHeight: 1200,
    aspectRatio: '1/1',
  },
  news: {
    name: 'News',
    recommendedWidth: 1200,
    recommendedHeight: 675,
    aspectRatio: '16/9',
  },
  project: {
    name: 'Project',
    recommendedWidth: 1600,
    recommendedHeight: 900,
    aspectRatio: '16/9',
  },
  logo: {
    name: 'Logo',
    recommendedWidth: 400,
    recommendedHeight: 160,
    aspectRatio: '5/2',
  },
  avatar: {
    name: 'Avatar',
    recommendedWidth: 200,
    recommendedHeight: 200,
    aspectRatio: '1/1',
  },
};

export const footerConfig: FooterConfig = {
  description: {
    ar: 'شريكك الموثوق في رحلة التحول الرقمي. نقدم حلولاً تقنية متقدمة للمؤسسات الطموحة.',
    en: 'Your trusted partner in digital transformation. We deliver advanced technology solutions for ambitious enterprises.',
  },
  columns: [
    {
      id: 'company',
      title: { ar: 'الشركة', en: 'Company' },
      links: [
        { label: { ar: 'من نحن', en: 'About Us' }, url: '/about' },
        { label: { ar: 'المشاريع', en: 'Projects' }, url: '/projects' },
        { label: { ar: 'الأخبار', en: 'News' }, url: '/news' },
        { label: { ar: 'تواصل معنا', en: 'Contact' }, url: '/contact' },
      ],
    },
    {
      id: 'solutions',
      title: { ar: 'الحلول', en: 'Solutions' },
      links: [
        { label: { ar: 'الحلول السحابية', en: 'Cloud Solutions' }, url: '/solutions/cloud-solutions' },
        { label: { ar: 'الأمن السيبراني', en: 'Cybersecurity' }, url: '/solutions/cybersecurity' },
        { label: { ar: 'الذكاء الاصطناعي', en: 'AI & Data' }, url: '/solutions/ai-data' },
      ],
    },
    {
      id: 'products',
      title: { ar: 'المنتجات', en: 'Products' },
      links: [
        { label: { ar: 'المنتجات', en: 'Products' }, url: '/products' },
        { label: { ar: 'الخدمات', en: 'Services' }, url: '/services' },
      ],
    },
  ],
  legalLinks: [],
  copyright: {
    ar: 'جميع الحقوق محفوظة',
    en: 'All rights reserved',
  },
};

export const contactFormConfig: ContactFormConfig = {
  fields: [
    { id: 'name', name: 'name', label: { ar: 'الاسم', en: 'Name' }, type: 'text', required: true, enabled: true, order: 0, placeholder: { ar: 'اسمك الكامل', en: 'Your full name' } },
    { id: 'company', name: 'company', label: { ar: 'الشركة', en: 'Company' }, type: 'text', required: false, enabled: true, order: 1, placeholder: { ar: 'اسم الشركة', en: 'Company name' } },
    { id: 'email', name: 'email', label: { ar: 'البريد الإلكتروني', en: 'Email' }, type: 'email', required: true, enabled: true, order: 2, placeholder: { ar: 'بريدك الإلكتروني', en: 'Your email' } },
    { id: 'phone', name: 'phone', label: { ar: 'الهاتف', en: 'Phone' }, type: 'tel', required: false, enabled: true, order: 3, placeholder: { ar: 'رقم الهاتف', en: 'Phone number' } },
    { id: 'subject', name: 'subject', label: { ar: 'الموضوع', en: 'Subject' }, type: 'text', required: true, enabled: true, order: 4, placeholder: { ar: 'موضوع الرسالة', en: 'Message subject' } },
    { id: 'message', name: 'message', label: { ar: 'الرسالة', en: 'Message' }, type: 'textarea', required: true, enabled: true, order: 5, placeholder: { ar: 'اكتب رسالتك هنا', en: 'Write your message here' } },
  ],
  successMessage: {
    ar: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
    en: 'Your message has been sent successfully. We will get back to you soon.',
  },
  errorMessage: {
    ar: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    en: 'An error occurred while sending the message. Please try again.',
  },
  destinationEmail: 'contact@technova.example',
};

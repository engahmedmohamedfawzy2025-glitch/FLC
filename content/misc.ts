import type { Client, NewsArticle, Stat, Testimonial } from '@/types';

export const clientsData: Client[] = [
  { id: 'cl-1', name: 'National Bank', logo: 'https://images.pexels.com/photos/10958528/pexels-photo-10958528.jpeg?auto=compress&cs=tinysrgb&h=120&w=200', website: 'https://example.com', description: { ar: 'بنك وطني رائد', en: 'Leading national bank' }, category: 'Finance', order: 0 },
  { id: 'cl-2', name: 'Saudi Energy Co.', logo: 'https://images.pexels.com/photos/15893881/pexels-photo-15893881.jpeg?auto=compress&cs=tinysrgb&h=120&w=200', website: 'https://example.com', description: { ar: 'شركة طاقة كبرى', en: 'Major energy company' }, category: 'Energy', order: 1 },
  { id: 'cl-3', name: 'Riyadh Municipality', logo: 'https://images.pexels.com/photos/1587095/pexels-photo-1587095.jpeg?auto=compress&cs=tinysrgb&h=120&w=200', website: 'https://example.com', description: { ar: 'أمانة الرياض', en: 'Riyadh Municipality' }, category: 'Government', order: 2 },
  { id: 'cl-4', name: 'Gulf Telecom', logo: 'https://images.pexels.com/photos/17489163/pexels-photo-17489163.jpeg?auto=compress&cs=tinysrgb&h=120&w=200', website: 'https://example.com', description: { ar: 'شركة اتصالات', en: 'Telecom company' }, category: 'Telecom', order: 3 },
  { id: 'cl-5', name: 'MedCare Health', logo: 'https://images.pexels.com/photos/8636614/pexels-photo-8636614.jpeg?auto=compress&cs=tinysrgb&h=120&w=200', website: 'https://example.com', description: { ar: 'شركة رعاية صحية', en: 'Healthcare company' }, category: 'Healthcare', order: 4 },
  { id: 'cl-6', name: 'Desert Logistics', logo: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=120&w=200', website: 'https://example.com', description: { ar: 'شركة لوجستية', en: 'Logistics company' }, category: 'Logistics', order: 5 },
  { id: 'cl-7', name: 'TechRetail', logo: 'https://images.pexels.com/photos/6804071/pexels-photo-6804071.jpeg?auto=compress&cs=tinysrgb&h=120&w=200', website: 'https://example.com', description: { ar: 'شركة تجزئة تقنية', en: 'Tech retail company' }, category: 'Retail', order: 6 },
  { id: 'cl-8', name: 'Falcon Industries', logo: 'https://images.pexels.com/photos/31403876/pexels-photo-31403876.jpeg?auto=compress&cs=tinysrgb&h=120&w=200', website: 'https://example.com', description: { ar: 'شركة صناعية', en: 'Industrial company' }, category: 'Manufacturing', order: 7 },
];

export const statsData: Stat[] = [
  { id: 'stat-1', label: { ar: 'سنوات الخبرة', en: 'Years of Experience' }, value: '15', suffix: '+', icon: 'Calendar', order: 0 },
  { id: 'stat-2', label: { ar: 'مشاريع منجزة', en: 'Projects Completed' }, value: '500', suffix: '+', icon: 'Briefcase', order: 1 },
  { id: 'stat-3', label: { ar: 'عميل حول العالم', en: 'Global Clients' }, value: '200', suffix: '+', icon: 'Users', order: 2 },
  { id: 'stat-4', label: { ar: 'خبير في الفريق', en: 'Team Experts' }, value: '120', suffix: '+', icon: 'UserCog', order: 3 },
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Ahmed Al-Rashid',
    role: { ar: 'المدير التقني', en: 'CTO' },
    company: 'National Bank',
    content: {
      ar: 'تِك نوفا حولت بنيتنا التحتية بالكامل. الترحيل السحابي تم بسلاسة ودون أي توقف للخدمة. فريق محترف ومتميز.',
      en: 'TechNova transformed our entire infrastructure. The cloud migration was seamless with zero service downtime. A truly professional team.',
    },
    rating: 5,
    order: 0,
  },
  {
    id: 'test-2',
    author: 'Sarah Al-Otaibi',
    role: { ar: 'مديرة الأمن', en: 'Security Director' },
    company: 'Saudi Energy Co.',
    content: {
      ar: 'منصة نوفا شيلد قدمت لنا حماية لم نكن نتخيلها. الكشف عن التهديدات أصبح فورياً والاستجابة أسرع من أي وقت مضى.',
      en: 'NovaShield platform gave us protection we could only imagine. Threat detection is now instant and response is faster than ever.',
    },
    rating: 5,
    order: 1,
  },
  {
    id: 'test-3',
    author: 'Khalid Al-Harbi',
    role: { ar: 'مدير التحول الرقمي', en: 'Digital Transformation Manager' },
    company: 'Riyadh Municipality',
    content: {
      ar: 'منصة الذكاء الاصطناعي التي طورتها تِك نوفا غيّرت طريقة إدارتنا للمدينة. النتائج فاقت توقعاتنا بشكل كبير.',
      en: 'The AI platform developed by TechNova changed how we manage the city. The results far exceeded our expectations.',
    },
    rating: 5,
    order: 2,
  },
];

export const newsData: NewsArticle[] = [
  {
    id: 'news-1',
    slug: 'technova-launches-new-ai-platform',
    title: { ar: 'تِك نوفا تطلق منصة ذكاء اصطناعي جديدة', en: 'TechNova Launches New AI Platform' },
    excerpt: {
      ar: 'أطلقت تِك نوفا اليوم منصة ذكاء اصطناعي جديدة مصممة للمؤسسات في المنطقة.',
      en: 'TechNova today launched a new AI platform designed for enterprises in the region.',
    },
    content: {
      ar: 'في خطوة جديدة نحو تعزيز قدرات الذكاء الاصطناعي في المنطقة، أطلقت تِك نوفا منصة متقدمة توفر حلولاً ذكية للمؤسسات. المنصة تدعم العربية وتتكامل مع الأنظمة الحالية بسلاسة.',
      en: 'In a new step toward enhancing AI capabilities in the region, TechNova launched an advanced platform providing smart solutions for enterprises. The platform supports Arabic and integrates seamlessly with existing systems.',
    },
    featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [],
    detailedContent: { ar: '', en: '' },
    author: 'TechNova Team',
    date: '2024-09-15',
    category: { ar: 'منتجات', en: 'Products' },
    featured: true,
    seo: {
      title: { ar: 'إطلاق منصة ذكاء اصطناعي جديدة | تِك نوفا', en: 'New AI Platform Launch | TechNova' },
    },
    status: 'published',
    createdAt: '2024-09-15T08:00:00Z',
    updatedAt: '2024-09-15T08:00:00Z',
  },
  {
    id: 'news-2',
    slug: 'technova-signs-strategic-partnership',
    title: { ar: 'تِك نوفا توقع شراكة استراتيجية مع مزود سحابي عالمي', en: 'TechNova Signs Strategic Partnership with Global Cloud Provider' },
    excerpt: {
      ar: 'وقعت تِك نوفا اتفاقية شراكة استراتيجية لتعزيز خدماتها السحابية في المنطقة.',
      en: 'TechNova signed a strategic partnership agreement to enhance its cloud services in the region.',
    },
    content: {
      ar: 'في إطار توسيع شبكة شركائها، وقعت تِك نوفا اتفاقية شراكة استراتيجية مع أحد أكبر مزودي الخدمات السحابية عالمياً. الاتفاقية تهدف إلى تقديم حلول سحابية متقدمة للعملاء في السعودية والمنطقة.',
      en: 'As part of expanding its partner network, TechNova signed a strategic partnership agreement with one of the largest global cloud providers. The agreement aims to deliver advanced cloud solutions to customers in Saudi Arabia and the region.',
    },
    featuredImage: 'https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [],
    detailedContent: { ar: '', en: '' },
    author: 'TechNova Team',
    date: '2024-08-20',
    category: { ar: 'شراكات', en: 'Partnerships' },
    featured: true,
    seo: {
      title: { ar: 'شراكة استراتيجية | تِك نوفا', en: 'Strategic Partnership | TechNova' },
    },
    status: 'published',
    createdAt: '2024-08-20T08:00:00Z',
    updatedAt: '2024-08-20T08:00:00Z',
  },
  {
    id: 'news-3',
    slug: 'technova-achieves-iso-certification',
    title: { ar: 'تِك نوفا تحصل على شهادة الأمن السيبراني ISO 27001', en: 'TechNova Achieves ISO 27001 Cybersecurity Certification' },
    excerpt: {
      ar: 'حصلت تِك نوفا على شهادة ISO 27001 للأمن السيبراني، مما يعزز موقعها كشريك موثوق.',
      en: 'TechNova achieved ISO 27001 cybersecurity certification, strengthening its position as a trusted partner.',
    },
    content: {
      ar: 'تعتبر شهادة ISO 27001 من أهم المعايير الدولية في مجال أمن المعلومات، ونجاح تِك نوفا في الحصول عليها يؤكد التزامها بأعلى معايير الأمان وحماية بيانات العملاء.',
      en: 'ISO 27001 is one of the most important international standards in information security, and TechNova success in achieving it confirms its commitment to the highest security standards and client data protection.',
    },
    featuredImage: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [],
    detailedContent: { ar: '', en: '' },
    author: 'TechNova Team',
    date: '2024-07-10',
    category: { ar: 'إنجازات', en: 'Achievements' },
    featured: false,
    seo: {
      title: { ar: 'شهادة ISO 27001 | تِك نوفا', en: 'ISO 27001 Certification | TechNova' },
    },
    status: 'published',
    createdAt: '2024-07-10T08:00:00Z',
    updatedAt: '2024-07-10T08:00:00Z',
  },
];

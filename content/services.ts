import type { Service } from '@/types';

export const servicesData: Service[] = [
  {
    id: 'srv-1',
    slug: 'consulting',
    title: { ar: 'الاستشارات التقنية', en: 'Technology Consulting' },
    shortDescription: {
      ar: 'استشارات استراتيجية لمساعدتك في اتخاذ القرارات التقنية الصحيحة',
      en: 'Strategic consulting to help you make the right technology decisions',
    },
    description: {
      ar: 'فريقنا من الخبراء يقدم استشارات تقنية احترافية تغطي جميع جوانب البنية التحتية، الأمان، والتحول الرقمي.',
      en: 'Our team of experts provides professional technology consulting covering all aspects of infrastructure, security, and digital transformation.',
    },
    features: [
      { ar: 'تقييم شامل للبنية الحالية', en: 'Comprehensive current state assessment' },
      { ar: 'خارطة طريق تقنية', en: 'Technology roadmap' },
      { ar: 'تحليل الفجوات', en: 'Gap analysis' },
    ],
    icon: 'Lightbulb',
    image: 'https://images.pexels.com/photos/20752572/pexels-photo-20752572.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [],
    detailedContent: { ar: '', en: '' },
    order: 0,
    seo: {
      title: { ar: 'الاستشارات التقنية | تِك نوفا', en: 'Technology Consulting | TechNova' },
    },
    status: 'published',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z',
  },
  {
    id: 'srv-2',
    slug: 'implementation',
    title: { ar: 'التنفيذ والتكامل', en: 'Implementation & Integration' },
    shortDescription: {
      ar: 'تنفيذ وتكامل الحلول التقنية بسلاسة وكفاءة',
      en: 'Seamless and efficient implementation and integration of technology solutions',
    },
    description: {
      ar: 'نضمن تنفيذ وتكامل حلولك التقنية بأعلى معايير الجودة، مع تقليل التوقف عن العمل وضمان التوافق مع أنظمتك الحالية.',
      en: 'We ensure your technology solutions are implemented and integrated to the highest quality standards, minimizing downtime and ensuring compatibility with your existing systems.',
    },
    features: [
      { ar: 'تنفيذ سريع وآمن', en: 'Fast and secure implementation' },
      { ar: 'تكامل مع الأنظمة الحالية', en: 'Integration with existing systems' },
      { ar: 'اختبار شامل', en: 'Comprehensive testing' },
    ],
    icon: 'Wrench',
    image: 'https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [],
    detailedContent: { ar: '', en: '' },
    order: 1,
    seo: {
      title: { ar: 'التنفيذ والتكامل | تِك نوفا', en: 'Implementation & Integration | TechNova' },
    },
    status: 'published',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-06-05T08:00:00Z',
  },
  {
    id: 'srv-3',
    slug: 'managed-services',
    title: { ar: 'الخدمات المدارة', en: 'Managed Services' },
    shortDescription: {
      ar: 'إدارة وصيانة أنظمتك التقنية على مدار الساعة',
      en: '24/7 management and maintenance of your technology systems',
    },
    description: {
      ar: 'نقدم خدمات إدارة وصيانة شاملة لأنظمتك التقنية، مع مراقبة مستمرة ودعم فني على مدار الساعة.',
      en: 'We provide comprehensive management and maintenance services for your technology systems, with continuous monitoring and 24/7 technical support.',
    },
    features: [
      { ar: 'مراقبة 24/7', en: '24/7 monitoring' },
      { ar: 'صيانة وقائية', en: 'Preventive maintenance' },
      { ar: 'دعم فني مستمر', en: 'Continuous technical support' },
    ],
    icon: 'Settings',
    image: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [],
    detailedContent: { ar: '', en: '' },
    order: 2,
    seo: {
      title: { ar: 'الخدمات المدارة | تِك نوفا', en: 'Managed Services | TechNova' },
    },
    status: 'published',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-06-10T08:00:00Z',
  },
  {
    id: 'srv-4',
    slug: 'training',
    title: { ar: 'التدريب والتطوير', en: 'Training & Development' },
    shortDescription: {
      ar: 'بناء قدرات فريقك التقنية من خلال برامج تدريبية احترافية',
      en: 'Building your team technology capabilities through professional training programs',
    },
    description: {
      ar: 'نقدم برامج تدريبية احترافية مصممة لتطوير مهارات فريقك في أحدث التقنيات والأدوات.',
      en: 'We provide professional training programs designed to develop your team skills in the latest technologies and tools.',
    },
    features: [
      { ar: 'برامج مخصصة', en: 'Customized programs' },
      { ar: 'مدربون معتمدون', en: 'Certified trainers' },
      { ar: 'شهادات معتمدة', en: 'Accredited certificates' },
    ],
    icon: 'GraduationCap',
    image: 'https://images.pexels.com/photos/39204813/pexels-photo-39204813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [],
    detailedContent: { ar: '', en: '' },
    order: 3,
    seo: {
      title: { ar: 'التدريب والتطوير | تِك نوفا', en: 'Training & Development | TechNova' },
    },
    status: 'published',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-06-15T08:00:00Z',
  },
];

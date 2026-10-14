/*
# Seed navigation_items, seo_settings, and branding setting

## Overview
- Inserts initial navigation items from the static navigation config
- Inserts SEO settings (title, description, keywords, etc.)
- Inserts branding settings into site_settings key-value table

## Notes
- Uses ON CONFLICT DO NOTHING to be idempotent
- Navigation items use parent_id for hierarchy (solutions children)
*/

-- ============ NAVIGATION_ITEMS ============
-- Parent items
INSERT INTO navigation_items (id, label, href, icon, enabled, sort_order, is_external)
VALUES
  ('00000000-0000-0000-0000-000000000001', '{"ar":"الرئيسية","en":"Home"}', '/', '', true, 0, false),
  ('00000000-0000-0000-0000-000000000002', '{"ar":"من نحن","en":"About"}', '/about', '', true, 1, false),
  ('00000000-0000-0000-0000-000000000003', '{"ar":"الحلول","en":"Solutions"}', '/solutions', '', true, 2, false),
  ('00000000-0000-0000-0000-000000000004', '{"ar":"المنتجات","en":"Products"}', '/products', '', true, 3, false),
  ('00000000-0000-0000-0000-000000000005', '{"ar":"المشاريع","en":"Projects"}', '/projects', '', true, 4, false),
  ('00000000-0000-0000-0000-000000000006', '{"ar":"الخدمات","en":"Services"}', '/services', '', true, 5, false),
  ('00000000-0000-0000-0000-000000000007', '{"ar":"الأخبار","en":"News"}', '/news', '', true, 6, false),
  ('00000000-0000-0000-0000-000000000008', '{"ar":"تواصل معنا","en":"Contact"}', '/contact', '', true, 7, false)
ON CONFLICT (id) DO NOTHING;

-- Solution children (parent = solutions)
INSERT INTO navigation_items (id, label, href, icon, enabled, sort_order, is_external, parent_id)
VALUES
  ('00000000-0000-0000-0000-000000000010', '{"ar":"الحلول السحابية","en":"Cloud Solutions"}', '/solutions/cloud-solutions', 'Cloud', true, 0, false, '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000011', '{"ar":"الأمن السيبراني","en":"Cybersecurity"}', '/solutions/cybersecurity', 'ShieldCheck', true, 1, false, '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000012', '{"ar":"الذكاء الاصطناعي","en":"AI & Data"}', '/solutions/ai-data', 'BrainCircuit', true, 2, false, '00000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- ============ SEO_SETTINGS ============
INSERT INTO seo_settings (key, value) VALUES
  ('title', '{"ar":"تِك نوفا | حلول تقنية متقدمة للمؤسسات","en":"TechNova | Advanced Technology Solutions for Enterprises"}'),
  ('description', '{"ar":"نقدم حلولاً متقدمة في التحول الرقمي، الحلول السحابية، الأمن السيبراني، والذكاء الاصطناعي للمؤسسات في السعودية والمنطقة.","en":"We deliver advanced solutions in digital transformation, cloud, cybersecurity, and AI for enterprises in Saudi Arabia and the region."}'),
  ('keywords', '{"ar":"تحول رقمي, حلول سحابية, أمن سيبراني, ذكاء اصطناعي, السعودية, الرياض","en":"digital transformation, cloud solutions, cybersecurity, AI, Saudi Arabia, Riyadh"}'),
  ('ogImage', '"/og-image.jpg"'),
  ('robots', '"index, follow"'),
  ('canonical', '""')
ON CONFLICT (key) DO NOTHING;

-- ============ BRANDING in site_settings ============
INSERT INTO site_settings (key, value) VALUES
  ('branding', '{"primaryColor":"#49D2C2","secondaryColor":"#1B3A5C","accentColor":"#49D2C2","backgroundColor":"#1A2332","surfaceColor":"#222D3F","textColor":"#E8EDF5","mutedColor":"#8B9BB0","borderColor":"rgba(255, 255, 255, 0.08)","successColor":"#16A34A","warningColor":"#F59E0B","errorColor":"#DC2626","arabicFont":"Tajawal","englishFont":"Inter","headingFont":"Inter","bodyFont":"Inter","borderRadius":"8px","buttonRadius":"8px","cardRadius":"12px","shadowIntensity":"subtle","containerWidth":"1280px","sectionSpacing":"96px"}')
ON CONFLICT (key) DO NOTHING;

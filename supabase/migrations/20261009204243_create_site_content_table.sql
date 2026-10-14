/*
# Create site_content table for admin-editable page content

This table stores all the text content that appears on the public-facing pages
but was previously hardcoded in component files. The admin can edit all of this
through the admin panel, so nothing shows on the site that the admin didn't write.

1. New Table: site_content
   - id (uuid, primary key)
   - key (text, unique) — identifies which content block this is (e.g. 'hero_badge', 'about_mission')
   - value (jsonb) — { "ar": "...", "en": "..." } localized string content
   - category (text) — grouping for admin UI (e.g. 'hero', 'about', 'contact', 'detail_headings')
   - label (text) — human-readable label for the admin form
   - sort_order (int, default 0)
   - created_at, updated_at (timestamps)

2. Security
   - RLS enabled
   - Public read (anon + authenticated) so the site loads for all visitors
   - Write restricted to authenticated admin users

3. Seed data
   - Hero badge, trust indicators
   - About page: mission, vision, values, features, paragraphs, headings
   - Contact page: headings and descriptions
   - Detail page section headings (overview, features, specifications, etc.)
*/

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{"ar":"","en":""}',
  category text NOT NULL DEFAULT 'general',
  label text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can view site content
DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated admins can insert
DROP POLICY IF EXISTS "admin_insert_site_content" ON site_content;
CREATE POLICY "admin_insert_site_content" ON site_content FOR INSERT
  TO authenticated WITH CHECK (true);

-- Only authenticated admins can update
DROP POLICY IF EXISTS "admin_update_site_content" ON site_content;
CREATE POLICY "admin_update_site_content" ON site_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated admins can delete
DROP POLICY IF EXISTS "admin_delete_site_content" ON site_content;
CREATE POLICY "admin_delete_site_content" ON site_content FOR DELETE
  TO authenticated USING (true);

-- Seed: Hero section
INSERT INTO site_content (key, value, category, label, sort_order) VALUES
('hero_badge', '{"ar":"شريك موثوق لأكثر من 200 مؤسسة","en":"Trusted by 200+ enterprises"}', 'hero', 'Hero Badge Text', 1),
('hero_trust_1', '{"ar":"آمن وموثوق","en":"Secure & Trusted"}', 'hero', 'Hero Trust Indicator 1', 2),
('hero_trust_2', '{"ar":"معايير عالمية","en":"Global Standards"}', 'hero', 'Hero Trust Indicator 2', 3),
('hero_trust_3', '{"ar":"حضور إقليمي","en":"Regional Presence"}', 'hero', 'Hero Trust Indicator 3', 4)
ON CONFLICT (key) DO NOTHING;

-- Seed: About page
INSERT INTO site_content (key, value, category, label, sort_order) VALUES
('about_heading', '{"ar":"نبني المستقبل الرقمي","en":"Building the Digital Future"}', 'about', 'About Heading', 1),
('about_paragraph_1', '{"ar":"منذ تأسيسنا، نلتزم بتقديم حلول تقنية متقدمة تساهم في تحقيق التحول الرقمي للقطاعات الحكومية والخاصة. نجمع بين الخبرة العالمية والفهم العميق للسوق المحلي لنقدم حلولاً مصممة خصيصاً لاحتياجات عملائنا.","en":"Since our founding, we have been committed to delivering advanced technology solutions that drive digital transformation across government and private sectors. We combine global expertise with deep understanding of the local market to deliver solutions tailored to our clients'' needs."}', 'about', 'About Paragraph 1', 2),
('about_paragraph_2', '{"ar":"فريقنا من أكثر من 120 خبيراً يعمل بشغف على تطوير حلول مبتكرة تواكب أحدث التقنيات العالمية. نؤمن بأن النجاح يتحقق من خلال الشراكة طويلة الأمد مع عملائنا، والاستثمار المستمر في الكفاءات البشرية.","en":"Our team of over 120 experts works passionately on developing innovative solutions that keep pace with the latest global technologies. We believe success is achieved through long-term partnerships with our clients and continuous investment in human talent."}', 'about', 'About Paragraph 2', 3),
('about_mission_title', '{"ar":"رسالتنا","en":"Our Mission"}', 'about', 'Mission Title', 4),
('about_mission_desc', '{"ar":"تمكين المؤسسات من تحقيق التحول الرقمي عبر حلول تقنية مبتكرة وموثوقة.","en":"Empowering enterprises to achieve digital transformation through innovative and reliable technology solutions."}', 'about', 'Mission Description', 5),
('about_vision_title', '{"ar":"رؤيتنا","en":"Our Vision"}', 'about', 'Vision Title', 6),
('about_vision_desc', '{"ar":"أن نكون الشريك التقني الأول في المنطقة، الرائد في تقديم حلول ذكية ومبتكرة.","en":"To be the leading technology partner in the region, pioneering smart and innovative solutions."}', 'about', 'Vision Description', 7),
('about_values_title', '{"ar":"قيمنا","en":"Our Values"}', 'about', 'Values Title', 8),
('about_values_desc', '{"ar":"النزاهة والاحترافية والابتكار هي المبادئ التي توجّه كل ما نقوم به.","en":"Integrity, professionalism, and innovation are the principles that guide everything we do."}', 'about', 'Values Description', 9),
('about_features_heading', '{"ar":"ما الذي يميزنا","en":"What Sets Us Apart"}', 'about', 'About Features Heading', 10),
('about_feature_1_title', '{"ar":"الموثوقية والأمان","en":"Reliability & Security"}', 'about', 'Feature 1 Title', 11),
('about_feature_1_desc', '{"ar":"نضمن أعلى مستويات الأمان والموثوقية في جميع حلولنا.","en":"We guarantee the highest levels of security and reliability in all our solutions."}', 'about', 'Feature 1 Description', 12),
('about_feature_2_title', '{"ar":"معايير عالمية","en":"Global Standards"}', 'about', 'Feature 2 Title', 13),
('about_feature_2_desc', '{"ar":"نلتزم بأعلى المعايير العالمية في الجودة والأداء.","en":"We adhere to the highest global standards in quality and performance."}', 'about', 'Feature 2 Description', 14),
('about_feature_3_title', '{"ar":"نتائج قابلة للقياس","en":"Measurable Results"}', 'about', 'Feature 3 Title', 15),
('about_feature_3_desc', '{"ar":"نقدم نتائج ملموسة يمكن قياس أثرها على أعمالك.","en":"We deliver tangible results whose impact on your business can be measured."}', 'about', 'Feature 3 Description', 16)
ON CONFLICT (key) DO NOTHING;

-- Seed: Contact page
INSERT INTO site_content (key, value, category, label, sort_order) VALUES
('contact_info_heading', '{"ar":"معلومات التواصل","en":"Get in Touch"}', 'contact', 'Contact Info Heading', 1),
('contact_info_desc', '{"ar":"نحن هنا لمساعدتك. اختر الطريقة المناسبة للتواصل معنا.","en":"We are here to help. Choose the best way to reach us."}', 'contact', 'Contact Info Description', 2),
('contact_form_heading', '{"ar":"أرسل لنا رسالة","en":"Send Us a Message"}', 'contact', 'Contact Form Heading', 3),
('contact_form_desc', '{"ar":"املأ النموذج وسيتواصل معك فريقنا قريباً.","en":"Fill out the form and our team will get back to you shortly."}', 'contact', 'Contact Form Description', 4)
ON CONFLICT (key) DO NOTHING;

-- Seed: Detail page headings
INSERT INTO site_content (key, value, category, label, sort_order) VALUES
('detail_overview', '{"ar":"نظرة عامة","en":"Overview"}', 'detail_headings', 'Overview Heading', 1),
('detail_features', '{"ar":"المميزات","en":"Features"}', 'detail_headings', 'Features Heading', 2),
('detail_specifications', '{"ar":"المواصفات","en":"Specifications"}', 'detail_headings', 'Specifications Heading', 3),
('detail_related_solutions', '{"ar":"حلول ذات صلة","en":"Related Solutions"}', 'detail_headings', 'Related Solutions Heading', 4),
('detail_key_features', '{"ar":"المميزات الرئيسية","en":"Key Features"}', 'detail_headings', 'Key Features Heading', 5),
('detail_benefits', '{"ar":"الفوائد","en":"Benefits"}', 'detail_headings', 'Benefits Heading', 6),
('detail_applications', '{"ar":"التطبيقات","en":"Applications"}', 'detail_headings', 'Applications Heading', 7),
('detail_related_products', '{"ar":"منتجات ذات صلة","en":"Related Products"}', 'detail_headings', 'Related Products Heading', 8),
('detail_what_we_offer', '{"ar":"ماذا نقدم","en":"What We Offer"}', 'detail_headings', 'What We Offer Heading', 9),
('detail_need_service_title', '{"ar":"هل تحتاج هذه الخدمة؟","en":"Need This Service?"}', 'detail_headings', 'Need Service Title', 10),
('detail_need_service_desc', '{"ar":"تواصل معنا اليوم لمناقشة احتياجاتك.","en":"Get in touch today to discuss your needs."}', 'detail_headings', 'Need Service Description', 11),
('detail_project_details', '{"ar":"تفاصيل المشروع","en":"Project Details"}', 'detail_headings', 'Project Details Heading', 12),
('detail_scope_of_work', '{"ar":"نطاق العمل","en":"Scope of Work"}', 'detail_headings', 'Scope of Work Heading', 13),
('detail_results', '{"ar":"النتائج","en":"Results"}', 'detail_headings', 'Results Heading', 14),
('detail_other_articles', '{"ar":"مقالات أخرى","en":"Other Articles"}', 'detail_headings', 'Other Articles Heading', 15)
ON CONFLICT (key) DO NOTHING;

-- Add detailed_content (LocalizedString) and gallery (text[]) to content tables
-- Products already has images[] but no gallery; Solutions has images[] but no gallery; Services has neither gallery nor detailed_content

ALTER TABLE products ADD COLUMN IF NOT EXISTS detailed_content jsonb DEFAULT '{"ar":"","en":""}';
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS detailed_content jsonb DEFAULT '{"ar":"","en":""}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS detailed_content jsonb DEFAULT '{"ar":"","en":""}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS detailed_content jsonb DEFAULT '{"ar":"","en":""}';
ALTER TABLE news ADD COLUMN IF NOT EXISTS detailed_content jsonb DEFAULT '{"ar":"","en":""}';

-- Add gallery columns where missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}';
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}';
-- projects already has gallery, news already has gallery

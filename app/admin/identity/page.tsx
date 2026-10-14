'use client';

import { AdminCard, AdminPageHeader, AdminInput, AdminTextarea, HelpNote, AdminButton } from '@/components/admin/ui';
import { siteConfig } from '@/config/site.config';
import { fetchSiteSettings, saveSettings } from '@/lib/content';
import { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';
import type { SiteIdentity, ContactInfo, SocialLinks } from '@/types';

export default function AdminIdentityPage() {
  const [identity, setIdentity] = useState<SiteIdentity>(siteConfig.identity);
  const [contact, setContact] = useState<ContactInfo>(siteConfig.contact);
  const [social, setSocial] = useState<SocialLinks>(siteConfig.social);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSiteSettings().then((settings) => {
      if (settings?.identity) setIdentity({ ...siteConfig.identity, ...(settings.identity as Partial<SiteIdentity>) });
      if (settings?.contact) setContact({ ...siteConfig.contact, ...(settings.contact as Partial<ContactInfo>) });
      if (settings?.social) setSocial({ ...siteConfig.social, ...(settings.social as Partial<SocialLinks>) });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error } = await saveSettings({ identity, contact, social });
    if (error) {
      setError(error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Website Identity"
        description="Configure your company identity, contact info, and social links"
        action={
          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : saved ? <><Check className="h-4 w-4" /> Saved!</> : 'Save Changes'}
          </AdminButton>
        }
      />

      {error && <div className="mb-4 rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">{error}</div>}

      <div className="space-y-6">
        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Company Identity</h2>
          <p className="text-sm text-muted-foreground mb-4">Basic company information displayed across the website</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="Company Name (Arabic)" value={identity.companyName.ar} onChange={(v) => setIdentity({ ...identity, companyName: { ...identity.companyName, ar: v } })} />
            <AdminInput label="Company Name (English)" value={identity.companyName.en} onChange={(v) => setIdentity({ ...identity, companyName: { ...identity.companyName, en: v } })} />
            <AdminInput label="Legal Name (Arabic)" value={identity.legalName.ar} onChange={(v) => setIdentity({ ...identity, legalName: { ...identity.legalName, ar: v } })} />
            <AdminInput label="Legal Name (English)" value={identity.legalName.en} onChange={(v) => setIdentity({ ...identity, legalName: { ...identity.legalName, en: v } })} />
            <AdminInput label="Tagline (Arabic)" value={identity.tagline.ar} onChange={(v) => setIdentity({ ...identity, tagline: { ...identity.tagline, ar: v } })} />
            <AdminInput label="Tagline (English)" value={identity.tagline.en} onChange={(v) => setIdentity({ ...identity, tagline: { ...identity.tagline, en: v } })} />
            <AdminTextarea label="Short Description (Arabic)" value={identity.shortDescription.ar} onChange={(v) => setIdentity({ ...identity, shortDescription: { ...identity.shortDescription, ar: v } })} rows={3} />
            <AdminTextarea label="Short Description (English)" value={identity.shortDescription.en} onChange={(v) => setIdentity({ ...identity, shortDescription: { ...identity.shortDescription, en: v } })} rows={3} />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Branding Assets</h2>
          <p className="text-sm text-muted-foreground mb-4">Logos, favicon, and social sharing image</p>
          <HelpNote>Put images in the public/ folder. For example: /logo.svg, /favicon.svg, /og-image.jpg</HelpNote>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <AdminInput label="Primary Logo URL" value={identity.logo} onChange={(v) => setIdentity({ ...identity, logo: v })} placeholder="/logo.svg" />
            <AdminInput label="Dark Background Logo" value={identity.logoDark} onChange={(v) => setIdentity({ ...identity, logoDark: v })} />
            <AdminInput label="Favicon" value={identity.favicon} onChange={(v) => setIdentity({ ...identity, favicon: v })} />
            <AdminInput label="Apple Touch Icon" value={identity.appleTouchIcon} onChange={(v) => setIdentity({ ...identity, appleTouchIcon: v })} />
            <AdminInput label="Social Sharing Image" value={identity.socialSharingImage} onChange={(v) => setIdentity({ ...identity, socialSharingImage: v })} />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Contact Information</h2>
          <p className="text-sm text-muted-foreground mb-4">How customers can reach you</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="Email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} type="email" />
            <AdminInput label="Phone" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} />
            <AdminInput label="WhatsApp" value={contact.whatsapp} onChange={(v) => setContact({ ...contact, whatsapp: v })} />
            <AdminInput label="Google Maps URL" value={contact.googleMapsUrl} onChange={(v) => setContact({ ...contact, googleMapsUrl: v })} />
            <AdminTextarea label="Address (Arabic)" value={contact.address.ar} onChange={(v) => setContact({ ...contact, address: { ...contact.address, ar: v } })} rows={2} />
            <AdminTextarea label="Address (English)" value={contact.address.en} onChange={(v) => setContact({ ...contact, address: { ...contact.address, en: v } })} rows={2} />
            <AdminInput label="Business Hours (Arabic)" value={contact.businessHours.ar} onChange={(v) => setContact({ ...contact, businessHours: { ...contact.businessHours, ar: v } })} />
            <AdminInput label="Business Hours (English)" value={contact.businessHours.en} onChange={(v) => setContact({ ...contact, businessHours: { ...contact.businessHours, en: v } })} />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-lg font-bold text-foreground mb-1">Social Media</h2>
          <p className="text-sm text-muted-foreground mb-4">Links to your social profiles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="LinkedIn" value={social.linkedin || ''} onChange={(v) => setSocial({ ...social, linkedin: v })} placeholder="https://linkedin.com/company/..." />
            <AdminInput label="Facebook" value={social.facebook || ''} onChange={(v) => setSocial({ ...social, facebook: v })} />
            <AdminInput label="Instagram" value={social.instagram || ''} onChange={(v) => setSocial({ ...social, instagram: v })} />
            <AdminInput label="X (Twitter)" value={social.x || ''} onChange={(v) => setSocial({ ...social, x: v })} />
            <AdminInput label="YouTube" value={social.youtube || ''} onChange={(v) => setSocial({ ...social, youtube: v })} />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

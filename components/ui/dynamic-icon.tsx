'use client';

import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

type IconName = keyof typeof LucideIcons;

export function DynamicIcon({
  name,
  className = 'h-6 w-6',
  defaultIcon = 'HelpCircle',
  ...props
}: {
  name?: string;
  className?: string;
  defaultIcon?: string;
} & Omit<LucideProps, 'name'>) {
  const iconKey = (name || defaultIcon) as IconName;
  const IconComponent = (LucideIcons[iconKey] || LucideIcons[defaultIcon as IconName]) as React.ComponentType<LucideProps>;
  if (!IconComponent) return null;
  return <IconComponent className={className} {...props} />;
}

'use client';

import { useEffect, useState } from 'react';
import { navigationConfig } from '@/config/navigation.config';
import { fetchNavigationItems } from '@/lib/content';
import type { NavItem, NavigationItemDB } from '@/types';

export function useNavigation(): NavItem[] {
  const [items, setItems] = useState<NavItem[]>(navigationConfig);

  useEffect(() => {
    fetchNavigationItems().then((dbItems) => {
      if (!dbItems || dbItems.length === 0) return;
      setItems(mapDbNavItems(dbItems));
    }).catch(() => {});
  }, []);

  return items;
}

function mapDbNavItems(dbItems: NavigationItemDB[]): NavItem[] {
  const parents = dbItems.filter((item) => !item.parentId);
  const childrenByParent = dbItems.reduce<Record<string, NavigationItemDB[]>>((acc, item) => {
    if (item.parentId) {
      (acc[item.parentId] = acc[item.parentId] || []).push(item);
    }
    return acc;
  }, {});

  return parents
    .filter((p) => p.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((parent) => {
      const children = (childrenByParent[parent.id] || [])
        .filter((c) => c.enabled)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      return {
        id: parent.id,
        label: parent.label,
        type: parent.isExternal ? 'external' as const : 'internal' as const,
        url: parent.href,
        enabled: parent.enabled,
        order: parent.sortOrder,
        icon: parent.icon || undefined,
        children: children.length > 0
          ? children.map((child) => ({
              id: child.id,
              label: child.label,
              url: child.href,
              icon: child.icon || undefined,
              order: child.sortOrder,
            }))
          : undefined,
      };
    });
}

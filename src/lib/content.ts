import type { Locale } from './i18n';
import { getCollection, type CollectionEntry } from 'astro:content';

type CollectionName = 'research' | 'ideas' | 'blog';

export async function getEntriesForLocale<T extends CollectionName>(
  collection: T,
  locale: Locale,
) {
  const all = await getCollection(collection, ({ data }) => !data.draft && data.lang === locale);
  return all.sort((a, b) => {
    const dateA = 'pubDate' in a.data ? a.data.pubDate : a.data.date;
    const dateB = 'pubDate' in b.data ? b.data.pubDate : b.data.date;
    const orderA = 'order' in a.data ? (a.data.order ?? 0) : 0;
    const orderB = 'order' in b.data ? (b.data.order ?? 0) : 0;
    if (orderA !== orderB) return orderB - orderA;
    return dateB.getTime() - dateA.getTime();
  });
}

export function entrySlug(entry: CollectionEntry<'research' | 'ideas' | 'blog'>): string {
  return entry.id.replace(/^(en|zh)\//, '').replace(/\.mdx?$/, '');
}

export function entryUrl(
  collection: CollectionName,
  locale: Locale,
  slug: string,
): string {
  const prefix = locale === 'zh' ? '/zh' : '';
  return `${prefix}/${collection}/${slug}/`;
}

export function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

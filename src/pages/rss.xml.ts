import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../lib/i18n';
import { entrySlug, entryUrl } from '../lib/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.lang === 'en');
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? siteConfig.title,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.summary,
      link: entryUrl('blog', 'en', entrySlug(post)),
    })),
  });
}

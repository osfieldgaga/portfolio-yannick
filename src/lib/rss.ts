import rss from '@astrojs/rss';
import { site } from '../site.config';
import { useT, type Lang } from '../i18n';
import { pages } from '../i18n/routes';
import { getProjects } from './projects';

/** RSS feed of case studies for one language (/rss.xml, /en/rss.xml). */
export async function projectFeed(lang: Lang) {
  const { t } = useT(lang);
  const projects = (await getProjects(lang)).filter((p) => p.hasCase);
  return rss({
    title: t('meta.siteTitle'),
    description: t('meta.homeDescription'),
    site: new URL(pages.home[lang], site.url).href,
    customData: `<language>${lang}</language>`,
    items: projects.map((p) => ({
      title: p.title,
      link: p.href!,
      description: p.entry.data.subtitle ?? p.summary,
      categories: [t(`categories.${p.category}`)],
      ...(p.entry.data.year ? { pubDate: new Date(Date.UTC(p.entry.data.year, 0, 1)) } : {}),
    })),
  });
}

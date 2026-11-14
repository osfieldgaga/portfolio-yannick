import type { Lang } from './index';

/**
 * Localized URLs for static pages. French is served at the root, English under /en/.
 * Each page passes its pair to the layout so the language switcher and hreflang
 * point to the same page in the other language.
 */
export const pages = {
  home: { fr: '/', en: '/en/' },
  about: { fr: '/a-propos/', en: '/en/about/' },
  services: { fr: '/services/', en: '/en/services/' },
  contact: { fr: '/contact/', en: '/en/contact/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type PageKey = keyof typeof pages;
export type Alternates = Record<Lang, string>;

/** Project slugs are the folder name and stay the same in both languages. */
export const projectPath = (lang: Lang, slug: string) => (lang === 'fr' ? `/projets/${slug}/` : `/en/projects/${slug}/`);
export const projectAlternates = (slug: string): Alternates => ({ fr: projectPath('fr', slug), en: projectPath('en', slug) });

export const rssPath = (lang: Lang) => (lang === 'fr' ? '/rss.xml' : '/en/rss.xml');

/** Home-page section anchors (the navigation jumps to these). */
export const sections = {
  work: { fr: 'travaux', en: 'work' },
  services: { fr: 'services', en: 'services' },
  about: { fr: 'a-propos', en: 'about' },
  tools: { fr: 'outils', en: 'tools' },
  contact: { fr: 'contact', en: 'contact' },
} as const satisfies Record<string, Record<Lang, string>>;

export type SectionKey = keyof typeof sections;

export const sectionId = (lang: Lang, s: SectionKey) => sections[s][lang];
export const sectionHref = (lang: Lang, s: SectionKey) => `${pages.home[lang]}#${sections[s][lang]}`;

/** French/English pair for any built URL path (used by the sitemap). */
export function alternatesForPath(path: string): Alternates | undefined {
  for (const p of Object.values(pages)) if (p.fr === path || p.en === path) return { ...p };
  const m = path.match(/^\/projets\/([^/]+)\/$/) ?? path.match(/^\/en\/projects\/([^/]+)\/$/);
  return m ? projectAlternates(m[1]) : undefined;
}

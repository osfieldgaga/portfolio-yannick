/**
 * /llms.txt — a plain-text summary of the site for AI assistants (llmstxt.org).
 * Built from the same texts and projects as the pages, so it never goes out of date.
 */
import type { APIRoute } from 'astro';
import { site } from '../site.config';
import { useT, LANGS, type Lang } from '../i18n';
import { pages, sectionHref } from '../i18n/routes';
import { getProjects } from '../lib/projects';
import { profileLinks } from '../lib/jsonld';

const HEAD: Record<Lang, { pages: string; work: string; contact: string; keywords: string }> = {
  en: { pages: 'Pages', work: 'Selected work', contact: 'Contact', keywords: 'Keywords' },
  fr: { pages: 'Pages', work: 'Travaux', contact: 'Contact', keywords: 'Mots-clés' },
};

export const GET: APIRoute = async ({ site: base }) => {
  const abs = (p: string) => new URL(p, base).href;
  const out: string[] = [];
  const en = useT('en');

  out.push(`# ${site.name}`, '');
  out.push(`> ${en.t('meta.homeDescription')}`, '');
  out.push(
    `${site.name} is a ${en.t('hero.role').replace(' · ', ' and ').toLowerCase()} based in ${site.location.city}, Benin, working in French and English. ` +
      `The site is bilingual: French at ${abs('/')}, English at ${abs('/en/')}.`,
    '',
  );

  // English first (the default language of most assistants), then French.
  for (const lang of ['en', 'fr'] as Lang[]) {
    const { t, d } = useT(lang);
    const h = HEAD[lang];
    out.push(`## ${lang === 'en' ? 'English' : 'Français'}`, '');
    out.push(d.about.bio1, '', d.about.bio2, '');
    out.push(`### ${t('services.title')}`, '');
    for (const s of d.services.items) out.push(`- **${s.t}**${lang === 'fr' ? ' :' : ':'} ${s.d}`);
    out.push('');
    out.push(`### ${h.pages}`, '');
    out.push(`- [${t('nav.work')}](${abs(sectionHref(lang, 'work'))})`);
    out.push(`- [${t('meta.aboutTitle')}](${abs(pages.about[lang])}): ${t('meta.aboutDescription')}`);
    out.push(`- [${t('meta.servicesTitle')}](${abs(pages.services[lang])}): ${t('meta.servicesDescription')}`);
    out.push(`- [${t('meta.contactTitle')}](${abs(pages.contact[lang])}): ${t('meta.contactDescription')}`);
    out.push(`- [CV (PDF)](${abs(site.cv[lang])})`);
    out.push('');
    out.push(`### ${h.work}`, '');
    for (const p of await getProjects(lang)) {
      const cat = t(`categories.${p.category}` as Parameters<typeof t>[0]);
      const year = p.entry.data.year ? `, ${p.entry.data.year}` : '';
      const c = p.entry.data.client;
      const client = c && !c.startsWith(p.title) ? ` — ${c}` : '';
      const name = p.href ? `[${p.title}](${abs(p.href)})` : p.title;
      out.push(`- ${name}${client} (${cat}${year}): ${p.summary}`);
    }
    out.push('');
    out.push(`${h.keywords}: ${d.meta.keywords.join(', ')}`, '');
  }

  out.push('## Contact', '');
  out.push(`- Email: ${site.email}`);
  out.push(`- WhatsApp: https://wa.me/${site.whatsapp}`);
  out.push(`- Contact form: ${abs(pages.contact.en)} (EN), ${abs(pages.contact.fr)} (FR)`);
  for (const href of profileLinks()) out.push(`- ${href}`);
  out.push('');
  out.push('## Optional', '');
  out.push(`- [Sitemap](${abs('/sitemap-index.xml')})`);
  for (const l of LANGS) out.push(`- [RSS (${l.toUpperCase()})](${abs(l === 'fr' ? '/rss.xml' : '/en/rss.xml')})`);
  out.push('');

  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

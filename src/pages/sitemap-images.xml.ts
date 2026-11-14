/**
 * Image sitemap: every project image, attached to the page it appears on, so the
 * work can be found in Google Images. Project images with their own case-study
 * page are listed under that page; the others under the homepage (in both languages).
 * Listed in sitemap-index.xml through `customSitemaps` in astro.config.mjs.
 */
import type { APIRoute } from 'astro';
import { LANGS } from '../i18n';
import { pages } from '../i18n/routes';
import { getProjects, fullSize } from '../lib/projects';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const abs = (p: string) => new URL(p, site).href;
  const byPage = new Map<string, Set<string>>();
  const add = (page: string, img: string) => {
    if (!byPage.has(page)) byPage.set(page, new Set());
    byPage.get(page)!.add(img);
  };

  for (const lang of LANGS) {
    for (const p of await getProjects(lang)) {
      for (const img of p.images) {
        const src = abs(await fullSize(img.src));
        add(abs(pages.home[lang]), src);
        if (p.href) add(abs(p.href), src);
      }
    }
  }

  const urls = [...byPage]
    .map(([loc, imgs]) => `<url><loc>${esc(loc)}</loc>${[...imgs].map((i) => `<image:image><image:loc>${esc(i)}</image:loc></image:image>`).join('')}</url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};

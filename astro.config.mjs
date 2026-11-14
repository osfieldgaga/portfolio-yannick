// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { alternatesForPath } from './src/i18n/routes.ts';
import { todoImages, requireAlt, caseStudyLayout } from './src/lib/markdown/case-study-plugins.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
// SITE_URL lets the audit build against localhost; production uses the real domain.
const SITE = process.env.SITE_URL || 'https://yannickbamona.com';

export default defineConfig({
  site: SITE,
  // Every URL ends with "/" (e.g. /a-propos/). wrangler.jsonc uses the matching
  // html_handling: "force-trailing-slash".
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    // French lives at the root (/), English under /en/.
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // Project images (src/pages/sitemap-images.xml.ts) are listed in the index too.
      customSitemaps: [new URL('/sitemap-images.xml', SITE).href],
      // Each URL lists its French and English versions (hreflang alternates).
      serialize(item) {
        const alt = alternatesForPath(new URL(item.url).pathname);
        if (alt) {
          item.links = [
            { lang: 'fr', url: new URL(alt.fr, SITE).href },
            { lang: 'en', url: new URL(alt.en, SITE).href },
            { lang: 'x-default', url: new URL(alt.fr, SITE).href },
          ];
        }
        return item;
      },
    }),
  ],
  image: {
    // Images in Markdown get a responsive srcset, width/height and lazy-loading.
    layout: 'constrained',
    responsiveStyles: false,
  },
  markdown: {
    processor: satteri({
      mdastPlugins: [todoImages, requireAlt],
      hastPlugins: [caseStudyLayout],
    }),
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { todoImages, requireAlt, caseStudyLayout } from './src/lib/markdown/case-study-plugins.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://yannickbamona.com',
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

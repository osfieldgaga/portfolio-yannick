// @ts-check
import { defineConfig } from 'astro/config';

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
});

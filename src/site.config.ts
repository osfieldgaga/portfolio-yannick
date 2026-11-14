/**
 * Site settings — everything that isn't a project or a translated text.
 * Change a link or an address here; never in a component.
 * Items marked TODO are listed in TODO.md.
 */
export const site = {
  name: 'Yannick Bamona',
  /** Production URL, no trailing slash. Also set as `site` in astro.config.mjs. */
  url: 'https://yannickbamona.com',
  email: 'yannbamona@gmail.com',
  /** International format, digits only (used for https://wa.me/<number>). */
  whatsapp: '2290144154739',

  location: {
    city: 'Cotonou',
    /** ISO 3166-1 country code, used in structured data. */
    country: 'BJ',
    /** HUD line shown at the top of the hero. */
    hud: '06°22′N 002°23′E · UTC+1',
  },

  /** Shown in the contact section and used as `sameAs` in structured data. */
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' }, // TODO: profile URL
    { label: 'Behance', href: 'https://www.behance.net/' }, // TODO: profile URL
    { label: 'Instagram', href: 'https://www.instagram.com/' }, // TODO: profile URL
  ],

  /** CV files in /public/cv/. The download button serves the one matching the page language. */
  cv: {
    fr: '/cv/yannick-bamona-cv-fr.pdf',
    en: '/cv/yannick-bamona-cv-en.pdf',
  },

  /** Default social-sharing image (1200×630) in /public/. Projects use their cover instead. */
  ogImage: '/og-default.jpg',

  /** Cloudflare Web Analytics token. Leave empty to disable analytics entirely. */
  cloudflareAnalyticsToken: '',

  /** Google Search Console "HTML tag" verification token (content="…" value only). */
  googleSiteVerification: '',

  /** Contact form (Web3Forms). Set PUBLIC_WEB3FORMS_KEY in .env or in the Cloudflare build settings. */
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',

  /** Design switches from the reference. */
  hud: {
    /** Red notched frame around the viewport. */
    frame: true,
    /** Hero backdrop: 'grid+stars' | 'grid' | 'stars' | 'none'. Stars only show in dark mode. */
    heroBackdrop: 'grid+stars' as 'grid+stars' | 'grid' | 'stars' | 'none',
  },
} as const;

export type SiteConfig = typeof site;

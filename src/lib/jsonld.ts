/**
 * JSON-LD structured data (schema.org) for search engines.
 * Facts come from site.config.ts and the i18n files only.
 */
import { site } from '../site.config';
import { useT, LANGS, type Lang } from '../i18n';
import { pages, sectionHref } from '../i18n/routes';

const abs = (p: string) => new URL(p, site.url).href;
const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;
const SERVICE_ID = `${site.url}/#service`;

/** Profile links only (skips placeholders like "https://www.linkedin.com/"). */
export const profileLinks = () => site.socials.map((s) => s.href).filter((h) => new URL(h).pathname.length > 1);

const both = (key: Parameters<ReturnType<typeof useT>['t']>[0]) => LANGS.map((l) => ({ '@value': useT(l).t(key), '@language': l }));

const address = {
  '@type': 'PostalAddress',
  addressLocality: site.location.city,
  addressCountry: site.location.country,
};

export function personLd(lang: Lang) {
  const sameAs = profileLinks();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    url: abs(pages.home[lang]),
    jobTitle: both('hero.role'),
    email: `mailto:${site.email}`,
    address,
    knowsLanguage: [
      { '@type': 'Language', name: 'French', alternateName: 'fr' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    url: abs(pages.home[lang]),
    inLanguage: lang,
    publisher: { '@id': PERSON_ID },
  };
}

export function professionalServiceLd(lang: Lang) {
  const { t, d } = useT(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: `${site.name} — ${t('hero.role')}`,
    url: abs(pages.services[lang]),
    description: t('meta.servicesDescription'),
    email: site.email,
    telephone: `+${site.whatsapp}`,
    image: abs(site.ogImage),
    address,
    areaServed: [{ '@type': 'Country', name: 'Benin' }, t('services.areaServed')],
    availableLanguage: ['fr', 'en'],
    founder: { '@id': PERSON_ID },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t('services.title'),
      itemListElement: d.services.items.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.t, description: s.d },
      })),
    },
  };
}

export function creativeWorkLd(opts: { lang: Lang; url: string; name: string; description: string; image?: string; year?: number; genre: string; client?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.name,
    url: abs(opts.url),
    description: opts.description,
    inLanguage: opts.lang,
    creator: { '@id': PERSON_ID, '@type': 'Person', name: site.name },
    genre: opts.genre,
    about: opts.genre,
    ...(opts.image ? { image: abs(opts.image) } : {}),
    ...(opts.year ? { dateCreated: String(opts.year) } : {}),
    ...(opts.client ? { sourceOrganization: { '@type': 'Organization', name: opts.client } } : {}),
  };
}

export function breadcrumbLd(lang: Lang, projectName: string, projectUrl: string) {
  const { t } = useT(lang);
  const items = [
    { name: t('case.breadcrumbHome'), url: pages.home[lang] },
    { name: t('case.breadcrumbWork'), url: sectionHref(lang, 'work') },
    { name: projectName, url: projectUrl },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.url) })),
  };
}

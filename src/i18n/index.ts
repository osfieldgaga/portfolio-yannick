import fr from './fr.json';
import en from './en.json';

export const LANGS = ['fr', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'fr';

/** The French file defines the shape. If en.json misses a key, this line fails type-checking. */
export type Dict = typeof fr;
const dicts: Record<Lang, Dict> = { fr, en };

/** Every dotted path to a string in the dictionary, e.g. "nav.work". Arrays are excluded (use `d`). */
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : T[K] extends readonly unknown[]
      ? never
      : T[K] extends object
        ? Leaves<T[K], `${P}${K}.`>
        : never;
}[keyof T & string];

export type Key = Leaves<Dict>;
type Vars = Record<string, string | number>;

function lookup(d: Dict, key: string): string {
  const v = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], d);
  if (typeof v !== 'string') throw new Error(`[i18n] Missing string "${key}"`);
  return v;
}

export function fill(s: string, vars?: Vars): string {
  return vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;
}

/**
 * const { t, d } = useT('fr');
 * t('nav.work')                     → "Travaux"
 * t('work.showing', { n: 8 })       → "8 projets affichés"
 * d.services.items                  → structured content (arrays)
 */
export function useT(lang: Lang) {
  const d = dicts[lang];
  const t = (key: Key, vars?: Vars) => fill(lookup(d, key), vars);
  return { t, d, lang };
}

export const otherLang = (lang: Lang): Lang => (lang === 'fr' ? 'en' : 'fr');

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && (LANGS as readonly string[]).includes(v);
}

const intlLocale: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB' };

export const formatDate = (lang: Lang, date: Date, opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }) =>
  new Intl.DateTimeFormat(intlLocale[lang], opts).format(date);

export const formatNumber = (lang: Lang, n: number, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat(intlLocale[lang], opts).format(n);

/** Two-digit counters used in the HUD ("01 / 13"). */
export const pad2 = (n: number) => String(n).padStart(2, '0');

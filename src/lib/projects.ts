/**
 * Project data from src/content/projects/<slug>/{fr,en}.md.
 *
 * - A project with only one language file still appears in the other language
 *   (`fallback: true`) and its page shows a notice.
 * - `draft: true` projects appear in `npm run dev` but not in the production build.
 * - Sort: `order` ascending, then `year` descending, then title.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { otherLang, type Lang } from '../i18n';
import { projectPath } from '../i18n/routes';
import type { Category } from './categories';

export { CATEGORIES, type Category } from './categories';

export type ProjectEntry = CollectionEntry<'projects'>;

export interface ProjectImage {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  /** Two-digit position in the full list ("01"). */
  num: string;
  /** Language of the Markdown actually used (differs from the page language when `fallback`). */
  contentLang: Lang;
  fallback: boolean;
  entry: ProjectEntry;
  category: Category;
  title: string;
  summary: string;
  context?: string;
  /** Cover first, then gallery images (without duplicates). Used by the lightbox. */
  images: ProjectImage[];
  cover?: ProjectImage;
  coverBg: string;
  coverFit: 'cover' | 'contain';
  coverPadding: string;
  placeholder?: string;
  /** Has a written case study (non-empty Markdown body) → gets its own page. */
  hasCase: boolean;
  /** Case-study URL in the page language, when hasCase. */
  href?: string;
  featured: boolean;
}

/** Kept for the homepage components. */
export type ProjectCardData = Project;

const isDraftHidden = (e: ProjectEntry) => import.meta.env.PROD && e.data.draft;

let warned = false;
function warnTodos(entries: ProjectEntry[]) {
  if (warned) return;
  warned = true;
  for (const e of entries) {
    const text = JSON.stringify(e.data) + (e.body ?? '');
    const n = (text.match(/\[TODO/gi) ?? []).length;
    if (n) console.warn(`[content] src/content/projects/${e.id}.md has ${n} TODO placeholder${n > 1 ? 's' : ''}`);
  }
}

async function loadGroups() {
  const entries = (await getCollection('projects')).filter((e) => !isDraftHidden(e));
  warnTodos(entries);
  const groups = new Map<string, Partial<Record<Lang, ProjectEntry>>>();
  for (const e of entries) {
    const [slug, lang] = e.id.split('/') as [string, Lang];
    const g = groups.get(slug) ?? {};
    g[lang] = e;
    groups.set(slug, g);
  }
  return groups;
}

function toProject(slug: string, lang: Lang, entry: ProjectEntry, fallback: boolean): Omit<Project, 'num'> {
  const d = entry.data;
  const cover = d.cover ? { src: d.cover, alt: d.coverAlt ?? '' } : undefined;
  const images: ProjectImage[] = cover ? [cover] : [];
  for (const g of d.gallery) {
    if (!images.some((i) => i.src.src === g.src.src)) images.push({ src: g.src, alt: g.alt, caption: g.caption });
  }
  const hasCase = !!entry.body?.trim();
  return {
    slug,
    contentLang: fallback ? otherLang(lang) : lang,
    fallback,
    entry,
    category: d.category,
    title: d.title,
    summary: d.summary,
    context: d.context,
    images,
    cover,
    coverBg: d.coverBg ?? 'var(--surface)',
    coverFit: d.coverFit,
    coverPadding: d.coverPadding ?? (d.coverFit === 'contain' ? '6%' : '0'),
    placeholder: d.placeholder,
    hasCase,
    href: hasCase ? projectPath(lang, slug) : undefined,
    featured: d.featured,
  };
}

/** All projects for a page language, sorted, numbered. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const groups = await loadGroups();
  const list: Omit<Project, 'num'>[] = [];
  for (const [slug, g] of groups) {
    const entry = g[lang] ?? g[otherLang(lang)];
    if (entry) list.push(toProject(slug, lang, entry, !g[lang]));
  }
  list.sort((a, b) => {
    const oa = a.entry.data.order ?? Infinity;
    const ob = b.entry.data.order ?? Infinity;
    if (oa !== ob) return oa - ob;
    const ya = a.entry.data.year ?? 0;
    const yb = b.entry.data.year ?? 0;
    if (ya !== yb) return yb - ya;
    return a.title.localeCompare(b.title, lang);
  });
  return list.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }));
}

/** Alias used by the homepage. */
export const getProjectCards = getProjects;

/** Large image URL for the lightbox (WebP, at most 1600px wide). */
export async function fullSize(img: ImageMetadata): Promise<string> {
  const r = await getImage({ src: img, width: Math.min(1600, img.width), format: 'webp' });
  return r.src;
}

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

export async function lightboxItems(images: ProjectImage[]): Promise<LightboxItem[]> {
  return Promise.all(images.map(async (i) => ({ src: await fullSize(i.src), alt: i.alt, caption: i.caption })));
}

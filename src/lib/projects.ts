/**
 * TEMPORARY (Phase 2): project data copied from the design reference so the
 * homepage can be built. Phase 3 replaces the data source with the Markdown
 * content collection; the exported types and getProjectCards() stay the same.
 */
import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import { projectPath } from '../i18n/routes';

import idylle from '../content/projects/idylle-deco/idylle-deco-logo-on-black.jpg';
import pastryPink from '../content/projects/pastrys-house/pastrys-house-logo-pink.jpg';
import pastryVector from '../content/projects/pastrys-house/pastrys-house-logo-vector.png';
import rick from '../content/projects/rickzadou/rickzadou-crest-yellow.jpg';
import rickDark from '../content/projects/rickzadou/rickzadou-crest-dark.jpg';
import jojo from '../content/projects/jojo-fruity/jojo-fruity-logo.png';
import jojoSet from '../content/projects/jojo-fruity/jojo-fruity-icon-set.jpg';
import typo from '../content/projects/nothing-can-stop-a-good-idea/typographic-poster.jpg';
import child from '../content/projects/child-portrait/child-portrait-digital-painting.jpg';
import space from '../content/projects/space-landscape/space-landscape.jpg';
import floralSketch from '../content/projects/floral-pattern-series/floral-pencil-sketch.jpg';
import floral1 from '../content/projects/floral-pattern-series/floral-pattern-yellow.jpg';
import floral2 from '../content/projects/floral-pattern-series/floral-pattern-salmon.jpg';

export const CATEGORIES = ['brand-identity', 'campaigns-posters', 'illustration', '3d-motion', 'sketchbook'] as const;
export type Category = (typeof CATEGORIES)[number];

export interface ProjectImage {
  src: ImageMetadata;
  alt: string;
}

export interface ProjectCardData {
  slug: string;
  /** Two-digit position in the full list ("01"). */
  num: string;
  category: Category;
  title: string;
  summary: string;
  /** Small right-aligned label on the card (agency or "Freelance"). */
  context?: string;
  images: ProjectImage[];
  /** Image shown on the card; undefined → "Image to come" placeholder. */
  cover?: ProjectImage;
  coverBg: string;
  coverFit: 'cover' | 'contain';
  /** Inner padding for contained logos, e.g. "6%". */
  coverPadding: string;
  /** Label shown on the placeholder card when there is no image. */
  placeholder?: string;
  /** Case-study URL when the project has a written case study. */
  href?: string;
  featured: boolean;
}

type L = Record<Lang, string>;
interface Raw {
  slug: string;
  category: Category;
  title: string | L;
  summary: L;
  context?: string;
  bg?: string;
  fit?: 'cover' | 'contain';
  pad?: string;
  cover?: number;
  imgs?: { src: ImageMetadata; alt: L }[];
  ph?: L;
  hasCase?: boolean;
  featured?: boolean;
}

const RAW: Raw[] = [
  { slug: 'idylle-deco', category: 'brand-identity', title: 'Idylle Déco', context: 'Freelance', featured: true, summary: { en: 'Logo for a decoration brand', fr: 'Logo pour une marque de décoration' }, bg: '#000', fit: 'contain', pad: '6%', imgs: [{ src: idylle, alt: { en: 'Idylle Déco logo: flowing iridescent script lettering with a copper swirl, on black', fr: 'Logo Idylle Déco : lettrage script irisé et volute cuivrée, sur fond noir' } }] },
  { slug: 'pastrys-house', category: 'brand-identity', title: 'Pastry’s House', context: 'Freelance', hasCase: true, summary: { en: 'Logo and variations for a bakery', fr: 'Logo et déclinaisons pour une pâtisserie' }, bg: '#a33a6e', fit: 'cover', imgs: [{ src: pastryPink, alt: { en: 'Pastry’s House logo: gold script wordmark under a line-drawn cupcake, on a pink gradient', fr: 'Logo Pastry’s House : logotype script doré sous un cupcake au trait, sur dégradé rose' } }, { src: pastryVector, alt: { en: 'Pastry’s House vector logo with ornamental frame, on white', fr: 'Logo vectoriel Pastry’s House avec cadre ornemental, sur blanc' } }] },
  { slug: 'prometheus', category: 'brand-identity', title: 'Prometheus', summary: { en: 'Logo', fr: 'Logo' }, ph: { en: 'Prometheus logo', fr: 'Logo Prometheus' } },
  { slug: 'rickzadou', category: 'brand-identity', title: 'Rickzadou', summary: { en: 'Crest logo for a custom clothing label', fr: 'Logo blason pour une marque de vêtements sur mesure' }, bg: '#fff24f', fit: 'cover', imgs: [{ src: rick, alt: { en: 'Rickzadou crest: a gold shield with a lion, laurels and a “Custom Clothes Since 1990” ribbon, on split yellow and black', fr: 'Blason Rickzadou : écu doré avec lion, lauriers et ruban « Custom Clothes Since 1990 », sur fond jaune et noir' } }, { src: rickDark, alt: { en: 'Rickzadou crest in gold on black', fr: 'Blason Rickzadou doré sur noir' } }] },
  { slug: 'jojo-fruity', category: 'brand-identity', title: 'Jojo Fruity', summary: { en: 'Logo and fruit icon set', fr: 'Logo et jeu d’icônes fruits' }, bg: '#fff', fit: 'contain', pad: '6%', imgs: [{ src: jojo, alt: { en: 'Jojo Fruity logo: a pot overflowing with illustrated fruit — watermelon, papaya, pineapple, kiwi — above a green script wordmark', fr: 'Logo Jojo Fruity : un pot débordant de fruits illustrés — pastèque, papaye, ananas, kiwi — au-dessus d’un logotype script vert' } }, { src: jojoSet, alt: { en: 'Jojo Fruity fruit icon set on a grid of bright colour blocks', fr: 'Jeu d’icônes fruits Jojo Fruity sur une grille de couleurs vives' } }] },
  { slug: 'men-in-suits', category: 'campaigns-posters', title: 'Men In Suits', context: 'Le Groupe Monarch', summary: { en: 'Campaign posters · Ghana', fr: 'Affiches de campagne · Ghana' }, ph: { en: 'Men In Suits campaign posters', fr: 'Affiches de campagne Men In Suits' } },
  { slug: 'lb-assur', category: 'campaigns-posters', title: 'LB Assur', context: 'Le Groupe Monarch', summary: { en: 'Campaign posters for an insurance agency', fr: 'Affiches de campagne pour un assureur' }, ph: { en: 'LB Assur campaign posters', fr: 'Affiches de campagne LB Assur' } },
  { slug: 'canal-plus', category: 'campaigns-posters', title: 'Canal+', context: 'Atelier Paon', summary: { en: 'Weekly programme posters', fr: 'Affiches hebdomadaires des programmes' }, ph: { en: 'Canal+ weekly posters', fr: 'Affiches hebdomadaires Canal+' } },
  { slug: 'nothing-can-stop-a-good-idea', category: 'campaigns-posters', title: { en: '“Nothing can stop a good idea”', fr: '« Nothing can stop a good idea »' }, summary: { en: 'Typographic poster', fr: 'Affiche typographique' }, bg: '#fff', fit: 'contain', pad: '4%', imgs: [{ src: typo, alt: { en: 'Typographic poster: the words “Nothing can stop a good idea” built from thin teal geometric strokes on white', fr: 'Affiche typographique : les mots « Nothing can stop a good idea » construits en fins traits géométriques turquoise sur blanc' } }] },
  { slug: 'peacock', category: 'illustration', title: { en: 'Peacock', fr: 'Paon' }, summary: { en: 'Digital illustration', fr: 'Illustration numérique' }, ph: { en: 'Peacock illustration', fr: 'Illustration du paon' } },
  { slug: 'child-portrait', category: 'illustration', title: { en: 'Child portrait', fr: 'Portrait d’enfant' }, summary: { en: 'Digital painting', fr: 'Peinture numérique' }, bg: '#fff', fit: 'contain', pad: '4%', imgs: [{ src: child, alt: { en: 'Digital portrait of a smiling young child with curly brown hair', fr: 'Portrait numérique d’un jeune enfant souriant aux cheveux bruns bouclés' } }] },
  { slug: 'space-landscape', category: 'illustration', title: { en: 'Space landscape', fr: 'Paysage spatial' }, summary: { en: 'Digital illustration', fr: 'Illustration numérique' }, bg: '#1f3a36', fit: 'cover', imgs: [{ src: space, alt: { en: 'Teal alien landscape with two large planets, shooting stars and mist over a mountain ridge', fr: 'Paysage extraterrestre turquoise avec deux grandes planètes, des étoiles filantes et de la brume sur une crête' } }] },
  { slug: 'floral-pattern-series', category: 'sketchbook', title: { en: 'Floral pattern series', fr: 'Série de motifs floraux' }, summary: { en: 'Sketch → colour, three versions', fr: 'Du croquis à la couleur, trois versions' }, bg: '#d8cf1f', fit: 'cover', cover: 1, imgs: [{ src: floralSketch, alt: { en: 'Pencil sketch of climbing vines and leaves', fr: 'Croquis au crayon de lianes et de feuilles' } }, { src: floral1, alt: { en: 'Coloured pattern: green vines and red roses on yellow with pink diagonal stripes', fr: 'Motif en couleur : lianes vertes et roses rouges sur fond jaune rayé de rose' } }, { src: floral2, alt: { en: 'Coloured pattern: green vines and red roses on salmon pink with yellow stripes', fr: 'Motif en couleur : lianes vertes et roses rouges sur fond saumon rayé de jaune' } }] },
];

const loc = (v: string | L, lang: Lang) => (typeof v === 'string' ? v : v[lang]);

export async function getProjectCards(lang: Lang): Promise<ProjectCardData[]> {
  return RAW.map((p, i) => {
    const images = (p.imgs ?? []).map((im) => ({ src: im.src, alt: im.alt[lang] }));
    return {
      slug: p.slug,
      num: String(i + 1).padStart(2, '0'),
      category: p.category,
      title: loc(p.title, lang),
      summary: p.summary[lang],
      context: p.context,
      images,
      cover: images[p.cover ?? 0],
      coverBg: p.bg ?? 'var(--surface)',
      coverFit: p.fit ?? 'cover',
      coverPadding: p.pad ?? '0',
      placeholder: p.ph?.[lang],
      href: p.hasCase ? projectPath(lang, p.slug) : undefined,
      featured: !!p.featured,
    };
  });
}

/**
 * Project categories. The order here is the order of the filter buttons.
 * Labels live in src/i18n/{fr,en}.json under "categories".
 *
 *   brand-identity     logos, brand charters, identities
 *   campaigns-posters  campaign, event and programme posters
 *   illustration       digital illustration and painting
 *   3d-motion          3D, motion design and video
 *   sketchbook         sketches and personal studies
 */
export const CATEGORIES = ['brand-identity', 'campaigns-posters', 'illustration', '3d-motion', 'sketchbook'] as const;
export type Category = (typeof CATEGORIES)[number];

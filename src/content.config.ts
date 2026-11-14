/**
 * Content schema. Every project is a folder in src/content/projects/ holding
 * fr.md and/or en.md plus its images. A typo or a missing field fails the build
 * with a message naming the file and the field.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './lib/categories';

const LANG_FILE = /^([a-z0-9-]+)\/(fr|en)\.md$/;

const projects = defineCollection({
  loader: glob({
    pattern: '*/{fr,en}.md',
    base: './src/content/projects',
    // id = "folder/lang", e.g. "idylle-deco/fr"
    generateId: ({ entry }) => {
      const m = entry.replace(/\\/g, '/').match(LANG_FILE);
      if (!m) {
        throw new Error(
          `[content] "${entry}": project folders must be lowercase letters, digits and hyphens (e.g. "idylle-deco"), and files must be fr.md or en.md.`,
        );
      }
      return `${m[1]}/${m[2]}`;
    },
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1, 'title is required'),
        client: z.string().optional(),
        year: z.number().int().min(1990).max(2100).optional(),
        category: z.enum(CATEGORIES, {
          error: () => `category must be one of: ${CATEGORIES.join(', ')}`,
        }),
        role: z.string().optional(),
        tools: z.array(z.string()).default([]),
        /** Small label on the card's top-right, e.g. the agency or "Freelance". */
        context: z.string().optional(),

        cover: image().optional(),
        coverAlt: z.string().optional(),
        /** Background behind the cover in cards (any CSS colour). */
        coverBg: z.string().optional(),
        /** "cover" fills the frame; "contain" shows the whole image (logos). */
        coverFit: z.enum(['cover', 'contain']).default('cover'),
        /** Padding around a contained cover, e.g. "6%". */
        coverPadding: z.string().optional(),
        /** Caption under the cover on the case-study page. */
        coverCaption: z.string().optional(),
        /** Label for the "image to come" card when there is no cover yet. */
        placeholder: z.string().optional(),

        summary: z
          .string()
          .min(1, 'summary is required (one or two sentences, used on cards and as the meta description)'),
        /** Optional longer line under the case-study title; also used as the meta description. */
        subtitle: z.string().optional(),
        featured: z.boolean().default(false),
        order: z.number().optional(),

        gallery: z
          .array(
            z.object({
              src: image(),
              alt: z.string().min(1, 'every gallery image needs alt text'),
              caption: z.string().optional(),
              /** Tile background (any CSS colour), e.g. for logos on different grounds. */
              bg: z.string().optional(),
              fit: z.enum(['cover', 'contain']).default('contain'),
            }),
          )
          .default([]),
        /** Heading above the gallery. Defaults to "Gallery" / "Galerie". */
        galleryTitle: z.string().optional(),

        draft: z.boolean().default(false),
      })
      .refine((d) => !d.cover || !!d.coverAlt?.trim(), {
        message: 'coverAlt is required when a cover image is set (describe the image for screen readers)',
        path: ['coverAlt'],
      }),
});

export const collections = { projects };

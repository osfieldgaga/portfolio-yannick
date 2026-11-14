import { getImage } from 'astro:assets';
import type { Project } from './projects';

export interface OgImage {
  src: string;
  width: number;
  height: number;
}

/**
 * Social-sharing image (1.91:1, up to 1200×630) cropped from a project's cover.
 * Astro never upscales, so a smaller cover gives a smaller image with the same ratio.
 */
export async function projectOgImage(p: Project): Promise<OgImage | undefined> {
  if (!p.cover) return undefined;
  const src = p.cover.src;
  // Largest 1200:630 box that fits inside the original.
  const width = Math.min(1200, src.width, Math.floor((src.height * 1200) / 630));
  const height = Math.round((width * 630) / 1200);
  const img = await getImage({ src, width, height, fit: 'cover', format: 'jpg', quality: 82 });
  return { src: img.src, width, height };
}

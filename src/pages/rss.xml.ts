import type { APIRoute } from 'astro';
import { projectFeed } from '../lib/rss';

export const GET: APIRoute = () => projectFeed('fr');

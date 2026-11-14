/**
 * robots.txt — everything is open to search engines and AI assistants.
 *
 * `User-agent: *` already allows every crawler; the named groups below make the
 * intent explicit for the main AI crawlers (some services only look for their own
 * name). To keep a crawler out, change its `Allow: /` to `Disallow: /`.
 *
 * Content-Signal (contentsignals.org) states how the content may be used:
 *   search    — appear in search results
 *   ai-input  — be used to answer questions in AI assistants (with a link back)
 *   ai-train  — be used to train AI models  → set to "no" to opt out of training
 *
 * Note: Cloudflare can add its own rules in front of this file (Security → Bots:
 * "Block AI bots" and "Manage robots.txt"). Keep both off, see README §6.
 */
import type { APIRoute } from 'astro';

const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes';

const AI_CRAWLERS = [
  // OpenAI (ChatGPT search, browsing, training)
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  // Anthropic (Claude)
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google (Gemini) and Apple (Apple Intelligence)
  'Google-Extended',
  'Applebot-Extended',
  // Microsoft Copilot uses Bingbot; others
  'Bingbot',
  'DuckAssistBot',
  'MistralAI-User',
  'meta-externalagent',
  'Amazonbot',
  'CCBot',
];

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const llms = new URL('llms.txt', site).href;
  const body = [
    '# Yannick Bamona — portfolio. Open to search engines and AI assistants.',
    `# Summary for AI assistants: ${llms}`,
    '',
    'User-agent: *',
    `Content-Signal: ${CONTENT_SIGNAL}`,
    'Allow: /',
    '',
    ...AI_CRAWLERS.map((ua) => `User-agent: ${ua}`),
    `Content-Signal: ${CONTENT_SIGNAL}`,
    'Allow: /',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

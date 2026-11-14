# Content to provide

Placeholders currently on the site. Each line says where to change it.

## Links and settings — `src/site.config.ts`
- [ ] LinkedIn profile URL (currently https://www.linkedin.com/)
- [ ] Behance profile URL (currently https://www.behance.net/)
- [ ] Instagram profile URL (currently https://www.instagram.com/)
  (Placeholder URLs are left out of the structured data until they point to a real profile.)
- [ ] Cloudflare Web Analytics token (optional; analytics stay off while empty)
- [ ] Google Search Console verification token (optional)
- [ ] Web3Forms access key → `PUBLIC_WEB3FORMS_KEY` in `.env` and in the Cloudflare build settings
- [ ] PostHog: project API key → `PUBLIC_POSTHOG_KEY` (in `.env` and the Cloudflare build settings), and confirm the region (`PUBLIC_POSTHOG_HOST`, EU by default)
- [ ] PostHog: turn on "Cookieless server hash mode" in Project settings, or the cookieless events are dropped
- [ ] Optional: replace the default share image `public/og-default.jpg` (1200×630, source in `scripts/og-default.html`)

## Images
- [ ] Portrait photo of Yannick for the About section (currently a hatched placeholder)
- [ ] Prometheus: logo image
- [ ] Men In Suits: campaign posters
- [ ] LB Assur: campaign posters
- [ ] Canal+: weekly posters
- [ ] Peacock: illustration
- [ ] Pastry's House: scans of the pencil sketches (case study, step 01)

## Text
The build prints every Markdown file that still contains a `[TODO` marker.

- [ ] Pastry's House case study (`src/content/projects/pastrys-house/`), outcome: where the logo is used today, and a short quote from the owner
- [ ] Idylle Déco case study (`src/content/projects/idylle-deco/`): subtitle, brief, process, outcome, year and tools
- [ ] Year for each project (only Pastry's House, 2023, is known from the design). Add `year: 2024` to the project's fr.md and en.md.

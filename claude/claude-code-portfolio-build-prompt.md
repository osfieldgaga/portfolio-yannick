# Claude Code prompt: build yannickbamona.com from the Claude Design output

> Paste everything below the line into Claude Code. Put the Claude Design HTML files in a `/design-reference` folder at the repo root before you start, and paste the original Claude Design prompt where it says **[PASTE CLAUDE DESIGN PROMPT HERE]**.

---

## Context

You're building the production portfolio site for **Yannick Bamona**, a bilingual (French/English) graphic designer and 2D/3D illustrator based in Cotonou, Benin. Domain: **yannickbamona.com**. The site has two jobs: get him hired (agency and remote design roles) and win freelance clients.

The visual design is **already done**. It lives in `/design-reference/*.html` (exported from Claude Design). This is the original design brief, for context:

[PASTE CLAUDE DESIGN PROMPT HERE]

**The design files are the visual source of truth.** Match layout, spacing, typography, colors, HUD accents (notched corners, red rules, red-dot dividers, tick marks), light/dark mode and responsive behavior as closely as you can. Don't "improve" the design. If something in the reference is ambiguous or broken, ask me before inventing a solution.

## Stack

- **Astro** (latest stable), static output, no client-side framework unless a component really needs one. Ship vanilla JS islands for the theme toggle, filter grid, lightbox, language switcher and mobile nav.
- Plain CSS with custom properties pulled from the design (no Tailwind unless the reference HTML already depends on it). Put all design tokens in one `src/styles/tokens.css`.
- Astro content collections for projects (Markdown), `astro:assets` for image optimization.
- Deploy target: **Cloudflare Workers with Static Assets** (Cloudflare's recommended path for new projects; free, with unmetered bandwidth for static files). Deploy the built files only, with no Worker script:
  - a `wrangler.jsonc` with `assets.directory` set to `./dist`;
  - `not_found_handling: "404-page"` so the custom 404 is served;
  - `html_handling` set to match Astro's trailing-slash setting.
  - Auto-deploy on every push to `main` through Workers Builds connected to the GitHub repo, with preview URLs for other branches.
  - Keep it portable, so Netlify or Vercel would also work.
- Node LTS, `npm`. No paid services required to run the site.

## Requirement 1: projects as Markdown files

Adding a project must be as simple as creating a folder with one or two text files and some images. No code changes.

**Structure:**
```
src/content/projects/
  idylle-deco/
    fr.md
    en.md
    cover.jpg
    01-sketch.jpg
    02-final.png
  pastrys-house/
    fr.md
    ...
```

**Frontmatter schema** (validate it with Zod in `src/content.config.ts` so typos fail the build with a clear message):
```yaml
---
title: "Idylle Déco"
client: "Idylle Déco"
year: 2024
category: brand-identity   # brand-identity | campaigns-posters | illustration | 3d-motion | sketchbook
role: "Logo design, brand identity"
tools: ["Illustrator", "Photoshop"]
cover: ./cover.jpg
coverAlt: "Idylle Déco logo on a cream background"
summary: "One or two sentences. Used in cards and as the SEO meta description."
featured: true             # shows on the homepage
order: 1                   # optional manual sort; otherwise sort by year desc
gallery:                   # optional; images in the body also work
  - src: ./01-sketch.jpg
    alt: "Pencil sketch of the logo concept"
  - src: ./02-final.png
    alt: "Final logo in two colorways"
draft: false
---
The case study goes here in Markdown: brief, process, deliverables, outcome.
```

**Rules:**
- `fr.md` and `en.md` share the same folder and images, so images are never duplicated.
- If only one language file exists, the project still shows up in the other language with a small "Disponible en français uniquement" / "Available in English only" notice. The build should not fail.
- Images placed in the Markdown body (`![alt](./image.jpg)`) get optimized too (responsive `srcset`, WebP/AVIF, lazy-loading, width/height to prevent layout shift).
- Images in the case study open in the accessible lightbox from the design (keyboard, swipe, Esc to close, focus trap, focus returns to the trigger on close).
- The category filter on the homepage is generated from the categories that actually have projects. Labels for each category come from the i18n strings file.
- `draft: true` hides a project in production but shows it in `npm run dev`.
- Add a helper script: `npm run new:project -- my-slug` scaffolds the folder with `fr.md` and `en.md` filled with the frontmatter template.

Build the case study pages from the case-study template in the design reference.

## Requirement 2: bilingual French/English, everywhere

- **French is the default locale and is served at the root** (`/`, `/projets/idylle-deco/`). English lives under `/en/` (`/en/projects/idylle-deco/`). Use Astro's built-in i18n routing.
- Localize URL slugs for static pages (`/a-propos/` vs `/en/about/`, `/contact/` vs `/en/contact/`). Project slugs stay the same in both languages (the folder name).
- **All UI text** (nav, buttons, form labels and errors, filter labels, footer, 404, dates, alt text for UI icons) lives in `src/i18n/fr.json` and `src/i18n/en.json`. No hardcoded strings in components. Add a small `t()` helper, typed so a missing key is a build error.
- The language switcher in the header links to **the same page** in the other language, not to the homepage. It sets `hreflang` and `lang` on the link.
- Set `<html lang="fr">` or `<html lang="en">` correctly on every page.
- Remember the visitor's choice (localStorage) only for the switcher state. **Don't** auto-redirect based on browser language, because it breaks SEO and shared links. A dismissible, non-blocking suggestion banner ("This page is also available in English") is fine.
- Dates and numbers are formatted per locale with `Intl`.

## Requirement 3: SEO on every page

Build one `<SEO />` component used by every layout. It takes title, description, image and type, with sensible fallbacks.

- **Unique `<title>` and meta description per page and per language.** Projects use `title` and `summary` from the frontmatter. Static pages take theirs from the i18n files. Pattern: `Idylle Déco · Brand identity | Yannick Bamona`. Warn at build time if a description is missing or longer than ~160 characters.
- `<link rel="canonical">` on every page.
- `hreflang` alternates on every page: `fr`, `en` and `x-default` (pointing to French).
- Open Graph and Twitter Card tags. `og:image` is the project's cover (resized to 1200×630) or a default site image. Set `og:locale` and `og:locale:alternate`.
- **JSON-LD structured data:**
  - Homepage: `Person` (name, jobTitle in both languages, address locality Cotonou, `sameAs` links to Behance/LinkedIn/Instagram, `knowsLanguage`) plus `WebSite`.
  - Project pages: `CreativeWork` (name, creator, dateCreated, image, about/genre) plus `BreadcrumbList`.
  - Services section: `ProfessionalService` with the service list and the area served.
- `@astrojs/sitemap` with i18n alternates, plus `robots.txt` that points to the sitemap.
- One `<h1>` per page and a logical heading order.
- Descriptive image filenames and alt text are required by the schema (`coverAlt`, gallery `alt`), so they can't be skipped.
- An RSS feed of projects per language (`/rss.xml`, `/en/rss.xml`) helps aggregators and Google Discover.
- A bilingual custom 404 page in the site's style.

## Requirement 4: easy for me to maintain

- **One config file**, `src/site.config.ts`, for everything that isn't a project: name, email, WhatsApp number, social links, CV file paths (FR and EN versions), default OG image, analytics ID, Google Search Console verification token. Changing a link should never mean editing a component.
- The **CV PDFs** live in `public/cv/` (`yannick-bamona-cv-fr.pdf`, `yannick-bamona-cv-en.pdf`). The download button serves the one that matches the current page language.
- Write a **README.md** for a non-developer, with these sections: how to run it locally, how to add or edit a project (step by step, with the frontmatter template), how to change texts, how to swap the CV, how to deploy, and what each category slug means.
- The build should fail with readable messages on bad frontmatter, missing images or missing alt text, so mistakes are caught before they go live.

## Requirement 5: contact form without a backend

- Make the form from the design work using **Web3Forms or Formspree** (free tier). Put the access key in `site.config.ts` or an env var. Include a honeypot field for spam.
- Show success and error states in both languages, with client-side validation that matches the accessible error pattern in the design (real labels, `aria-describedby`, focus moves to the first error).
- The WhatsApp button uses a `wa.me` link with a prefilled message in the current language.

## Requirement 6: performance and accessibility (non-negotiable)

- WCAG 2.2 AA, as specified in the design brief: contrast, visible focus, full keyboard navigation, `prefers-reduced-motion`, skip link, form labels.
- Lighthouse targets on mobile: **Performance ≥ 95, Accessibility 100, SEO 100, Best Practices ≥ 95.** Many visitors will be on phones and slow mobile data in West Africa.
- Self-host fonts (WOFF2, `font-display: swap`, preload the one or two critical files, subset if possible). No Google Fonts CDN.
- Ship no JS on pages that don't need it. Don't let the theme toggle cause a flash of the wrong theme (use an inline script in `<head>` that respects `prefers-color-scheme` and the saved choice).
- Privacy-friendly analytics: Cloudflare Web Analytics (no cookies, so no consent banner). Make it optional through the config.

## How to work

Work in phases. **Stop after each phase**, summarize what you did, and wait for me to confirm:

1. **Plan.** Read every file in `/design-reference`. List the pages, components and design tokens you found, anything ambiguous, and your proposed file structure. Don't write code yet.
2. **Foundation.** Set up the Astro project, tokens, fonts, base layout, header/footer, theme toggle, i18n routing and strings, the SEO component and site config. Build the homepage from the reference, filled with placeholder data.
3. **Projects system.** Content collection, schema, project cards plus the filter, case study page, lightbox, the `new:project` script. Create 2 example projects (Idylle Déco, Pastry's House) in both languages with clearly marked placeholder images and text.
4. **Remaining pages.** About, services, contact (with a working form), 404, CV downloads.
5. **SEO and discoverability.** JSON-LD, sitemap, robots, RSS, OG images, build-time warnings.
6. **Polish and deploy.** Run a Lighthouse and accessibility audit (use `axe` or `pa11y` in CI or as an npm script) and fix the issues. Write the README. Add `wrangler.jsonc`, and add step-by-step Cloudflare Workers deploy instructions to the README: connect the GitHub repo in Workers Builds, set the build command and the output folder, and add the custom domain yannickbamona.com.

**Ground rules:**
- Never invent facts about Yannick (clients, years, results). Use obvious placeholders like `[TODO: outcome]` and list them all at the end of each phase.
- Keep dependencies minimal. Explain any package you add.
- Commit after each phase with a clear message.
- If the design reference and this prompt conflict, the design wins on visuals and this prompt wins on functionality. Point out the conflict when it happens.

## Later (don't build now, but don't block it)

- A blog/journal section (`src/content/journal/`) that reuses the same Markdown and i18n pattern. Keep the content config and layouts generic enough that this is a small addition.
- An optional git-based CMS (**Decap CMS** or **Pages CMS**) so Yannick can add projects from a browser without touching files. Structure the frontmatter so it maps cleanly to a CMS schema.

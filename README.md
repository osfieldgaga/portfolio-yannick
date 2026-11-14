# yannickbamona.com

Portfolio of Yannick Bamona, graphic designer and illustrator, in French and English.

- French is the main language, at **/** (`/a-propos/`, `/projets/idylle-deco/`…)
- English is at **/en/** (`/en/about/`, `/en/projects/idylle-deco/`…)

Built with [Astro](https://astro.build): a static site, so there's no database and no server to maintain. Everything you change is a text file.

**Contents**

1. [Run the site on your computer](#1-run-the-site-on-your-computer)
2. [Add or edit a project](#2-add-or-edit-a-project)
3. [Change the texts](#3-change-the-texts)
4. [Change links, email, WhatsApp and settings](#4-change-links-email-whatsapp-and-settings)
5. [Swap the CV](#5-swap-the-cv)
6. [Deploy (Cloudflare)](#6-deploy-cloudflare)
7. [Categories](#7-categories)
8. [Checks before publishing](#8-checks-before-publishing)
9. [Where things are](#9-where-things-are)

---

## 1. Run the site on your computer

You need **Node.js 22.23 or newer** ([nodejs.org](https://nodejs.org), take the "LTS" version).

Open a terminal in the project folder, then:

```bash
npm install      # first time only (and after pulling changes that add packages)
npm run dev      # start the site
```

Open **http://localhost:4321/** (French) or **http://localhost:4321/en/** (English).
Leave the terminal open: every time you save a file, the page updates. Press `Ctrl + C` to stop.

| Command | What it does |
|---|---|
| `npm run dev` | Site on your computer, updates as you edit |
| `npm run build` | Checks everything and builds the final site into `dist/` |
| `npm run preview` | Shows the built `dist/` version (run `npm run build` first) |
| `npm run new:project -- my-slug` | Creates a new project folder (see below) |
| `npm run audit` | Accessibility and speed checks (see [section 8](#8-checks-before-publishing)) |

---

## 2. Add or edit a project

Each project is **one folder** in `src/content/projects/`, holding a French file, an English file and the images:

```
src/content/projects/
  pastrys-house/
    fr.md                          French text
    en.md                          English text
    pastrys-house-logo-pink.jpg    images, shared by both languages
    pastrys-house-logo-vector.png
```

The folder name is the address of the page: `pastrys-house` → `/projets/pastrys-house/` and `/en/projects/pastrys-house/`. Use lowercase letters, digits and hyphens only.

### Step by step

1. Create the folder and both files:

   ```bash
   npm run new:project -- canal-plus-posters
   ```

2. Put your images in `src/content/projects/canal-plus-posters/`. Give them names that describe them (`canal-plus-poster-june.jpg`, not `IMG_2034.jpg`), because Google reads them. JPG or PNG, ideally at least 1600 px wide. The site makes the smaller and faster versions itself.
3. Open `fr.md` and `en.md` and fill in the part between the two `---` lines (the "frontmatter", see the template below), then write the case study under it.
4. Run `npm run dev` and check the project on the homepage and on its page.
5. New projects start with `draft: true`: they show on your computer but not on the live site. Change it to `draft: false` to publish.

**Only one language?** Delete the other file. The project still appears on the other site, with a small notice saying the text is only available in French (or English).

### The frontmatter template

```yaml
---
title: "Idylle Déco"                  # required
client: "Idylle Déco"
year: 2024
category: brand-identity              # required, see section 7
role: "Logo design, brand identity"
tools: ["Illustrator", "Photoshop"]
context: "Freelance"                  # small label on the card (agency or "Freelance")

cover: ./cover.jpg                    # main image (optional: without it the card shows "Image to come")
coverAlt: "Idylle Déco logo on black" # required when there is a cover: describe the image
coverBg: "#000000"                    # colour behind the image on the card
coverFit: contain                     # contain = whole image (logos) · cover = fills the frame (photos)
coverPadding: "6%"                    # space around a "contain" image
coverCaption: "Final logo on black."  # caption under the big image on the project page
placeholder: "Idylle Déco logo"       # label on the "Image to come" card (when there is no cover)

summary: "Logo for a decoration brand"   # required: short line on the card
subtitle: "One sentence under the title on the project page, also shown on Google."
featured: true                        # true = big image at the top of the homepage
order: 1                              # optional: manual order (otherwise newest year first)

gallery:                              # optional: extra images shown at the end of the page
  - src: ./01-sketch.jpg
    alt: "Pencil sketch of the logo concept"   # required for every image
    caption: "Sketch"
    bg: "#ffffff"                     # optional tile colour
galleryTitle: "Variations"            # optional heading above the gallery

draft: false                          # true = only visible on your computer
---
```

Quotes `" "` are needed around text that contains `:` or `#`. When in doubt, use them.

### Writing the case study (under the frontmatter)

The case study is ordinary Markdown. A few patterns give you the page layout from the design:

```markdown
## The brief                      ← each "##" heading starts a numbered section (01, 02…)

Two or three sentences.           ← shown to the right of the heading

## Process

### Sketch                        ← each "###" becomes a step in a 3-column grid ("01 → SKETCH")

![Pencil sketch of the logo](./sketch.jpg "Caption shown under the image")

What happened at this step.

### Vector

![Vector logo on white](./vector.png)

## Deliverables

- Primary logo                    ← lists get the red "//" marks
- Colour variations

## Outcome

[TODO: outcome] …                 ← a paragraph starting with [TODO is shown in a dashed box
```

- **Images:** `![description](./file.jpg)`. The description is **required**: the build stops and tells you which image is missing it. Text in quotes after the file name becomes the caption.
- **An image you don't have yet:** `![Pencil sketches — scans to come](todo:)` shows the hatched "image to come" box.
- **PNG logos** with a transparent background are shown on white; JPG photos fill their frame.
- Every image in the case study opens in the full-screen viewer when clicked.
- **No text under the frontmatter?** The project shows on the homepage (its images open in the viewer) but gets no separate page and no "Read the case study" link.

### If the build complains

The error names the file and the problem, for example:

```
projects → canal-plus-posters/en data does not match collection schema.
  category: category must be one of: brand-identity, campaigns-posters, illustration, 3d-motion, sketchbook
```

```
[content] Missing alt text for image "./cover.jpg" in src/content/projects/canal-plus-posters/en.md.
```

```
[ImageNotFound] Could not find requested image `./nope.jpg`. Does it exist?
```

Fix that line and save. When the site builds, it also lists every file that still contains a `[TODO` marker.

---

## 3. Change the texts

All the texts that aren't projects (menu, homepage sections, buttons, form messages, footer, 404 page) are in two files:

- `src/i18n/fr.json` (French)
- `src/i18n/en.json` (English)

Find the sentence, change it between the quotes, save. Both files must have **the same keys** (the words before the `:`). If one is missing in `en.json`, `npm run build` stops and names it.

Useful places:

| What | Where in the file |
|---|---|
| Hero text under the name | `hero` |
| Services (title, description, tools) | `services.items` |
| About text, experience, education | `about` |
| Tools list | `tools.groups` |
| Contact form labels and error messages | `contact` |
| Page titles and Google descriptions | `meta` (keep descriptions under about 160 characters) |
| Category names | `categories` |

---

## 4. Change links, email, WhatsApp and settings

Everything else is in **`src/site.config.ts`**: email, WhatsApp number, social links, CV files, location line, analytics, the contact form key, and the default image used when a page is shared. Change the value between the quotes and save. You never need to edit a component.

Keys that shouldn't be written in the code go in a file called `.env` at the root of the project (copy `.env.example` to start) and in the Cloudflare settings ([section 6](#6-deploy-cloudflare)):

| Variable | What for |
|---|---|
| `PUBLIC_WEB3FORMS_KEY` | Makes the contact form send emails. Free key at [web3forms.com](https://web3forms.com): enter the address that should receive the messages. Without it, the form only pretends to send on your computer. |
| `PUBLIC_POSTHOG_KEY` | Optional visitor analytics with [PostHog](https://posthog.com). Leave empty to turn it off. |
| `PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` (EU, default) or `https://us.i.posthog.com` (US), depending on where the PostHog project was created. |

**PostHog runs without cookies** (no cookie banner needed). For that to work, in PostHog go to **Project settings** and turn on **"Cookieless server hash mode"**, otherwise PostHog ignores the visits. Besides page views it records: contact form sent, CV downloaded, WhatsApp click, email click, social link click, and portfolio filter used.

The default sharing image is `public/og-default.jpg` (1200 × 630). Its source is `scripts/og-default.html` if you want to remake it.

---

## 5. Swap the CV

Replace the two PDFs in `public/cv/`, **keeping the same names**:

- `public/cv/yannick-bamona-cv-fr.pdf` (served on French pages)
- `public/cv/yannick-bamona-cv-en.pdf` (served on English pages)

If you want different names, change them in `src/site.config.ts` under `cv`.

---

## 6. Deploy (Cloudflare)

The site is hosted for free on **Cloudflare Workers** (static files only, no server code). Once it's set up, every push to `main` on GitHub publishes the site automatically, and other branches get their own preview link.

### First-time setup

1. **Cloudflare account:** sign up at [dash.cloudflare.com](https://dash.cloudflare.com) (free plan).
2. **Connect the repository:**
   1. In the dashboard: **Workers & Pages → Create → Import a repository**.
   2. Connect GitHub and pick `osfieldgaga/portfolio-yannick`.
   3. Settings:
      - **Project name:** `yannickbamona` (must match `name` in `wrangler.jsonc`)
      - **Build command:** `npm run build`
      - **Deploy command:** `npx wrangler deploy` (the default)
      - **Non-production branch deploy command:** `npx wrangler versions upload` (the default; it gives each branch a preview link)
      - **Root directory:** `/`
   4. **Build variables** (under *Advanced settings*, or later in *Settings → Build → Variables*):
      - `PUBLIC_WEB3FORMS_KEY` = your Web3Forms key
      - `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST`, if you use PostHog
      - `NODE_VERSION` = `24`
   5. Click **Deploy**. The first build takes a minute or two, then the site is live on a `*.workers.dev` address.
3. **Preview links for branches:** in the Worker's **Settings → Build**, make sure *Builds for non-production branches* is on. Each branch push then gets its own preview URL, shown on the GitHub commit.

### Custom domain: yannickbamona.com

1. The domain must use Cloudflare's DNS: **Add a domain** in the Cloudflare dashboard, then at your registrar replace the nameservers with the two Cloudflare gives you. This can take a few hours.
2. Open the Worker → **Settings → Domains & Routes → Add → Custom domain** → `yannickbamona.com`. Cloudflare creates the DNS record and the HTTPS certificate.
3. Add `www.yannickbamona.com` the same way, then in **Rules → Redirect Rules** create a redirect from `www.yannickbamona.com/*` to `https://yannickbamona.com/${1}` (301), so there's one address.
4. Optional: **Google Search Console** → add the property `https://yannickbamona.com`, choose the *HTML tag* method, put the `content="…"` value in `googleSiteVerification` in `src/site.config.ts`, push, then submit `https://yannickbamona.com/sitemap-index.xml`.
5. Optional: **Cloudflare Web Analytics** (cookie-free page counts). Create a site in *Analytics & Logs → Web Analytics* and put its token in `cloudflareAnalyticsToken` in `src/site.config.ts`.

### Day to day

Edit, check with `npm run dev`, then commit and push to `main`. Cloudflare rebuilds and publishes. If a build fails (for example a missing alt text), the live site stays as it was and the error shows in the Worker's **Deployments** tab.

### Other hosts

The site is plain static files in `dist/`, so it also works elsewhere: on Netlify or Vercel use build command `npm run build` and output folder `dist`. Netlify reads `public/_headers`; both serve the 404 page.

---

## 7. Categories

Use one of these values for `category:` in a project. The filter buttons on the homepage only show categories that have at least one project. The names shown to visitors come from `categories` in the i18n files.

| `category:` | Shown as (FR / EN) | For |
|---|---|---|
| `brand-identity` | Identité de marque / Brand Identity | Logos, brand charters, identities |
| `campaigns-posters` | Campagnes & affiches / Campaigns & Posters | Campaign, event and programme posters |
| `illustration` | Illustration | Digital illustration and painting |
| `3d-motion` | 3D & motion | 3D, motion design and video |
| `sketchbook` | Carnet de croquis / Sketchbook | Sketches and personal studies |

---

## 8. Checks before publishing

`npm run build` catches content mistakes (missing images, alt texts, wrong category, missing translations).

`npm run audit` goes further (it needs Google Chrome installed):

- builds the site and opens every page in Chrome;
- runs **axe** accessibility checks (WCAG 2.2 AA) on every page, light mode on desktop and dark mode on a phone;
- runs **Lighthouse** on the main pages with phone-speed throttling. Targets: performance ≥ 95, accessibility 100, SEO 100, best practices ≥ 95.

The same audit runs on GitHub for every pull request (`.github/workflows/audit.yml`).

---

## 9. Where things are

```
src/
  content/projects/<slug>/   projects (fr.md, en.md, images)
  i18n/fr.json, en.json      all interface texts
  i18n/routes.ts             page addresses in each language
  site.config.ts             email, links, CV, analytics, form, sharing image
  styles/tokens.css          colours (light and dark), fonts, spacing
  components/                header, footer, cards, lightbox, form, sections…
  views/                     page layouts shared by French and English
  pages/                     one file per address
  lib/                       project loading, structured data, RSS, share images
public/
  cv/                        CV PDFs
  fonts/                     Archivo font files
  og-default.jpg             default sharing image
scripts/
  new-project.mjs            npm run new:project
  audit.mjs                  npm run audit
wrangler.jsonc               Cloudflare settings
TODO.md                      content still to provide
```

The visual design comes from `design-reference/` (exported from Claude Design).

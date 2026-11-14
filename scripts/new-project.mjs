#!/usr/bin/env node
/**
 * Scaffold a new project folder:
 *   npm run new:project -- my-project-slug
 * Creates src/content/projects/my-project-slug/{fr.md,en.md} from the template.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const slug = (process.argv[2] || '').trim();

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    '\nUsage: npm run new:project -- my-project-slug\n\n' +
      'The slug becomes the URL (/projets/my-project-slug/). Use lowercase letters, digits and hyphens only,\n' +
      'e.g. "idylle-deco" or "canal-plus-posters".\n',
  );
  process.exit(1);
}

const dir = join(root, 'src', 'content', 'projects', slug);
if (existsSync(dir)) {
  console.error(`\nThe folder src/content/projects/${slug}/ already exists. Pick another slug or edit that project.\n`);
  process.exit(1);
}

const year = new Date().getFullYear();

const template = (lang) => {
  const fr = lang === 'fr';
  return `---
# ${fr ? 'Titre du projet' : 'Project title'}
title: "${fr ? 'Titre du projet' : 'Project title'}"
client: "${fr ? 'Nom du client' : 'Client name'}"
year: ${year}
# brand-identity | campaigns-posters | illustration | 3d-motion | sketchbook
category: brand-identity
role: "${fr ? 'Création du logo, identité de marque' : 'Logo design, brand identity'}"
tools: ["Illustrator", "Photoshop"]
# ${fr ? 'Petit libellé en haut à droite de la carte (agence ou « Freelance »)' : 'Small label at the top right of the card (agency or "Freelance")'}
context: "Freelance"

# ${fr ? 'Image principale : déposez-la dans ce dossier et indiquez son nom ici.' : 'Main image: drop it in this folder and put its file name here.'}
# cover: ./cover.jpg
# coverAlt: "${fr ? 'Description de l’image pour les lecteurs d’écran' : 'Describe the image for screen readers'}"
# coverBg: "#ffffff"      # ${fr ? 'couleur de fond derrière l’image' : 'background colour behind the image'}
# coverFit: contain       # ${fr ? 'contain = image entière (logos), cover = remplit le cadre' : 'contain = whole image (logos), cover = fills the frame'}
# coverCaption: "${fr ? 'Légende sous l’image' : 'Caption under the image'}"
placeholder: "${fr ? 'Image à venir' : 'Image to come'}"   # ${fr ? 'supprimez cette ligne une fois la couverture ajoutée' : 'delete this line once the cover is added'}

summary: "${fr ? 'Une ou deux phrases. Utilisée sur les cartes et comme description pour Google.' : 'One or two sentences. Used on cards and as the description for Google.'}"
# subtitle: "${fr ? 'Phrase plus longue sous le titre de l’étude de cas (optionnel)' : 'Longer line under the case-study title (optional)'}"
featured: false   # ${fr ? 'true = image à la une sur la page d’accueil' : 'true = featured image on the homepage'}
# order: 20       # ${fr ? 'ordre manuel (sinon : année, la plus récente d’abord)' : 'manual order (otherwise by year, newest first)'}

# ${fr ? 'Images supplémentaires (optionnel)' : 'Extra images (optional)'}
# gallery:
#   - src: ./01-sketch.jpg
#     alt: "${fr ? 'Croquis au crayon du logo' : 'Pencil sketch of the logo concept'}"
#     caption: "${fr ? 'Croquis' : 'Sketch'}"

draft: true   # ${fr ? 'true = visible seulement en local (npm run dev). Passez à false pour publier.' : 'true = only visible locally (npm run dev). Set to false to publish.'}
---

${fr ? `## La demande

Qui est le client, de quoi il avait besoin, et où le résultat sera utilisé.

## Démarche

### Croquis

![Croquis au crayon du logo](todo:)

Ce qui a été exploré au crayon.

### Vectorisation

Le croquis retenu redessiné au propre.

## Livrables

- Logo principal
- Déclinaisons

## Résultat

[TODO: résultat] Où le travail est utilisé aujourd’hui, et une citation du client.` : `## The brief

Who the client is, what they needed, and where the work will be used.

## Process

### Sketch

![Pencil sketch of the logo concept](todo:)

What was explored in pencil.

### Vector

The chosen sketch redrawn cleanly.

## Deliverables

- Primary logo
- Variations

## Outcome

[TODO: outcome] Where the work is used today, and a quote from the client.`}
`;
};

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'fr.md'), template('fr'));
writeFileSync(join(dir, 'en.md'), template('en'));

console.log(`
Created src/content/projects/${slug}/
  fr.md   French text
  en.md   English text

Next:
  1. Put the images in that folder (e.g. cover.jpg).
  2. Fill in both files (or delete one: the project then shows in the other language with a notice).
  3. Run "npm run dev" to preview. Set draft: false to publish.
`);

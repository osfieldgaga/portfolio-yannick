/**
 * Markdown plugins for case studies (Astro 7 / Sätteri plugin API).
 *
 * todoImages (mdast): `![Pencil sketches — scans to come](todo:)` renders the
 *   hatched "image to come" placeholder from the design instead of an image.
 *
 * requireAlt (mdast): fails the build when a body image has no alt text.
 *
 * caseStudyLayout (hast): turns flat Markdown into the case-study structure:
 *   - each `## Heading` and what follows → <section class="cs-section">
 *   - inside a section, each `### Step` and what follows → <div class="cs-step">,
 *     grouped in <div class="cs-steps"> (the 3-up "Process" grid)
 *   - a paragraph holding only an image → <figure> (title → <figcaption>)
 *   - a paragraph starting with "[TODO" → dashed placeholder box
 */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** @type {import('satteri').MdastPluginDefinition} */
export const todoImages = {
  name: 'yb-todo-images',
  image(node, ctx) {
    if (!node.url || !node.url.startsWith('todo:')) return;
    const label = esc(node.alt || 'Image to come');
    ctx.replaceNode(node, {
      type: 'html',
      value: `<span class="cs-ph hatch" role="img" aria-label="${label}"><span class="hatch-label">${label}</span></span>`,
    });
  },
};

/** @type {import('satteri').MdastPluginDefinition} */
export const requireAlt = {
  name: 'yb-require-alt',
  image(node, ctx) {
    if (node.url?.startsWith('todo:')) return;
    if (!node.alt || !node.alt.trim()) {
      const file = ctx.fileURL ? decodeURIComponent(ctx.fileURL.pathname.split('/src/')[1] ?? ctx.fileURL.pathname) : 'a Markdown file';
      throw new Error(
        `\n[content] Missing alt text for image "${node.url}" in src/${file}.\n` +
          `Write a short description between the brackets: ![Pencil sketch of the logo](${node.url})\n`,
      );
    }
  },
};

const isWs = (n) => n.type === 'text' && !n.value.trim();
const el = (tagName, className, children) => ({ type: 'element', tagName, properties: className ? { className: [className] } : {}, children });

/** A <p> whose only meaningful children are images or placeholders. */
function mediaOnly(p) {
  if (p.type !== 'element' || p.tagName !== 'p') return null;
  const kids = p.children.filter((c) => !isWs(c));
  if (!kids.length) return null;
  const ok = kids.every(
    (c) => (c.type === 'element' && c.tagName === 'img') || c.type === 'raw' || (c.type === 'element' && c.properties?.className?.includes?.('cs-ph')),
  );
  return ok ? kids : null;
}

/** Image (or placeholder) → <figure> with the design's notched frame. */
function toFigure(node) {
  const isImg = node.type === 'element' && node.tagName === 'img';
  const frame = el('span', 'notch', [el('span', 'notch-in', [node])]);
  frame.properties.className.push('notch-tl');
  if (!isImg) frame.properties.className.push('notch-soft');
  const children = [frame];
  const title = isImg ? node.properties?.title : undefined;
  if (title) children.push(el('figcaption', null, [{ type: 'text', value: String(title) }]));
  const fig = el('figure', 'cs-figure', children);
  if (isImg) {
    // Logos and artwork with transparency (.png/.svg) sit on white; photos fill the frame.
    const src = String(node.properties?.src ?? '');
    fig.properties.className.push(/\.(png|svg)$/i.test(src) ? 'is-graphic' : 'is-photo');
  } else {
    fig.properties.className.push('is-placeholder');
  }
  return fig;
}

function transformBlock(node) {
  const media = mediaOnly(node);
  if (media) {
    const figs = media.map(toFigure);
    return figs.length === 1 ? figs[0] : el('div', 'cs-figures', figs);
  }
  if (node.type === 'element' && node.tagName === 'p') {
    const first = node.children.find((c) => !isWs(c));
    if (first?.type === 'text' && /^\s*\[TODO/i.test(first.value)) {
      return { ...node, properties: { ...node.properties, className: ['cs-todo'] } };
    }
  }
  return node;
}

function hasMedia(nodes) {
  return nodes.some(
    (n) =>
      n.type === 'element' &&
      (n.tagName === 'figure' || n.tagName === 'img' || (n.properties?.className ?? []).some?.((c) => c === 'cs-figures' || c === 'cs-steps' || c === 'cs-ph')),
  );
}

function buildSection(h2, body) {
  // Group ### steps
  const out = [];
  let steps = null;
  let step = null;
  for (const n of body) {
    if (n.type === 'element' && n.tagName === 'h3') {
      if (!steps) {
        steps = el('div', 'cs-steps', []);
        out.push(steps);
      }
      step = el('div', 'cs-step', [n]);
      steps.children.push(step);
    } else if (step && !isWs(n)) {
      step.children.push(n);
    } else if (!isWs(n)) {
      out.push(n);
    }
  }
  const media = hasMedia(out);
  const section = el('section', 'cs-section', []);
  section.properties.className.push(media ? 'cs-section--media' : 'cs-section--text');
  if (media) {
    section.children = h2 ? [h2, ...out] : out;
  } else {
    section.children = [...(h2 ? [h2] : []), el('div', 'cs-body', out)];
  }
  return section;
}

/** @type {import('satteri').HastPluginDefinition} */
export const caseStudyLayout = {
  name: 'yb-case-study-layout',
  after(root, ctx) {
    // Only case studies get the section layout (a future journal can keep plain prose).
    if (ctx.fileURL && !ctx.fileURL.pathname.includes('/content/projects/')) return;
    const blocks = root.children.filter((n) => !isWs(n)).map(transformBlock);
    const out = [];
    let current = null;
    let currentH2 = null;
    const flush = () => {
      if (current) out.push(buildSection(currentH2, current));
    };
    for (const n of blocks) {
      if (n.type === 'element' && n.tagName === 'h2') {
        flush();
        currentH2 = n;
        current = [];
      } else if (current) {
        current.push(n);
      } else {
        // Content before the first ## heading
        out.push(n);
      }
    }
    flush();
    ctx.setField(root, 'children', out);
  },
};

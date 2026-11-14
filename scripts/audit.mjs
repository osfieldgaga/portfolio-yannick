#!/usr/bin/env node
/**
 * Accessibility and performance audit.
 *   npm run audit
 *
 * 1. Builds the site for http://localhost:4330 and serves it with `astro preview`.
 * 2. Runs axe-core (WCAG 2.2 A/AA + best practices) on every page in the sitemap
 *    plus the 404 page, in light mode on desktop and dark mode on a phone.
 * 3. Runs Lighthouse (mobile, throttled) on the key pages.
 * Exits with an error if axe finds violations or a Lighthouse score is under target.
 *
 * Uses the Chrome installed on the machine (or CHROME_PATH).
 */
import { spawn, execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const require = createRequire(import.meta.url);
const PORT = 4330;
const ORIGIN = `http://localhost:${PORT}`;
const TARGETS = { performance: 95, accessibility: 100, seo: 100, 'best-practices': 95 };
const LH_PAGES = ['/', '/en/', '/projets/pastrys-house/', '/en/contact/'];
const skipBuild = process.argv.includes('--no-build');
const onlyAxe = process.argv.includes('--axe-only');

// ── build & serve ────────────────────────────────────────────────────────────
if (!skipBuild) {
  console.log('Building for', ORIGIN, '…');
  execSync('npx astro build', { stdio: 'ignore', env: { ...process.env, SITE_URL: ORIGIN } });
}
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore', detached: true });
const stopServer = () => {
  try {
    process.kill(-server.pid);
  } catch {}
};
process.on('exit', stopServer);
for (let i = 0; i < 50; i++) {
  try {
    if ((await fetch(ORIGIN)).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 200));
}

const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
pages.push('/this-page-does-not-exist/');

// ── axe via the DevTools protocol ───────────────────────────────────────────
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--disable-gpu'] });
let failures = 0;

async function cdpTab() {
  const res = await fetch(`http://127.0.0.1:${chrome.port}/json/new?about:blank`, { method: 'PUT' });
  const tab = await res.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d);
      pending.delete(d.id);
    } else if (d.method) listeners.forEach((l) => l(d));
  };
  const send = (method, params = {}) =>
    new Promise((r) => {
      const i = ++id;
      pending.set(i, r);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const loaded = () => new Promise((r) => listeners.push((d) => d.method === 'Page.loadEventFired' && r()));
  return { send, loaded, close: () => ws.close(), id: tab.id };
}

const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const modes = [
  { name: 'light · 1280px', width: 1280, height: 900, mobile: false, scheme: 'light' },
  { name: 'dark · 390px', width: 390, height: 844, mobile: true, scheme: 'dark' },
];

console.log(`\naxe-core ${require('axe-core/package.json').version}: ${pages.length} pages × ${modes.length} modes`);
const tab = await cdpTab();
await tab.send('Page.enable');
for (const mode of modes) {
  await tab.send('Emulation.setDeviceMetricsOverride', { width: mode.width, height: mode.height, deviceScaleFactor: 1, mobile: mode.mobile });
  await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: mode.scheme }] });
  for (const path of pages) {
    const loaded = tab.loaded();
    await tab.send('Page.navigate', { url: ORIGIN + path });
    await loaded;
    await new Promise((r) => setTimeout(r, 300));
    await tab.send('Runtime.evaluate', { expression: axeSource });
    const { result } = await tab.send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } })
        .then(r => r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 4).map(n => n.target.join(' ') + (n.failureSummary ? ' — ' + n.failureSummary.split('\\n').slice(1, 2).join(' ').trim() : '')) })))`,
    });
    const violations = result.result.value ?? [];
    if (violations.length) {
      failures += violations.length;
      console.log(`  ✗ ${path} [${mode.name}]`);
      for (const v of violations) {
        console.log(`      ${v.impact} · ${v.id}: ${v.help}`);
        v.nodes.forEach((n) => console.log(`        ${n}`));
      }
    } else console.log(`  ✓ ${path} [${mode.name}]`);
  }
}
tab.close();

// ── Lighthouse ───────────────────────────────────────────────────────────────
if (!onlyAxe) {
  console.log('\nLighthouse (mobile, simulated slow 4G):');
  for (const path of LH_PAGES) {
    const r = await lighthouse(ORIGIN + path, { port: chrome.port, output: 'json', logLevel: 'error' });
    const cats = r.lhr.categories;
    const scores = Object.fromEntries(Object.keys(TARGETS).map((k) => [k, Math.round(cats[k].score * 100)]));
    const bad = Object.entries(TARGETS).filter(([k, min]) => scores[k] < min);
    console.log(`  ${bad.length ? '✗' : '✓'} ${path.padEnd(28)} ` + Object.entries(scores).map(([k, v]) => `${k} ${v}`).join(' · '));
    if (bad.length) {
      failures += bad.length;
      // Show the failing audits for the categories under target
      for (const [k] of bad) {
        for (const ref of cats[k].auditRefs) {
          const a = r.lhr.audits[ref.id];
          if (ref.weight > 0 && a.score !== null && a.score < 0.9) console.log(`      ${k}: ${a.title}${a.displayValue ? ` (${a.displayValue})` : ''}`);
        }
      }
    }
  }
}

await chrome.kill();
stopServer();
console.log(failures ? `\n${failures} problem(s) found.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);

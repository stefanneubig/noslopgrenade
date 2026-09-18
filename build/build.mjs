// Static i18n generator for noslopgrenade.com
// Reads build/template.html + build/locales/<code>.json and emits one
// self-contained page per locale (en -> /, others -> /<path>/), plus a
// localized sitemap.xml. Run locally; commit the output. The deploy stays
// pure static (no build step on Cloudflare).
//
//   node build/build.mjs
//
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE = 'https://noslopgrenade.com';

// Locale config. `code` = json filename, `lang`/`hreflang` = BCP-47 tags,
// `path` = URL path, `name` = native name for the switcher, `og` = og:locale.
const LOCALES = [
  { code: 'en',    lang: 'en',      hreflang: 'en',      path: '/',      name: 'English',    og: 'en_US' },
  { code: 'de',    lang: 'de',      hreflang: 'de',      path: '/de/',    name: 'Deutsch',    og: 'de_DE' },
  { code: 'fr',    lang: 'fr',      hreflang: 'fr',      path: '/fr/',    name: 'Français',   og: 'fr_FR' },
  { code: 'es',    lang: 'es',      hreflang: 'es',      path: '/es/',    name: 'Español',    og: 'es_ES' },
  { code: 'pt-br', lang: 'pt-BR',   hreflang: 'pt-BR',   path: '/pt-br/', name: 'Português',  og: 'pt_BR' },
  { code: 'ja',    lang: 'ja',      hreflang: 'ja',      path: '/ja/',    name: '日本語',      og: 'ja_JP' },
  { code: 'zh',    lang: 'zh-Hans', hreflang: 'zh-Hans', path: '/zh/',    name: '中文',        og: 'zh_CN' },
  { code: 'ko',    lang: 'ko',      hreflang: 'ko',      path: '/ko/',    name: '한국어',      og: 'ko_KR' },
  { code: 'ru',    lang: 'ru',      hreflang: 'ru',      path: '/ru/',    name: 'Русский',    og: 'ru_RU' },
  { code: 'it',    lang: 'it',      hreflang: 'it',      path: '/it/',    name: 'Italiano',   og: 'it_IT' },
  { code: 'nl',    lang: 'nl',      hreflang: 'nl',      path: '/nl/',    name: 'Nederlands', og: 'nl_NL' },
];

const CONTENT_KEYS = [
  'title_tagline', 'meta_desc', 'tagline', 'label_bad', 'label_good', 'user_you', 'user_them',
  'time_q', 'time_bad', 'time_good', 'question', 'slop_preview', 'slop_hidden',
  'more', 'less', 'good_answer', 'h2_what', 'p_what_1', 'p_what_2', 'h2_why',
  'p_why_1', 'p_why_2', 'p_why_3', 'principle', 'baud_intro_pre',
  'baud_intro_post', 'quote', 'share_prompt', 'copied', 'footer_pre', 'footer_post',
];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const template = readFileSync(join(__dirname, 'template.html'), 'utf8');

// Only reference locales whose translation actually exists, so partial builds
// never link to pages that aren't there yet.
const available = LOCALES.filter((l) => existsSync(join(__dirname, 'locales', `${l.code}.json`)));
const skipped = LOCALES.filter((l) => !available.includes(l)).map((l) => l.code);

// hreflang block is identical on every page (all alternates + x-default).
const hreflang = [
  ...available.map((l) => `    <link rel="alternate" hreflang="${l.hreflang}" href="${BASE}${l.path}">`),
  `    <link rel="alternate" hreflang="x-default" href="${BASE}/">`,
].join('\n');

function switcherFor(current) {
  return available.map((l) =>
    l.code === current.code
      ? `<span aria-current="page">${l.name}</span>`
      : `<a href="${l.path}">${l.name}</a>`
  ).join('\n        ');
}

let built = 0;
for (const loc of available) {
  const jsonPath = join(__dirname, 'locales', `${loc.code}.json`);
  const content = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const missing = CONTENT_KEYS.filter((k) => !(k in content) || content[k] === '');
  if (missing.length) {
    throw new Error(`Locale ${loc.code} is missing keys: ${missing.join(', ')}`);
  }

  const pageUrl = BASE + loc.path;
  let html = template
    .replaceAll('{{HREFLANG}}', hreflang)
    .replaceAll('{{SWITCHER}}', switcherFor(loc))
    .replaceAll('{{lang}}', loc.lang)
    .replaceAll('{{og_locale}}', loc.og)
    .replaceAll('{{page_url}}', pageUrl);

  for (const key of CONTENT_KEYS) {
    html = html.replaceAll(`{{${key}}}`, esc(content[key]));
  }

  const leftover = html.match(/\{\{[^}]+\}\}/g);
  if (leftover) throw new Error(`Unreplaced tokens in ${loc.code}: ${[...new Set(leftover)].join(', ')}`);

  const outPath = loc.code === 'en'
    ? join(ROOT, 'index.html')
    : join(ROOT, loc.path.replace(/^\/|\/$/g, ''), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  built++;
  console.log(`  ${loc.code.padEnd(6)} -> ${outPath.replace(ROOT + '/', '')}`);
}

// Localized sitemap: every URL lists all language alternates (xhtml:link).
const altLinks = available.map((l) => `      <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${BASE}${l.path}"/>`).join('\n')
  + `\n      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/"/>`;
const today = process.env.BUILD_DATE || '2026-06-02';
const urls = available.map((l) => `  <url>
    <loc>${BASE}${l.path}</loc>
${altLinks}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l.code === 'en' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap);

console.log(`\nBuilt ${built} pages + sitemap.xml`);
if (skipped.length) console.log(`Skipped (no translation yet): ${skipped.join(', ')}`);

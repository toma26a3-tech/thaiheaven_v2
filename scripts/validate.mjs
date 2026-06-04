import { readFileSync } from 'node:fs';
const files = ['index.html', 'src/app.js', 'src/styles.css'];
for (const file of files) readFileSync(file, 'utf8');
const js = readFileSync('src/app.js', 'utf8');
const css = readFileSync('src/styles.css', 'utf8').replace(/\s+/g, '');
const routes = ['splash','onboarding','home-map','search','search-input','category','filter','venue-overview','venue-roster','venue-reviews','line','my'];
for (const route of routes) {
  if (!js.includes(`'${route}'`) && !js.includes(`"${route}"`)) throw new Error(`Missing route: ${route}`);
}
for (const token of ['--bg:#fbf6ee','--paper:#fffdf8','--ink:#1a1410','--hot:#c8341a','--line:#06c755']) {
  if (!css.includes(token)) throw new Error(`Missing design token: ${token}`);
}
if (css.includes('#tweaks')) throw new Error('tweaks panel CSS must not ship');
console.log(`Validated Thai Heaven prototype-aligned mobile app (${routes.length} routes).`);

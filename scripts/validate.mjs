import { readFileSync } from 'node:fs';
const files = ['index.html', 'src/app.js', 'src/styles.css'];
for (const file of files) readFileSync(file, 'utf8');
const js = readFileSync('src/app.js', 'utf8');
const routes = ['splash','onboarding','home-map','search','category','filters','venue','venue-roster','profile','line','booking','confirmation'];
for (const route of routes) {
  if (!js.includes(`'${route}'`) && !js.includes(`"${route}"`)) throw new Error(`Missing route: ${route}`);
}
console.log(`Validated Thai Heaven static mobile app (${routes.length} routes).`);

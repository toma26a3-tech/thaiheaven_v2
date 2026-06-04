# Thai Heaven Mobile Frontend

A dependency-free mobile web implementation of the Thai Heaven prototype handoff. This revision mirrors the supplied prototype styling more closely: fixed dark stage, brand chrome, flow rail, 320×692 phone frame, static prototype DOM in `index.html` controlled by a prototype-style JS router, paper screens, ink borders, hard offset shadows, editorial zine typography, map sheet, modal filter sheet, and LINE-style handoff.

## Run locally

```bash
npm run dev
```

Then open <http://localhost:5173>.

## Validate

```bash
npm run build
```

The validation script confirms the app files exist, all prototype data-view routes are present, required design tokens are present, and `#tweaks` panel CSS is not included.

## Implemented flow

1. `splash` — 18+ gate with seal animation
2. `onboarding` — 3-step genre, area, notification setup
3. `home-map` — CSS map pins and expandable editor recommendation sheet
4. `search` — active search state, venue/area suggestions, and recent searches
5. `category` — category/list page with filter chips and inline PR slot
6. `filter` — scrim + bottom sheet modal
7. `venue-overview` — hero, save/share, specs, editor note, LINE CTA
8. `venue-roster` — 3-column roster with multi-select CTA
9. `venue-reviews` — rating summary and review cards
10. `line` — LINE-style thread, prefilled template, quick replies, auto-reply
11. `my` — saved/history/profile area

## State and interaction coverage

The app keeps prototype state for route history, onboarding toggles, saved venue affordances, map sheet expansion, selected roster girls, visual filter chips, LINE thread messages, and My tabs. Keyboard shortcuts match the prototype: `Backspace` returns and `r` resets. The onboarding step function is exposed as `window.__onbStep`, and `window.ThaiHeaven` exposes the route helpers for inspection.

## Assets

Photos and host visuals remain CSS placeholders so licensed real assets can be swapped in later. The prototype-only `tweaks.js` panel is intentionally excluded from this production app.

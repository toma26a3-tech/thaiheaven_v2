# Thai Heaven Mobile Frontend

A dependency-free mobile web implementation of the Thai Heaven 12-view handoff. This revision mirrors the supplied prototype styling more closely: fixed dark stage, brand chrome, flow rail, 320×692 phone frame, JS-routed `.vw` views, paper screens, ink borders, hard offset shadows, editorial zine typography, map sheet, modal filter sheet, and LINE-style handoff.

## Run locally

```bash
npm run dev
```

Then open <http://localhost:5173>.

## Validate

```bash
npm run build
```

The validation script confirms the app files exist, all 12 handoff routes are registered, required design tokens are present, and `#tweaks` panel CSS is not included.

## Implemented flow

1. `splash` — 18+ gate with seal animation
2. `onboarding` — 3-step genre, area, notification setup
3. `home-map` — CSS map pins and expandable editor recommendation sheet
4. `search-input` — active search state with cursor treatment
5. `search` — venue, area, and recent-search suggestions
6. `category` — category/list page with filter chips and inline PR slot
7. `filter` — scrim + bottom sheet modal
8. `venue-overview` — hero, save/share, specs, editor note, LINE CTA
9. `venue-roster` — 3-column roster with multi-select CTA
10. `venue-reviews` — rating summary and review cards
11. `line` — LINE-style thread, prefilled template, quick replies, auto-reply
12. `my` — saved/history/profile area

## State and interaction coverage

The app keeps state for age verification, onboarding interests/areas/notifications, route history, saved venues, map sheet expansion, selected roster girls, LINE thread messages, search query, and filter selections. Keyboard shortcuts match the prototype: `Backspace` returns and `r` resets.

## Assets

Photos and host visuals remain CSS placeholders so licensed real assets can be swapped in later. The prototype-only `tweaks.js` panel is intentionally excluded from this production app.

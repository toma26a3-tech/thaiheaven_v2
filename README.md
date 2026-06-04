# Thai Heaven Mobile Frontend

A dependency-free mobile web implementation of the Thai Heaven 12-view handoff. The UI now follows the supplied README tokens: paper background, angular cards, ink borders, hard offset shadows, a `--hot` accent, teal/gold secondary accents, and LINE-green handoff CTAs.

## Run locally

```bash
npm run dev
```

Then open <http://localhost:5173>.

## Validate

```bash
npm run build
```

The validation script confirms the static app files exist, the 12 handoff routes are registered, and the primary design tokens are present.

## Implemented flow

1. `splash` — 18+ gate with seal animation
2. `onboarding` — 3-step genre, area, notification setup
3. `home-map` — map pins and expandable editor recommendation sheet
4. `search-input` — active search-input state
5. `search` — suggestions, areas, and recent searches
6. `category` — category list with active filters and inline PR slot
7. `filter` — modal-style filter sheet
8. `venue-overview` — hero, specs, editor note, LINE CTA
9. `venue-roster` — 3-column roster with multi-select CTA
10. `venue-reviews` — rating summary and review cards
11. `line` — LINE-style thread, template, quick replies, auto-reply
12. `my` — saved/history/profile area

## State and interaction coverage

The app keeps state for age verification, onboarding selections, notification preferences, route history, saved venues, venue tab routing, map sheet expansion, multi-select roster picks, line thread messages, search query, and active filters. Keyboard shortcuts match the prototype: `Backspace` returns and `r` resets.

## Assets

Photos and host visuals are CSS placeholders (`.ph`, `.ph.v2`, `.ph.v3`) so real licensed assets can be swapped in later.

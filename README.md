# Thai Heaven Mobile Frontend

A standalone, dependency-free mobile web implementation for the Thai Heaven nightlife guide concept. The app is designed for a single portrait mobile viewport based on a 320×692pt handoff target while remaining responsive up to a 360px phone shell.

## Run locally

```bash
npm run dev
```

Then open <http://localhost:5173>.

## Validate

```bash
npm run build
```

The build script performs a lightweight static validation and confirms that all 12 required routes are registered.

## Implemented flow

1. Splash
2. Onboarding / accent setup
3. Home map
4. Search
5. Category exploration
6. Filters
7. Venue detail with Overview, Menu, and Reviews tabs
8. Roster multi-select
9. Host profile
10. LINE handoff
11. In-app reservation request
12. Confirmation

## Theming

The neon accent is controlled by the `--hot` CSS custom property. The onboarding screen exposes four runtime swatches to demonstrate that the UI can be rethemed from a single token.

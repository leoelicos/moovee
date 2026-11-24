# AGENTS.md — moovee

Shared context for every contributor, human or AI. Read this first; don't rediscover the repo or rely on chat history.

## Purpose

Search movies and series (OMDb), see details and ratings, and play the trailer (YouTube). Home page shows TMDB's
popular list. Live: https://mooovee.vercel.app

## Stack

React 19, TypeScript 6 (strict, `noUncheckedIndexedAccess`), Vite 8, React Router 7 (data router, `react-router`
package), plain CSS with tokens in `src/styles/app.css`. No UI kit. Tests: Vitest + Testing Library + axe-core (jsdom),
Playwright + @axe-core/playwright (Chromium). Node 22+.

## Repo map

```
index.html                 entry HTML; inline script applies the saved theme before paint
vite.config.ts             Vite + Vitest config (envPrefix VITE_ and REACT_APP_, outDir build, coverage thresholds)
playwright.config.ts       e2e: builds with placeholder keys, serves with vite preview on 127.0.0.1:4317 (E2E_PORT)
eslint.config.js           ESLint 9 flat config (typescript-eslint strict, jsx-a11y strict, react-hooks)
vercel.json                SPA rewrite to /index.html
.github/workflows/ci.yml   the only CI workflow: quality job + e2e job
src/
  main.tsx, routes.tsx, Layout.tsx   entry (+ SW registration), routes (/, /search, /results, /watchlist, *), shell, shortcuts, dialogs, palette
  api/        http (typed ApiError), omdb, tmdb, youtube: fetch + parse + cache, no React
  hooks/      useAsync (abortable, tagged results), useSearchResults (paged), useMovieDialog (?m=), useRecent
  lib/        env (keys), query (URL state, sort, cleanQuery), history, watchlist, theme, dom, grid (arrow keys), pwa
  components/ Header, SearchBox, Filters, ResultsGrid, MovieCard, Poster, MovieDialog, Trailer, Dialog, States, ...
  pages/      SearchPage (results or Discover), DiscoverPage, ErrorPages
  test/       setup (dialog polyfill, keys, cache reset), fixtures, apiMocks, render helper, axe helper
e2e/          mocks.ts (all network), fixtures.ts (axe + layout helpers), journey, keyboard, states, features, pwa, a11y, responsive, screenshots, live (opt-in)
public/sw.js  offline app shell service worker (same-origin GET only; never caches API calls)
scripts/check-size.mjs  gzipped bundle budget
docs/         TESTING.md, ACCESSIBILITY.md, DEPLOY.md, screenshots/
```

Unit tests sit beside the code as `*.test.ts(x)`.

## Commands

- `npm run dev` · `npm run build` · `npm run preview`
- `npm test` runs everything CI runs: typecheck → lint (0 warnings) → Prettier check → unit + coverage → Playwright
- `npm run test:unit` · `npm run test:e2e` · `npm run screenshots` (writes to `screenshots/`, or `SCREENSHOT_DIR`)

## Rules

- **No manual testing.** Every behaviour change comes with a unit or e2e test. `npm test` must be green before a PR.
- **No secrets in the repo.** Keys only come from env vars (`REACT_APP_*` or `VITE_*`); document new ones in `.env.example`.
- **The network is always mocked in tests.** Unit tests use `mockFetch`/`mockAppApis`; Playwright uses `e2e/mocks.ts`,
  which aborts any request it doesn't know. Never depend on a real API in CI.
- **State lives in the URL** (`q`, `type`, `y`, `sort`, `m`, and `t` on home). Only non-default values are written. Keep links stable.
- **Accessibility is a gate.** axe must pass in light and dark; keyboard paths are tested; targets ≥ 24px; no sideways
  scrolling from 320px. Use native elements (`<button>`, `<dialog>`, radios, `<select>`) before ARIA.
- **Spend API quota carefully.** Debounce search, cache results, look up trailers only on request (100 YouTube units each).
- **Budgets:** `npm run size` must pass; lazy-load anything big rather than raising the budget casually.
- **No floating controls over content:** the responsive spec fails if a fixed/sticky element covers a card.
- Free tools only. Prettier and ESLint configs are the style guide; don't hand-format.
- Specs and PRs should state removals explicitly.

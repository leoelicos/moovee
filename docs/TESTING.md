# Testing

`npm test` runs, in order: `tsc -b`, ESLint (`--max-warnings 0`), Prettier check, Vitest with coverage, Playwright, then the gzipped bundle budget.
CI runs the same steps (see `.github/workflows/ci.yml`). There is no manual test plan.

## Unit and integration (Vitest, jsdom)

- `src/api/*.test.ts`: request building, parsing of every OMDb/TMDB/YouTube shape we rely on (including OMDb's
  "N/A" values and HTTP-200 errors), caching, missing keys, network/HTTP/abort mapping.
- `src/lib/*.test.ts`: URL state parsing and writing, sorting, recent-search storage (with the CRA-era migration),
  theme persistence, DOM helpers, focus wrapping.
- `src/hooks/useSearchResults.test.tsx`: paging, partial failure and retry, de-duplication.
- `src/App.test.tsx`: the whole app on a memory router with mocked `fetch`: debounced search, Enter, URL sync,
  filters, load more, empty/error/missing-key states, keyboard navigation, shortcuts dialog, detail dialog, trailer
  success/none/error, theme, 404 and the route error page. Key screens are scanned with axe-core.
- Coverage thresholds live in `vite.config.ts` (lines/statements/functions 95%, branches 90%).

## End to end (Playwright, Chromium)

`playwright.config.ts` builds the app with placeholder keys and serves it with `vite preview`. `e2e/mocks.ts` answers
OMDb, TMDB, YouTube, the trailer embed and both image CDNs with deterministic fixtures (generated SVG posters), and
**aborts every other external request**, so the suite never touches the real network.

| Spec                  | Covers                                                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `journey.spec.ts`     | Search → results → detail → trailer; one request per settled query; trailer cache; URL state across reload, share, Back/Forward; filters, year, sort, load more; recent searches; trending links          |
| `keyboard.spec.ts`    | Mouse-free flow: skip link, `/`, Enter, arrow keys across real grid rows, focus kept in the modal, trailer, Esc returns focus to the card; `?` shortcuts; visible focus                                   |
| `states.spec.ts`      | Missing and 404 posters fall back to placeholders; skeletons; debounce; empty and 404 pages; OMDb down and bad key; TMDB down; YouTube no result and quota error; reduced motion; system and manual theme |
| `a11y.spec.ts`        | axe WCAG 2.2 A/AA (with colour contrast) on home, results, detail, trailer, empty, 404 and shortcuts, in light and dark                                                                                   |
| `responsive.spec.ts`  | 320, 375, 390, 768, 1024 and 1280px in light and dark: no horizontal scroll on home, results or detail, every control inside the viewport and at least 24×24px, sensible column counts                    |
| `screenshots.spec.ts` | Skipped unless `SCREENSHOTS=1`; writes review screenshots                                                                                                                                                 |

Mock switches (`test.use({ mocks: { omdb: 'error' } })`): `omdb: ok | error | invalid-key`, `tmdb: ok | error`,
`youtube: ok | none | error`, `omdbDelay` (ms).

Service workers are blocked in every spec except `pwa.spec.ts`, so cached shells can't leak between tests.

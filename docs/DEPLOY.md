# Deploying

The app is a static SPA. On Vercel:

- **Build command:** `npm run build` (Vercel's default). **Output directory:** `build`, which is what the Create React
  App preset already uses, so the existing project settings keep working. If the project's framework preset is changed
  to Vite, set the output directory to `build` or remove `outDir` from `vite.config.ts`.
- **Rewrites:** `vercel.json` sends every path to `index.html` so `/search?q=…` deep links load.
- **Node:** 22 or newer.
- **Env vars:** `REACT_APP_OMDB_KEY`, `REACT_APP_TMDB_KEY`, `REACT_APP_GAPI_KEY` (the existing names) or the `VITE_*`
  equivalents. Changing them needs a redeploy because Vite inlines them at build time.

## Key hygiene

- Keys are inlined into the browser bundle (as in every earlier version). Treat them as public identifiers and limit
  their blast radius: restrict the Google key to the YouTube Data API and to the site's HTTP referrers; OMDb and TMDB
  keys are rate-limited per key.
- A TMDB API key was hard-coded in this repo's history (commit `ebe4a2e`, May 2023) before it moved to env vars.
  Rotating that key in the TMDB dashboard is recommended; this PR does not rewrite history.
- To keep keys fully server-side later, add a small serverless proxy (for example a Vercel Function) and point
  `src/api/*` at it. Not done here to avoid changing hosting.

## Vercel preview toolbar

Preview deployments show Vercel's floating toolbar button (bottom right). It is injected by Vercel, not by Moovee, and
does not appear in production. It can be turned off for previews in the Vercel project settings
(Settings → General → Vercel Toolbar) or with `VERCEL_PREVIEW_FEEDBACK_ENABLED=0`; neither was changed here. Automated
runs send `x-vercel-skip-toolbar: 1` (see `playwright.config.ts`), and the responsive e2e spec guarantees Moovee's own
UI never puts a floating control over result cards.

## PWA

`public/sw.js` caches the app shell and hashed assets for offline use; API requests (other origins) pass straight
through. Bump `VERSION` in the worker to force old caches out.

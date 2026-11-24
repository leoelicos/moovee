# moovee <a href="https://mooovee.vercel.app/">![try the app](https://img.shields.io/badge/>-0?label=try%20the%20app&style=for-the-badge&labelColor=white&color=purple)</a>

Search any movie or series and watch its trailer, fast.

![Moovee results and detail, dark mode](docs/screenshots/results-1280-dark.png)

## What it does

- **Instant search.** Results follow your typing after a short pause (one OMDb call per settled query, cached).
  Press Enter to search straight away.
- **Everything in the URL.** Query, type, year, sort and the open title (`?q=star&type=series&sort=title&m=tt0458290`)
  are all in the address, so links are shareable and Back/Forward/reload just work. Old `/results?q=` links still work.
- **Rich detail view.** Plot, cast, crew, awards, box office and IMDb / Rotten Tomatoes / Metacritic ratings,
  with the YouTube trailer one click (or Enter) away. Each trailer lookup is cached on the device to save YouTube quota.
- **Filters and sorting.** Movies / Series, a release year, and best match / newest / oldest / A–Z. Load more pages on demand.
- **Popular right now.** The home page leads with TMDB's popular list. If TMDB is down, quick picks keep it useful.
- **Recent searches**, kept on the device (and migrated from the old version's storage).
- **Keyboard first.** `/` focus search · `↓` into results · arrows move through the grid row by row · `Home`/`End` ·
  `Enter` open · `Esc` clear or close · `?` shortcut list.
- **Accessible.** WCAG 2.2 AA checked with axe in unit and browser tests, a skip link, native modal dialogs with
  focus kept inside and returned afterwards, visible focus everywhere, 24px+ targets, live status for result counts.
- **Light and dark**, following the system with a manual override, and **reduced motion** respected everywhere.
- **View Transitions** between pages where the browser supports them.
- **Works from 320px up** with no sideways scrolling (tested at 320, 375, 390, 768, 1024 and 1280px).
- **Posters that never break.** Missing or failing images fall back to a titled placeholder.

## Getting started

Requires Node 22 or newer.

```sh
npm ci
cp .env.example .env.local   # then add your keys
npm run dev                  # http://localhost:5173
```

### API keys

| Service      | Used for                     | Env var (either name works)            | Free key                                                                                     |
| ------------ | ---------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| OMDb         | Search and title details     | `REACT_APP_OMDB_KEY` / `VITE_OMDB_KEY` | [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) (1,000 calls a day)           |
| TMDB (v3)    | Popular list and hero images | `REACT_APP_TMDB_KEY` / `VITE_TMDB_KEY` | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)                       |
| YouTube Data | Finding the trailer          | `REACT_APP_GAPI_KEY` / `VITE_GAPI_KEY` | [Google Cloud console](https://console.cloud.google.com/apis/library/youtube.googleapis.com) |

The `REACT_APP_*` names are the ones the Create React App version used, so the existing Vercel project variables keep
working unchanged. Keys are never committed: `.env*` files are git-ignored apart from `.env.example`.

> These keys end up in the browser bundle, as they always have in this app. Restrict them where the provider allows it
> (HTTP referrer limits for the Google key). See [docs/DEPLOY.md](docs/DEPLOY.md).

## Scripts

| Command               | What it does                                                                   |
| --------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`         | Vite dev server                                                                |
| `npm run build`       | Type-check and build to `build/`                                               |
| `npm test`            | **Everything**: typecheck, lint, Prettier check, unit tests with coverage, e2e |
| `npm run test:unit`   | Vitest + Testing Library + axe, with coverage thresholds                       |
| `npm run test:e2e`    | Playwright against a production build with every API mocked                    |
| `npm run screenshots` | Capture review screenshots (320/390/768/1280px, light and dark)                |
| `npm run format`      | Prettier write                                                                 |

No manual testing: if it matters, there is a test for it. See [docs/TESTING.md](docs/TESTING.md).

## Stack

React 19 · TypeScript 6 (strict) · Vite 8 · React Router 7 · plain CSS with design tokens · Vitest · Testing Library ·
axe-core · Playwright · ESLint 9 (typescript-eslint strict, jsx-a11y strict, react-hooks) · Prettier · GitHub Actions.
No UI framework, no runtime dependencies beyond React and React Router.

## Docs

- [AGENTS.md](AGENTS.md): repo map and rules for anyone (human or AI) changing the code
- [docs/TESTING.md](docs/TESTING.md): what each test layer covers and how the mocks work
- [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md): the accessibility baseline
- [docs/DEPLOY.md](docs/DEPLOY.md): Vercel notes and key hygiene

## Screenshots

| Home (390px, light)                                     | Detail with trailer (390px, dark)                           |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| ![Home on a phone](docs/screenshots/home-390-light.png) | ![Detail on a phone](docs/screenshots/trailer-390-dark.png) |

## Credits

| Contributors                                   | Original Roles              | Tasks                    |
| ---------------------------------------------- | --------------------------- | ------------------------ |
| [Umair Khalid](https://github.com/umairkhalid) | Project Manager / Developer | Rendering, Design        |
| [Elsie Lawrie](https://github.com/ElsieMay)    | Developer                   | Rendering, Design        |
| [Xuan Huy Bui](https://github.com/HuyBui1987)  | Developer                   | Rendering, Local Storage |
| [Leo Wong](https://github.com/leoelicos)       | Developer                   | APIs                     |

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Version history

[Version 1](https://github.com/umairkhalid/movie-planner) was made by the original team (credits above).

**Version 2** was my refactor to React, now taken offline.

**Version 3** minimised calls to OMDb, added the TMDB splash screen and better state control (Create React App, Ant Design).

**Version 4**, this one: a rebuild on Vite + TypeScript with instant URL-synced search, filters, a rich detail view,
keyboard shortcuts, WCAG 2.2 AA, light/dark, and full unit + Playwright coverage in CI.

## License

Licensed under the [MIT License](./LICENSE).

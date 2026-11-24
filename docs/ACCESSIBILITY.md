# Accessibility baseline (WCAG 2.2 AA)

- **Structure:** one `h1` per view, landmarks (`header`, `search`, `main`, `footer`), a skip link, labelled regions.
- **Keyboard:** everything works without a mouse. `/` focuses search; ↓ moves from search into results; arrow keys
  move through the grid by real rows (computed from layout), `Home`/`End` jump; ↑ from the first row returns to search;
  `Enter` opens; `Esc` clears search or closes a dialog; `?` lists shortcuts. Shortcuts never fire while typing.
- **Dialogs:** native `<dialog>` with `showModal()` (inert background, Esc), Tab wraps inside, focus returns to the
  opener on close. Details are linked by `?m=` so Back also closes them.
- **Feedback:** result counts and loading are announced through `role="status"`; errors use `role="alert"`.
- **Names:** result buttons read as "Title, Year, Series"; posters inside buttons are decorative; standalone posters
  and placeholders have text alternatives; links that open a new tab say so.
- **Targets:** at least 24×24px everywhere (most are 44px).
- **Contrast:** tokens chosen for AA in both themes and checked by axe in a real browser.
- **Motion:** `prefers-reduced-motion` turns off animations, shimmer and view transitions.
- **Themes:** follows `prefers-color-scheme`, with a persistent manual override; `forced-colors` keeps selected states visible.
- **Reflow:** no horizontal scrolling from 320px CSS width.

Automated checks: axe-core in Vitest (structure, names, ARIA) and @axe-core/playwright in Chromium (adds colour
contrast), for light and dark. See [TESTING.md](TESTING.md).

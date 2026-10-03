# Contributing

This is community knowledge: corrections and additions are welcome. Most changes only touch
`data.js`, which is the whole dataset. You don't need Node or a build step.

1. Edit `data.js`.
2. Run `python3 tools/validate.py`. It checks that every cross-reference resolves.
3. Preview with `python3 -m http.server 8765` and open http://localhost:8765. The site uses ES modules,
   so opening `index.html` from disk won't work.
4. Open a PR and say where the information comes from. CI runs the validator on every PR.

If you change a file the site loads (anything in `js/`, `index.html`, `app.css` or `data.js`), bump
`VERSION` in `sw.js`. Otherwise returning visitors keep the cached copy for one extra visit.

## Schema

### `errors[]`: secondary error codes

```js
{ code: "0102",            // 4-digit secondary code (digits 0-3), or "E74" / "E64 / E65" for E-keyed rows
  sys: "GPU",              // sub-system; drives the filter chips
  boards: "Xenon, Zephyr",
  fix: "One-liner shown in the table.",
  severity: "fatal",       // fatal | serious | moderate | minor
  difficulty: "pro only",  // DIY | advanced | pro only  (also picks the "What you'll need" list from `tools`)
  detail: "Longer explanation shown when the row is expanded.",
  related: ["0110", "E74"] }  // any code that resolves to a row, secondary or E-code
```

A secondary code is the E-code written in base 4 (E74 = 1022). The decoder matches by value, so
a row keyed `E73` is found when someone enters `1021`.

### `mobos[]`: motherboards

The display fields are `name`, `year`, `stats{}`, `desc`, `ident`, `faults`, `mod`, `codes[]`,
`compat{jtag, rgh, badupdate}`, `tier` (S+ S A B C F) and `risk` (0-100). Two more fields are
structural:

- `slug`: the stable id used in links (`#boards/jasper`). Don't rename it.
- `id`: drives the Identify wizard.
  `{ chassis: ["Phat"], hdmi: true, watts: [175], dateFrom: "2007-08", dateTo: "2008-06" }`.
  Dates are the production window as `YYYY-MM`. The wizard tolerates answers a few months
  outside it.

### `flows{}`: the troubleshooter

A tree of nodes keyed by id, starting at `start`. A node is either a question or a result:

```js
nopower:  { q: "Look at the LED on the power brick...", options: [{ label: "Red", next: "brickred" }] }
brickred: { title: "Brick in protection mode", result: "Unplug the DC lead...",
            links: [{ label: "0001 - 12 V short", route: "codes/0001" }] }
```

A `route` is any in-app link without the `#`: `codes/0102`, `codes?q=HANA`, `boards/jasper`,
`troubleshoot/heat`, `reference/x-clamp`, `decoder?guide=1`, `identify`.

### Other sections

| Key | What it is |
| --- | --- |
| `primary[]` | Ring of Light / power-light states per chassis (`lights` 1-4, or 0 for S/E). |
| `brick[]` | Power brick LED colours. |
| `tools{}` | Tool lists per fix difficulty. |
| `glossary[]` | `{term, slug, def, aka[], cat}`. Terms and `aka` are auto-linked wherever they appear in board and code text. `cat` is one of diagnosis, repair, hardware, modding, models. |
| `timeline[]` | `{date: "YYYY-MM", kind: board/hack/event, label, board?}`. `board` is a board slug. |
| `tiers`, `score`, `models`, `editions`, `softmods`, `psuConnectors` | As they appear on their tabs. |
| `meta` | `updated` date shown in the header, and the `repo` URL used for "Report a correction". |

## Code layout

| File | What it is |
| --- | --- |
| `index.html` | App shell plus one `<template id="tpl-...">` per view. Vue reads them as in-DOM templates, so use kebab-case component tags and never self-close one. |
| `js/main.js` | Root app: tabs, keyboard shortcuts, command palette, theme, service worker registration. |
| `js/store.js` | Shared reactive state, the hash router (`navigate`), favourites, the repair log and localStorage persistence. |
| `js/lib.js` | Pure helpers: base-4 code maths, search highlighting, glossary linking. |
| `js/components.js` | Small shared components: Ring digit, severity badge, tier box, star, icons. |
| `js/views/*.js` | One file per tab. |
| `sw.js` | Offline cache. |

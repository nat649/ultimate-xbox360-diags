# ultimate-xbox360-diags

Xbox 360 hardware reference: an interactive RROD decoder, the secondary error code
database, motherboard revisions, softmod compatibility and every retail model.

**Live:** https://nat649.github.io/ultimate-xbox360-diags/

## What's in it

- **Ring of Light decoder** — click the quadrants the way you'd count them off the console
  and the diagnosis resolves live, with severity, fix difficulty, deeper notes and links to
  related codes. Deep-linkable: `#decoder/0102`.
- **E-code ↔ secondary converter** — the secondary code is simply the dashboard E-code
  written in base 4 (E74 = 1022, E68 = 1010, E73 = 1021), so the two convert both ways and
  every row cross-references.
- **Error code database** — fuzzy search (Fuse.js) across codes, boards and fix text.
  Searching `E74` or `74` also resolves through the base-4 relationship. Filter by
  subsystem, click any row to expand.
- **Motherboards** — per-revision specs (CPU/GPU process, NAND, DVD drives shipped), an
  RROD risk bar, what fails first, and modding notes.
- **Softmods** — JTAG / RGH / BadUpdate compatibility matrix plus a BadUpdate reference
  (requirements, entry points including ABadAvatar, and the non-persistence caveat).
  BadUpdate is software only, so it reaches Winchester and Corona V6 — the two boards no
  glitch hack can touch.
- **Ranking** — reliability tier list and a sortable scoreboard.
- **Models** — every retail SKU by generation, plus the limited editions.

Four phosphor themes, a CRT scanline toggle, `/` to search, `1`–`6` for tabs, and on the
decoder tab the `0`–`3` keys shift digits in like tapping Eject.

## Structure

No build step — static files, so GitHub Pages serves it as-is. Vue 3, Tailwind and Fuse.js
load from CDN.

| File | What it is |
| --- | --- |
| `index.html` | The app shell and all markup (Vue 3 in-DOM templates) |
| `app.js` | Vue app: decoder, search, filters, routing, persistence |
| `app.css` | CRT/scene theme layer (CSS custom properties) |
| `data.js` | The whole dataset — **edit this to add or correct content** |
| `extract.mjs` / `enrich.mjs` / `gen.mjs` | One-off pipeline that lifted the data out of the original page and layered the extra detail on. Not needed at runtime. |
| `index.legacy.html` | The original single-file version, kept for reference |
| `backup/terminal-ui-2026-09-04/` | Snapshot taken before an experiment; safe to delete |

### Adding an error code

Append to `window.DIAGS.errors` in `data.js`:

```js
{ code: "0031", sys: "RAM", boards: "All",
  fix: "Short one-liner shown in the table.",
  severity: "serious",        // fatal | serious | moderate | minor
  difficulty: "pro only",     // DIY | advanced | pro only
  detail: "The longer explanation shown when the row is expanded.",
  related: ["0033", "0110"] }
```

## Local preview

```bash
python -m http.server 8765
```

Corrections welcome — this is community knowledge, verify before you reball.

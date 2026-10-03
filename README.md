# ultimate-xbox360-diags

Xbox 360 hardware reference: an interactive RROD decoder, the secondary error code
database, motherboard revisions, softmod compatibility and every retail model.

**Live:** https://nat649.github.io/ultimate-xbox360-diags/

## What's in it

- **Ring of Light decoder.** Click the quadrants the way you'd count them off the console, or type
  `0`–`3`, and the diagnosis resolves live. Each result shows severity, fix difficulty, the tools you'll
  need, which boards it typically hits, and related codes. A **guided reading** mode walks you through
  Sync + Eject one digit at a time. Deep-linkable: `#decoder/0102`.
- **What the lights mean.** The primary light patterns for Phat, S and E consoles, plus the power brick LED.
- **E-code ↔ secondary converter.** The secondary code is the dashboard E-code written in base 4
  (E74 = 1022, E68 = 1010, E73 = 1021), so the two convert both ways. The decoder finds a row either way.
- **Troubleshooter.** A branching symptom checker (no power, no picture, red lights, freezes, disc,
  heat). Every step has its own shareable link.
- **Error code database.** Fuzzy search (Fuse.js) across codes, boards and fix text, with severity and
  sub-system filters, sortable columns, and a link to every row (`#codes/0102`).
- **Identify my board.** Answer chassis, HDMI, brick wattage and manufacture date to narrow it down to a
  board revision, with a confidence score.
- **Motherboards.** Per-revision specs, an RROD risk bar, what fails first, modding notes, and side-by-side
  **compare** for up to three boards.
- **Softmods, Ranking, Models.** The JTAG / RGH / BadUpdate matrix, the reliability tier list and
  scoreboard, and every retail SKU and limited edition.
- **Reference.** A glossary that auto-links terms across the site, and a timeline of board revisions and hacks.
- **My consoles.** A repair log stored in your browser: board, status, codes seen and notes, with a
  printable repair sheet and JSON export/import.

Everywhere: `Ctrl K` (or `/`) searches the whole site; `1`–`0` switch tabs (`Alt`+number on the
decoder, where digits enter the code); you can pin codes and boards; there are dark, light and system
themes, four accent colours and an optional CRT scanline effect. On phones there is a bottom tab bar,
and once you've visited, the site installs as an app and works offline.

## Structure

No build step. The files are static, so GitHub Pages serves them as-is. Vue 3, Tailwind and Fuse.js
load from CDN, and the app is plain ES modules.

| File | What it is |
| --- | --- |
| `data.js` | The whole dataset. **Edit this to add or correct content.** |
| `index.html` | App shell and one template per view. |
| `js/` | The Vue app: `main.js` (root), `store.js` (state + router), `lib.js` (helpers), `views/` (one per tab). |
| `app.css` | Theme tokens (dark/light), components and the print sheet. |
| `sw.js`, `manifest.webmanifest`, `icon*` | Offline support and install metadata. |
| `tools/validate.py` | Data integrity checks. CI runs it on every PR. |

See [CONTRIBUTING.md](CONTRIBUTING.md) for the data schema.

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

Then run `python3 tools/validate.py`.

## Local preview

```bash
python3 -m http.server 8765
```

It has to be served: ES modules don't load from `file://`.

Corrections welcome — this is community knowledge, verify before you reball.

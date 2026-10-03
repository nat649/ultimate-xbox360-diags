/* Pure helpers shared by every view: escaping, code maths, highlighting, ring geometry. */

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* annulus sector path, used for the Ring of Light quadrants */
export function sector(a0, a1, r1, r2) {
  const rad = a => (a - 90) * Math.PI / 180;
  const p = (a, r) => [50 + r * Math.cos(rad(a)), 50 + r * Math.sin(rad(a))].map(n => n.toFixed(2)).join(' ');
  return `M ${p(a0, r2)} A ${r2} ${r2} 0 0 1 ${p(a1, r2)} L ${p(a1, r1)} A ${r1} ${r1} 0 0 0 ${p(a0, r1)} Z`;
}
export const quad = i => sector(i * 90 + 2, i * 90 + 88, 23, 45);
// digit 0 is shown as all four quadrants lit
export const lit = (d, q) => d === 0 ? true : q < d;

/* ---- code maths: the secondary code is the dashboard E-code written in base 4 ---- */
export const toBase4 = n => Math.max(0, Math.min(255, n | 0)).toString(4).padStart(4, '0');

// every value a code (or a row key like "E64 / E65") stands for
export function valsOf(code) {
  const s = String(code), m = s.match(/\b[0-3]{4}\b/);
  if (m) return [parseInt(m[0], 4)];
  const es = [...s.matchAll(/E\s*(\d{1,3})/gi)].map(x => +x[1]);
  return es.length ? es : [];
}

// numeric secondary -> its E-code; an E-keyed row -> its secondary code
export function crossRef(code) {
  const s = String(code);
  if (/\b[0-3]{4}\b/.test(s)) return 'E' + valsOf(s)[0];
  const v = valsOf(s);
  return v.length ? v.map(toBase4).join(' / ') : '—';
}

export const findRow = (errors, code) => {
  const v = valsOf(code);
  return v.length ? errors.find(e => valsOf(e.code).some(x => v.includes(x))) : undefined;
};

/* split the raw text on the term and escape each piece, so a search for "amp" can't land inside an entity */
export function hl(text, term) {
  term = (term || '').trim();
  if (term.length < 2) return esc(text);
  const re = new RegExp('(' + reEsc(term) + ')', 'ig');
  return String(text).split(re).map((p, i) => i % 2 ? '<mark>' + esc(p) + '</mark>' : esc(p)).join('');
}

/* turn glossary terms inside plain text into links; the text is escaped first */
export function linkify(text, glossary) {
  let out = esc(text);
  if (!glossary || !glossary.length) return out;
  const words = [];
  // match the term as written, plus its lowercase form for longer words ("Reflow" in a sentence is "reflow")
  glossary.forEach(g => [g.term, ...(g.aka || [])].forEach(w => {
    words.push([w, g.slug]);
    if (w.length >= 4 && w !== w.toLowerCase()) words.push([w.toLowerCase(), g.slug]);
  }));
  words.sort((a, b) => b[0].length - a[0].length);
  const map = new Map(words.map(([w, s]) => [w.toLowerCase(), s]));
  const re = new RegExp('\\b(' + words.map(w => reEsc(esc(w[0]))).join('|') + ')\\b', 'g');
  const done = new Set();
  // link only the first mention of each term, and never inside a tag
  return out.replace(re, (m) => {
    const s = map.get(m.toLowerCase());
    if (!s || done.has(s)) return m;
    done.add(s);
    return `<a class="gl" href="#reference/${s}">${m}</a>`;
  });
}

export const ymNum = ym => { const [y, m] = String(ym).split('-').map(Number); return y + ((m || 1) - 1) / 12; };

export const fmtDate = ts => new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

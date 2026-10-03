/* App-wide reactive state: routing, persistence, favourites, recent codes, repair log, toast. */
import { uid, valsOf, toBase4 } from './lib.js';

const { reactive, watch } = Vue;

export const DB = window.DIAGS;

export const LS = {
  get: (k, d) => { try { const v = localStorage.getItem('x360.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem('x360.' + k, JSON.stringify(v)); } catch (e) {} }
};

// group is used for the dividers in the nav; mobile shows `bar` tabs directly and the rest under "More"
export const TABS = [
  { id: 'decoder', label: 'Decoder', group: 'diagnose', bar: true, icon: 'ring' },
  { id: 'troubleshoot', label: 'Troubleshoot', group: 'diagnose', bar: true, icon: 'flow' },
  { id: 'codes', label: 'Error codes', group: 'diagnose', bar: true, icon: 'list', count: DB.errors.length },
  { id: 'identify', label: 'Identify', group: 'hardware', icon: 'search' },
  { id: 'boards', label: 'Motherboards', group: 'hardware', bar: true, icon: 'chip', count: DB.mobos.length },
  { id: 'ranking', label: 'Ranking', group: 'hardware', icon: 'tier' },
  { id: 'models', label: 'Models', group: 'hardware', icon: 'box', count: DB.models.length },
  { id: 'softmods', label: 'Softmods', group: 'mods', icon: 'key' },
  { id: 'reference', label: 'Reference', group: 'ref', icon: 'book' },
  { id: 'consoles', label: 'My consoles', group: 'ref', icon: 'wrench' }
];

export const store = reactive({
  route: { tab: 'decoder', arg: '', query: {} },
  digits: [0, 1, 0, 2],
  phosphor: LS.get('phosphor', 'green'),
  theme: LS.get('theme', 'system'),
  scan: LS.get('scan', false),
  favs: LS.get('favs', []),
  recent: LS.get('recent', []),
  consoles: LS.get('consoles', []),
  compare: [],
  toast: '',
  palette: false,
  print: null
});

for (const k of ['phosphor', 'theme', 'scan', 'favs', 'recent', 'consoles']) {
  watch(() => store[k], v => LS.set(k, v), { deep: true });
}

/* ---------------- routing ----------------
   #tab/arg?key=val. Decoder digit changes replace the entry; everything else pushes one,
   so the browser back button walks through what you looked at. */
export function parseHash(h = location.hash) {
  const raw = decodeURIComponent(h.replace(/^#/, ''));
  const [path, qs = ''] = raw.split('?');
  const [tab, ...rest] = path.split('/');
  const query = Object.fromEntries(new URLSearchParams(qs));
  return { tab: TABS.some(t => t.id === tab) ? tab : '', arg: rest.join('/'), query };
}

export function applyRoute(r) {
  if (!r.tab) return;
  store.route = { tab: r.tab, arg: r.arg, query: r.query };
  if (r.tab === 'decoder' && /^[0-3]{4}$/.test(r.arg)) store.digits = r.arg.split('').map(Number);
  LS.set('tab', r.tab);
}

export const hashOf = r => '#' + r.tab + (r.arg ? '/' + r.arg : '') +
  (r.query && Object.keys(r.query).length ? '?' + new URLSearchParams(r.query) : '');

export function navigate(route, { replace = false } = {}) {
  const r = typeof route === 'string' ? parseHash('#' + route) : route;
  if (!r.tab) return;
  const h = hashOf(r);
  if (location.hash !== h) history[replace ? 'replaceState' : 'pushState'](null, '', h);
  applyRoute(r);
  if (!replace && !r.arg) window.scrollTo(0, 0);
}

export const go = tab => navigate(tab === 'decoder' ? 'decoder/' + store.digits.join('') : tab);

/* ---------------- codes ---------------- */
export function loadCode(code) {
  const v = valsOf(code)[0];
  if (v == null || v > 255) return;
  store.digits = toBase4(v).split('').map(Number);
  navigate('decoder/' + store.digits.join(''));
  pushRecent(store.digits.join(''));
}

export function pushRecent(code) {
  store.recent = [code, ...store.recent.filter(c => c !== code)].slice(0, 8);
}

/* ---------------- favourites: "code:0102", "board:jasper" ---------------- */
export const isFav = key => store.favs.includes(key);
export function toggleFav(key, label) {
  const on = isFav(key);
  store.favs = on ? store.favs.filter(f => f !== key) : [...store.favs, key];
  toast(on ? 'Unpinned ' + label : 'Pinned ' + label);
}

/* ---------------- repair log ---------------- */
export function newConsole(seed = {}) {
  const c = {
    id: uid(), name: seed.name || 'Console ' + (store.consoles.length + 1), chassis: seed.chassis || '',
    board: seed.board || '', mfg: '', serial: '', status: 'diagnosing', notes: '',
    codes: [], created: Date.now(), updated: Date.now()
  };
  store.consoles = [c, ...store.consoles];
  return c;
}

export function logCode(consoleId, code) {
  const c = store.consoles.find(x => x.id === consoleId);
  if (!c) return;
  c.codes.unshift({ code, at: Date.now() });
  c.updated = Date.now();
  toast('Logged ' + code + ' on ' + c.name);
}

/* ---------------- misc ---------------- */
let toastT;
export function toast(msg) {
  store.toast = msg;
  clearTimeout(toastT);
  toastT = setTimeout(() => store.toast = '', 1800);
}

export async function copy(text, msg) {
  try { await navigator.clipboard.writeText(text); toast(msg || 'Copied'); }
  catch (e) { toast('Copy failed: select and copy manually'); }
}

export const linkTo = route => location.origin + location.pathname + '#' + route;

export function printSheet(sheet) {
  store.print = sheet;
  Vue.nextTick(() => { window.print(); });
}
window.addEventListener('afterprint', () => { store.print = null; });

export function issueUrl(context) {
  const body = `**Page:** ${location.href}\n**Item:** ${context}\n\n**What's wrong / what should it say:**\n\n**Source (if any):**\n`;
  return DB.meta.repo + '/issues/new?title=' + encodeURIComponent('Correction: ' + context) + '&body=' + encodeURIComponent(body);
}

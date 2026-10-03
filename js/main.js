/* 360 Diagnostic Wiki — Vue 3 app (no build step: CDN Vue + native ES modules) */
import { crossRef, hl, linkify, slug, fmtDate, valsOf, toBase4 } from './lib.js';
import { DB, TABS, store, navigate, go, loadCode, copy, linkTo, isFav, toggleFav, toast, issueUrl, parseHash, applyRoute, LS } from './store.js';
import { RingDigit, SevBadge, TierBox, FavStar, Icon } from './components.js';
import Decoder from './views/decoder.js';
import Troubleshoot from './views/troubleshoot.js';
import Codes from './views/codes.js';
import Identify from './views/identify.js';
import Boards from './views/boards.js';
import Ranking from './views/ranking.js';
import Models from './views/models.js';
import Softmods from './views/softmods.js';
import Reference from './views/reference.js';
import Consoles from './views/consoles.js';

const VIEWS = { decoder: Decoder, troubleshoot: Troubleshoot, codes: Codes, identify: Identify, boards: Boards,
  ranking: Ranking, models: Models, softmods: Softmods, reference: Reference, consoles: Consoles };

/* everything the command palette can jump to */
function paletteIndex() {
  const items = [];
  TABS.forEach(t => items.push({ type: 'Page', title: t.label, route: t.id === 'decoder' ? 'decoder/' + store.digits.join('') : t.id }));
  items.push({ type: 'Action', title: 'Guided code reading', sub: 'Step through Sync + Eject', route: 'decoder?guide=1' });
  items.push({ type: 'Action', title: 'Which board do I have?', sub: 'Identify wizard', route: 'identify' });
  DB.errors.forEach(e => items.push({ type: 'Code', title: e.code, sub: e.sys + ' · ' + e.fix, route: 'codes/' + e.code.split(' ')[0], extra: crossRef(e.code) }));
  DB.mobos.forEach(m => items.push({ type: 'Board', title: m.name, sub: m.year + ' · tier ' + m.tier, route: 'boards/' + m.slug, extra: m.ident }));
  DB.models.forEach(m => items.push({ type: 'Model', title: m.gen + ' ' + m.sku, sub: m.years + ' · ' + m.storage, route: 'models?q=' + encodeURIComponent(m.sku) }));
  DB.editions.forEach(e => items.push({ type: 'Edition', title: e.name, sub: e.year + ' · ' + e.chassis, route: 'models?q=' + encodeURIComponent(e.name) }));
  DB.glossary.forEach(g => items.push({ type: 'Term', title: g.term, sub: g.def, route: 'reference/' + g.slug, extra: g.aka.join(' ') }));
  Object.entries(DB.flows).forEach(([k, n]) => items.push({ type: 'Fix', title: n.title || n.q, sub: 'Troubleshooter', route: 'troubleshoot/' + k, extra: n.result || '' }));
  return items;
}

const app = Vue.createApp({
  data() {
    return {
      TABS, more: false, pq: '', pi: 0, online: navigator.onLine, offlineReady: false,
      phosphors: [
        { id: 'green', c: '#65b042' }, { id: 'amber', c: '#ffb020' },
        { id: 'ice', c: '#3fb9ff' }, { id: 'magenta', c: '#ff4fd8' }
      ]
    };
  },
  computed: {
    tab() { return store.route.tab; },
    view() { return VIEWS[this.tab] || Decoder; },
    barTabs() { return TABS.filter(t => t.bar); },
    moreActive() { return !TABS.find(t => t.id === this.tab)?.bar; },
    fuse() { return new Fuse(paletteIndex(), { keys: [{ name: 'title', weight: 3 }, { name: 'extra', weight: 1.5 }, { name: 'sub', weight: 1 }], threshold: 0.38, ignoreLocation: true }); },
    results() {
      const t = this.pq.trim();
      if (!t) return paletteIndex().filter(i => i.type === 'Page' || i.type === 'Action');
      const out = this.fuse.search(t, { limit: 12 }).map(r => r.item);
      // "1022", "E74" or "74" also offers to decode it straight away
      const m = t.match(/^([0-3]{4})$/) || t.match(/^e\s*(\d{1,3})$/i) || t.match(/^(\d{1,3})$/);
      if (m) {
        const v = m[1].length === 4 && /^[0-3]{4}$/.test(m[1]) ? parseInt(m[1], 4) : +m[1];
        if (v <= 255) out.unshift({ type: 'Decode', title: 'Decode ' + toBase4(v) + ' (E' + v + ')', sub: 'Open in the Ring of Light decoder', route: 'decoder/' + toBase4(v) });
      }
      return out;
    },
    footerContext() {
      const r = store.route;
      return TABS.find(t => t.id === r.tab)?.label + (r.arg ? ' / ' + r.arg : '');
    }
  },
  watch: {
    'S.theme': { handler: 'applyTheme' },
    'S.phosphor'(p) { document.documentElement.dataset.phosphor = p; },
    'S.scan'(v) { document.body.dataset.scanlines = v ? 'on' : 'off'; },
    pq() { this.pi = 0; },
    tab() { this.more = false; }
  },
  methods: {
    go, navigate,
    setPhosphor(p) { store.phosphor = p; },
    cycleTheme() {
      const order = ['system', 'dark', 'light'];
      store.theme = order[(order.indexOf(store.theme) + 1) % 3];
      toast('Theme: ' + store.theme);
    },
    applyTheme() {
      const t = store.theme;
      if (t === 'system') delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = t;
    },
    openPalette() { store.palette = true; this.pq = ''; this.$nextTick(() => this.$refs.pal?.focus()); },
    closePalette() { store.palette = false; },
    pick(i) {
      const r = this.results[i];
      if (!r) return;
      this.closePalette();
      navigate(r.route);
    },
    palKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); this.pi = Math.min(this.pi + 1, this.results.length - 1); this.scrollPal(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.pi = Math.max(this.pi - 1, 0); this.scrollPal(); }
      else if (e.key === 'Enter') { e.preventDefault(); this.pick(this.pi); }
      else if (e.key === 'Escape') this.closePalette();
    },
    scrollPal() { this.$nextTick(() => this.$refs.palList?.querySelector('[data-on="1"]')?.scrollIntoView({ block: 'nearest' })); },
    // roving focus across the tab strip (ARIA tabs pattern)
    tabKey(e, i) {
      const n = TABS.length;
      const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
      if (j < 0) return;
      e.preventDefault();
      go(TABS[j].id);
      this.$nextTick(() => document.getElementById('tab-' + TABS[j].id)?.focus());
    },
    keys(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); store.palette ? this.closePalette() : this.openPalette(); return; }
      if (store.palette) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) { if (e.key === 'Escape') e.target.blur(); return; }
      if (e.ctrlKey || e.metaKey) return;
      if (e.key === 'Escape') { this.more = false; return; }
      if (e.key === '/') { e.preventDefault(); this.openPalette(); return; }
      // on the decoder, 0-3 shift digits in like tapping Eject; tabs move to Alt+1-9 there
      if (this.tab === 'decoder' && !e.altKey && /^[0-3]$/.test(e.key)) {
        store.digits = [...store.digits.slice(1), +e.key];
        return;
      }
      const n = '1234567890'.indexOf(e.code.replace(/^Digit/, ''));
      if (n > -1 && n < TABS.length && (e.altKey || this.tab !== 'decoder')) { e.preventDefault(); go(TABS[n].id); }
    }
  },
  mounted() {
    document.documentElement.dataset.phosphor = store.phosphor;
    document.body.dataset.scanlines = store.scan ? 'on' : 'off';
    this.applyTheme();
    const r = parseHash();
    applyRoute(r.tab ? r : { tab: LS.get('tab', 'decoder'), arg: '', query: {} });
    window.addEventListener('popstate', () => applyRoute(parseHash()));
    window.addEventListener('hashchange', () => applyRoute(parseHash()));
    window.addEventListener('keydown', this.keys);
    window.addEventListener('online', () => this.online = true);
    window.addEventListener('offline', () => this.online = false);
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then(() => this.offlineReady = true).catch(() => {});
    }
  }
});

Object.assign(app.config.globalProperties, {
  DB, S: store, nav: navigate, loadCode, copy, linkTo, isFav, toggleFav, toast, issueUrl, crossRef, slug, fmtDate,
  hl, lk: t => linkify(t, DB.glossary), valsOf
});
app.component('ring-digit', RingDigit);
app.component('sev-badge', SevBadge);
app.component('tier-box', TierBox);
app.component('fav-star', FavStar);
app.component('icon', Icon);
app.mount('#app');

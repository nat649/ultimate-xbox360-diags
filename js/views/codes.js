import { valsOf, toBase4, crossRef, hl, findRow } from '../lib.js';
import { DB, store, navigate, loadCode, copy, linkTo } from '../store.js';

const SEV_ORDER = { fatal: 0, serious: 1, moderate: 2, minor: 3 };

export default {
  template: '#tpl-codes',
  data() {
    return { q: '', sysSel: [], sevSel: [], sortK: 'code', sortD: 1 };
  },
  computed: {
    systems() { return [...new Set(DB.errors.map(e => e.sys))].sort(); },
    sevs() { return Object.keys(SEV_ORDER); },
    fuse() {
      return new Fuse(DB.errors, {
        keys: [{ name: 'code', weight: 3 }, { name: 'sys', weight: 2 }, { name: 'boards', weight: 2 },
               { name: 'fix', weight: 1 }, { name: 'detail', weight: 1 }],
        threshold: 0.35, ignoreLocation: true, minMatchCharLength: 2
      });
    },
    // the row named in the route (#codes/0102) is the expanded one
    expand() { const r = store.route.tab === 'codes' && store.route.arg && findRow(DB.errors, store.route.arg); return r ? r.code : ''; },
    shown() {
      let rows = DB.errors;
      const term = this.q.trim();
      if (term) {
        // a raw E-code ("E74", "74") or secondary ("1022") query resolves through base 4 too
        const hits = this.fuse.search(term).map(r => r.item);
        const em = term.match(/^e?\s*(\d{1,3})$/i) || term.match(/^([0-3]{4})$/);
        if (em) {
          const v = em[1].length === 4 && /^[0-3]+$/.test(em[1]) ? parseInt(em[1], 4) : +em[1];
          DB.errors.filter(e => valsOf(e.code).includes(v)).forEach(d => { if (!hits.includes(d)) hits.unshift(d); });
        }
        rows = hits;
      }
      if (this.sysSel.length) rows = rows.filter(e => this.sysSel.includes(e.sys));
      if (this.sevSel.length) rows = rows.filter(e => this.sevSel.includes(e.severity));
      if (term && this.sortK === 'code') return rows; // keep relevance order while searching
      const k = this.sortK, d = this.sortD;
      const key = e => k === 'code' ? Math.min(...valsOf(e.code)) : k === 'severity' ? SEV_ORDER[e.severity] : String(e[k]);
      return [...rows].sort((a, b) => { const x = key(a), y = key(b); return (typeof x === 'number' ? x - y : x.localeCompare(y)) * d; });
    },
    // close matches to offer when a search finds nothing
    suggestions() {
      if (this.shown.length || !this.q.trim()) return [];
      return new Fuse(DB.errors, { keys: ['code', 'sys', 'fix'], threshold: 0.6, ignoreLocation: true })
        .search(this.q.trim()).slice(0, 4).map(r => r.item);
    }
  },
  watch: {
    // #codes?q=HANA prefills the search
    'S.route': {
      handler(r) {
        if (r.tab !== 'codes') return;
        if (r.query.q != null) this.q = r.query.q;
        // a deep link must show its row, so drop any search or filter that would hide it
        else if (r.arg && this.expand && !this.shown.some(e => e.code === this.expand)) this.clear();
        if (r.arg) this.$nextTick(() => document.getElementById('code-' + this.expand.split(' ')[0])?.scrollIntoView({ block: 'nearest' }));
      },
      immediate: true
    }
  },
  methods: {
    crossRef, loadCode, toBase4,
    hl(t) { return hl(t, this.q); },
    toggle(list, v) { const i = list.indexOf(v); i > -1 ? list.splice(i, 1) : list.push(v); },
    sortBy(k) { this.sortD = this.sortK === k ? -this.sortD : 1; this.sortK = k; },
    open(e) { navigate(this.expand === e.code ? 'codes' : 'codes/' + e.code.split(' ')[0], { replace: true }); },
    share(e) { copy(linkTo('codes/' + e.code.split(' ')[0]), 'Link to ' + e.code + ' copied'); },
    clear() { this.q = ''; this.sysSel = []; this.sevSel = []; },
    sortMark(k) { return this.sortK === k ? (this.sortD > 0 ? ' ▲' : ' ▼') : ''; },
    ariaSort(k) { return this.sortK === k ? (this.sortD > 0 ? 'ascending' : 'descending') : 'none'; }
  }
};

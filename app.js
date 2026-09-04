/* 360 Diagnostic Wiki — Vue 3 app (no build step, CDN only) */
const { createApp } = Vue;

const LS = {
  get: (k, d) => { try { const v = localStorage.getItem('x360.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem('x360.' + k, JSON.stringify(v)); } catch (e) {} }
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* annulus sector path, used for the Ring of Light quadrants */
function sector(a0, a1, r1, r2) {
  const rad = a => (a - 90) * Math.PI / 180;
  const p = (a, r) => [50 + r * Math.cos(rad(a)), 50 + r * Math.sin(rad(a))].map(n => n.toFixed(2)).join(' ');
  return `M ${p(a0, r2)} A ${r2} ${r2} 0 0 1 ${p(a1, r2)} L ${p(a1, r1)} A ${r1} ${r1} 0 0 0 ${p(a0, r1)} Z`;
}

createApp({
  data() {
    return {
      DB: window.DIAGS,
      tab: LS.get('tab', 'decoder'),
      digits: [0, 1, 0, 2],
      q: '', sysSel: [], expand: '',
      boardFilter: '', genSel: 'All', mq: '',
      sortK: 'rank', sortD: 1,
      eInput: 74,
      phosphor: LS.get('phosphor', 'green'),
      scan: LS.get('scan', false),
      toast: '',
      phosphors: [
        { id: 'green', c: '#65b042' }, { id: 'amber', c: '#ffb020' },
        { id: 'ice', c: '#3fb9ff' }, { id: 'magenta', c: '#ff4fd8' }
      ],
      cols: [['rank', '#'], ['board', 'Board'], ['rel', 'Reliability'], ['why', 'Why it sits here']]
    };
  },

  computed: {
    tabs() {
      return [
        { id: 'decoder', label: 'Decoder' },
        { id: 'codes', label: 'Error codes', count: this.DB.errors.length },
        { id: 'boards', label: 'Motherboards', count: this.DB.mobos.length },
        { id: 'softmods', label: 'Softmods' },
        { id: 'ranking', label: 'Ranking' },
        { id: 'models', label: 'Models', count: this.DB.models.length }
      ];
    },
    code() { return this.digits.join(''); },
    ecode() { return this.digits.reduce((a, d) => a * 4 + d, 0); },
    permalink() { return location.origin + location.pathname + '#decoder/' + this.code; },
    eToSecondary() {
      let n = Math.max(0, Math.min(255, parseInt(this.eInput, 10) || 0)), out = '';
      for (let i = 0; i < 4; i++) { out = (n % 4) + out; n = Math.floor(n / 4); }
      return out;
    },
    match() { return this.DB.errors.find(e => e.code.replace(/\s|\//g, '').includes(this.code)); },
    neighbours() {
      const t = this.ecode;
      return [...this.DB.errors]
        .map(e => ({ ...e, d: Math.abs(this.decOf(e.code) - t) }))
        .sort((a, b) => a.d - b.d).slice(0, 5);
    },
    systems() { return [...new Set(this.DB.errors.map(e => e.sys))].sort(); },
    fuse() {
      return new Fuse(this.DB.errors, {
        keys: [{ name: 'code', weight: 3 }, { name: 'sys', weight: 2 }, { name: 'boards', weight: 2 },
               { name: 'fix', weight: 1 }, { name: 'detail', weight: 1 }],
        threshold: 0.35, ignoreLocation: true, minMatchCharLength: 2
      });
    },
    shown() {
      let rows = this.DB.errors;
      const term = this.q.trim();
      if (term) {
        // let a raw E-code query ("E74", "74") resolve through the base-4 relationship too
        const em = term.match(/^e?\s*(\d{1,3})$/i);
        const hits = this.fuse.search(term).map(r => r.item);
        if (em) {
          const sec = (+em[1]).toString(4).padStart(4, '0');
          const direct = this.DB.errors.filter(e => e.code.includes(sec));
          direct.forEach(d => { if (!hits.includes(d)) hits.unshift(d); });
        }
        rows = hits;
      }
      if (this.sysSel.length) rows = rows.filter(e => this.sysSel.includes(e.sys));
      return rows;
    },
    boards() {
      const safe = ['S+', 'S', 'A'];
      return this.DB.mobos.filter(m =>
        this.boardFilter === 'safe' ? safe.includes(m.tier) :
        this.boardFilter === 'risky' ? !safe.includes(m.tier) :
        this.boardFilter === 'glitch' ? !!m.glitchable : true);
    },
    scoreboard() {
      const k = this.sortK, d = this.sortD;
      return [...this.DB.score].sort((a, b) =>
        (typeof a[k] === 'number' ? a[k] - b[k] : String(a[k]).localeCompare(String(b[k]))) * d);
    },
    models() {
      const t = this.mq.trim().toLowerCase();
      return this.DB.models.filter(m =>
        (this.genSel === 'All' || m.gen === this.genSel) &&
        (!t || Object.values(m).join(' ').toLowerCase().includes(t)));
    },
    editions() { return this.DB.editions; },
    BU() { return this.DB.softmods && this.DB.softmods.badupdate; }
  },

  methods: {
    quad(i) { return sector(i * 90 + 2, i * 90 + 88, 23, 45); },
    lit(d, q) { return d === 0 ? true : q < d; },
    setDigit(i, n) { this.digits[i] = n; },
    decOf(code) {
      const m = String(code).match(/\d{4}/);
      return m ? m[0].split('').reduce((a, c) => a * 4 + (+c), 0) : -99;
    },
    // numeric secondary -> its dashboard E-code; an E-keyed row -> its secondary code
    eOf(code) {
      const d = this.decOf(code);
      if (d >= 0) return 'E' + d;
      const m = String(code).match(/E\s*(\d{1,3})/i);
      return m ? (+m[1]).toString(4).padStart(4, '0') : '—';
    },
    loadCode(c) {
      const m = String(c).match(/\d{4}/);
      if (!m) return;
      this.digits = m[0].split('').map(Number);
      this.go('decoder');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    toggleSys(s) {
      const i = this.sysSel.indexOf(s);
      i > -1 ? this.sysSel.splice(i, 1) : this.sysSel.push(s);
    },
    sortBy(k) { this.sortD = this.sortK === k ? -this.sortD : 1; this.sortK = k; },
    sevStyle(sev) {
      const c = { fatal: '#ff3b30', serious: '#ffb020', moderate: '#8ede5f', minor: '#4fb0ff' }[sev] || 'var(--dim)';
      return { color: c, border: '1px solid ' + c, background: 'color-mix(in srgb,' + c + ' 12%,transparent)' };
    },
    riskColor(r) { return r >= 60 ? '#ff3b30' : r >= 30 ? '#ffb020' : '#8ede5f'; },
    hl(text) {
      const t = esc(text), term = this.q.trim();
      if (!term || term.length < 2) return t;
      return t.replace(new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
    },
    go(id) { this.tab = id; LS.set('tab', id); this.syncHash(); },
    syncHash() {
      const h = this.tab === 'decoder' ? '#decoder/' + this.code : '#' + this.tab;
      if (location.hash !== h) history.replaceState(null, '', h);
    },
    readHash() {
      const [t, c] = decodeURIComponent(location.hash.replace(/^#/, '')).split('/');
      if (t && this.tabs.some(x => x.id === t)) this.tab = t;
      if (c && /^[0-3]{4}$/.test(c)) this.digits = c.split('').map(Number);
    },
    setPhosphor(p) { this.phosphor = p; LS.set('phosphor', p); document.documentElement.dataset.phosphor = p; },
    toggleScan() { this.scan = !this.scan; LS.set('scan', this.scan); document.body.dataset.scanlines = this.scan ? 'on' : 'off'; },
    async copy(text, msg) {
      try { await navigator.clipboard.writeText(text); } catch (e) {}
      this.toast = msg || 'Copied';
      clearTimeout(this._t); this._t = setTimeout(() => this.toast = '', 1600);
    },
    keys(e) {
      if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) { if (e.key === 'Escape') e.target.blur(); return; }
      if (e.key === '/') { e.preventDefault(); this.go('codes'); this.$nextTick(() => this.$refs.search.focus()); }
      const n = '123456'.indexOf(e.key);
      if (n > -1) this.go(this.tabs[n].id);
      if (this.tab === 'decoder' && /^[0-3]$/.test(e.key)) {
        this.digits = [...this.digits.slice(1), +e.key]; // shift a digit in, like tapping Eject
      }
    }
  },

  watch: {
    code() { this.syncHash(); },
    tab() { this.syncHash(); }
  },

  mounted() {
    document.documentElement.dataset.phosphor = this.phosphor;
    document.body.dataset.scanlines = this.scan ? 'on' : 'off';
    this.readHash();
    window.addEventListener('hashchange', this.readHash);
    window.addEventListener('keydown', this.keys);
  }
}).mount('#app');

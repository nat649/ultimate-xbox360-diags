import { DB, store, navigate, loadCode, toast } from '../store.js';

const SAFE = ['S+', 'S', 'A'];

export default {
  template: '#tpl-boards',
  data() { return { filter: '', flash: '' }; },
  computed: {
    boards() {
      const f = this.filter;
      return DB.mobos.filter(m =>
        f === 'safe' ? SAFE.includes(m.tier) :
        f === 'risky' ? !SAFE.includes(m.tier) :
        f === 'glitch' ? !!m.glitchable :
        f === 'pinned' ? store.favs.includes('board:' + m.slug) : true);
    },
    cmp() { return store.compare.map(s => DB.mobos.find(m => m.slug === s)).filter(Boolean); },
    // spec rows for the comparison table; a row is flagged when the boards disagree
    cmpRows() {
      const rows = [
        ['Tier', m => m.tier], ['RROD risk', m => m.risk + '%'], ['Year', m => m.year],
        ...[...new Set(this.cmp.flatMap(m => Object.keys(m.stats)))].map(k => [k, m => m.stats[k] || '—']),
        ['HDMI', m => m.id.hdmi ? 'Yes' : 'No'], ['JTAG', m => m.compat?.jtag || '—'], ['RGH', m => m.compat?.rgh || '—'],
        ['BadUpdate', m => m.compat?.badupdate || '—'], ['Fails first', m => m.faults || '—']
      ];
      return rows.map(([k, f]) => { const v = this.cmp.map(f); return { k, v, diff: new Set(v).size > 1 }; });
    }
  },
  watch: {
    'S.route': {
      handler(r) {
        if (r.tab !== 'boards' || !r.arg) return;
        this.filter = '';
        this.flash = r.arg;
        this.$nextTick(() => document.getElementById('board-' + r.arg)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        clearTimeout(this._ft); this._ft = setTimeout(() => this.flash = '', 1800);
      },
      immediate: true
    }
  },
  methods: {
    loadCode,
    riskColor(r) { return r >= 60 ? 'var(--sev-fatal)' : r >= 30 ? 'var(--sev-serious)' : 'var(--sev-moderate)'; },
    inCmp(m) { return store.compare.includes(m.slug); },
    toggleCmp(m) {
      if (this.inCmp(m)) store.compare = store.compare.filter(s => s !== m.slug);
      else if (store.compare.length >= 3) toast('Compare up to three boards');
      else store.compare = [...store.compare, m.slug];
    },
    clearCmp() { store.compare = []; },
    showCmp() { document.getElementById('compare')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
    link(m) { navigate('boards/' + m.slug, { replace: true }); }
  }
};

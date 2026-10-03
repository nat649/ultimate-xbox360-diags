import { ymNum } from '../lib.js';
import { DB, store, navigate } from '../store.js';

const CATS = { diagnosis: 'Diagnosis', repair: 'Repair', hardware: 'Hardware', modding: 'Modding', models: 'Models' };

export default {
  template: '#tpl-reference',
  data() { return { gq: '', cat: '', flash: '' }; },
  computed: {
    cats() { return CATS; },
    terms() {
      const t = this.gq.trim().toLowerCase();
      return DB.glossary
        .filter(g => (!this.cat || g.cat === this.cat) &&
          (!t || (g.term + ' ' + g.aka.join(' ') + ' ' + g.def).toLowerCase().includes(t)))
        .sort((a, b) => a.term.localeCompare(b.term));
    },
    // overview strip: one dot per event on a year axis, one lane per kind
    tl() {
      const x0 = 2005, x1 = 2026, W = 1000, X = v => 20 + (v - x0) / (x1 - x0) * (W - 40);
      const ev = DB.timeline.map(e => ({ ...e, x: X(ymNum(e.date)), y: { board: 22, hack: 42, event: 62 }[e.kind] }));
      const ticks = [];
      for (let y = x0; y <= x1; y++) ticks.push({ y, x: X(y) });
      return { ev, ticks, W };
    },
    // the readable version: events grouped by year
    byYear() {
      const out = [];
      DB.timeline.forEach(e => {
        const y = e.date.slice(0, 4);
        if (!out.length || out.at(-1).y !== y) out.push({ y, ev: [] });
        out.at(-1).ev.push(e);
      });
      return out;
    }
  },
  watch: {
    'S.route': {
      handler(r) {
        if (r.tab !== 'reference' || !r.arg) return;
        this.gq = ''; this.cat = '';
        this.flash = r.arg;
        this.$nextTick(() => document.getElementById('term-' + r.arg)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        clearTimeout(this._ft); this._ft = setTimeout(() => this.flash = '', 1800);
      },
      immediate: true
    }
  },
  methods: {
    openEvent(e) { if (e.board) navigate('boards/' + e.board); },
    link(g) { navigate('reference/' + g.slug, { replace: true }); },
    kindLabel(k) { return { board: 'Board', hack: 'Hack', event: 'Event' }[k]; }
  }
};

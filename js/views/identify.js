import { ymNum } from '../lib.js';
import { DB, store, navigate } from '../store.js';

// answers live in the URL (#identify?c=Phat&hdmi=1&w=175&d=2008-06), so a result can be shared
export default {
  template: '#tpl-identify',
  computed: {
    a() { return store.route.tab === 'identify' ? store.route.query : (this._a || {}); },
    wattOptions() {
      const set = new Set();
      DB.mobos.filter(m => !this.a.c || m.id.chassis.includes(this.a.c)).forEach(m => m.id.watts.forEach(w => set.add(w)));
      return [...set].sort((x, y) => y - x);
    },
    // every board that survives the hard answers, weighted by how far the manufacture date sits outside its window
    ranked() {
      const a = this.a, d = a.d && /^\d{4}-\d{2}$/.test(a.d) ? ymNum(a.d) : null;
      const rows = DB.mobos.filter(m =>
        (!a.c || m.id.chassis.includes(a.c)) &&
        (a.hdmi == null || a.hdmi === '' || m.id.hdmi === (a.hdmi === '1')) &&
        (!a.w || m.id.watts.includes(+a.w)) &&
        (a.ihs == null || a.ihs === '' || (a.ihs === '0') === (m.slug === 'winchester'))
      ).map(m => {
        let miss = 0;
        if (d != null) {
          const f = ymNum(m.id.dateFrom), t = ymNum(m.id.dateTo) + 1 / 12;
          miss = d < f ? f - d : d > t ? d - t : 0;
        }
        return { m, w: 1 / (1 + miss * 6) ** 2, miss };
      }).filter(x => x.miss < 1.5);
      const total = rows.reduce((s, x) => s + x.w, 0) || 1;
      return rows.map(x => ({ ...x, p: x.w / total })).sort((x, y) => y.p - x.p);
    },
    top() { return this.ranked[0]; },
    answered() { return ['c', 'hdmi', 'w', 'd', 'ihs'].filter(k => this.a[k]).length; },
    // a guess is solid once one board holds most of the weight
    confident() { return this.top && this.top.p >= 0.75; },
    years() { const out = []; for (let y = 2005; y <= 2016; y++) out.push(y); return out; },
    dYear() { return (this.a.d || '').slice(0, 4); },
    dMonth() { return (this.a.d || '').slice(5, 7); }
  },
  watch: { a(v) { this._a = v; } },
  methods: {
    set(k, v) {
      const q = { ...this.a };
      if (v === '' || v == null || q[k] === String(v)) delete q[k]; else q[k] = String(v);
      // a chassis change invalidates the answers that only make sense for the old one
      if (k === 'c') { delete q.hdmi; delete q.w; delete q.ihs; }
      navigate({ tab: 'identify', arg: '', query: q }, { replace: true });
    },
    setDate(y, m) {
      if (!y) return this.set('d', '');
      this.set('d', y + '-' + (m || '06'));
    },
    on(k, v) { return this.a[k] === String(v) ? '1' : '0'; },
    reset() { navigate({ tab: 'identify', arg: '', query: {} }, { replace: true }); },
    pct(p) { return Math.round(p * 100); }
  }
};

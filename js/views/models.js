import { DB, navigate } from '../store.js';

export default {
  template: '#tpl-models',
  data() { return { genSel: 'All', mq: '', gens: ['All', 'Phat', 'Slim (S)', 'E'] }; },
  computed: {
    models() {
      const t = this.mq.trim().toLowerCase();
      return DB.models.filter(m =>
        (this.genSel === 'All' || m.gen === this.genSel) &&
        (!t || Object.values(m).join(' ').toLowerCase().includes(t)));
    },
    editions() {
      const t = this.mq.trim().toLowerCase();
      return DB.editions.filter(e =>
        (this.genSel === 'All' || e.chassis === this.genSel) &&
        (!t || Object.values(e).join(' ').toLowerCase().includes(t)));
    }
  },
  watch: {
    // #models?q=Jasper prefills the filter (used by the command palette)
    'S.route': { handler(r) { if (r.tab === 'models' && r.query.q != null) { this.mq = r.query.q; this.genSel = 'All'; } }, immediate: true }
  },
  methods: {
    // "Zephyr - late stock may be an early Falcon" -> the first board named
    boardIn(text) {
      const t = String(text).toLowerCase();
      return DB.mobos.map(m => ({ m, i: t.indexOf(m.name.split(/[\s(]/)[0].toLowerCase()) }))
        .filter(x => x.i > -1).sort((a, b) => a.i - b.i)[0]?.m;
    },
    open(m) { navigate('boards/' + m.slug); }
  }
};

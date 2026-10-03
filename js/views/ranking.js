import { DB, navigate } from '../store.js';

export default {
  template: '#tpl-ranking',
  data() {
    return { sortK: 'rank', sortD: 1, cols: [['rank', '#'], ['board', 'Board'], ['rel', 'Reliability'], ['why', 'Why it sits here']] };
  },
  computed: {
    scoreboard() {
      const k = this.sortK, d = this.sortD;
      return [...DB.score].sort((a, b) =>
        (typeof a[k] === 'number' ? a[k] - b[k] : String(a[k]).localeCompare(String(b[k]))) * d);
    }
  },
  methods: {
    sortBy(k) { this.sortD = this.sortK === k ? -this.sortD : 1; this.sortK = k; },
    ariaSort(k) { return this.sortK === k ? (this.sortD > 0 ? 'ascending' : 'descending') : 'none'; },
    // tier-list names ("Late Falcon v2 (Rhea)", "Corona V2-V5") map to board cards by their first word
    boardOf(label) {
      const w = label.split(/[\s/(]/)[0].toLowerCase();
      return DB.mobos.find(b => b.name.toLowerCase().startsWith(w));
    },
    openBoard(label) { const m = this.boardOf(label); if (m) navigate('boards/' + m.slug); }
  }
};

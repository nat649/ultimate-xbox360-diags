import { valsOf, toBase4, crossRef, findRow, quad } from '../lib.js';
import { DB, store, navigate, pushRecent, loadCode, logCode, newConsole, toast, printSheet, linkTo } from '../store.js';

export default {
  template: '#tpl-decoder',
  data() {
    return {
      eInput: 74,
      guide: null,        // guided reading: { step: 0-4, digits: [] }
      logTarget: '',
      chassis: 'Phat'
    };
  },
  computed: {
    code() { return store.digits.join(''); },
    ecode() { return store.digits.reduce((a, d) => a * 4 + d, 0); },
    match() { return DB.errors.find(e => valsOf(e.code).includes(this.ecode)); },
    neighbours() {
      const t = this.ecode;
      return DB.errors
        .map(e => ({ e, d: Math.min(...valsOf(e.code).map(v => Math.abs(v - t))) }))
        .sort((a, b) => a.d - b.d).slice(0, 5).map(x => x.e);
    },
    eToSecondary() { return toBase4(parseInt(this.eInput, 10) || 0); },
    eRow() { return findRow(DB.errors, 'E' + (parseInt(this.eInput, 10) || 0)); },
    // boards whose "Its codes" list includes this code
    boardsFor() { return this.match ? DB.mobos.filter(m => (m.codes || []).some(c => valsOf(c).some(v => valsOf(this.match.code).includes(v)))) : []; },
    toolsFor() { return this.match ? DB.tools[this.match.difficulty] || [] : []; },
    pinned() {
      return store.favs.map(f => {
        const [kind, id] = f.split(':');
        if (kind === 'code') { const r = findRow(DB.errors, id); return r && { kind, id, label: r.code, sub: r.sys }; }
        if (kind === 'board') { const b = DB.mobos.find(m => m.slug === id); return b && { kind, id, label: b.name, sub: 'Board' }; }
      }).filter(Boolean);
    },
    primary() { return DB.primary.filter(p => p.chassis === this.chassis); }
  },
  watch: {
    code(c) {
      if (store.route.tab === 'decoder') navigate('decoder/' + c, { replace: true });
      clearTimeout(this._rt);
      // only remember codes the user settled on
      this._rt = setTimeout(() => { if (this.match) pushRecent(c); }, 1500);
    },
    'S.route.query.guide': { handler(v) { if (v) this.startGuide(); }, immediate: true }
  },
  methods: {
    crossRef,
    ringQuad: quad,
    printCode() {
      const m = this.match;
      printSheet({
        title: 'Code ' + this.code + ' (E' + this.ecode + ')',
        subtitle: m.sys + ' · ' + m.severity + ' · fix: ' + m.difficulty,
        meta: [['Boards', m.boards], ['Listed as', m.code], ['Related', (m.related || []).join(', ') || '—']],
        sections: [{ h: 'Diagnosis', body: m.fix }, { h: 'Deeper', body: m.detail }, { h: "What you'll need", body: this.toolsFor.join(', ') }]
          .filter(s => s.body),
        link: linkTo('decoder/' + this.code)
      });
    },
    setDigit(i, n) { store.digits[i] = n; },
    reset() { store.digits = [0, 0, 0, 0]; },
    open(p) { p.kind === 'code' ? loadCode(p.id) : navigate('boards/' + p.id); },
    startGuide() { this.guide = { step: 0, digits: [] }; this.$nextTick(() => this.$refs.guide?.focus()); },
    guideNext() { this.guide.step++; },
    guidePick(n) {
      this.guide.digits.push(n);
      if (this.guide.digits.length === 4) {
        store.digits = [...this.guide.digits];
        pushRecent(this.code);
        this.guide = null;
        toast('Code ' + this.code + ' entered');
      }
    },
    guideBack() {
      if (this.guide.digits.length) this.guide.digits.pop();
      else if (this.guide.step > 0) this.guide.step--;
      else this.guide = null;
    },
    closeGuide() { this.guide = null; if (store.route.query.guide) navigate('decoder/' + this.code, { replace: true }); },
    saveToLog() {
      let id = this.logTarget;
      if (!id || id === '__new') id = newConsole().id;
      logCode(id, this.code);
      this.logTarget = id;
    }
  }
};

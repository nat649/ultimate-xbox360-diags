import { findRow, fmtDate, valsOf, toBase4 } from '../lib.js';
import { DB, store, navigate, newConsole, logCode, loadCode, printSheet, toast } from '../store.js';

const STATUSES = [['diagnosing', 'Diagnosing'], ['waiting', 'Waiting on parts'], ['repaired', 'Repaired'], ['parted', 'Parted out']];

export default {
  template: '#tpl-consoles',
  data() { return { addCode: '', confirmDel: '' }; },
  computed: {
    statuses() { return STATUSES; },
    list() { return [...store.consoles].sort((a, b) => b.updated - a.updated); },
    sel() { return store.consoles.find(c => c.id === store.route.arg) || null; },
    boards() { return DB.mobos; }
  },
  methods: {
    fmtDate,
    rowOf(code) { return findRow(DB.errors, code); },
    statusLabel(s) { return (STATUSES.find(x => x[0] === s) || [, s])[1]; },
    open(c) { navigate('consoles/' + c.id, { replace: true }); },
    add() { const c = newConsole(); this.open(c); },
    touch() { if (this.sel) this.sel.updated = Date.now(); },
    log() {
      const raw = this.addCode.trim();
      const v = valsOf(raw.match(/^\d{1,3}$/) ? 'E' + raw : raw)[0];
      if (v == null || v > 255) return toast('Enter a 4-digit code (0-3) or an E-code');
      logCode(this.sel.id, toBase4(v));
      this.addCode = '';
    },
    unlog(i) { this.sel.codes.splice(i, 1); this.touch(); },
    remove(c) {
      if (this.confirmDel !== c.id) { this.confirmDel = c.id; return; }
      store.consoles = store.consoles.filter(x => x.id !== c.id);
      this.confirmDel = '';
      navigate('consoles', { replace: true });
      toast('Deleted ' + c.name);
    },
    loadCode,
    exportAll() {
      const blob = new Blob([JSON.stringify({ app: 'x360-diags', version: 1, consoles: store.consoles }, null, 1)], { type: 'application/json' });
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'x360-consoles-' + new Date().toISOString().slice(0, 10) + '.json' });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    async importFile(ev) {
      const f = ev.target.files[0];
      ev.target.value = '';
      if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        const incoming = (Array.isArray(data) ? data : data.consoles || []).filter(c => c && c.id && c.name);
        if (!incoming.length) throw new Error('no consoles');
        // merge by id: an imported console replaces the local copy of the same console
        const ids = new Set(incoming.map(c => c.id));
        store.consoles = [...incoming.map(c => ({ codes: [], notes: '', status: 'diagnosing', ...c })), ...store.consoles.filter(c => !ids.has(c.id))];
        toast('Imported ' + incoming.length + ' console' + (incoming.length > 1 ? 's' : ''));
      } catch (e) { toast('That file is not a console export'); }
    },
    print(c) {
      printSheet({
        kind: 'console', title: c.name,
        meta: [['Status', this.statusLabel(c.status)], ['Chassis', c.chassis || '—'], ['Board', c.board || '—'], ['Manufactured', c.mfg || '—'], ['Serial', c.serial || '—']],
        codes: c.codes.map(x => ({ code: x.code, at: fmtDate(x.at), row: this.rowOf(x.code) })),
        notes: c.notes
      });
    }
  }
};

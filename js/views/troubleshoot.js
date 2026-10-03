import { DB, store, navigate } from '../store.js';

// shortest path from "start" to every node, so a deep link can still show its breadcrumb trail
const trails = (() => {
  const out = { start: [] }, queue = ['start'];
  while (queue.length) {
    const k = queue.shift();
    for (const o of DB.flows[k].options || []) {
      if (!(o.next in out)) { out[o.next] = [...out[k], { node: k, answer: o.label }]; queue.push(o.next); }
    }
  }
  return out;
})();

export default {
  template: '#tpl-troubleshoot',
  computed: {
    id() { return store.route.tab === 'troubleshoot' && DB.flows[store.route.arg] ? store.route.arg : (this._last || 'start'); },
    node() { return DB.flows[this.id]; },
    trail() { return trails[this.id] || []; },
    depth() { return this.trail.length; }
  },
  watch: { id(v) { this._last = v; } },
  methods: {
    pick(o) { navigate('troubleshoot/' + o.next); },
    back(i) { navigate('troubleshoot/' + (i == null ? (this.trail.at(-1)?.node || 'start') : this.trail[i].node)); },
    restart() { navigate('troubleshoot/start'); },
    q(k) { return DB.flows[k].q; }
  }
};

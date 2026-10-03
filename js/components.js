/* Small shared components. Their markup lives in index.html as <template id="tpl-..."> blocks. */
import { quad, lit } from './lib.js';
import { isFav, toggleFav } from './store.js';

export const RingDigit = {
  template: '#tpl-ring-digit',
  props: { d: Number, size: { type: Number, default: 80 }, interactive: Boolean, label: String },
  emits: ['set'],
  methods: {
    quad, lit,
    // clicking quadrant q (1-4) means "this many are lit"; four lit is digit 0
    pick(q) { if (this.interactive) this.$emit('set', q === 4 ? 0 : q); }
  }
};

export const SevBadge = {
  props: { sev: String },
  template: `<span v-if="sev" class="sev label capitalize whitespace-nowrap" :data-sev="sev">{{ sev }}</span>`
};

export const TierBox = {
  props: { tier: String, size: { type: String, default: 'md' } },
  template: `<span v-if="tier" :class="['tierbox', 'tier-' + tier, 'tierbox-' + size]" :title="'Reliability tier ' + tier">{{ tier }}</span>`
};

export const FavStar = {
  props: { k: String, label: String },
  computed: { on() { return isFav(this.k); } },
  methods: { flip() { toggleFav(this.k, this.label); } },
  template: `<button type="button" class="star" :data-on="on ? '1' : '0'" @click.stop="flip"
      :aria-pressed="on" :aria-label="(on ? 'Unpin ' : 'Pin ') + label" :title="on ? 'Unpin' : 'Pin to the decoder'">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>
    </button>`
};

export const Icon = {
  props: { n: String, s: { type: Number, default: 18 } },
  template: `<svg :width="s" :height="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="n==='ring'"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 8 8" stroke-width="3.2"/></template>
    <template v-else-if="n==='flow'"><rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="16" width="7" height="5" rx="1"/><path d="M6.5 8v4.5h11V16"/></template>
    <template v-else-if="n==='list'"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></template>
    <template v-else-if="n==='search'"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></template>
    <template v-else-if="n==='chip'"><rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></template>
    <template v-else-if="n==='tier'"><path d="M4 6h16M4 12h11M4 18h6"/></template>
    <template v-else-if="n==='box'"><rect x="3" y="7" width="18" height="11" rx="2"/><path d="M7 14h.01M11 14h6"/></template>
    <template v-else-if="n==='key'"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3"/></template>
    <template v-else-if="n==='book'"><path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></template>
    <template v-else-if="n==='wrench'"><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8z" transform="rotate(0)"/><path d="M3 21l6-6"/></template>
    <template v-else-if="n==='more'"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></template>
    <template v-else-if="n==='sun'"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></template>
    <template v-else-if="n==='moon'"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></template>
    <template v-else-if="n==='auto'"><circle cx="12" cy="12" r="8"/><path d="M12 4v16a8 8 0 0 0 0-16z" fill="currentColor"/></template>
    <template v-else-if="n==='print'"><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><rect x="6" y="14" width="12" height="7"/></template>
    <template v-else-if="n==='link'"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></template>
    <template v-else-if="n==='x'"><path d="M6 6l12 12M18 6 6 18"/></template>
    <template v-else-if="n==='cmd'"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></template>
  </svg>`
};

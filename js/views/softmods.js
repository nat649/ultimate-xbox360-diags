import { DB, navigate } from '../store.js';

export default {
  template: '#tpl-softmods',
  computed: { BU() { return DB.softmods && DB.softmods.badupdate; } },
  methods: {
    dim(v) { return /^(No|None)/.test(v); },
    open(m) { navigate('boards/' + m.slug); }
  }
};

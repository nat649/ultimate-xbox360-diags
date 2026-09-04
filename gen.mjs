import fs from 'fs';
const d = JSON.parse(fs.readFileSync('data.json','utf8'));

const tierOf = {};
d.tiers.forEach(t => t.items.forEach(i => tierOf[i.toLowerCase()] = t.tier));
function findTier(name){
  const n = name.toLowerCase();
  for (const k in tierOf) {
    const base = k.split('(')[0].split('/')[0].trim();
    if (n.includes(base) || base.includes(n.split('(')[0].trim())) return tierOf[k];
  }
  return null;
}
const mobos = d.mobos.map(m => ({...m, tier: findTier(m.name)}));

const score = d.named['[Ranking] Detailed Scoreboard'].map(([rank,board,rel,why]) => ({
  rank: +rank, board, rel: parseFloat(rel), relText: rel, why
}));

const gen = (key, label) => (d.named[key]||[]).map(([sku,years,storage,finish,notes]) =>
  ({gen: label, sku, years, storage, finish, notes}));
const models = [
  ...gen('[Models] Original Xbox 360 "Phat" (2005 - 2010)','Phat'),
  ...gen('[Models] Xbox 360 S / "Slim" (2010 - 2013)','Slim (S)'),
  ...gen('[Models] Xbox 360 E (2013 - 2016)','E'),
];
const editions = (d.named['[Info] Notable Limited & Special Editions']||[]).map(([name,year,chassis,notes])=>({name,year,chassis,notes}));

const out = {errors: d.errors, mobos, tiers: d.tiers, score, models, editions, softmods: d.softmods};
fs.writeFileSync('data.js', '/* Auto-generated dataset for the 360 Diagnostic Wiki. Edit here, the UI reads it. */\nwindow.DIAGS = ' + JSON.stringify(out, null, 1) + ';\n');
console.log('tiers assigned:', mobos.map(m=>m.name+'='+m.tier).join(', '));
console.log('models', models.length, 'editions', editions.length, 'score', score.length);

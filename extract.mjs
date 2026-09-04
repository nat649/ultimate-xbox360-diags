import fs from 'fs';
const html = fs.readFileSync('index.legacy.html','utf8');
const strip = s => s.replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&rarr;/g,'→').replace(/&mdash;/g,'—').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const cells = tr => [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m=>strip(m[1]));

function tableRows(section){
  const tb = section.match(/<tbody>([\s\S]*?)<\/tbody>/);
  if(!tb) return [];
  return [...tb[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(m=>cells(m[1])).filter(r=>r.length);
}

// 1. error codes
const dt = html.match(/<table id="dataTable">([\s\S]*?)<\/table>/)[1];
const errors = tableRows(dt).filter(r=>r.length>=4).map(([code,sys,boards,fix])=>({code,sys,boards,fix}));

// 2. motherboards
const mobos = [...html.matchAll(/<div class="mobo-box([^"]*)">([\s\S]*?)<\/div>\s*<\/div>/g)].map(m=>{
  const body=m[2];
  const h4=body.match(/<h4>([\s\S]*?)<\/h4>/)[1];
  const year=(h4.match(/<span class="year">([\s\S]*?)<\/span>/)||[,''])[1];
  const name=strip(h4.replace(/<span class="year">[\s\S]*?<\/span>/,''));
  const stats={};
  [...body.matchAll(/<li><strong>([^<]*):<\/strong>([\s\S]*?)<\/li>/g)].forEach(s=>stats[strip(s[1])]=strip(s[2]));
  const desc=strip((body.match(/<div class="mobo-desc">([\s\S]*)/)||[,''])[1]);
  return {name,year:strip(year),highlight:m[1].includes('highlight'),stats,desc};
});

// 3. tiers
const tiers=[...html.matchAll(/<div class="tier-row">([\s\S]*?)<\/div>\s*<\/div>/g)].map(m=>({
  tier:strip((m[1].match(/<div class="tier-label[^"]*">([\s\S]*?)<\/div>/)||[,''])[1]),
  cls:(m[1].match(/tier-label (tier-\w+)/)||[,''])[1],
  items:[...m[1].matchAll(/<span class="tier-chip">([\s\S]*?)<\/span>/g)].map(x=>strip(x[1]))
}));

// 4+5. remaining tables in document order, keyed by preceding h2
const tables=[...html.matchAll(/<h2>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2>|<\/div>\s*<\/div>\s*<!--|$)/g)];
const named={};
for(const t of tables){
  const title=strip(t[1]);
  const rows=tableRows(t[2]);
  if(rows.length && !/Complete Error Code/.test(title)) named[title]=rows;
}
fs.writeFileSync('data.json',JSON.stringify({errors,mobos,tiers,named},null,1));
console.log('errors',errors.length,'mobos',mobos.length,'tiers',tiers.length);
console.log(Object.keys(named).map(k=>k+' :: '+named[k].length).join('\n'));
console.log('sys tags:', [...new Set(errors.map(e=>e.sys))].join(' | '));

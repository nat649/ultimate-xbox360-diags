/* Offline support. Site files are pre-cached; everything else (CDN scripts, fonts) is
   stale-while-revalidate, so the page works offline after one online visit.
   Bump VERSION whenever a site file changes so returning visitors get the new copy. */
const VERSION = 'x360-v2';
const SITE = [
  './', 'index.html', 'app.css', 'data.js', 'icon.svg', 'icon-192.png', 'manifest.webmanifest',
  'js/main.js', 'js/lib.js', 'js/store.js', 'js/components.js',
  'js/views/decoder.js', 'js/views/troubleshoot.js', 'js/views/codes.js', 'js/views/identify.js',
  'js/views/boards.js', 'js/views/ranking.js', 'js/views/models.js', 'js/views/softmods.js',
  'js/views/reference.js', 'js/views/consoles.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SITE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !/^https?:/.test(req.url)) return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    const fresh = fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    }).catch(() => hit || (req.mode === 'navigate' ? cache.match('index.html') : Response.error()));
    return hit || fresh;
  }));
});

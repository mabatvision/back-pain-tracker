// Offline cache for the app shell. Bump VERSION whenever files change.
const VERSION = 'bt-v2';
const ASSETS = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// network-first: latest version when online; cache when offline or the network is slow (>3s)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  const key = e.request.mode === 'navigate' ? 'index.html' : e.request;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const cached = await cache.match(key, { ignoreSearch: true });
    const net = fetch(e.request, { cache: 'no-cache' })
      .then(r => { if (r.ok) cache.put(key, r.clone()); return r; });
    if (!cached) return net;
    const slow = new Promise(res => setTimeout(() => res(cached), 3000));
    return Promise.race([net.catch(() => cached), slow]);
  }));
});

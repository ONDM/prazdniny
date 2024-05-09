const cacheName = 'prazdniny-v1';
const offlinePage = 'offline.html';
const assets = [
  '/prazdniny/',
  '/prazdniny/index.html',
  '/prazdniny/style.css',
  '/prazdniny/script.js',
  '/prazdniny/favicon.png',
  '/prazdniny/font1.woff2',
  '/prazdniny/manifest.json',
  '/prazdniny/logo.png',
];

self.addEventListener('install', event =>
  {
  event.waitUntil(
    caches.open(cacheName).then(cache =>
      {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', event =>
  {
  event.respondWith(
    caches.match(event.request).then(response =>
      {
      return response || fetch(event.request);
      }).catch(() =>
      {
      return caches.match(offlinePage);
    })
  );
});

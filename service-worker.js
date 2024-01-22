const cacheName = 'prazdniny-cache-v2';

self.addEventListener('install', (event) =>
{
  event.waitUntil(
    caches.open(cacheName).then((cache) =>
    {
      return cache.addAll([
        '/prazdniny/',
        '/prazdniny/manifest.json',
        '/prazdniny/style.css',
        '/prazdniny/script.js',
        '/prazdniny/favicon.png',
        '/prazdniny/font.woff2',
        '/prazdniny/sw.js',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) =>
{
  event.respondWith(
  caches.match(event.request).then((response) =>
  {
    return response || fetch(event.request);
  })
  );
});

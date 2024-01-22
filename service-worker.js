const cacheName = 'prazdniny-cache-v2';

self.addEventListener('install', (event) =>
{
  event.waitUntil(
    caches.open(cacheName).then((cache) =>
    {
      return cache.addAll([
        '/',
        '/manifest.json',
        'style.css',
        'script.js',
        'favicon.png',
        'font/font1.woff2',
        'font/font2.woff2',
        'sw.js',
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

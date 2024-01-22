// SERVICE-WORKER STATUS
if ('serviceWorker' in navigator)
{
  navigator.serviceWorker.register('/service-worker.js')
  .then((registration) =>
  {
    console.log('Service Worker zaregistrován:', registration);
  })
  .catch((error) =>
  {
    console.log('Chyba při registraci Service Worker:', error);
  });
}

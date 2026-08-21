const cacheName = "mkarpenko-WorldBox-0.51.2";
const contentToCache = [
    "Build/WorldFox.loader.js",
    "Build/WorldFox.framework.js.br",
    "Build/WorldFox.data.br",
    "Build/WorldFox.wasm.br",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('caching all app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});

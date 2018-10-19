const CACHE_NAME = "offline";
const NONCACHED_HOSTS = [
  "https://www.googleapis.com/",
  "https://firestore.googleapis.com"
];

// self.addEventListener("install", function(event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache) {
//       return cache.addAll([
//         "/__/firebase/init.json",
//         "/dist/build.js",
//         "/index.html",
//       ]);
//     })
//   );
// });

self.addEventListener("fetch", (event: any) => {
  event.respondWith(
    (function() {
      const isNoCache =
        NONCACHED_HOSTS.map(function(domain) {
          return event.request.url.startsWith(domain) || undefined;
        }).filter(i => i).length > 0;

      if (isNoCache) {
        return fetch(event.request);
      } else {
        return caches.open(CACHE_NAME).then(function(cache) {
          return cache.match(event.request).then(function(response) {
            return (
              response ||
              fetch(event.request).then(function(response) {
                cache.put(event.request, response.clone());
                return response;
              })
            );
          });
        });
      }
    })()
  );
});

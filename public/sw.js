// Minimal service worker. Its main job is simply to exist — Chrome/Android
// require an active service worker before it will offer the "Install app"
// prompt at all. On top of that, it caches the app shell so the icon/manifest
// and a basic offline fallback keep working without a network round-trip.

const CACHE_NAME = "apexedunexus-shell-v1";
const SHELL_FILES = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for everything (this app is API/data-driven — stale cached
// data would be actively misleading for deadlines/quizzes). Cache is only a
// fallback for when the network is genuinely unavailable.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
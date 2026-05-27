// Roadmap service worker
// A fetch handler is REQUIRED for Chrome to offer a real PWA install prompt.
// Strategy: network-first for everything. No offline cache yet.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === "navigate") {
        return new Response(
          "<html><body><p>You are offline. Please reconnect to use Roadmap.</p></body></html>",
          { headers: { "Content-Type": "text/html" } }
        );
      }
      return new Response("", { status: 503 });
    })
  );
});

// Vorici Calculator Service Worker
const CACHE_NAME = 'vorici-calculator-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/calculator.html',
  '/guides.html',
  '/faq.html',
  '/mechanics.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/404.html',
  '/styles.min.css',
  '/styles.css',
  '/breadcrumbs.css',
  '/script.min.js',
  '/script.js',
  '/favicon.ico',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/sitemap.xml',
  '/robots.txt'
];

// Install event - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and those coming from third-party domains
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Cache successful response for future requests
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          });
      })
      .catch(() => {
        // If both cache and network fail, serve fallback HTML for HTML requests
        if (event.request.headers.get('Accept').includes('text/html')) {
          return caches.match('/404.html');
        }
      })
  );
});

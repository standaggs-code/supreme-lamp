const CACHE_NAME = 'league-cmd-center-v2';
const ASSETS = [
    './',
    './index.html',
    './nba_league_command_center.html',
    './icon-192.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // Add files individually so a single 404 doesn't crash the entire setup
            return Promise.all(
                ASSETS.map(url => {
                    return cache.add(url).catch(err => {
                        console.warn(`Service Worker: Failed to cache ${url}, skipping...`);
                    });
                })
            );
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

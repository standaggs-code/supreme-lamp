const CACHE_NAME = 'nba-dashboards-v1';
const ASSETS = ['/', '/index.html', '/nba_league_command_center.html'];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Never cache live API requests
    if (e.request.url.includes('api.espn.com') || e.request.url.includes('cdn.nba.com')) {
        return;
    }
    // Network-first strategy for local app files
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});

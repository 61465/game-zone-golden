const GZ_CACHE = 'gamzone-v1';
const GZ_BASE = '/game-zone-golden';
const GZ_ASSETS = [
    GZ_BASE + '/',
    GZ_BASE + '/index.html',
    GZ_BASE + '/styles.css',
    GZ_BASE + '/app.js',
    GZ_BASE + '/manifest.json'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(GZ_CACHE).then(c => c.addAll(GZ_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== GZ_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (url.hostname.includes('mistral') || url.hostname.includes('generativelanguage') ||
        url.hostname.includes('openrouter') || url.hostname.includes('pollinations')) return;
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
            if (res.ok && url.origin === self.location.origin) {
                const clone = res.clone();
                caches.open(GZ_CACHE).then(c => c.put(e.request, clone));
            }
            return res;
        }).catch(() => caches.match(GZ_BASE + '/index.html')))
    );
});

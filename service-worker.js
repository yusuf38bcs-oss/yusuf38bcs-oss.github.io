self.addEventListener('install', e => {
  e.waitUntil(caches.open('v1').then(cache => cache.addAll(['/','/index.html','/assets/css/main.css','/assets/js/navbar.js'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

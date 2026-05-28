/* TWO LINE — Service Worker v123
 * 오프라인 작동 + 캐싱 (cache-first 전략)
 * v123: 외부 이미지 자산 29장 캐시 포함
 */

const CACHE_NAME = 'two-line-v123';
const CACHED_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png',
  // ─── v123 자산 (assets/) ───
  './assets/logo-small.png',
  './assets/logo-title.jpg',
  './assets/logo-banner.jpg',
  './assets/char-yunsea.jpg',
  './assets/char-shadow.png',
  './assets/icon-attack.png',
  './assets/icon-fear.png',
  './assets/icon-shield.jpg',
  './assets/icon-hp.png',
  './assets/icon-confused.png',
  './assets/icon-heart.png',
  './assets/icon-gold.png',
  './assets/icon-bag.png',
  './assets/icon-circuit.png',
  './assets/icon-cards.png',
  './assets/icon-settings.png',
  './assets/icon-swords.png',
  './assets/icon-cross.png',
  './assets/deco-wreath.png',
  './assets/deco-touch.png',
  './assets/mockup-subway.jpg',
  './assets/mockup-battle.png',
  './assets/ref-hades-menu.png',
  './assets/ref-hades-char.png',
  './assets/ref-chart.png',
  './assets/ref-game1.png',
  './assets/ref-game2.png',
  './assets/ref-game3.png',
  './assets/ref-game4.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHED_FILES).catch((err) => {
        console.warn('[SW] 캐시 일부 실패:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

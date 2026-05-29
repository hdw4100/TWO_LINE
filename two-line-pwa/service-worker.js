/* TWO LINE — Service Worker v123
 * 오프라인 작동 + 캐싱 (cache-first 전략)
 * v123: 외부 이미지 자산 29장 캐시 포함
 */

const CACHE_NAME = 'two-line-v144';
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
  // ─── v126 사용자 정식 자산 (30장) ───
  './assets/user/card-buff-bird.png',
  './assets/user/card-buff-egg.png',
  './assets/user/card-buff-puff.png',
  './assets/user/card-buff-rose.png',
  './assets/user/card-han-base.jpg',
  './assets/user/card-kang-base.jpg',
  './assets/user/card-kang-base2.jpg',
  './assets/user/card-misc-weapons.jpeg',
  './assets/user/card-park-base.jpg',
  './assets/user/card-yun-base.jpg',
  './assets/user/char-han-idle.png',
  './assets/user/char-han-standing.png',
  './assets/user/char-kang-idle.png',
  './assets/user/char-kang-standing.png',
  './assets/user/char-yun-idle.png',
  './assets/user/char-yun-standing.png',
  './assets/user/cutin-han.png',
  './assets/user/cutin-kang.png',
  './assets/user/cutin-yun.png',
  './assets/user/enemy-01-250610.png',
  './assets/user/enemy-02-260408.png',
  './assets/user/enemy-03-chartreuse-horn.png',
  './assets/user/enemy-04-graviton-lance.png',
  './assets/user/enemy-05-mut.png',
  './assets/user/enemy-06-redwithrou-copy-2.png',
  './assets/user/enemy-07-catio.png',
  './assets/user/enemy-08-cffd26250923725b.png',
  './assets/user/enemy-09-copy.png',
  './assets/user/enemy-10-dde3.png',
  './assets/user/enemy-11-mida.png',
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

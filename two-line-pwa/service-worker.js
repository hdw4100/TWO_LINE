/* TWO LINE — Service Worker
 * 오프라인 작동 + 캐싱 (cache-first 전략)
 */

const CACHE_NAME = 'two-line-v121';
const CACHED_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png',
];

// 설치 시점에 핵심 파일 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHED_FILES).catch((err) => {
        // 일부 파일이 없어도 설치 계속 (아이콘 PNG 등이 아직 없을 수 있음)
        console.warn('[SW] 캐시 일부 실패:', err);
      });
    })
  );
  self.skipWaiting();
});

// 활성화 — 오래된 캐시 정리
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

// fetch — cache-first, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 외부 origin (구글 폰트, CDN 등)은 네트워크 우선 + 캐시 폴백
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          // 정상 응답만 캐시
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

  // 같은 origin — cache-first
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

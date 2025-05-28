// service - worker.js
self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open('my-cache-v1')
			.then(function (cache) {
				return cache.addAll([
					'/',
					'/manifest.json',
					'/icons/app_icon-192x192.png',
					'/icons/app_icon-512x512.png',
				]);
			})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
				if (response) {
					return response;
				}
				return fetch(event.request);
			})
	);
});

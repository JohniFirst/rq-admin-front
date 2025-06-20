// service - worker.js
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open('my-cache-v1')
			.then((cache) => cache.addAll(['/manifest.json', '/icons/app_icon-192x192.png', '/icons/app_icon-512x512.png'])),
	)
})

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response
			}
			return fetch(event.request)
		}),
	)
})

const CACHE_NAME = "version-1"
const URLS_TO_CACHE = ["index.html", "offline.html"]

const self = this
//install SW
self.addEventListener("install", e => {
	e.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			console.log("Added cache")
			return cache.addAll(URLS_TO_CACHE)
		})
	)
})

// listen for requests
self.addEventListener("fetch", e => {
	e.respondWith(
		caches
			.match(e.request)
			.then(() => fetch(e.request).catch(() => caches.match("offline.html")))
	)
})

// Activate the SW
self.addEventListener("activate", e => {
	const cacheWhiteList = []
	cacheWhiteList.push(CACHE_NAME)

	e.waitUntil(
		caches.keys().then(cacheNames => {
			Promise.all(
				cacheNames.map(cacheName => {
					if (!cacheWhiteList.includes(cacheName)) {
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
})

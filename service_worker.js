'use strict';

var CACHE_NAME = 'cache-v1';
var urlsToCache = [
  '',
  'index.html'
];

self.addEventListener('install', function(event) {
	// Open device cache and store our list of items
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // https://deanhume.com/create-a-really-really-simple-offline-page-using-service-workers/
  
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request.url).catch(error => {
          // Return the offline page
          return caches.match('index.html');
      })
    );
  }
  else{
      // Respond with everything else if we can
      event.respondWith(caches.match(event.request)
        .then(function (response) {
            return response || fetch(event.request);
        })
      );
    }
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
  	// Open our apps cache and delete any old cache items
  	caches.open(CACHE_NAME).then(function(cacheNames){
  		cacheNames.keys().then(function(cache){
  			cache.forEach(function(element, index, array) {
  				if (urlsToCache.indexOf(element) === -1){
  					caches.delete(element);
  				}
  	    });
  		});
  	})
  );
});

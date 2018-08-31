/* Create the cache to store the files 
    and the array of files to load */
var currentCacheName = 'myCache';
var arrayOfFilesToCache = [
    './',
    './index.html',
    './restaurant.html',
    './js/main.js',
    './js/restaurant_info.js',
    './js/dbhelper.js',
    './css/styles.css',
    './data/restaurants.json',
    './img/1.jpg',
    './img/10.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',  
];
/* Create the event listener to actually install the service worker and
 add the files to the caches storage*/
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(currentCacheName).then(function(cache) {
            console.log('cache opened');
            return cache.addAll(arrayOfFilesToCache);
        })
    );
});
/*Create the event listener to activate the service worker*/
self.addEventListener('activate', function(event) {
    console.log('sw activated');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            /*return a function to delete old caches */
            return Promise.all(cacheNames.map(function(cacheName) {
                if (cacheName !== currentCacheName) {
                    return caches.delete(cacheName);
                }
            }));
        })
    );
});
/* Create the answers to the fetch events*/
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            /*If the event.request match anything in the cache, return it*/
            if (response) {
                return response;
            /* If the event.request does not match, then it will get 
                from the network and cloned into the cache*/
            } else {
                return fetch(event.request).then(function(res) {
                    return caches.open(currentCacheName).then(function(cache) {
                        cache.put(event.request.url, res.clone());
                        return res;
                    });
                });
            }
        })
    );
});
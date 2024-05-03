importScripts('/javascripts/idb-utility.js');
importScripts('/javascripts/utils.js');

self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {
        console.log('Service Worker: Caching App Shell at the moment......');
        try {
            const cache = await caches.open("static");
            cache.addAll([
                '/',
                '/detail',
                '/chat',
                '/manifest.json',
                '/javascripts/index.js',
                '/javascripts/detail.js',
                '/javascripts/chat.js',
                '/javascripts/dbpedia.js',
                '/javascripts/utils.js',
                '/javascripts/idb-utility.js',
                '/images/logo.png',
                '/images/favicon.ico',
                '/stylesheets/index.css',
                '/stylesheets/chat.css',
                '/stylesheets/detail.css',
                '/stylesheets/dbpedia.css',
                '/svgs/flower-off.svg',
                '/svgs/flower.svg',
                '/svgs/fruit-off.svg',
                '/svgs/fruit.svg',
                '/svgs/leaf-off.svg',
                '/svgs/leaf.svg',
                '/svgs/full-sun.svg',
                '/svgs/full-shade.svg',
                '/svgs/partial-shade.svg',
                '/svgs/seeding-off.svg',
                '/svgs/seeding.svg',
            ]);
            console.log('Service Worker: App Shell Cached');
        }
        catch {
            console.log("error occured while caching...")
        }
    })());
})

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        return keys.map(async (cache) => {
            if (cache !== "static") {
                console.log('Service Worker: Removing old cache: ' + cache);
                return await caches.delete(cache);
            }
        })
    })());
})

self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open("static");
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            console.log('Service Worker: Fetching from Cache: ', event.request.url);
            return cachedResponse;
        }
        console.log('Service Worker: Fetching from URL: ', event.request.url);
        return fetch(event.request);
    })());
})

self.addEventListener('sync', event => {
    if (event.tag === 'sync-plant') {
        console.log('Service Worker: Syncing new Plants');
        openPlantIDBSync().then((syncPostDB) => {
            getAllPlantSync(syncPostDB).then(async (syncPlants) => {
                for (const syncPlant of syncPlants) {
                    console.log('Service Worker: Syncing new Plant: ', syncPlant);
                    const plants = await fetchPlants({ name: syncPlant.name });
                    if (plants.length > 0) {
                        console.log('Service Worker: Syncing new Plant exist! ');
                        break;
                    };

                    const newPlant = await createPlant(syncPlant);
                    if (newPlant.id) {
                        console.log('Service Worker: Syncing new Plant: ', syncPlant, ' done');
                        deletePlantFromIDBSync(syncPostDB, syncPlant.id);
                        // Send a notification
                        self.registration.showNotification('Plant Synced', {
                            body: 'Plant synced successfully!',
                        });
                        self.clients.matchAll().then(clients => {
                            console.log('clients', clients)
                            clients.forEach(client => {
                                console.log('client', client)
                                client.postMessage({ type: 'newPlantSynced', newPlant: { ...syncPlant, ...newPlant } });
                            });
                        });
                    } else {
                        console.error('Service Worker: Syncing new Plant: ', syncPlant, ' failed');
                    }
                }
            });
        });
    }
    console.log('self.addEventListener', event)
    if (event.tag === 'sync-comment') {
        console.log('Service Worker: Syncing new Comments');
        openCommentIDBSync().then((syncPostDB) => {
            getAllCommentSync(syncPostDB).then(async (syncComments) => {
                for (const syncComment of syncComments) {
                    console.log('Service Worker: Syncing new Comment: ', syncComment);
                    const newComment = await createComment(syncComment);
                    if (newComment.id) {
                        console.log('Service Worker: Syncing new Comment: ', syncComment, ' done');
                        deleteCommentFromIDBSync(syncPostDB, syncComment.id);
                        // Send a notification
                        self.registration.showNotification('Comment Synced', {
                            body: 'Comment synced successfully!',
                        });
                        self.clients.matchAll().then(clients => {
                            console.log('clients', clients)
                            clients.forEach(client => {
                                console.log('client', client)
                                client.postMessage({ type: 'newCommentSynced', roomId: syncComment.plant, newComment: { ...syncComment, ...newComment } });
                            });
                        });
                    } else {
                        console.error('Service Worker: Syncing new Comment: ', syncComment, ' failed');
                    }
                }
            });
        });
    }
})
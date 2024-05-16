// Function to handle adding a new plant
const addNewPlantToSync = (syncIDB, plant, cb) => {
    // Retrieve plant and add it to the IndexedDB
    if (plant) {
        const transaction = syncIDB.transaction(["sync-plants"], "readwrite")
        const plantStore = transaction.objectStore("sync-plants")
        const addRequest = plantStore.add(plant)
        addRequest.addEventListener("success", () => {
            console.log("Added plant" + "#" + addRequest.result + ": " + plant.name)
            const getRequest = plantStore.get(addRequest.result)
            getRequest.addEventListener("success", () => {
                console.log("Found " + getRequest.result.id)
                // Send a sync message to the service worker
                navigator.serviceWorker.ready.then((sw) => {
                    sw.sync.register("sync-plant")
                }).then(() => {
                    if (cb) cb(navigator.onLine);
                    console.log("Sync registered");
                }).catch((err) => {
                    console.log("Sync registration failed: " + JSON.stringify(err))
                })
            })
        })
    }
}
// Function to add new plants to IndexedDB and return a promise
const addNewPlantsToIDB = (plantIDB, plants) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");

        const addPromises = plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.addEventListener("success", () => {
                    console.log("Added " + "#" + addRequest.result + ": " + plant.name);
                    const getRequest = plantStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        console.log("Found " + getRequest.result.id);
                        resolveAdd(); // Resolve the add promise
                    });
                    getRequest.addEventListener("error", (event) => {
                        rejectAdd(event.target.error); // Reject the add promise if there's an error
                    });
                });
                addRequest.addEventListener("error", (event) => {
                    rejectAdd(event.target.error); // Reject the add promise if there's an error
                });
            });
        });

        // Resolve the main promise when all add operations are completed
        Promise.all(addPromises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
};
// Function to remove all plants from idb
const deleteAllPlantExistingFromIDB = (plantIDB) => {
    const transaction = plantIDB.transaction(["plants"], "readwrite");
    const plantStore = transaction.objectStore("plants");
    const clearRequest = plantStore.clear();

    return new Promise((resolve, reject) => {
        clearRequest.addEventListener("success", () => {
            resolve();
        });

        clearRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
};
// Function to get the plant list from the IndexedDB
const getAllPlant = (plantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"]);
        const plantStore = transaction.objectStore("plants");
        const getAllRequest = plantStore.getAll();

        // Handle success event
        getAllRequest.addEventListener("success", (event) => {
            resolve(event.target.result); // Use event.target.result to get the result
        });

        // Handle error event
        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}
// Function to get the plant list from the IndexedDB
const getAllPlantSync = (syncIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = syncIDB.transaction(["sync-plants"]);
        const plantStore = transaction.objectStore("sync-plants");
        const getAllRequest = plantStore.getAll();

        getAllRequest.addEventListener("success", () => {
            resolve(getAllRequest.result);
        });

        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}
// Function to delete a syn
const deletePlantFromIDBSync = (syncIDB, id) => {
    const transaction = syncIDB.transaction(["sync-plants"], "readwrite")
    const plantStore = transaction.objectStore("sync-plants")
    const deleteRequest = plantStore.delete(id)
    deleteRequest.addEventListener("success", () => {
        console.log("Deleted " + id)
    })
}

function openPlantIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("plants", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('plants', { keyPath: '_id' });
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

function openPlantIDBSync() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("sync-plants", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('sync-plants', { keyPath: 'id', autoIncrement: true });
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

// Comments
// Function to handle adding a new comment
const addNewCommentToSync = (syncIDB, comment, cb) => {
    // Retrieve comment and add it to the IndexedDB
    if (comment) {
        const transaction = syncIDB.transaction(["sync-comments"], "readwrite")
        const store = transaction.objectStore("sync-comments")
        const addRequest = store.add(comment)
        addRequest.addEventListener("success", () => {
            console.log("Added comment" + "#" + addRequest.result + ": " + comment.comment)
            const getRequest = store.get(addRequest.result)
            getRequest.addEventListener("success", () => {
                console.log("Found " + getRequest.result.id)
                // Send a sync message to the service worker
                navigator.serviceWorker.ready.then((sw) => {
                    sw.sync.register("sync-comment")
                }).then(() => {
                    if (cb) cb();
                    console.log("Sync registered");
                }).catch((err) => {
                    console.log("Sync registration failed: " + JSON.stringify(err))
                })
            })
        })
    }
}
// Function to add new comments to IndexedDB and return a promise
const addNewCommentsToIDB = (IDB, comments) => {
    return new Promise((resolve, reject) => {
        const transaction = IDB.transaction(["comments"], "readwrite");
        const store = transaction.objectStore("comments");

        const addPromises = comments.map(comment => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = store.add(comment);
                addRequest.addEventListener("success", () => {
                    console.log("Added " + "#" + addRequest.result + ": " + comment.comment);
                    const getRequest = store.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        console.log("Found " + getRequest.result.id);
                        resolveAdd(); // Resolve the add promise
                    });
                    getRequest.addEventListener("error", (event) => {
                        rejectAdd(event.target.error); // Reject the add promise if there's an error
                    });
                });
                addRequest.addEventListener("error", (event) => {
                    rejectAdd(event.target.error); // Reject the add promise if there's an error
                });
            });
        });

        // Resolve the main promise when all add operations are completed
        Promise.all(addPromises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
};
// Function to remove all comment from idb
const deleteAllCommentExistingFromIDB = (IDB) => {
    const transaction = IDB.transaction(["comments"], "readwrite");
    const store = transaction.objectStore("comments");
    const clearRequest = store.clear();

    return new Promise((resolve, reject) => {
        clearRequest.addEventListener("success", () => {
            resolve();
        });

        clearRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
};
// Function to get the comment list from the IndexedDB
const getAllComment = (IDB) => {
    return new Promise((resolve, reject) => {
        const transaction = IDB.transaction(["comments"]);
        const store = transaction.objectStore("comments");
        const getAllRequest = store.getAll();

        // Handle success event
        getAllRequest.addEventListener("success", (event) => {
            resolve(event.target.result); // Use event.target.result to get the result
        });

        // Handle error event
        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}
// Function to get the comment list from the IndexedDB
const getAllCommentSync = (syncIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = syncIDB.transaction(["sync-comments"]);
        const store = transaction.objectStore("sync-comments");
        const getAllRequest = store.getAll();

        getAllRequest.addEventListener("success", () => {
            resolve(getAllRequest.result);
        });

        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}
// Function to delete a syn
const deleteCommentFromIDBSync = (syncIDB, id) => {
    const transaction = syncIDB.transaction(["sync-comments"], "readwrite")
    const store = transaction.objectStore("sync-comments")
    const deleteRequest = store.delete(id)
    deleteRequest.addEventListener("success", () => {
        console.log("Deleted " + id)
    })
}

function openCommentIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("comments", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('comments', { keyPath: '_id' });
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

function openCommentIDBSync() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("sync-comments", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('sync-comments', { keyPath: 'id', autoIncrement: true });
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

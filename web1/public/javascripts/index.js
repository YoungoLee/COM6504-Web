let isSearch = false;
async function handleSearch() {
    const hasFlowers = document.getElementById('queryHasFlowers');
    const hasLeaves = document.getElementById('queryHasLeaves');
    const hasFruits = document.getElementById('queryHasFruits');
    const hasSeeds = document.getElementById('queryHasSeeds');
    const sunExposure = document.getElementById('querySunExposure');
    const distance = document.getElementById('queryDistance');
    const sawTime = document.getElementById('querySawTime');
    const query = {}
    if (!isSearch && (hasFlowers.value || hasLeaves.value || hasFruits.value || hasSeeds.value || sunExposure.value)) {
        isSearch = true;

        if (['true', 'false'].includes(hasFlowers.value)) {
            Object.assign(query, { hasFlowers: hasFlowers.value === 'true' })
        }
        if (['true', 'false'].includes(hasLeaves.value)) {
            Object.assign(query, { hasLeaves: hasLeaves.value === 'true' })
        }
        if (['true', 'false'].includes(hasFruits.value)) {
            Object.assign(query, { hasFruits: hasFruits.value === 'true' })
        }
        if (['true', 'false'].includes(hasSeeds.value)) {
            Object.assign(query, { hasSeeds: hasSeeds.value === 'true' })
        }
        if (['full sun', 'partial shade', 'full shade'].includes(sunExposure.value)) {
            Object.assign(query, { sunExposure: sunExposure.value })
        }
        if (['ascend', 'descend'].includes(sawTime.value)) {
            Object.assign(query, { sawTime: sawTime.value === 'ascend' ? 1 : -1 })
        }
        if (['ascend', 'descend'].includes(distance.value)) {
            const position = JSON.parse(localStorage.getItem('position') || '{}');
            Object.assign(query, {
                distance: distance.value === 'ascend' ? 1 : -1,
                ...position
            })
        }
        const { list = [] } = await fetchPlants(query);
        await renderPlants(list);
        isSearch = false;
    }
}

async function renderPlant(plant) {
    const plants = document.getElementById('plants');
    if (plant.id) {
        const row = document.createElement('div');
        row.id = plant.id;
        row.className = 'col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mt-3 plant'
        const card = document.createElement('div');
        card.className = 'card';
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-img-top';
        const img = document.createElement('img');
        img.src = plant.photo;
        img.alt = `plant ${plant.name || ''} photo`;
        img.className = 'plant-photo';
        cardHeader.appendChild(img);
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = plant.name;
        const cardDescription = document.createElement('p');
        cardDescription.className = 'card-text';
        cardDescription.textContent = plant.description || '';
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardDescription);
        if (!plant.sync) {
            const detailLink = document.createElement('a');
            detailLink.className = 'btn';
            detailLink.title = 'detail';
            const detailIcon = document.createElement('i');
            detailIcon.className = 'bi bi-eye btn-detail';
            detailLink.href = `/detail?id=${plant.id}`
            detailLink.appendChild(detailIcon);

            const chatLink = document.createElement('a');
            chatLink.className = 'btn';
            chatLink.title = 'chat';
            const chatIcon = document.createElement('i');
            chatIcon.className = 'bi bi-chat  btn-chat';
            chatLink.href = `/chat?id=${plant.id}`
            chatLink.appendChild(chatIcon);
            cardBody.appendChild(detailLink);
            cardBody.appendChild(chatLink);
        }
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        row.appendChild(card);
        plants.appendChild(row);
    }
}

async function renderPlants(list = []) {
    const plants = document.getElementById('plants');
    plants.textContent = '';
    list.forEach(plant => {
        const row = document.createElement('div');
        row.className = 'col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mt-3 plant'
        const card = document.createElement('div');
        card.className = 'card';
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-img-top';
        const img = document.createElement('img');
        img.src = plant.photo;
        img.alt = `plant ${plant.name || ''} photo`;
        img.className = 'plant-photo';
        cardHeader.appendChild(img);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = plant.name;
        const cardDescription = document.createElement('p');
        cardDescription.className = 'card-text';
        cardDescription.textContent = plant.description || '';
        const detailLink = document.createElement('a');
        detailLink.className = 'btn';
        detailLink.title = 'detail';
        const detailIcon = document.createElement('i');
        detailIcon.className = 'bi bi-eye btn-detail';
        detailLink.href = `/detail?id=${plant.id}`
        detailLink.appendChild(detailIcon);
        const chatLink = document.createElement('a');
        chatLink.className = 'btn';
        chatLink.title = 'chat';
        const chatIcon = document.createElement('i');
        chatIcon.className = 'bi bi-chat  btn-chat';
        chatLink.href = `/chat?id=${plant.id}`
        chatLink.appendChild(chatIcon);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardDescription);
        cardBody.appendChild(detailLink);
        cardBody.appendChild(chatLink);

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        row.appendChild(card);
        plants.appendChild(row);
    })
}

async function checkHasNickName() {
    const nicknameModal = document.getElementById('addNickNameModal');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.id) {
        nicknameModal.className = 'modal fade show';
        nicknameModal.style.display = 'block';
        nicknameModal.style.background = 'rgba(0,0,0,0.3)';
        return;
    }
    const user = await fetchUser(userInfo.id);
    if (!user.id) {
        nicknameModal.className = 'modal fade show';
        nicknameModal.style.display = 'block';
        nicknameModal.style.background = 'rgba(0,0,0,0.3)';
        return;
    }
}

async function handleSubmitNickName() {
    const profile = document.querySelector('.profile');
    const nicknameModal = document.getElementById('addNickNameModal');
    const nickname = document.getElementById('nickname');
    const userInfo = await createUser({ nickname: nickname.value || randomNickName() });
    if (userInfo.id) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        nicknameModal.className = 'modal fade';
        nicknameModal.style.display = 'none';
        nicknameModal.style.background = 'transparent';
        profile.textContent = userInfo.nickname || '--';
    }
}

function renderProfileUserName() {
    const profile = document.querySelector('.profile');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    profile.textContent = userInfo.nickname || '--';
}

function getGeolocation() {
    const userLatitude = document.getElementById('userLatitude');
    const userLongitude = document.getElementById('userLongitude');
    let error;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            localStorage.setItem('position', JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }));
            if (userLatitude) {
                userLatitude.value = position.coords.latitude;
            }
            if (userLongitude) {
                userLongitude.value = position.coords.longitude;
            }
        }, error => {
            error = error.code
        }, {
            timeout: 30 * 1000,
            maximumAge: 5000,
            enableHighAccuracy: false
        })
    } else {
        error = 'GEO_NO_SUPPORT'
    }
    const watch = navigator.geolocation.watchPosition(position => {
        const userLatitude = document.getElementById('userLatitude');
        const userLongitude = document.getElementById('userLongitude');
        localStorage.setItem('position', JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }));
        if (userLatitude) {
            userLatitude.value = position.coords.latitude;
        }
        if (userLongitude) {
            userLongitude.value = position.coords.longitude;
        }
    })
    setTimeout(() => {
        navigator.geolocation.clearWatch(watch);
    }, 10 * 1000)

}

async function handleAddPlant(event) {
    event.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const position = JSON.parse(localStorage.getItem('position') || '{}');
    const data = new FormData(event.currentTarget);
    const plant = {
        user: userInfo.id,
        name: data.get('name') || `Plant-${randomNickName()}`,
        description: data.get('description'),
        photo: await fileToDataUrl(data.get('photo')),
        size: {
            height: data.get('height'),
            spread: data.get('spread'),
        },
        characteristics: {
            hasFlowers: data.get('hasFlowers') === 'true',
            hasLeaves: data.get('hasLeaves') === 'true',
            hasFruits: data.get('hasFruits') === 'true',
            hasSeeds: data.get('hasSeeds') === 'true',
            flowerColor: data.get('flowerColor'),
            sunExposure: data.get('sunExposure'),
        },
        userLocation: {
            type: 'Point',
            coordinates: [position.longitude, position.latitude],
        },
        location: {
            type: 'Point',
            coordinates: [parseFloat(data.get('longitude')), parseFloat(data.get('latitude'))],
        }
    }
    openPlantIDBSync().then((db) => {
        addNewPlantToSync(db, plant, function (onLine) {
            const modal = document.getElementById('addPlantModal');
            const backdrop = document.querySelector('.modal-backdrop')
            const bootstrapModal = new bootstrap.Modal(modal, {
                keyboard: false
            });
            modal.classList.remove('show')
            document.body.removeChild(backdrop)
            bootstrapModal.hide();
            if (!onLine) {
                renderPlant({ ...plant, sync: true, id: `sync-${Math.random() * 10000}` })
            }
        });
    });
}

async function renderDbpedia(search) {
    const { list = [] } = await fetchDbpedias({ search });
    const detail = list[0];
    const dbpedia = document.getElementById('dbpedia');
    if (detail) {
        dbpedia.textContent = '';
        if (detail.photo) {
            const photo = document.createElement('img');
            photo.className = 'dbpedia-photo';
            photo.src = detail.photo;
            dbpedia.appendChild(photo);
        }
        if (detail.description) {
            const description = document.createElement('p');
            description.className = 'dbpedia-description';
            description.textContent = detail.description;
            description.title = detail.description;
            dbpedia.appendChild(description);
        }
        if ((detail.photo || detail.description)) {
            const link = document.createElement('a');
            link.className = 'dbpedia-link';
            link.textContent = detail.label || detail.uri;
            link.href = detail.uri;
            link.target = '_blank';
            dbpedia.appendChild(link);
        }
    } else {
        dbpedia.textContent = '';
        dbpedia.textContent = 'No Data Link to Dbpedia';
    }
}

function loading(element) {
    if (element) {
        const loading = document.createElement('div');
        loading.classList = 'spinner-border';
        loading.role = 'spinner-bordestatus';
        const text = document.createElement('span');
        text.classList = 'visually-hidden';
        text.textContent = 'Loading...';
        loading.appendChild(text);
        element.appendChild(loading);
    }
}

function dbpedia() {
    const name = document.getElementById('name');
    name.addEventListener('blur', function (event) {
        const value = event.target.value;
        if (value) {
            loading(document.getElementById('dbpedia'));
            renderDbpedia(value)
        }
    })
}

function initMap() {
    const initLatitude = 53.3813;
    const initLongitude = -1.4901;
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    latitudeInput.value = initLatitude;
    longitudeInput.value = initLongitude;
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: initLatitude, lng: initLongitude },
        zoom: 8,
    });
    const marker = new google.maps.Marker({
        position: { lat: initLatitude, lng: initLongitude },
        map,
        draggable: true,
    });

    google.maps.event.addListener(marker, "dragend", function (event) {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        latitudeInput.value = latitude;
        longitudeInput.value = longitude;
    });

    function updateMarkerPosition() {
        const latitude = parseFloat(latitudeInput.value);
        const longitude = parseFloat(longitudeInput.value);
        const newPosition = { lat: latitude, lng: longitude };
        marker.setPosition(newPosition);
        map.setCenter(newPosition);
    }

    latitudeInput.addEventListener("input", updateMarkerPosition);
    longitudeInput.addEventListener("input", updateMarkerPosition);
}



document.addEventListener('DOMContentLoaded', function () {
    checkHasNickName();
    renderProfileUserName();
    getGeolocation();
    dbpedia();
    initMap();
})

const clearSyncPlants = () => {
    const plants = document.getElementById('plants');
    Array.from(plants.children).forEach(child => {
        if (child.id.includes('sync-')) {
            plants.removeChild(child);
        }
    })
}

window.onload = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then(function (reg) {
                console.log('Service Worker Registered!', reg);
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
            });
    }
    // Check if the browser supports the Notification API
    if ("Notification" in window) {
        // Check if the user has granted permission to receive notifications
        if (Notification.permission === "granted") {
            // Notifications are allowed, you can proceed to create notifications
            // Or do whatever you need to do with notifications
        } else if (Notification.permission !== "denied") {
            // If the user hasn't been asked yet or has previously denied permission,
            // you can request permission from the user
            Notification.requestPermission().then(function (permission) {
                // If the user grants permission, you can proceed to create notifications
                if (permission === "granted") {
                    navigator.serviceWorker.ready
                        .then(function (serviceWorkerRegistration) {
                            serviceWorkerRegistration.showNotification("Plant Recognition App",
                                { body: "Notifications are enabled!" })
                                .then(r =>
                                    console.log(r)
                                );
                        });
                }
            });
        }
    }
    if (navigator.onLine) {
        fetchPlants().then(function ({ list: newPlants }) {
            openPlantIDB().then((db) => {
                renderPlants(newPlants);
                deleteAllPlantExistingFromIDB(db).then(() => {
                    addNewPlantsToIDB(db, newPlants).then(() => {
                        console.log("All new plants added to IDB")
                    })
                });
            });
        });
    } else {
        console.log("Offline mode")
        openPlantIDB().then((db) => {
            getAllPlant(db).then((plants) => {
                for (const plant of plants) {
                    renderPlant(plant)
                }
            });
        });
    }

    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'newPlantSynced') {
            clearSyncPlants();
            renderPlant(event.data.newPlant);
        }
    });
}

window.onerror = function (message, source, lineno, colno, error) {
    console.log(message, source, lineno, colno, error)
}
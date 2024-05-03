let isSearch = false;
async function handleSearch() {
    const type = document.getElementById('type');
    if (!isSearch && type.value) {
        isSearch = true;
        const { list = [] } = await fetchPlants({ hasFlowers: type.value === 'true' ? 1 : -1 });
        await renderPlants(list);
        isSearch = false;
    }
}

async function renderPlant(plant) {
    const plants = document.getElementById('plants');
    if (plant.id) {
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
    let error;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            localStorage.setItem('position', JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }));
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
        localStorage.setItem('position', JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }));
    })
    setTimeout(() => {
        navigator.geolocation.clearWatch(watch);
    }, 10 * 1000)

}

async function handleAddPlant(event) {
    event.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const location = JSON.parse(localStorage.getItem('position') || '{}');
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
        location
    }

    openPlantIDBSync().then((db) => {
        addNewPlantToSync(db, plant, function () {
            const modal = document.getElementById('addPlantModal');
            const backdrop = document.querySelector('.modal-backdrop')
            const bootstrapModal = new bootstrap.Modal(modal, {
                keyboard: false
            });
            modal.classList.remove('show')
            document.body.removeChild(backdrop)
            bootstrapModal.hide();
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    checkHasNickName();
    renderProfileUserName();
    getGeolocation();
})

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
                renderPlants(plants)
            });
        });
    }

    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'newPlantSynced') {
            renderPlant(event.data.newPlant);
        }
    });
}
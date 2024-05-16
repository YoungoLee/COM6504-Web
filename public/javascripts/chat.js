let talking = false;

async function getPlant() {
    const id = window.location.search.replace('?id=', '')
    return await fetchPlant(id);
}

async function renderPlants(list = []) {
    const plantId = window.location.search.replace('?id=', '')
    const plants = document.querySelector('.plants');
    const messages = document.querySelector('.messages');
    plants.textContent = '';
    const newList = list.filter(i => i.id !== plantId);
    if (newList.length > 0) {
        plants.className = 'col-2 plants';
        plants.style.overflowY = 'auto';
        messages.className = 'col-10 messages';
        const list = document.createElement('div');
        list.className = 'd-flex flex-column list-group';
        newList.forEach(plant => {
            const a = document.createElement('a');
            a.classList = 'list-group-item';
            a.href = `/chat?id=${plant.id}`;
            const img = document.createElement('img');
            img.src = plant.photo;
            img.classList = 'rounded-circle mr-1"';
            img.alt = 'plant photo';
            img.width = 40;
            img.height = 40;
            const name = document.createElement('span');
            name.textContent = plant.name;
            name.className = 'mx-1'
            a.appendChild(img);
            a.appendChild(name);
            list.appendChild(a);
        })
        plants.appendChild(list);
    } else {
        messages.className = 'col-12 messages';
        plants.style.display = 'none';
    }
}

function renderProfileUserName() {
    const profile = document.querySelector('.profile');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    profile.textContent = userInfo.nickname || '--';
}

async function renderCurrentPlant() {
    const plant = await getPlant();
    const currentPlant = document.querySelector('.currentPlant');
    if (plant.id) {
        currentPlant.textContent = '';
        const a = document.createElement('a');
        a.href = `/detail?id=${plant.id}`;
        const img = document.createElement('img');
        img.src = plant.photo;
        img.className = 'rounded-circle mr-1';
        img.width = 40;
        img.height = 40;
        const name = document.createElement('span');
        name.className = 'px-3';
        name.textContent = plant.name;
        a.appendChild(img);
        a.appendChild(name);
        currentPlant.appendChild(a)
    }
}

function renderUsers(data) {
    const users = document.querySelector('.users');
    if (data && data.length > 0) {
        users.textContent = '';
        data.forEach((user, index) => {
            const avatar = document.createElement('span');
            avatar.className = 'avatar';
            avatar.textContent = user.charAt(0).toUpperCase();
            avatar.title = user;
            avatar.style.zIndex = 99 - index;
            avatar.style.background = randomColor();
            users.appendChild(avatar);
        })
    }
}

async function renderComment(comment) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const messages = document.querySelector('.chat-messages');
    if (comment.id) {
        const message = document.createElement('div');
        message.className = `pb-4 ${comment.user === userInfo.id ? 'chat-message-right' : 'chat-message-left'}`;
        const nickname = document.createElement('span');
        nickname.className = 'chat-nikename';
        const currentUserInfo = await fetchUser(comment.user);
        nickname.textContent = comment.user === userInfo.id ? 'You' : currentUserInfo.nickname;
        message.appendChild(nickname);
        const content = document.createElement('div');
        content.className = 'flex-shrink-1 bg-light rounded py-2 px-3 mr-3';
        content.textContent = comment.comment;
        const time = document.createElement('span');
        time.className = 'text-muted small text-nowrap mx-2';
        time.textContent = formatTime(comment.createdAt);
        content.appendChild(time);
        message.appendChild(content);
        messages.appendChild(message);
    }
    messages.scrollTop = messages.scrollHeight;
}

async function renderComments(list = []) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const messages = document.querySelector('.chat-messages');
    if (list.length > 0) {
        messages.textContent = '';
        for (const item of list) {
            const message = document.createElement('div');
            message.className = `pb-4 ${item.user === userInfo.id ? 'chat-message-right' : 'chat-message-left'}`;
            const nickname = document.createElement('span');
            nickname.className = 'chat-nikename';
            const currentUserInfo = await fetchUser(item.user);
            nickname.textContent = item.user === userInfo.id ? 'You' : currentUserInfo.nickname;
            message.appendChild(nickname);
            const content = document.createElement('div');
            content.className = 'flex-shrink-1 bg-light rounded py-2 px-3 mr-3';
            content.textContent = item.comment;
            const time = document.createElement('span');
            time.className = 'text-muted small text-nowrap mx-2';
            time.textContent = formatTime(item.createdAt);
            content.appendChild(time);
            message.appendChild(content);
            messages.appendChild(message);
        }
    }
    messages.scrollTop = messages.scrollHeight;
}

async function submitMessage(message, socket, userInfo) {
    const roomId = window.location.search.replace('?id=', '')
    const comment = {
        plant: roomId,
        user: userInfo.id,
        comment: message.value
    }
    openCommentIDBSync().then((db) => {
        addNewCommentToSync(db, comment, function () {
            socket.emit('chat', roomId, userInfo.id, message.value);
            message.value = '';
            talking = false;
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const users = [];
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    renderProfileUserName();
    renderCurrentPlant();
    const socket = io.connect('/chatroom');
    const roomId = window.location.search.replace('?id=', '')
    socket.emit('create or join', roomId, userInfo.nickname);

    const send = document.getElementById('send');
    const message = document.getElementById('message');

    socket.on('joined', function (room, user) {
        if (!users.includes(user) && user !== userInfo.nickname) {
            users.push(user);
            renderUsers(users)
        }
    });

    send.addEventListener('click', function () {
        if (message.value && !talking) {
            talking = true;
            submitMessage(message, socket, userInfo)
        }
    });

    document.addEventListener('keydown', function (event) {
        if (message.value && !talking && (event.keyCode === 13 || event.key === 'Enter')) {
            talking = true;
            submitMessage(message, socket, userInfo)
        }
    });
    socket.on('chat', function (currentRoomId) {
        if (currentRoomId === roomId) {

        }
    });
})

window.onload = function () {
    const roomId = window.location.search.replace('?id=', '')
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
        fetchComments().then(function ({ list: newComments }) {
            openCommentIDB().then((db) => {
                renderComments(newComments.filter(i => i.plant === roomId));
                deleteAllCommentExistingFromIDB(db).then(() => {
                    addNewCommentsToIDB(db, newComments).then(() => {
                        console.log("All new comments added to IDB")
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
        openCommentIDB().then((db) => {
            getAllComment(db).then((comments) => {
                renderComments(comments.filter(i => i.plant === roomId))
            });
        });
    }

    navigator.serviceWorker.addEventListener('message', event => {
        const roomId = window.location.search.replace('?id=', '')
        if (event.data.type === 'newCommentSynced') {
            if (event.data.roomId === roomId) {
                renderComment(event.data.newComment);
            }
        }
    });
}
function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const now = new Date();
    const options = { hour: 'numeric', minute: 'numeric' };
    if (date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()) {
        return date.toLocaleString('en-US', options);
    } else {
        const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const formattedTime = date.toLocaleString('en-US', options);
        return `${formattedDate} ${formattedTime}`;
    }
}

function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
};

function randomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red},${green},${blue})`;
}

function request(method = 'GET', url = '', data = {}, params = {}) {
    return new Promise(function (resolve, reject) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const urlParams = new URLSearchParams(params).toString();
        const requestUrl = urlParams ? `${url}?${urlParams}` : url;
        if (method.toUpperCase() !== 'GET') {
            options.body = JSON.stringify(data);
        }
        return fetch(`/api${requestUrl}`, options)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(errMsg.error)
                    resolve(errMsg.error)
                }
                resolve(data)

            })
            .catch(error => {
                reject(new Error('Network error', error))
            })
    })
}

async function fetchUsers() {
    return await request('GET', '/user/all');
}

async function fetchUser(id) {
    return await request('GET', `/user/${id}`);
}

async function createUser(data) {
    return await request('POST', '/user', data);
}

async function updateUser(data) {
    return await request('PUT', `/user/${data.id}`, data);
}

async function deleteUser(data) {
    return await request('DELETE', `/user/${data.id}`);
}

function randomNickName() {
    return `Unkonwn-${Math.random() * 10000}`;
}

async function fetchPlants(params = {}) {
    return await request('GET', '/plant/all', {}, params);
}

async function fetchPlant(id) {
    return await request('GET', `/plant/${id}`);
}

async function createPlant(data) {
    return await request('POST', '/plant', data);
}

async function updatePlant(data) {
    return await request('PUT', `/plant/${data.id}`, data);
}

async function deletePlant(data) {
    return await request('DELETE', `/plant/${data.id}`);
}

async function fetchRecommends() {
    return await request('GET', '/recommend/all');
}

async function fetchRecommend(id) {
    return await request('GET', `/recommend/${id}`);
}

async function createRecommend(data) {
    return await request('POST', '/recommend', data);
}

async function updateRecommend(data) {
    return await request('PUT', `/recommend/${data.id}`, data);
}

async function deleteRecommend(data) {
    return await request('DELETE', `/recommend/${data.id}`);
}

async function fetchComments() {
    return await request('GET', '/comment/all');
}

async function fetchComment(id) {
    return await request('GET', `/comment/${id}`);
}

async function createComment(data) {
    return await request('POST', '/comment', data);
}

async function updateComment(data) {
    return await request('PUT', `/comment/${data.id}`, data);
}

async function deleteComment(data) {
    return await request('DELETE', `/comment/${data.id}`);
}
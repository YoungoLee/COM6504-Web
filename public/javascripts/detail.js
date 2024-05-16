async function getPlant() {
    const id = window.location.search.replace('?id=', '')
    return await fetchPlant(id);
}
async function getCreator(userId) {
    const user = await fetchUser(userId);
    return user ? user.nickname : '--';
}

async function renderPlant() {
    const detail = await getPlant();
    const plant = document.getElementById('plant')
    if (detail.id) {
        plant.textContent = '';
        const photo = document.createElement('img');
        photo.className = 'photo mx-1 mb-3';
        photo.src = detail.photo;
        photo.width = 50;
        photo.height = 50;

        const header = document.createElement('div');
        header.className = 'mt-3 d-flex align-items-center justify-content-between';
        const name = document.createElement('h3');
        name.textContent = detail.name;
        const status = document.createElement('span');
        status.className = `badge ${detail.status === 'in-progress' ? 'text-bg-warning' : 'text-bg-success'}`
        status.textContent = detail.status;
        const info = document.createElement('div');
        info.className = 'd-flex flex-row align-items-center'
        info.appendChild(photo);
        info.appendChild(name);
        header.appendChild(info);
        header.appendChild(status);
        plant.appendChild(header);
        const body = document.createElement('div');
        body.className = 'd-flex align-items-center justify-content-between';
        const characteristics = document.createElement('div');
        characteristics.className = 'd-flex align-items-center justify-content-between'
        const hasFlowers = document.createElement('img');
        hasFlowers.className = 'icon';
        hasFlowers.src = detail.characteristics.hasFlowers ? '/svgs/flower.svg' : '/svgs/flower-off.svg';
        hasFlowers.title = `hasFlowers: ${detail.characteristics.hasFlowers ? 'Yes' : 'No'}`
        const hasLeaves = document.createElement('img');
        hasLeaves.className = 'icon';
        hasLeaves.src = detail.characteristics.hasLeaves ? '/svgs/leaf.svg' : '/svgs/leaf-off.svg';
        hasLeaves.title = `hasLeaves: ${detail.characteristics.hasLeaves ? 'Yes' : 'No'}`
        const hasFruits = document.createElement('img');
        hasFruits.className = 'icon';
        hasFruits.src = detail.characteristics.hasFruits ? '/svgs/fruit.svg' : '/svgs/fruit-off.svg';
        hasFruits.title = `hasFruits: ${detail.characteristics.hasFruits ? 'Yes' : 'No'}`
        const hasSeeds = document.createElement('img');
        hasSeeds.className = 'icon';
        hasSeeds.src = detail.characteristics.hasSeeds ? '/svgs/seeding.svg' : '/svgs/seeding-off.svg';
        hasSeeds.title = `hasSeeds: ${detail.characteristics.hasSeeds ? 'Yes' : 'No'}`;
        const time = document.createElement('small');
        time.textContent = detail.sawTime.split('T')[0];
        const flowerColor = document.createElement('span');
        flowerColor.className = 'flowerColor';
        flowerColor.title = 'flowerColor';
        flowerColor.style.background = detail.characteristics.flowerColor;
        const sunExposure = document.createElement('img');
        sunExposure.className = 'icon';
        sunExposure.src = `/svgs/${detail.characteristics.sunExposure.split(' ').join('-')}.svg`;
        sunExposure.title = `sunExposure: ${detail.characteristics.sunExposure}`;
        characteristics.appendChild(flowerColor);
        characteristics.appendChild(hasFlowers);
        characteristics.appendChild(hasLeaves);
        characteristics.appendChild(hasFruits);
        characteristics.appendChild(hasSeeds);
        characteristics.appendChild(sunExposure);
        body.appendChild(characteristics);
        body.appendChild(time);
        plant.appendChild(body);
        const footer = document.createElement('div');
        const content = document.createElement('p');
        content.className = 'd-flex flex-column text-start mt-3';
        const description = document.createElement('span');
        description.textContent = detail.description;
        const creator = document.createElement('span');
        creator.textContent = `creator: ${await getCreator(detail.user)}`;
        const userPosition = document.createElement('span');
        userPosition.textContent = detail.userLocation ? `latitude: ${detail.userLocation.coordinates[0] || '-'}, longitude: ${detail.userLocation.coordinates[1] || '-'}` : '';
        const plantPosition = document.createElement('span');
        plantPosition.textContent = detail.location ? `plant latitude: ${detail.location.coordinates[0] || '-'}, plant longitude: ${detail.location.coordinates[1] || '-'}` : '';
        const size = document.createElement('span');
        size.textContent = `height: ${detail.size.height || '-'}, spread: ${detail.size.spread || '-'}`;
        content.appendChild(creator);
        content.appendChild(userPosition);
        content.appendChild(plantPosition);
        content.appendChild(size);
        content.appendChild(description);
        footer.appendChild(content);
        plant.appendChild(footer);

        const { list = [] } = await fetchDbpedias({ search: detail.name });
        const dbpediaDetail = list[0];
        const dbpedia = document.createElement('div');
        const title = document.createElement('h5');
        title.textContent = 'Dbpedia Infomation:';
        if (dbpediaDetail) {
            dbpedia.appendChild(title)
            if (dbpediaDetail.photo) {
                const photo = document.createElement('img');
                photo.className = 'dbpedia-photo';
                photo.src = dbpediaDetail.photo;
                photo.width = 100;
                dbpedia.appendChild(photo);
            }
            if (dbpediaDetail.description) {
                const description = document.createElement('p');
                description.className = 'dbpedia-description';
                description.textContent = dbpediaDetail.description;
                description.title = dbpediaDetail.description;
                dbpedia.appendChild(description);
            }
            if ((dbpediaDetail.photo || dbpediaDetail.description)) {
                const link = document.createElement('a');
                link.className = 'dbpedia-link';
                link.textContent = dbpediaDetail.label || dbpediaDetail.uri;
                link.href = dbpediaDetail.uri;
                link.target = '_blank';
                dbpedia.appendChild(link);
            }

        } else {
            const none = document.createElement('div');
            none.textContent = 'No Data Link to Dbpedia';
            dbpedia.appendChild(none)
        }
        plant.appendChild(dbpedia);
    }
}

async function handleApprove({ id, name }) {
    const plantId = window.location.search.replace('?id=', '')
    const recommend = await updateRecommend({ id, approved: true, approvedAt: Date.now() });
    if (recommend.id) {
        const plant = await updatePlant({
            id: plantId,
            name,
            status: 'completed'
        });
        if (plant.id) {
            renderPlant();
            renderRecommends();
        }
    }
}

async function renderRecommends() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const plant = await getPlant();
    const { list = [] } = await fetchRecommends();
    const filterList = list.filter(i => i.plant === plant._id);
    if (filterList && filterList.length > 0) {
        const recommend = document.getElementById('recommend');
        const leftBox = document.querySelector('.left-box');
        recommend.textContent = '';
        const title = document.createElement('h5');
        title.className = 'mt-3';
        title.textContent = 'Recommend';
        const badge = document.createElement('span');
        badge.className = 'badge rounded-pill text-bg-info';
        badge.textContent = list.length;
        title.appendChild(badge);
        recommend.appendChild(title);
        const recommends = document.createElement('div');
        recommends.className = 'list-group row';

        for (const recommend of filterList) {
            const item = document.createElement('div');
            item.className = 'list-group-item col-12 d-flex flex-row align-items-center justify-content-between'
            const content = document.createElement('span');
            const name = document.createElement('span');
            name.textContent = recommend.name;
            const nickname = document.createElement('span');
            nickname.textContent = `${recommend.user}: `;
            content.appendChild(nickname);
            content.appendChild(name);
            item.appendChild(content);
            if (userInfo.id === plant.user && plant.status !== 'completed') {
                const approve = document.createElement('button');
                approve.className = 'btn btn-primary btn-sm';
                approve.textContent = 'approve';
                approve.addEventListener('click', () => handleApprove(recommend))
                item.appendChild(approve);
            }
            if (plant.status === 'completed' && recommend.name === plant.name) {
                const approve = document.createElement('span');
                approve.className = 'badge text-bg-success';
                approve.textContent = 'approved!';
                item.appendChild(approve);
            }
            recommends.appendChild(item);
        }
        recommend.appendChild(recommends);
        leftBox.classList.remove('col-lg-12');
        leftBox.classList.add('col-lg-8');
    }


}
function renderProfileUserName() {
    const profile = document.querySelector('.profile');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    profile.textContent = userInfo.nickname || '--';
}

async function handleAddRecommend(event) {
    event.preventDefault();
    const plant = window.location.search.replace('?id=', '')
    const data = new FormData(event.currentTarget);
    const recommend = await createRecommend({
        plant,
        user: data.get('user'),
        name: data.get('name'),
    })
    if (recommend.id) {
        document.querySelector('.recommendForm form').reset();
        renderRecommends();
    }
}

async function renderRecommendForm() {
    const plant = await getPlant();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (plant.status === 'completed' || plant.user === userInfo.id) {
        document.querySelector('.recommendForm').classList.add('hide');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderProfileUserName();
    renderPlant();
    renderRecommends();
    renderRecommendForm();
})

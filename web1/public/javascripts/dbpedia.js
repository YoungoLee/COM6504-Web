function renderProfileUserName() {
    const profile = document.querySelector('.profile');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    profile.textContent = userInfo.nickname || '--';
}

let isSearch = false;

async function handleSearch() {
    const result = document.querySelector('.result');
    const search = document.getElementById('searchVal');
    const searchTxt = document.getElementById('search-txt');
    const loading = document.getElementById('search-loading');
    if (!isSearch && search.value) {
        isSearch = true;
        loading.classList.remove('hide');
        searchTxt.className = 'hide';
        const response = await fetch(`/dbpedia/data?${new URLSearchParams({
            search: search.value
        })}`).then(response => {
            isSearch = false;
            loading.classList.add('hide');
            searchTxt.className = '';
            search.value = '';
            return response.json()
        });
        const { list: dataSource = [] } = response;
        if (dataSource.length > 0) {
            result.textContent = '';
            const list = document.createElement('div');
            list.className = 'd-flex flex-column list-group';
            dataSource.forEach(plant => {
                const box = document.createElement('div');
                box.classList = 'list-group-item';
                const name = document.createElement('p');
                name.textContent = `name: ${plant.name ? plant.name.value : '-'}`;
                const img = document.createElement('img');
                img.src = plant.depiction ? plant.depiction.value : '-';
                img.classList = 'rounded-circle mr-1"';
                img.alt = 'plant photo';
                img.width = 40;
                img.height = 40;
                const abstract = document.createElement('p');
                abstract.textContent = `description: ${plant.abstract ? plant.abstract.value : '-'}`;
                const url = document.createElement('a');
                url.href = plant.url ? plant.url.value : '-';
                url.textContent = plant.url ? plant.url.value : '-';
                box.appendChild(name);
                box.appendChild(img);
                box.appendChild(abstract);
                if (plant.url && plant.url.value) {
                    box.appendChild(url);
                }
                list.appendChild(box);
            })
            result.appendChild(list);
        } else {
            result.textContent = 'No Data Found, Please Try Other';
        }


    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderProfileUserName();

})

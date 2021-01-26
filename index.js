async function fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "191dfc62",
            s: searchTerm,
        },
    });
    return response.data.Error ? [] : response.data.Search;
}

const root = document.querySelector('.autocomplete');
root.innerHTML =`
    <label><b>Search For a Movie</b></label>
    <input class="input">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

async function onInput(e) {
    const movies = await fetchData(e.target.value);
    if(movies.length === 0) {
        dropdown.classList.remove('is-active');
        return;
    }

    resultsWrapper.innerHTML = "";    
    dropdown.classList.add('is-active');

    for (const movie of movies) {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.innerHTML = `
            <img src="${movie.Poster === 'N/A' ? '' : movie.Poster}">
            ${movie.Title}
        `;

        resultsWrapper.appendChild(option);
    }
}

input.addEventListener('input', debounce(onInput, 1000));

document.addEventListener('click', e =>{
    if(!root.contains(e.target)){
        dropdown.classList.remove('is-active');
    }
});

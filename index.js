const root = document.querySelector('.autocomplete');
root.innerHTML = `
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
    if (movies.length === 0) {
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
        option.addEventListener('click', () => {
            onOptionSelected(movie);
        });

        resultsWrapper.appendChild(option);
    }
}

input.addEventListener('input', debounce(onInput, 1000));

document.addEventListener('click', e => {
    if (!root.contains(e.target)) {
        dropdown.classList.remove('is-active');
    }
});

async function onOptionSelected(movie) {
    dropdown.classList.remove('is-active');
    input.value = movie.Title;
    const movieData = await fetchDataById(movie.imdbID);
    if (movieData) {
        document.querySelector('#summary').innerHTML = generateMovieTemplate(movieData);

    }
};
function generateMovieTemplate(movieData) {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieData.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieData.Title}</h1>
                    <h4>${movieData.Genre}</h4>
                    <p>${movieData.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieData.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
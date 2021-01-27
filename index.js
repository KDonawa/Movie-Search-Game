createDropdown({
    inputLabel: 'Search For a Movie',
    root: document.querySelector('.autocomplete'),
    optionDisplay: (movie) => {
        return `
            <img src="${movie.Poster === 'N/A' ? '' : movie.Poster}">
            ${movie.Title} (${movie.Year})
        `;
    },
    onOptionSelected: async (movie) => {
        const movieData = await fetchDataById(movie.imdbID);
        if (movieData) {
            document.querySelector('#summary').innerHTML = generateMovieTemplate(movieData);
        }
    },
    inputValue: movie => movie.Title,
    fetchOptions: async (searchTerm) => await fetchData(searchTerm)
});


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

async function fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "191dfc62",
            s: searchTerm,
        },
    });
    return response.data.Error ? [] : response.data.Search;
};
async function fetchDataById(searchId) {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "191dfc62",
            i: searchId,
        },
    });
    return response.data.Error ? null : response.data;
};
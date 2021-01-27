const dropdownConfig = {
    optionDisplay: (movieData) => {
        return `
            <img src="${movieData.Poster === 'N/A' ? '' : movieData.Poster}">
            ${movieData.Title} (${movieData.Year})
        `;
    },
    inputValue: movieData => movieData.Title,
    fetchOptions: async (searchTerm) => await fetchData(searchTerm)
};

let leftMovieDetails;
let rightMovieDetails;
createDropdown({
    root: document.querySelector('#search1'),
    onOptionSelected: async (movieData) => {
        leftMovieDetails = await displayMovieDetails(movieData, document.querySelector('#details1'));
        compareMovies();
    },
    ...dropdownConfig
});
createDropdown({
    root: document.querySelector('#search2'),
    onOptionSelected: async (movieData) => {
        rightMovieDetails = await displayMovieDetails(movieData, document.querySelector('#details2'));
        compareMovies();
    },
    ...dropdownConfig
});

async function displayMovieDetails(movieData, displayLocation) {
    const movieDetails = await fetchDataById(movieData.imdbID);
    if (movieDetails) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        displayLocation.innerHTML = generateDisplayTemplate(movieDetails);
    }
    return movieDetails;
};
function compareMovies(){
    if(leftMovieDetails && rightMovieDetails){
        const leftMovieStats = document.querySelectorAll('#details1 .notification');
        const rightMovieStats = document.querySelectorAll('#details2 .notification');
        for (let i = 0; i < leftMovieStats.length; i++) {
            const leftStat = parseInt(leftMovieStats[i].dataset.value);
            const rightStat = parseInt(rightMovieStats[i].dataset.value);
            if(leftStat < rightStat){
                leftMovieStats[i].classList.remove('is-primary');
                leftMovieStats[i].classList.add('is-warning');
            }
            else if(leftStat > rightStat){
                rightMovieStats[i].classList.remove('is-primary');
                rightMovieStats[i].classList.add('is-warning');
            }            
        }
    }
};
function generateDisplayTemplate(movieDetails) {
    const boxOffice = parseInt(movieDetails.BoxOffice.replace(/\$|,/g,""));
    const metascore = parseInt(movieDetails.Metascore);
    const rating = parseFloat(movieDetails.imdbRating);
    const votes = parseInt(movieDetails.imdbVotes.replace(/,/g,""));
    const awards = movieDetails.Awards
        .split(' ')
        .filter(x => parseInt(x))
        .map(x => parseInt(x))
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${boxOffice} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${rating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
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
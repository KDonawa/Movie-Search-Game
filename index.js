async function fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '191dfc62',
            s: searchTerm
        }
    });
    console.log(response.data);
};

const input = document.querySelector('input');

const onInput = debounce((e) => {
    //fetchData(e.target.value);
    console.log(e.target.value);
}, 500);

input.addEventListener('input', onInput);
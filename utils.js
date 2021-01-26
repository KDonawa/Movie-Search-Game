function debounce(func, delay = 1000){
    let timeoutId;
    return function (...args){
        if(timeoutId){
            clearTimeout(timeoutId);   
        }
        timeoutId = setTimeout(()=>{
            func.apply(null, args);
        }, delay);
    };
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
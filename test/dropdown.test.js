function waitFor(selector) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if(document.querySelector(selector)){
                clearInterval(interval);
                clearTimeout(timeout);
                resolve();
            }
        }, 30);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            reject();
        }, 2000);
    });
}

beforeEach(() => {
    document.querySelector('#target').innerHTML = "";
    createDropdown({
        root: document.querySelector('#target'),
        optionDisplay(movie) {
            return `${movie.Title}`;
        },
        fetchOptions() {
            return [
                {Title: 'Avengers'},
                {Title: 'Batman'},
                {Title: 'Not Batman'},
            ];
        },
    });
});

it('Shows an empty search bar with no dropdown', () => {  
    const dropdown = document.querySelector('.dropdown');
    
    assert.isNotOk(dropdown.classList.contains('is-active'));
});

it('After searching, dropdown opens up', async () => {
    const input = document.querySelector('input');
    input.value = 'avengers';
    input.dispatchEvent(new Event('input'));

    await waitFor('.dropdown-item');

    const dropdown = document.querySelector('.dropdown');
    
    assert.isOk(dropdown.classList.contains('is-active'));
});

it('3 movies are displayed after searching', async () => {
    const input = document.querySelector('input');
    input.value = 'avengers';
    input.dispatchEvent(new Event('input'));

    await waitFor('.dropdown-item');

    const items = document.querySelectorAll('.dropdown-item');
    
    assert.strictEqual(items.length, 3);
});
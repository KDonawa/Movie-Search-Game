function createDropdown({
    inputLabel,
    root,
    optionDisplay,
    onOptionSelected,
    inputValue,
    fetchOptions
}) {
    root.innerHTML = `
        <label><b>${inputLabel}</b></label>
        <input class="input">
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    async function onInput(e) {
        const options = await fetchOptions(e.target.value);
        if (options.length === 0) {
            dropdown.classList.remove('is-active');
            return;
        }

        resultsWrapper.innerHTML = "";
        dropdown.classList.add('is-active');

        for (const option of options) {
            const item = document.createElement('a');
            item.classList.add('dropdown-item');
            item.innerHTML = optionDisplay(option);
            item.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(option);
                onOptionSelected(option);
            });

            resultsWrapper.appendChild(item);
        }
    }

    input.addEventListener('input', debounce(onInput, 1000));

    document.addEventListener('click', e => {
        if (!root.contains(e.target)) {
            dropdown.classList.remove('is-active');
        }
    });
}
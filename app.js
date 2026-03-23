function bindEvents() {
    const button = document.getElementById('myButton');
    button.addEventListener('click', debounce(handleClick, 300));
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function handleClick(event) {
    // Handle the button click event
    console.log('Button clicked!', event);
}
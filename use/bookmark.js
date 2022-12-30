// Grabbing elements for use
const add_bookmark = document.querySelector('.add-bookmark');
const modal_overlay = document.querySelector('.overlay');
const hide_modal = document.querySelector('.modal i');
const bookmark_form = document.querySelector('.bookmark-form');
const bookmark_container = document.querySelector('.bookmark-container');
const instruction = document.querySelector('.instruction');

// Global variables
let title;
let url;
let bookmarks = [];

// updating bookmarks in the DOM
const update_DOM = () => {
    // checking if there is any bookmark saved in the browser's storage
    if (!localStorage) {
        instruction.hidden = false;
    } else {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        // refreshing the bookmark container
        bookmark_container.textContent = '';
        // displaying in the DOM, if there is
        if (bookmarks) {
            bookmarks.forEach( (book, i) => {
                // container for every bookmark
                const bookmark = document.createElement('div');
                bookmark.classList.add('bookmark');
                // thumbtack at the top
                const thumbtack = document.createElement('img');
                thumbtack.classList.add('thumbtack');
                thumbtack.setAttribute('src', 'assets/pin.png');
                thumbtack.setAttribute('alt', 'thumbtack');
                // delete button
                const delBtn = document.createElement('i');
                delBtn.classList.add('fa-regular');
                delBtn.classList.add('fa-circle-xmark');
                delBtn.setAttribute('title', 'Delete');
                // favicon for every bookmarked site's link
                const favicon = document.createElement('img');
                favicon.classList.add('favicon');
                favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${book.url}`);
                favicon.setAttribute('alt', 'favicon');
                // link to the website
                const link = document.createElement('a');
                link.setAttribute('href', book.url);
                link.setAttribute('target', '_blank');
                link.classList.add('bookmark-link');
                link.textContent = book.title;
    
                // putting them all together
                bookmark.append(thumbtack, delBtn, favicon, link);
                bookmark_container.appendChild(bookmark);
                // making the initial instruction disappear on first bookmark creation
                instruction.hidden = true;

                // adding EventListener for each bookmark's delete button
                delBtn.addEventListener('click', () => {
                    bookmarks.splice(i, 1)
                    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                    update_DOM();
                });
            });
        }
    }
}
// calling
update_DOM();

// validating web address
const web_validation = (title, url) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if (!url.match(regex)) {
        alert('Please, input a valid web address!');
    } else {
        // storing bookmark
        bookmarks.push({ title: title, url: url });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    update_DOM();
}

// receiving bookmark input from user
const save_bookmark = (e) => {
    e.preventDefault();
    // to make sure form is not submitted empty
    if (bookmark_form.children[1].value === '' || bookmark_form.children[3].value === '') {
        alert('Please, fill all fields!');
    } else {
        // caching input data
        title = bookmark_form.children[1].value;
        // checking if url already had http/https or not
        bookmark_form.children[3].value.includes('http://') || bookmark_form.children[3].value.includes('https://') ? url = bookmark_form.children[3].value : url = `https://${bookmark_form.children[3].value}`;

        // validating web address
        web_validation(title, url);
    }
    // clearing input fields after submitting data
    bookmark_form.reset();
    // hiding modal
    modal_overlay.classList.add('hide-modal');
}

// EventListeners
bookmark_form.addEventListener('submit', save_bookmark);

// displaying modal
add_bookmark.addEventListener('click', () => {
    modal_overlay.classList.remove('hide-modal');
    bookmark_form.children[1].focus();
});

// hiding modal
hide_modal.addEventListener('click', () => modal_overlay.classList.add('hide-modal'));
window.addEventListener('click', (e) => {
    if (e.target === modal_overlay) {
        modal_overlay.classList.add('hide-modal');
    }
});
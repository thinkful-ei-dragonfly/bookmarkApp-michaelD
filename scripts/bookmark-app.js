/* global store, $, api */
/* this bookmarkApp handles all the funcitonality for adding and removing
Bookmarks to the the store[]. Like store.js it is an IIFE staement
store.js manipulate the store | think array[]
bookmarkApp manipulates the bookmarks in the store | think array[id] */

// eslint-disable-next-line no-unused-vars
const bookmarkApp = (function () {


  function generateError(message) {
    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateRatingString(rating) {
    if (rating === 5) {
      return '&#9733&#9733&#9733&#9733&#9733';
    } else if (rating === 4) {
      return '&#9733&#9733&#9733&#9733&#9734';
    } else if (rating === 3) {
      return '&#9733&#9733&#9733&#9734&#9734';
    } else if (rating === 2) {
      return '&#9733&#9733&#9734&#9734&#9734';
    } else if (rating === 1) {
      return '&#9733&#9734&#9734&#9734&#9734';
    } else {
      return '&#9734';
    }
  }

  function generateBookmarkElement(bookmark) {
    let bookmarkInfo = '';
    if (bookmark.isDetailedView) {
      bookmarkInfo = `
                <div>
                    <p class="bookmark-description">${bookmark.desc}</p>
                    <a href=${bookmark.url}><button>Visit Site</button></a>
                    <button class="js-bookmark-delete">Delete</button>
                    <button class="js-bookmark-list-more-info"> Show less</button>
                </div>
                `;
    } else {
      bookmarkInfo = `
      <button class="js-bookmark-list-more-info">More Info</button>
      `;
    }

    if (bookmark.rating < store.minimumRating) {
      return `
      `;
    }

    return `
        <li class="bookmark js-bookmark" data-item-id="${bookmark.id}">
        <p class="bookmark-title">${bookmark.title}</p>
            <div class="rating">
                ${generateRatingString(bookmark.rating)}
            </div>
            ${bookmarkInfo}
        </li>
        `;
  }

  function generateBookmarkString(bookmarkApp) {
    const bookmarks = bookmarkApp.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
  }

  function renderError() {
    if (store.error) {
      const el = generateError(store.error);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }
  }

  function renderForm() {
    let bookmarkHTML = '';
    if (store.newBookmarkForm === false) {
      bookmarkHTML = `
      <button class="js-toggle-bookmark" > Add Bookmark </button>
      `;
    } else {
      bookmarkHTML = `
    <fieldset>
      <legend>New Bookmark Form</legend>
        <label for="title">Title: </label>
        <input type="text" name="title" id="js-title-input" placeholder="title">
        <label for="url">URL: </label>
        <input type="url" name="url" id="js-url-input" placeholder="http://www.google.com">
        <label for="description">Description: </label>
        <input type="text" name="desc" id="js-description-input">
        <input type="radio" name="rating" value="5" id="starRating-5">
    <fieldset id="bookmark-rating">
      <legend>Rating</legend>
      <label for="StarRating-5"> 5 Stars </label>
      <input type="radio" name="rating" value="4" id="starRating-4">
      <label for="StarRating-4"> 4 Stars </label>
      <input type="radio" name="rating" value="3" id="starRating-3">
      <label for="StarRating-3"> 3 Stars </label>
      <input type="radio" name="rating" value="2" id="starRating-2">
      <label for="StarRating-2"> 2 Stars </label>
      <input type="radio" name="rating" value="1" id="starRating-1">
      <label for="StarRating-1"> 1 Stars </label>
    </fieldset>
    <button type="submit">Submit</button>
    <button class="js-toggle-bookmark" > Cancel </button>
    </fieldset>
    `;
    }

    $('#js-bookmark-app-form').html(bookmarkHTML);
  }

  function render() {
    renderError();
    renderForm();
    let bookmarks = [...store.bookmarks];
    if (store.minumRating > 0) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.minimumRating);
    }
    console.log('`render` ran');
    const bookmarkListStrings = generateBookmarkString(bookmarks);
    // insert above HTML string into the DOM
    $('.js-bookmark-list').html(bookmarkListStrings);
  }

  function handleToggleNewBookmarkForm() {
    $('#js-bookmark-app-form').on('click', '.js-toggle-bookmark', event => {
      store.toggleNewBookmarkForm();
      renderForm();
      render();
    });
  }

  function handleNewBookmarkSubmit() {
    $('#js-bookmark-app-form').submit(function (event) {
      event.preventDefault();
      const newBookmark = $('#js-bookmark-app-form').serializeJson();
      event.target.reset;
      api.createBookmark(newBookmark)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(bookmark => {
          store.addBookmark(bookmark);
          render();
        })
        .catch((err) => {
          store.setError(err.message);
          renderError();
        });
    });
  }

  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.bookmark')
      .data('item-id');
  }

  function handleDeleteButtonClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-delete', event => {
      let id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        })
        .catch((err) => {
          store.setError(err.message);
          renderError();
        });
    });
  }

  function expandBookmark() {
    $('.js-bookmark-list').on('click', '.js-bookmark-list-more-info', event => {
      let id = getBookmarkIdFromElement(event.currentTarget);
      const targetBookmark = store.findById(id);
      targetBookmark.isDetailedView = !targetBookmark.isDetailedView;
      render();
    });
  }

  const minimumChange = function () {
    $('#js-min-stars').on('change', 'select', (e) => {
      let filter = parseInt($(e.target).val());
      store.setMinRating(filter);
      render();
    });
  };


  function bindEventListeners() {
    handleToggleNewBookmarkForm();
    renderForm();
    handleNewBookmarkSubmit();
    handleDeleteButtonClicked();
    expandBookmark();
    minimumChange();
  }

  return {
    renderForm,
    render,
    bindEventListeners,
  };
}());